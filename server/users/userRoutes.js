var userController = require('./userController.js');


module.exports = function (app) {
  // app === userRouter injected from middlware.js
  app.post('/login', userController.login);
  app.post('/signup', userController.signup);
  app.get('/logout', userController.checkAuth, userController.logout);
  app.get('/:id', userController.checkAuth, userController.serveData);
  //server path for search
  app.get('/search', userController.checkAuth, userController.serveUsers)
  app.get('/comm/:id', userController.checkAuth, userController.serveCommData);
  app.post('/settings', userController.checkAuth,
  	userController.updateSettings)

};


