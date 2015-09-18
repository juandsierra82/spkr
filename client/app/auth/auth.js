// responsible for our client side authentication.

angular.module('spkr.auth', [])

.controller('AuthController', function ($scope, $rootScope, $route, $window, $location, Auth) {
  $scope.user = {};

  $scope.login = function () {
    Auth.login($scope.user)
      .then(function (data) {
        $window.localStorage.setItem('com.spkr', data.token);
        $window.localStorage.setItem('userid', data.userid);
        $location.path('/data-profile');
      })
      .catch(function (error) {
        $scope.user.error = "Username and/or password is incorrect.";
        console.error(error);
      });
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (data) {
        $window.localStorage.setItem('com.spkr', data.token);
        $window.localStorage.setItem('userid', data.userid);
        $location.path('/data-profile');
      })
      .catch(function (error) {
        var passLength= document.getElementById('password').value.length;
        if (passLength < 8) {
          $scope.user.error= "Password must be 8 characters or more!"
        }
        else if(passLength >=8) {
          $scope.user.error = "Username already exists!";
          console.error(error);}
        
      });
  };
});
