(function () {
  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentsAbilityChart = window.cet.dashboard.studentsAbilityChart || {};
  cet.dashboard.studentsAbilityChart.measuresClass = function (options) {



    var self = this;

    self.titleHeight = 28;
    self.width = options.width;
    self.height = options.height;
    self.gridMargin = { top: 30, right: 50, left: 50, bottom: 60 };

    self.gridWidth = self.width - self.gridMargin.left - self.gridMargin.right;
    self.gridHeight = self.height - self.gridMargin.top - self.gridMargin.bottom - self.titleHeight;

    self.svgHeight = self.height - self.titleHeight;

    self.xLabelHeight = 10;





  }
})();