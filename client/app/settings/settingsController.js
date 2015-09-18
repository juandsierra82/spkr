angular.module('spkr.settings', [])
	.controller('SettingsController', function ($scope, $window){
		var userid = $window.localStorage.getItem('userid');
		$scope.settings = {
				shared: false,
				id: userid
		}	

	
	})