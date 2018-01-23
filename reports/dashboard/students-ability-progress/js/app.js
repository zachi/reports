
(function () {

  var app = (function () {

    function getUrl(options) {
      if (options.domain) {
        var controllerName = options.useDemoData ? "dashboard-demo-data" : "dashboard-data";
        return options.domain + "/ability/" + controllerName + "/" + options.audienceId + "/" + options.folderId;
      }
      var baseUrl = document.location.href.indexOf('github') !== -1 ? '/reports/reports/' : "/";
      return baseUrl + "dashboard/data/data.json";
    }

    function getStudentsAbilityChartOptions(options) {
      var newOptions = JSON.parse(JSON.stringify(options));
      newOptions.height = cet.dashboard.studentsAbilityProgress.measures.studentsAbilityChart.height;
      return newOptions;
    }

    function getStudentAverageAbilityListOptions(options) {
      var newOptions = JSON.parse(JSON.stringify(options));
      newOptions.height = cet.dashboard.studentsAbilityProgress.measures.studentAverageAbilityList.height;
      newOptions.width = cet.dashboard.studentsAbilityProgress.measures.studentAverageAbilityList.width;
      newOptions.rootElementSelector = '.student-average-ability-list';

      return newOptions;
    }

    function getstudentsAbilityHistoryChart(options) {
      var newOptions = JSON.parse(JSON.stringify(options));
      newOptions.height = cet.dashboard.studentsAbilityProgress.measures.studentsAbilityHistoryChart.height;
      newOptions.width = cet.dashboard.studentsAbilityProgress.measures.studentsAbilityHistoryChart.width;
      newOptions.rootElementSelector = '.students-ability-history-chart';
      return newOptions;
    }


    function init(options) {
      // Set default width and hegit when not passed in options
      if (!options || !options.width) {
        options.width = window.outerWidth * 0.85 - ((window.outerWidth > 1280) ? 410 : 0);
      }

      if (!options || !options.height) {
        options.height = window.innerHeight * 0.85 - 102;
      }

      var containerElement = document.querySelector(options.rootElementSelector);
      containerElement.innerHTML = '';

      var rootElement = document.createElement('div');
      rootElement.classList.add("students-ability-dashboard");
      containerElement.appendChild(rootElement);


      cet.dashboard.studentsAbilityProgress.measures.init(options);

      rootElement.style.width = options.width + 'px';
      rootElement.style.height = options.height + 'px';

      if (options.title) {
        var titleElement = document.createElement('h2');
        titleElement.classList.add('students-ability-dashboard__title');
        titleElement.innerHTML = options.title;
        rootElement.appendChild(titleElement);
      }

      var studentsAbilityChartElement = document.createElement('div');
      studentsAbilityChartElement.classList.add("students-ability-chart");
      rootElement.appendChild(studentsAbilityChartElement);
      cet.dashboard.studentsAbilityChart.init(getStudentsAbilityChartOptions(options));

      if (window.location.href.indexOf('.lab.') == -1) {

        var studentsAbilityHistoryChartElement = document.createElement('div');
        studentsAbilityHistoryChartElement.classList.add("students-ability-history-chart");
        rootElement.appendChild(studentsAbilityHistoryChartElement);
        cet.dashboard.studentsAbilityHistoryChart.init(getstudentsAbilityHistoryChart(options));

        var studentAverageAbilityListElement = document.createElement('div');
        studentAverageAbilityListElement.classList.add("student-average-ability-list");
        rootElement.appendChild(studentAverageAbilityListElement);
        cet.dashboard.studentAverageAbilityList.init(getStudentAverageAbilityListOptions(options));
      }
      d34.json(getUrl(options), function (response) {

        cet.dashboard.studentsAbilityProgress.data.init(response);

      });



    }

    return {
      init: init
    }

  })();

  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentsAbilityProgress = window.cet.dashboard.studentsAbilityProgress || {};
  cet.dashboard.studentsAbilityProgress.app = app;
  cet.dashboard.studentsAbilityProgress.init = app.init;

})()

