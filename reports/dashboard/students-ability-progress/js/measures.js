(function () {
  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentsAbilityProgress = window.cet.dashboard.studentsAbilityProgress || {};
  cet.dashboard.studentsAbilityProgress.measures = (function () {
    function init(options) {
      var self = cet.dashboard.studentsAbilityProgress.measures;
      
      
      self.width = options.width;
      self.height = options.height;

      var titleHeight = document.querySelector('.students-ability-dashboard__title').getBoundingClientRect().height
      var gapBetweenCharts = 12;
      var chartsHeight = 0.5 * (self.height - titleHeight - gapBetweenCharts);


      self.studentsAbilityChart = { width: self.width, height: chartsHeight };
      self.studentsAbilityHistoryChart = { width: (self.width * 0.75) - gapBetweenCharts, height: chartsHeight };
      self.studentAverageAbilityList = { width: self.width * 0.25, height: chartsHeight };
    }
    return {
      init: init
    }
  })();
})();