(function () {
  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentsAbilityChart = window.cet.dashboard.studentsAbilityChart || {};
  cet.dashboard.studentsAbilityChart.appClass = function (options) {
    var self = this;

    self.namespace = options.namespace;
    self.chartClassName = options.chartClassName;

    var chart = document.querySelector("." + self.chartClassName);
    var titleElement = document.createElement('div');
    titleElement.classList.add(self.chartClassName + '__title');
    titleElement.innerHTML = self.namespace.texts.chartName;
    chart.appendChild(titleElement, chart.firstChild);


    var preloader = document.createElement("div");
    preloader.classList.add(self.chartClassName + "__preloader");
    preloader.innerText = "loading...";
    chart.appendChild(preloader);
    self.measures = self.namespace.measures = new cet.dashboard.studentsAbilityChart.measuresClass(options);
    

    chart.style.width = self.measures.width + 'px';
    chart.style.height = self.measures.height + 'px';

    if (options.direction === 'ltr') {
      chart.style.marginLeft = 'auto';
    }
    cet.dashboard.studentsAbilityProgress.data.on('ready', function () {

      var preloader = document.querySelector('.' + self.chartClassName + '__preloader');
      if (preloader && preloader.parentNode) {
        preloader.parentNode.removeChild(preloader);
      }

      self.svg = d34.select("." + self.chartClassName)
        .append("svg")
        .attr("width", self.measures.width)
        .attr("height", self.measures.svgHeight)
        .append("g")
        .attr("transform", "translate(" + self.measures.gridMargin.left + "," + self.measures.gridMargin.top + ")");
      self.namespace.legend.init(self.svg, self.chartClassName);

      self.namespace.axes = new cet.dashboard.studentsAbilityChart.axesClass(
        self.svg,
        self.measures,
        self.chartClassName
      )

      self.namespace.abilities.init();
    });
    
  }


})();

