angular.module('spkr.settings', [])
	.controller('SettingsController', function ($scope, $location, Auth, $window, Set){
		//making the settings object
		$scope.root = window.location.href.slice(0,window.location.href.lastIndexOf('/'));
    
    $scope.$watch(Auth.isAuth, function(authed) {
      if (authed) {
        $location.path('/settings');
      } else {
        $location.path('/')
      }
    }, true);


		var userid = $window.localStorage.getItem('userid');
		$scope.settings = {
				shared: false,
				id: userid
		}	

		$scope.subPub = function (settings){
			console.log("this is the user object,", settings)
			Set.updateUser(settings).then(
				function (data, err){
					if(err) console.log(err);
				})		
		}
	
	})