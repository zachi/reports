
(function () {
  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentsAbilityHistoryChart = window.cet.dashboard.studentsAbilityHistoryChart || {};

  cet.dashboard.studentsAbilityHistoryChart.studentsColors = (function () {
    var colorBank = ["#ffaacb", "#dba388", "#3cbac9", "#74a9cf", "#94af8c"];
    var dynamicColors = JSON.parse(JSON.stringify(colorBank));
    var currentAllocation = {};
    function reset() {
      currentAllocation = {};
      dynamicColors = JSON.parse(JSON.stringify(colorBank));
    }
    function getStudentColor(id) {
      if (!currentAllocation[id])
        currentAllocation[id] = dynamicColors.pop();
      return currentAllocation[id];
    }

    return {
      getStudentColor: getStudentColor,
      reset: reset
    }
  })();

})();