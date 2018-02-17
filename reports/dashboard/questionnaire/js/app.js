
(function () {

  var app = (function () {
    var optionsBackup;
    function getUrl(options) {
      if (options.domain && options.audienceId + options.folderId) {
        var controllerName = options.useDemoData ? "dashboard-demo-data" : "dashboard-data";
        return options.domain + "/ability/" + controllerName + "/" + options.audienceId + "/" + options.folderId;
      }
      var baseUrl = document.location.href.indexOf('github') !== -1 ? '/reports/reports/' : "/";
      return baseUrl + "dashboard/questionnaire/data/data.json";
    }

    function getStudentsAbilityChartOptions(options) {
      var newOptions = JSON.parse(JSON.stringify(options));
      newOptions.height = cet.dashboard.studentsAbilityProgress.measures.studentsAbilityChart.height;
      newOptions.width = cet.dashboard.studentsAbilityProgress.measures.studentsAbilityChart.width;
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


      var containerElement = document.querySelector(options.rootElementSelector);
      containerElement.innerHTML = '';
      containerElement.style.overflow = 'auto';
      var rootElement = document.createElement('div');
      rootElement.classList.add("students-ability-dashboard");
      containerElement.appendChild(rootElement);

      if (options.direction) {
        rootElement.classList.add('students-ability-dashboard--' + options.direction);
      }

      if (options.title) {
        var titleElement = document.createElement('h2');
        titleElement.classList.add('students-ability-dashboard__title');
        titleElement.innerHTML = cet.dashboard.studentsAbilityChart.texts.titilePrefix + ": " + options.title;
        rootElement.appendChild(titleElement);
      }

      

      cet.dashboard.studentsAbilityProgress.measures.init(options);

      rootElement.style.width = cet.dashboard.studentsAbilityProgress.measures.width + 'px';
      rootElement.style.height = cet.dashboard.studentsAbilityProgress.measures.height + 'px';

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
      //optionsBackup.width = 1200;
      //optionsBackup.height = 700;
      load(options);
      d34.json(getUrl(options), function (response) {
        cet.dashboard.studentsAbilityProgress.data.load(response);
      });
    }

    function dispose() { }

    return {
      init: init,
      resize: resize
    }

  })();

  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.questionnaire = window.cet.dashboard.questionnaire || {};
  cet.dashboard.questionnaire.app = app;
  cet.dashboard.questionnaire.init = app.init;
  cet.dashboard.questionnaire.resize = app.resize;

})()

