var presentationController = require('./presentationController.js');
var userController = require('../users/userController.js');

module.exports = function (app) {
  // app === userRouter injected from middlware.js

  app.post('/', userController.checkAuth, presentationController.create); //create a presentation and send back unique id
  app.get('/:id', presentationController.onePres);
}; 
