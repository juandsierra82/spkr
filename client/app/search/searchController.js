angular.module('spkr.search', [])
  .controller('SearchController', function ($scope, $window, $location, Auth, Pres) {
    $scope.public;
    $scope.match;

    $scope.search = function(val) {
      //this function will be invoked with the str in the input field everytime it is dirtied
      //scope.match will be updated with the results of this function
      console.log('executing the search function');
    },

    $scope.getPublic = function() {
      //needs to return an array of results based off of the public prop being true
      //then set scope.public to that array of results
      console.log('executing the getPublic function');
    },

    $scope.getPublic();

  })