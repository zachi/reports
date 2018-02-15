(function () {
  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentsAbilityHistoryChart = window.cet.dashboard.studentsAbilityHistoryChart || {};
  cet.dashboard.studentsAbilityHistoryChart.AppExtention = function (options) {
    var self = this;

    self.namespace = options.namespace;
    self.classes = {
      chart: options.chartClassName,
      pathsToggle: "students-ability-history-chart__pathsToggle"
    }
    self.events = {
      studentsSelectionChanged: "students-selection-changed",
      showPathsToggled: "show-paths-toggled"
    }
    self.dontShowPaths = false;

    document.querySelector("." + self.classes.chart).classList.remove('students-ability-chart--loading');

    self.buildPathsToggleButton();

    cet.dashboard.studentsAbilityProgress.data.on(self.events.studentsSelectionChanged, function () {

      cet.dashboard.studentsAbilityHistoryChart.studentsColors.reload();

      cet.dashboard.studentsAbilityHistoryChart.legend.reload();

      cet.dashboard.studentsAbilityHistoryChart.abilities.reload();

      self.switchOnPathsToggleButton();

    });

    cet.dashboard.studentsAbilityProgress.data.on(self.events.showPathsToggled, function (ev) {
      if (self.dontShowPaths) {
        self.switchOnPathsToggleButton();
      }
      else {
        self.switchOffPathsToggleButton();
      }

      cet.dashboard.studentsAbilityHistoryChart.abilities.reload(self.dontShowPaths);
    });
  }

  cet.dashboard.studentsAbilityHistoryChart.AppExtention.prototype.buildPathsToggleButton = function () {
    var self = this;
    let chart = document.getElementsByClassName(cet.dashboard.studentsAbilityHistoryChart.app.chartClassName)[0];
    let pathsToggle = document.createElement("div");
    pathsToggle.classList.add(this.classes.pathsToggle);
    chart.appendChild(pathsToggle);
    pathsToggle.addEventListener("click", function (ev) {
      let rootElement = document.getElementsByClassName("students-ability-dashboard")[0];
      rootElement.dispatchEvent(new Event(self.events.showPathsToggled));
    });
  }

  cet.dashboard.studentsAbilityHistoryChart.AppExtention.prototype.switchOnPathsToggleButton = function () {
    this.dontShowPaths = false;
    document.getElementsByClassName(this.classes.pathsToggle)[0].classList.add("active");
  }

  cet.dashboard.studentsAbilityHistoryChart.AppExtention.prototype.switchOffPathsToggleButton = function () {
    this.dontShowPaths = true;
    document.getElementsByClassName(this.classes.pathsToggle)[0].classList.remove("active");
  }

})();

