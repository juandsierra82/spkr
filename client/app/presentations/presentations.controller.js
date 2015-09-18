angular.module('spkr.presentations', [])
  .controller('PresentationsController', function ($scope, $window, $location, Auth, Pres) {
    
    $scope.presentation = {};

    $scope.root = window.location.href.slice(0,window.location.href.lastIndexOf('/'));
    
    $scope.$watch(Auth.isAuth, function(authed) {
      if (authed) {
        $location.path('/presentations');
      } else {
        $location.path('/')
      }
    }, true);

    var today = new Date().toISOString().split('T')[0];
    //date bug fixed; only today and future dates allowed
    document.getElementById('date').setAttribute('min', today);
    document.getElementById('expiration').setAttribute('min', today);

    $scope.$watch(function(){return $scope.presentation.date}, function(){
      $scope.presentation.date && document.getElementById('expiration').setAttribute('min', $scope.presentation.date.toISOString().split('T')[0]);
    });

    $scope.submit = function(presentation){
      Pres.createPresentation(presentation).then(function(data, err){
        if(err) console.log(err);
        $scope.feedbackUrl = $scope.root + "/feedback-form/" + data.newPresentation.presentationid;
        $scope.getData();
        $scope.presentation = {};
      });
    };

    $scope.getData = function(){
      Auth.getAllData()
        .then(function(data){
          $scope.presentations = data.slice(1);
        })
        .catch(function(error){
          console.err(error)
        });
    };
    $scope.getData();
  })
