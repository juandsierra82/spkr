var User = require('./userModel.js'),
    Q    = require('q'),
    jwt  = require('jwt-simple'),
    mongoose = require('mongoose'),
    Presentation  = require('../presentations/presentationModel.js');
var Feedbacks = require('../feedback/feedbackModel.js');

module.exports = {
  login: function (req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    var findUser = Q.nbind(User.findOne, User);
    findUser({username: username})
      .then(function (user) {
        if (!user) {
          next(new Error('User does not exist'));
        } else {
          return user.comparePasswords(password)
            .then(function(foundUser) {
              if (foundUser) {
                var token = jwt.encode(user, 'secret');
                req.session.userId = user._id;
                res.json({token: token, userid: user._id});
              } else {
                return next(new Error('No user'));
              }
            });
        }
      })
      .fail(function (error) {
        next(error);
      });
  },

  logout: function (req, res, next) {
    delete req.session.userId;
    res.send(200);
  },

  signup: function (req, res, next) {
    var username  = req.body.username,
        password  = req.body.password,
        //crating shared property on req on sign up
        shared = req.body.shared,
        create,
        newUser;

    var findOne = Q.nbind(User.findOne, User);

    // check to see if user already exists
    findOne({username: username})
      .then(function(user) {
        if (user) {
          next(new Error('User already exists!'));
        } else {
          // make a new user if not one
          create = Q.nbind(User.create, User);
          newUser = {
            username: username,
            password: password,
            //setting the shared property to false so user will be private on signup
            shared: false
          };
          return create(newUser);
        }
      })
      .then(function (user) {
        req.session.userId = user._id;
        // create token to send back for auth
        var token = jwt.encode(user, 'secret');
        //the user id is included in the encoded token 
        //that is sent back, but the front end has no way
        //of decoding token
        //the front end needs the user id in order to properly make
        //requests to the server

        res.json({token: token, userid: user._id});
      })
      .fail(function (error) {
        next(error);
      });
  },

  checkAuth: function (req, res, next) {
    // checking to see if the user is authenticated
    // grab the token in the header is any
    // then decode the token, which we end up being the user object
    // check to see if that user exists in the database
    var token = req.headers['x-access-token'];
    // if (!token) {
    //   next(new Error('No token'));
    // } else {
    //   var user = jwt.decode(token, 'secret');
      var findUser = Q.nbind(User.findOne, User);
      var userId = req.session.userId;
      findUser({_id: userId})
        .then(function (foundUser) {
          if (foundUser) {
            next();
          } else {
            res.send(401);
          }
        })
        .fail(function (error) {
          next(error);
        });
  },

  // serve all community data
  serveCommData: function(req, res, next) {
    Feedbacks.find()
      .then(function(feedbacks){
        res.json(feedbacks);
      })
  },

  //serves back all data for a given user
  serveData: function(req, res, next){
  var userid = mongoose.Types.ObjectId(req.params.id);
  var username;
  //the presentation documentations do not have a username property
  //so the username must be manually queried and added to json before sending it back
  User.find({_id: userid})
              .populate('presentations')
              .then(function(user){
                username = user[0].username
              })
              .then(function(){
                //populate converts the nonsensical ObjectID's to their corresponding documents
                return Presentation.find({_presenter: userid}).populate("feedbacks")
              })
              .then(function(feedbacks){
                //the feedbacks object from the previous then statement
                //does not contain a username and is being manually added here
                feedbacks.unshift({username: username})
                res.json(feedbacks)
              })
  },
//tested query for usernames and userid's which are private

  serveUsers: function(req, res, next){
    console.log('calling serve users')
    var findPublic = Q.nbind(User.find, User)
      
      findPublic({shared:false}, '_id username')
          .then(function (publicUsers) {
        console.log('this should be an array of users', publicUsers)
          if (publicUsers) {
            res.json(publicUsers);
          } else {
            res.send(401);
          }
        })
        .fail(function (error) {
          next(error);
        });    
  },

  //toggles users public function

  updateSettings: function(req, res, next){
    console.log('calling update');

    //field updated already populated for user
    var shareOpt = req.body.shared;
    //field inserted after settings page
    var firstOpt = req.body.firstname;
    var lastOpt = req.body.lastname;
    var emailOpt = req.body.email;
    var orgOpt = req.body.organization;
    
    var updateUser = Q.nbind(User.update, User);
    var userId = req.session.userId;

    updateUser({_id:userId}, {$set: 
      {shared: shareOpt,
       firstname: firstOpt,
       lastname: lastOpt,
       email: emailOpt,
       organization: orgOpt 
      }
      })
      .then(function (user){
        if(!user){
          res.send(401);
        } else {
          res.send(user);
        }
      })

  }
};
