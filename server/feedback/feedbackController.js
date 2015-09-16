var Presentation = require('../presentations/presentationModel.js'),
    Feedback  = require('./feedbackModel.js'),
    Q    = require('q'),
    mongoose = require('mongoose');

    //jwt  = require('jwt-simple');

var presentationId;

//makes sure that a presentation exists prior to 
//adding feedback to it
//this makes sure that extraneous feedback docs are not
//added and clutter the database
module.exports = {
  add: function(req, res, next){
    console.log("add feedback session before: ", req.cookies['express:sess']);
    
    var presentationId = mongoose.Types.ObjectId(req.body.presId),
        //assumes that a presentation does not exist so that 
        //we don't accidentally add when there's no need
        presentationExists = false,
        feedbackId,
        //Q makes things "thenable"
        findPresentation = Q.nbind(Presentation.findOne, Presentation),
        create = Q.nbind(Feedback.create, Feedback);

    findPresentation({ _id: presentationId })
    .then(function(presentation){
      if (! presentation){
        return res.statusCode(400).json({error: "No presentation found!"})
      }

      // loop through votes to check if session has submitted feeedback already
      var votes = presentation.votes;
      for (var i = 0; i < votes.length; i ++) {
        if (votes[i] === req.cookies['express:sess']) {
          return next(new Error ("You have already submit your feedback!"));
        }
      }

      var newFeedback = {
        _presentation: presentationId,
        scores: [
          req.body.organization,
          req.body.clarity,
          req.body.volume,
          req.body.posture,
          req.body.prepared,
          req.body.visualAids,
          req.body.connect,
          req.body.question,
          req.body.overall
        ]
      }

      create(newFeedback)
      .then(function(feedback){ 
        feedbackId = feedback.id
      
        presentation.feedbacks.push(feedbackId)
        presentation.votes.push(req.cookies['express:sess']);
        //.save() must follow a model in order for the entry to enter into the database;
        presentation.save();
        //req.session.voted = true;
        res.json({data: "Thanks for providing feedback!"})
      })
    })
  }
}