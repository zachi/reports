
(function () {
  
  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {};
  cet.dashboard.studentsAbilityChart.measures = (function () {
    var margin = { top: 27, right: 50, bottom: 50, left: 50 },
      outerWidth = 1000,
      outerHeight = 500,
      width = outerWidth - margin.left - margin.right,
      height = outerHeight - margin.top - margin.bottom,
      xLabelHeight = 10;

    return {
      margin: margin,
      outerWidth: outerWidth,
      outerHeight: outerHeight,
      width: width,
      height: height,
      xLabelHeight: xLabelHeight
    }

  })();

})();