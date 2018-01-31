
(function () {

  var app = (function () {
    var optionsBackup;
    function getUrl(options) {
      if (options.domain && options.audienceId + options.folderId) {
        var controllerName = options.useDemoData ? "dashboard-demo-data" : "dashboard-data";
        return options.domain + "/ability/" + controllerName + "/" + options.audienceId + "/" + options.folderId;
      }
      var baseUrl = document.location.href.indexOf('github') !== -1 ? '/reports/reports/' : "/";
      return baseUrl + "dashboard/data/data.json";
    }

    function getStudentsAbilityChartOptions(options) {
      var newOptions = JSON.parse(JSON.stringify(options));
      newOptions.height = cet.dashboard.studentsAbilityProgress.measures.studentsAbilityChart.height;
      newOptions.namespace = cet.dashboard.studentsAbilityChart;
      newOptions.chartClassName = "students-ability-chart";
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
      newOptions.namespace = cet.dashboard.studentsAbilityHistoryChart;
      newOptions.chartClassName = "students-ability-history-chart";
      return newOptions;
    }

    function resize(width, height) {
      optionsBackup.width = width;
      optionsBackup.height = height;
      load(optionsBackup);
      cet.dashboard.studentsAbilityProgress.data.invokeReady();
    }

    function load(options) {
      // Set default width and hegit when not passed in options
      if (!options || !options.width) {
        options.width = window.innerWidth * 0.85 - ((window.innerWidth > 1280) ? 410 : 0);
      }

      if (!options || !options.height) {
        options.height = window.innerHeight * 0.85 - 102;
      }

      var containerElement = document.querySelector(options.rootElementSelector);
      containerElement.innerHTML = '';

      var rootElement = document.createElement('div');
      rootElement.classList.add("students-ability-dashboard");
      containerElement.appendChild(rootElement);

      if (options.title) {
        var titleElement = document.createElement('h2');
        titleElement.classList.add('students-ability-dashboard__title');
        titleElement.innerHTML = cet.dashboard.studentsAbilityChart.texts.titilePrefix + ": " + options.title;
        rootElement.appendChild(titleElement);
      }

      if (options.direction) {
        rootElement.style.direction = options.direction;
      }

      cet.dashboard.studentsAbilityProgress.measures.init(options);

      rootElement.style.width = options.width + 'px';
      rootElement.style.height = options.height + 'px';

      cet.dashboard.studentsAbilityProgress.data.init(rootElement);

      var studentsAbilityChartElement = document.createElement('div');
      studentsAbilityChartElement.classList.add("students-ability-chart");
      rootElement.appendChild(studentsAbilityChartElement);
      cet.dashboard.studentsAbilityChart.app = new cet.dashboard.studentsAbilityChart.appClass(getStudentsAbilityChartOptions(options));

      //if (window.location.href.indexOf('.lab.') == -1) {
      var studentAverageAbilityListElement = document.createElement('div');
      studentAverageAbilityListElement.classList.add("student-average-ability-list");
      rootElement.appendChild(studentAverageAbilityListElement);
      cet.dashboard.studentAverageAbilityList.init(getStudentAverageAbilityListOptions(options));

      var studentsAbilityHistoryChartElement = document.createElement('div');
      studentsAbilityHistoryChartElement.classList.add("students-ability-history-chart");
      rootElement.appendChild(studentsAbilityHistoryChartElement);
      cet.dashboard.studentsAbilityHistoryChart.app = new cet.dashboard.studentsAbilityChart.appClass(getstudentsAbilityHistoryChart(options));
      cet.dashboard.studentsAbilityHistoryChart.appExtention = new cet.dashboard.studentsAbilityHistoryChart.AppExtention(getstudentsAbilityHistoryChart(options));

    }

    function init(options) {
     
      optionsBackup = options;
      load(options);
      d34.json(getUrl(options), function (response) {
        cet.dashboard.studentsAbilityProgress.data.load(response);
      });
    }

    function dispose() { }

    return {
      init: init,
      dispose: dispose,
      resize: resize
    }

  })();

  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentsAbilityProgress = window.cet.dashboard.studentsAbilityProgress || {};
  cet.dashboard.studentsAbilityProgress.app = app;
  cet.dashboard.studentsAbilityProgress.init = app.init;
  cet.dashboard.studentsAbilityProgress.resize = app.resize;

})()

