angular.module('spkr.feedback-form', ['ngRoute', 'youtube-embed'])
  .controller('FeedbackController', function ($scope, $location, $routeParams, FeedbackService, Pres, Auth) {

    var presId = $routeParams.id;
    $scope.loggedIn = Auth.isAuth(),
    $scope.title,
    $scope.date,
    $scope.expiration,
    $scope.today,
    $scope.user,
    $scope.youtube,
    $scope.watched = false,
    $scope.presentation = {
      // date: 'guest',
      // name: 'guest',
      organization: 50,
      clarity: 50,
      volume: 50,
      posture: 50,
      prepared: 50,
      visualAids: 50,
      connect: 50,
      question: 50,
      overall: 50
    },

    
  // add in submitFeedback function to be able to call it on feedbackForm.html for ng-click Submit
    $scope.submitFeedback = function (presentation) {
      presentation.presId = presId;
      FeedbackService.submitFeedback(presentation) // inputs may be changed
        .then (function (data) {
          $scope.feedbackSuccess = data.data
        })
        .catch (function (error) {
          console.log(error)
        })
    },

    $scope.getData = function(){
      Pres.getData(presId)
      .then(function(data){
        $scope.user = data._presenter.username;
        $scope.title = data.title;
        $scope.date  = data.date.slice(0,10);
        $scope.today = new Date().toISOString().split('T')[0];
        $scope.expiration = data.expiration.slice(0,10);
        $scope.youtube = data.youtube;
        //the following is a predefined youtube link for testing purposes:
        // $scope.youtube = 'https://www.youtube.com/watch?v=jSNLvyXmsv4'; //testing
        if(!$scope.youtube.length) {
          $scope.watched = true; 
        }
      })
      .catch(function(error){
        $location.path('/data-profile')
      })
    },

    $scope.$on('youtube.player.ended', function($event, player) {
      $scope.watched = true;
    })

    $scope.getData();

  });


