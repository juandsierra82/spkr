angular.module('spkr.search', [])
  .controller('SearchController', function ($scope, $window, $location, Auth, Pres, Vis, SearchService) {
    // $scope.public = SearchService.getPublic();
    $scope.public = [{username: 'Aaron', userid: 0}, {username: 'juan', userid: 2}];
    $scope.matched;
    $scope.searched = false;

    $scope.match = function(val) {
      $scope.matched = [];
      console.log('Search field has been dirtied with ' + val);
      for(var i = 0; i < $scope.public.length; i ++) {
        if($scope.public[i].username.slice(0, val.length) === val) {
          $scope.matched.push($scope.public[i]);
        }
      }
    }

    $scope.search = function() {
      //this function will be invoked with the str in the input field everytime it is dirtied
      //scope.match will be updated with the results of this function
      console.log('executing the search function');
      SearchService.getAllData($scope.matched[0].userid);
      $scope.searched = true;
    },

    Auth.getAllData()
    .then(function(data){
      console.log(data);
      $scope.user = data[0].username;
      if (data.length > 1) {
        var criteria = data[1].criteria;
        var scoresData = [];
        for (var i = 1; i < data.length; i++){
          if (data[i].feedbacks.length > 0) { //only add the presentations with feedbacks
            var sums = [];
            for (var j = 0; j < criteria.length; j++){
              sums.push(0);
            }
            data[i].feedbacks.forEach(function(feedback){
              feedback.scores.forEach(function(score,i){
                sums[i] += parseInt(score);
              });
            });
            var avgs = sums.map(function(sum){return Math.round(sum/data[i].__v)});
            scoresData.push({date: data[i].date.slice(0,10), title: data[i].title, scores: avgs});
          }
        }
        scoresData.sort(function(a, b) {
          if (a.date > b.date) {
            return 1;
          }
          if (a.date < b.date) {
            return -1;
          }
          return 0;
        });
        if (scoresData.length === 0) { //if there are no presentations with feedbacks
          $("#userFallbackMessage").append(
          "<h2>Oh no!</h2><p>It looks like you haven't recieved any feedback yet." +
          "  Make sure to give out your <a href='/#/presentations'>feedback form URL</a> to start recieving feedback!</p>")
        } else {
          //call the homepageGraph factory function (this is where d3 happens)
          Vis.homepageGraph(criteria, scoresData);
        }
      } else { //if the user doesn't have any presentations
        $("#userFallbackMessage").append("<h2>Oh no!</h2><p>It looks like you haven't made any presentations yet.  <a href='/#/presentations'>Create</a> your first presentation to start recieving feedback!</p>")
      }
      
    })


  })