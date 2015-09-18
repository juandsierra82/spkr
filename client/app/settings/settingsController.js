angular.module('spkr.settings', [])
	.controller('SettingsController', function ($scope, $window, Set){
		//making the settings object
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