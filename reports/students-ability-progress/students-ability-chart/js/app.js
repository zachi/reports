
(function () {

  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {};
  cet.dashboard.studentsAbilityChart.app = (function () {

    var chart;

    function init(options) {
      var preloader = document.createElement("div");
      preloader.classList.add("students-ability-chart__preloader");
      preloader.innerText = "loading...";
      chart = document.querySelector(".students-ability-chart");
      chart.style.width = cet.dashboard.studentsAbilityChart.measures.outerWidth + "px";
      chart.appendChild(preloader);
      //"data/data.json"

      d34.json("/data/data.json", function (response) {

        var preloader = document.querySelector('.students-ability-chart__preloader');
        preloader.parentNode.removeChild(preloader);

        cet.dashboard.studentsAbilityChart.app.svg = d34.select(".students-ability-chart").append("svg").attr("width", cet.dashboard.studentsAbilityChart.measures.outerWidth).attr("height", cet.dashboard.studentsAbilityChart.measures.outerHeight).append("g").attr("transform", "translate(" + cet.dashboard.studentsAbilityChart.measures.margin.left + "," + cet.dashboard.studentsAbilityChart.measures.margin.top + ")");
        initLegend();
        cet.dashboard.studentsAbilityChart.data.init(response);
        cet.dashboard.studentsAbilityChart.axes.init();
        cet.dashboard.studentsAbilityChart.abilities.init();

      });
    }

    function initLegend() {
      var legend = cet.dashboard.studentsAbilityChart.app.svg.append("g")
        .classed("legend", true)
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("circle")
        .attr("r", 10)
        .attr("cx", cet.dashboard.studentsAbilityChart.measures.width - 7)
        .attr("cy", -15)
        .classed("ability", true)
        .classed("finished", true);


      legend.append("text")
        .attr("y", -10)
        .text(cet.dashboard.studentsAbilityChart.texts.legendAbilityFinished)
        //.attr("x", cet.dashboard.studentsAbilityChart.measures.width - 20) //the correct calculation when 'direction:rtl' is working (not on IE11)
        .attr("x", cet.dashboard.studentsAbilityChart.measures.width - 127)
        .classed('students-ability-chart__legend-text', true);

      legend.append("circle")
        .classed("ability", true)
        .attr("r", 10)
        .attr("cx", cet.dashboard.studentsAbilityChart.measures.width - 145)
        .attr("cy", -15);


      legend.append("text")
        .attr("y", -10)
        .text(cet.dashboard.studentsAbilityChart.texts.legendAbility)
        .classed('students-ability-chart__legend-text', true)
      //.attr("x", cet.dashboard.studentsAbilityChart.measures.width - 108); //the correct calculation when 'direction:rtl' is working (not on IE11)
      .attr("x", cet.dashboard.studentsAbilityChart.measures.width - 293);

      var titleElement = document.createElement('div');
      titleElement.classList.add('students-ability-chart__title');
      titleElement.innerHTML = cet.dashboard.studentsAbilityChart.texts.chartName;
      
      chart.insertBefore(titleElement, chart.firstChild);



    }

    return {
      svg: null,
      init: init
    }

  })();

  cet.dashboard.studentsAbilityChart.init = function (options) {
    cet.dashboard.studentsAbilityChart.app.init(options);
  }

})();