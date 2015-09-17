(function () {

  angular.module('spkr.reports', [])
    .controller('ReportsController', ReportsController);

    function ReportsController ($scope, $window, $location, Auth, Bullet) {

      $scope.$watch(Auth.isAuth, function(authed){
        if (authed) {
          $location.path('/reports');
        } else {
          $location.path('/')
        } 
      }, true);

      // make bullet chart format data 
      // get all feedback data
      Auth.getCommData()
        .then(function(commData){
          return commData;
        })
        .then(function(commData){
          // get user data
          Auth.getAllData()
            .then(function(data){
              $scope.bullet = Bullet.makeBulletData(commData, data);
              Bullet.makeBulletChart($scope.bullet);
            });
        });
  }

}) ()
