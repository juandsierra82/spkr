angular.module('spkr.background', [])
  .controller('BackgroundController', function ($scope, $rootScope, $route, $routeParams, $window, $location, Auth) {
  $rootScope.withBackground = true;
  $rootScope.withBackgroundPaths = ['/signup', '/login', '/'];
  $rootScope.$on('$locationChangeStart', function(event, next, current){
    var next = next.split('#')[1];
    console.log("next: ",  $rootScope.withBackgroundPaths.indexOf(next));
    if($rootScope.withBackgroundPaths.indexOf(next) === -1){
      $rootScope.withBackground = false;
    }
  });
});