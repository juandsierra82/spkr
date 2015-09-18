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

      $scope.preSelect = function(select) {
        $scope.pre = select;
        if ($scope.pre === "Overall"){
          $scope.preData = $scope.userData;
        } else {
          $scope.preData = [$scope.userData[$scope.presObj[$scope.pre]]];  
          console.log("preData", $scope.preData)     
        }
        $scope.init();
      };

      $scope.baseSelect = function(base) {
        $scope.base = base;
        if ($scope.base.indexOf("Me") > -1) {
          $scope.baseData = $scope.userFeeds;   
        } else {
          $scope.baseData = $scope.commData;
        }
        $scope.init();        
      }

      $scope.init = function() {
        $scope.bullet = Bullet.makeBulletData($scope.baseData, $scope.preData);
        Bullet.makeBulletChart($scope.bullet);
      }

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
              $scope.commData = commData;
              $scope.userData = data.slice(1);
              $scope.pres = ['Overall'];
              $scope.presObj = {};
              $scope.userFeeds = [];
              $scope.userData.forEach(function(item, i){
                if (item.feedbacks && item.feedbacks.length > 0){
                  $scope.pres.push(item.title);
                  var temp = item.feedbacks.map(function(item){
                    return item;
                  }); 
                  $scope.userFeeds = $scope.userFeeds.concat(temp);
                  $scope.presObj[item.title] = i;
                }
              });
              $scope.preData = $scope.userData;
              $scope.baseData = $scope.commData;
              $scope.init();
            });
        });

  }

}) ()
