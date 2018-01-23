(function () {
  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentsAbilityHistoryChart = window.cet.dashboard.studentsAbilityHistoryChart || {};
  cet.dashboard.studentsAbilityHistoryChart.measures = (function () {

    function init(options) {
      
      var self = cet.dashboard.studentsAbilityHistoryChart.measures;
      self.margin = { top: 50, right: 50, bottom: 50, left: 50 };
      self.outerWidth = options.width,
      self.outerHeight = options.height,
      self.width = self.outerWidth - self.margin.left - self.margin.right,
      self.height = self.outerHeight - self.margin.top - self.margin.bottom// - cet.dashboard.studentsAbilityHistoryChart.app.getTitleHeight();
      
      self.xLabelHeight = 10;

      
    }

    return {
      init: init
    }
  })();
})();