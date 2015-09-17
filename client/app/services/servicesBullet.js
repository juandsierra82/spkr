(function () {
  angular.module('spkr.services')

  .factory("Bullet", Bullet);

  function Bullet () {
    var makeBulletData = function (commData, userData) {
      var userData = userData.slice(1);
      // all the criteria list are the same.
      var criteria = ['overall', 'organization','clarity','volume','posture','preparation','visual aids','connection','questions']
      var bullet = [];
      for (var i = 0; i < criteria.length; i ++) {

        // get user criteria average
        var userAvg = 0;
        var preAvg = [];
        var userTotal = 0;
        var preFeedCount = 0;
        userData.forEach(function(pre) {
          var preTotal = 0;
          if (pre.feedbacks && pre.feedbacks.length > 0) {
            preFeedCount ++;
            pre.feedbacks.forEach(function(userFeed) {
              preTotal += parseInt(userFeed.scores[i]);
            })

            var preScoreAvg = Math.round(preTotal / pre.feedbacks.length);

            preAvg.push({preId: pre._id, preTitle: pre.title, preScoreAvg: preScoreAvg});

            userTotal += preScoreAvg;
          }
        });

        userAvg = userTotal / preFeedCount;
        
        // get min/max/average of all feedbacks
        var min = 100;
        var max = 0;
        var total = 0;
        var average = 0;
        var commCount = 0;
        commData.forEach(function(feed){
          var score = parseInt(feed.scores[i]);
          if (score > 100) {
            return;
          }
          (score < min) && (min = score);
          (score > max) && (max = score);
          total += score;
        })
        average = Math.round(total / commData.length);
        bullet[i] = {title: criteria[i], ranges:[min, max, 100], measures: [userAvg], markers: [average] };
      };

      return bullet;
    };


    
    return {
      makeBulletData: makeBulletData
    }
  };

}) ();