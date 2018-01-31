(function () {
  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentsAbilityHistoryChart = window.cet.dashboard.studentsAbilityHistoryChart || {};
  cet.dashboard.studentsAbilityHistoryChart.AppExtention = function (options) {
    var self = this;

    self.namespace = options.namespace;
    self.chartClassName = options.chartClassName;
    document.querySelector("." + self.chartClassName).classList.remove('students-ability-chart--loading');
    
    cet.dashboard.studentsAbilityProgress.data.on('students-selection-changed', function () {

      cet.dashboard.studentsAbilityHistoryChart.studentsColors.reload();
      cet.dashboard.studentsAbilityHistoryChart.legend.reload();
      
      cet.dashboard.studentsAbilityHistoryChart.abilities.reload();
    
    });
    
  }

})();

