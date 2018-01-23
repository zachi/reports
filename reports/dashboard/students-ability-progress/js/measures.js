(function () {
  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentsAbilityProgress = window.cet.dashboard.studentsAbilityProgress || {};
  cet.dashboard.studentsAbilityProgress.measures = (function () {
    function init(options) {
      var self = cet.dashboard.studentsAbilityProgress.measures;
   
        self.width = options.width,
        self.height = options.height,
        self.studentsAbilityChart = { width: self.width, height: self.height * 0.5 };
        //self.studentsAbilityHistoryChart = { width: 600, height: 200 };
        self.studentsAbilityHistoryChart = { width: self.width * 0.75, height: (self.height * 0.5) - 30 };
        self.studentAverageAbilityList = { width: self.width * 0.1, height: self.height * 0.5 };
    }
    return {
      init: init
    }
  })();
})();