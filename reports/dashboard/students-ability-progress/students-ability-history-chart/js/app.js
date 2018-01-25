(function () {
  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentsAbilityHistoryChart = window.cet.dashboard.studentsAbilityHistoryChart || {};
  cet.dashboard.studentsAbilityHistoryChart.app = (function () {

    var measures;
    var namespace = cet.dashboard.studentsAbilityHistoryChart;
    var chartClassName = "students-ability-history-chart";
    function init(options) {

      var chart = document.querySelector("." + chartClassName);
      var titleElement = document.createElement('div');
      titleElement.classList.add(chartClassName + '__title');
      titleElement.innerHTML = namespace.texts.chartName;
      chart.appendChild(titleElement, chart.firstChild);


      var preloader = document.createElement("div");
      preloader.classList.add(chartClassName + "__preloader");
      preloader.innerText = "loading...";
      chart.appendChild(preloader);

      measures = new cet.dashboard.studentsAbilityChart.measuresClass(options);
      namespace.measures = measures;

      chart.style.width = measures.width + 'px';
      chart.style.height = measures.height + 'px';

      if (options.direction === 'ltr') {
        chart.style.marginLeft = 'auto';
      }
      cet.dashboard.studentsAbilityProgress.data.on('ready', function () {

        var preloader = document.querySelector('.' + chartClassName + '__preloader');
        if (preloader && preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }



        namespace.app.svg = d34.select("." + chartClassName)
          .append("svg")
          .attr("width", measures.width)
          .attr("height", measures.svgHeight)
          .append("g")
          .attr("transform", "translate(" + measures.gridMargin.left + "," + measures.gridMargin.top + ")");
        initLegend();

        namespace.axes = new cet.dashboard.studentsAbilityChart.axesClass(
          namespace.app.svg,
          measures,
          namespace.texts)

        namespace.abilities.init();
      });
    }

    function initLegend() {
      var legend = namespace.app.svg.append("g")
        .classed("legend", true)
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("circle")
        .attr("r", 8)
        .attr("cx", measures.gridWidth - 7)
        .attr("cy", -15)
        .classed("finished-part", true);

      legend.append("text")
        .attr("y", -10)
        .text(cet.dashboard.studentsAbilityChart.texts.legendAbilityFinished)
        //.attr("x", measures.width - 20) //the correct calculation when 'direction:rtl' is working (not on IE11)
        .attr("font-family", cet.dashboard.studentsAbilityChart.texts.fontFamily)
        .attr("x", measures.gridWidth - 115)
        .classed(chartClassName + '__legend-text', true);

      legend.append("circle")
        .classed("ability", true)
        .attr("r", 8)
        .attr("cx", measures.gridWidth - 145)
        .attr("cy", -15);

      legend.append("text")
        .attr("y", -10)
        .text(cet.dashboard.studentsAbilityChart.texts.legendAbility)
        .classed(chartClassName + '__legend-text', true)
        //.attr("x", measures.width - 108); //the correct calculation when 'direction:rtl' is working (not on IE11)
        .attr("x", measures.gridWidth - 276)
        .attr("font-family", cet.dashboard.studentsAbilityChart.texts.fontFamily);


    }

    function getTitleHeight() {
      return titleHeight;
    }

    return {
      init: init,
      getTitleHeight: getTitleHeight
    }

  })();

 
  cet.dashboard.studentsAbilityHistoryChart.init = cet.dashboard.studentsAbilityHistoryChart.app.init;

})();

