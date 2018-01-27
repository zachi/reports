(function () {
  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentsAbilityHistoryChart = window.cet.dashboard.studentsAbilityHistoryChart || {};
  cet.dashboard.studentsAbilityHistoryChart.AppExtention = function (options) {
    var self = this;

    self.namespace = options.namespace;
    self.chartClassName = options.chartClassName;
    
    cet.dashboard.studentsAbilityProgress.data.on('students-selection-changed', function () {

      cet.dashboard.studentsAbilityHistoryChart.legend.reload();
      
      cet.dashboard.studentsAbilityHistoryChart.abilities.reload();
    
    });
    
  }

})();

