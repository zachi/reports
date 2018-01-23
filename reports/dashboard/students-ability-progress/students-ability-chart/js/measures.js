(function () {
  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {};
  cet.dashboard.studentsAbilityChart.measures = (function () {

    function init(options) {
      var self = cet.dashboard.studentsAbilityChart.measures;
      self.margin = { top: 27, right: 50, bottom: 85, left: 50 };
      self.outerWidth = options.width,
      self.outerHeight = options.height,
      self.width = self.outerWidth - self.margin.left - self.margin.right,
      self.height = self.outerHeight - self.margin.top - self.margin.bottom;
      self.xLabelHeight = 10;
    }

    return {
      init: init
    }
  })();
})();