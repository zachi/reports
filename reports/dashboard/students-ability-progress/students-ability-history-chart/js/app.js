
(function () {

  var app = (function () {
    var titleHeight;

    function init(options) {

      chart = document.querySelector(".students-ability-history-chart");
      var titleElement = document.createElement('div');
      titleElement.classList.add('students-ability-history-chart__title');
      titleElement.innerHTML = cet.dashboard.studentsAbilityHistoryChart.texts.chartName;
      chart.appendChild(titleElement, chart.firstChild);
      titleHeight = titleElement.getBoundingClientRect().height;
      titleHeight = 28;

      var preloader = document.createElement("div");
      preloader.classList.add("students-ability-history-chart__preloader");
      preloader.innerText = "loading...";
      chart.appendChild(preloader);

      cet.dashboard.studentsAbilityHistoryChart.measures.init(options);

      if (options.direction === 'ltr') {
        chart.style.marginLeft = 'auto';
      }
      cet.dashboard.studentsAbilityProgress.data.on('ready', function () {
        
        var preloader = document.querySelector('.students-ability-history-chart__preloader');
        if (preloader && preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }


        cet.dashboard.studentsAbilityHistoryChart.app.svg = d34.select(".students-ability-history-chart")
                  .append("svg")
                  .attr("width", cet.dashboard.studentsAbilityHistoryChart.measures.outerWidth)
                  .attr("height", cet.dashboard.studentsAbilityHistoryChart.measures.outerHeight - getTitleHeight())
                  .append("g")
                  .attr("transform", "translate(50,20)");
                  //.attr("transform", "translate(" + cet.dashboard.studentsAbilityHistoryChart.measures.margin.left + "," + cet.dashboard.studentsAbilityHistoryChart.measures.margin.top + ")");
        //initLegend();

        cet.dashboard.studentsAbilityHistoryChart.axes.init();
        cet.dashboard.studentsAbilityHistoryChart.abilities.init();
      });
    }

    function initLegend() {
      var legend = cet.dashboard.studentsAbilityHistoryChart.app.svg.append("g")
        .classed("legend", true)
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("circle")
        .attr("r", 8)
        .attr("cx", cet.dashboard.studentsAbilityHistoryChart.measures.width - 7)
        .attr("cy", -15)
        .classed("finished-part", true);

      legend.append("text")
        .attr("y", -10)
        .text(cet.dashboard.studentsAbilityChart.texts.legendAbilityFinished)
        //.attr("x", cet.dashboard.studentsAbilityChart.measures.width - 20) //the correct calculation when 'direction:rtl' is working (not on IE11)
        .attr("font-family", cet.dashboard.studentsAbilityChart.texts.fontFamily)
        .attr("x", cet.dashboard.studentsAbilityHistoryChart.measures.width - 115)
        .classed('students-ability-history-chart__legend-text', true);

      legend.append("circle")
        .classed("ability", true)
        .attr("r", 8)
        .attr("cx", cet.dashboard.studentsAbilityHistoryChart.measures.width - 145)
        .attr("cy", -15);

      legend.append("text")
        .attr("y", -10)
        .text(cet.dashboard.studentsAbilityChart.texts.legendAbility)
        .classed('students-ability-history-chart__legend-text', true)
        //.attr("x", cet.dashboard.studentsAbilityChart.measures.width - 108); //the correct calculation when 'direction:rtl' is working (not on IE11)
        .attr("x", cet.dashboard.studentsAbilityHistoryChart.measures.width - 276)
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

  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentsAbilityHistoryChart = window.cet.dashboard.studentsAbilityHistoryChart || {};
  cet.dashboard.studentsAbilityHistoryChart.app = app;
  cet.dashboard.studentsAbilityHistoryChart.init = app.init;

})();

