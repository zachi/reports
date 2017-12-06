


(function () {

  
    var app = (function () {
      
    function init(options) {
      
      var rootElement = document.createElement('div');
      rootElement.classList.add("students-ability-dashboard");
      document.querySelector(options.rootElementSelector).appendChild(rootElement);

      
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
    cet.dashboard.studentsAbility = app;

})()

