
(function () {
  
    var app = (function () {
      
    function init(options) {
      var containerElement = document.querySelector(options.rootElementSelector);
      containerElement.innerHTML = '';
      var rootElement = document.createElement('div');
      rootElement.classList.add("students-ability-dashboard");
      containerElement.appendChild(rootElement);
      
      var studentsAbilityChartElement = document.createElement('div');
      studentsAbilityChartElement.classList.add("students-ability-chart");
      rootElement.appendChild(studentsAbilityChartElement);
      cet.dashboard.studentsAbilityChart.init(options);
      
    }

    return {
      init:init
    }

  })();

    window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {};
    cet.dashboard.studentsAbilityProgress = app;

})()

