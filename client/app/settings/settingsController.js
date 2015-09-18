angular.module('spkr.settings', [])
	.controller('SettingsController', function ($scope, $window){
		var userid = $window.localStorage.getItem('userid');
		$scope.settings = {
				shared: false,
				id: userid
		}	
		$scope.subPub = function (user){
			console.log("this is the user object," user)

		}
	
	})