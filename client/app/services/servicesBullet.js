(function () {
  angular.module('spkr.services')

  .factory("Bullet", Bullet);

  function Bullet () {

    var makeBulletData = function (commData, userData) {
      // all the criteria list are the same.
      var criteria = ['organization','clarity','volume','posture','preparation','visual aids','connection','questions', 'overall']
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
            pre.feedbacks.forEach(function(userFeed) {
              preFeedCount ++;
              userTotal += parseInt(userFeed.scores[i]);
            })
          }
        });

        userAvg = Math.round(userTotal / preFeedCount);
        
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
          commCount ++;
        })
        average = Math.round(total / commCount);
        userAvg || (userAvg = 0);
        bullet[i] = {title: criteria[i], ranges:[min, max, 100], measures: [userAvg], markers: [average] };
      };
      bullet = bullet.slice(bullet.length-1).concat(bullet.slice(0, bullet.length-1))
      return bullet;
    };

    var makeBulletChart = function(data) {
      var margin = {top: 5, right: 40, bottom: 20, left: 120};
      var width = 1000 - margin.left - margin.right;
      var height = 50 - margin.top - margin.bottom;
      var series = [{"Min":10, "Max":10, "Avg":10, "Me":10}];

      var chart = d3.bullet()
            .width(width)
            .height(height);
      d3.select("#commBulletChart").html("");
      
      var svg = d3.select("#commBulletChart").selectAll("svg")
            .data(data).enter().append("svg")
            .attr("class", "bullet")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("tranform", "translate(" + margin.left + "," + margin.top + ")")
            .call(chart);

      var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .html(function (d) {
              return "<strong>Me:</strong> <span>" + d.measures[0] + "; </span>" + "<strong> Avg:</strong> <span>" + d.markers[0] + "; </span>"+ "<strong> Min:</strong> <span>" + d.ranges[0] + "; </span>" + "<strong>  Max:</strong> <span>" + d.ranges[1] + "</span>"
            });
            
      svg.call(tip);

      svg.on("mouseover", tip.show)
        .on("mouseout", tip.hide);

      var title = svg.append("g")
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + height / 2 + ")");

      title.append("text")
        .attr("class", "title")
        .text(function(d){ return d.title; });

      title.append("text")
        .attr("class", "subtitle")
        .attr("dy", "1em")
        .text(function(d) { return d.title; });

    };
    
    return {
      makeBulletData: makeBulletData,
      makeBulletChart: makeBulletChart
    }
  };

}) ();