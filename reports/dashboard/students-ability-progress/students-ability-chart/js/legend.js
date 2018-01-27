(function () {
  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentsAbilityChart = window.cet.dashboard.studentsAbilityChart || {};
  cet.dashboard.studentsAbilityChart.legend = (function () {
    var self = this;

    


    function init(svg, chartClassName) {

      var namespace = cet.dashboard.studentsAbilityChart;



      var self = this;

      

      var legend = svg.append("g")
        .classed("legend", true)
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("circle")
        .attr("r", 8)
        .attr("cx", namespace.measures.gridWidth - 7)
        .attr("cy", -15)
        .classed("finished-part", true);

      legend.append("text")
        .attr("y", -10)
        .text(cet.dashboard.studentsAbilityChart.texts.legendAbilityFinished)
        //.attr("x", measures.width - 20) //the correct calculation when 'direction:rtl' is working (not on IE11)
        .attr("font-family", cet.dashboard.studentsAbilityChart.texts.fontFamily)
        .attr("x", namespace.measures.gridWidth - 115)
        .classed(chartClassName + '__legend-text', true);

      legend.append("circle")
        .classed("ability", true)
        .attr("r", 8)
        .attr("cx", namespace.measures.gridWidth - 145)
        .attr("cy", -15);

      legend.append("text")
        .attr("y", -10)
        .text(cet.dashboard.studentsAbilityChart.texts.legendAbility)
        .classed(chartClassName + '__legend-text', true)
        //.attr("x", measures.width - 108); //the correct calculation when 'direction:rtl' is working (not on IE11)
        .attr("x", namespace.measures.gridWidth - 276)
        .attr("font-family", cet.dashboard.studentsAbilityChart.texts.fontFamily);


    }

    return { init: init };




  })();

  




})();

