
(function () {

  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; cet.dashboard.studentsAbilityHistoryChart = cet.dashboard.studentsAbilityHistoryChart || {}
  cet.dashboard.studentsAbilityHistoryChart.axes =  (function () {

    function init() {

      var questionnaireTip = d34.select(".students-ability-chart").append("div").attr("class", "questionnaire-tip").style("opacity", 0);

      /**************************** Y AXIS **********************************/

      cet.dashboard.studentsAbilityHistoryChart.axes.yAxisScale = d34.scaleLinear().domain([10, 0]).range([0, cet.dashboard.studentsAbilityHistoryChart.measures.height]);
      var yAxis = d34.axisLeft(cet.dashboard.studentsAbilityHistoryChart.axes.yAxisScale).tickSize(cet.dashboard.studentsAbilityHistoryChart.measures.width).tickFormat(function (d) {
        
        return d === 0 ? "" : d ;
      });
      var yAxisGroup = cet.dashboard.studentsAbilityHistoryChart.app.svg.append("g")
        .classed("y axis", true)
        .call(yAxis)
        .attr("transform", "translate(" + cet.dashboard.studentsAbilityHistoryChart.measures.width + ", 0)");

      //set y axis title
      var yAxisTitle = yAxisGroup.append("text")
        .classed("students-ability-chart__axis-label", true)
        .attr("transform", "rotate(-90)")
        .attr("font-family", cet.dashboard.studentsAbilityChart.texts.fontFamily)
        .attr("y", -cet.dashboard.studentsAbilityHistoryChart.measures.width - cet.dashboard.studentsAbilityHistoryChart.measures.margin.left + 16)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(cet.dashboard.studentsAbilityChart.texts.ability);
      yAxisTitle.attr("x", -(( cet.dashboard.studentsAbilityHistoryChart.measures.height - yAxisTitle.node().getBoundingClientRect().height) / 2))

      /**************************** X AXIS **********************************/

      cet.dashboard.studentsAbilityHistoryChart.axes.xAxisScale = d34.scaleLinear().domain([0, cet.dashboard.studentsAbilityProgress.data.root.folder.questionnaires.length]).range([0, cet.dashboard.studentsAbilityHistoryChart.measures.width]);
      var xAxis = d34.axisBottom(cet.dashboard.studentsAbilityHistoryChart.axes.xAxisScale).ticks(cet.dashboard.studentsAbilityProgress.data.root.folder.questionnaires.length).tickSize(-cet.dashboard.studentsAbilityHistoryChart.measures.height).tickFormat(function (d) { return d === 0 ? "" : d; });
      var xAxisGroup = cet.dashboard.studentsAbilityHistoryChart.app.svg.append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + cet.dashboard.studentsAbilityHistoryChart.measures.height + ")")
        .call(xAxis);

      //set x axis title
      var xAxisTitle = xAxisGroup.append("text")
        .classed("students-ability-chart__axis-label", true)
        .attr("y", 40)
        .attr("font-family", cet.dashboard.studentsAbilityChart.texts.fontFamily)
        .style("text-anchor", "end")
        .text(cet.dashboard.studentsAbilityChart.texts.questionnaire);
      xAxisTitle.attr("x", (cet.dashboard.studentsAbilityHistoryChart.measures.width + xAxisTitle.node().getBoundingClientRect().width) / 2);

      //set x axis lables height
      var xTicks = cet.dashboard.studentsAbilityHistoryChart.app.svg.selectAll('.x .tick text');
      xTicks.attr("y", cet.dashboard.studentsAbilityHistoryChart.measures.xLabelHeight);



      //set ticks questionaire name tooltip
      xTicks.on("mouseover", function (tick) {
        if (tick === 0)
          return;
        questionnaireTip.style("display", "");
        questionnaireTip.html(function () { return cet.dashboard.studentsAbilityProgress.data.root.folder.questionnaires[tick - 1].name });

        var top = cet.dashboard.studentsAbilityHistoryChart.axes.yAxisScale(0) + cet.dashboard.studentsAbilityHistoryChart.measures.margin.top - questionnaireTip.node().getBoundingClientRect().height + 15;
        var left = cet.dashboard.studentsAbilityHistoryChart.axes.xAxisScale(tick) + cet.dashboard.studentsAbilityHistoryChart.measures.margin.left - (questionnaireTip.node().getBoundingClientRect().width / 2);;

        if (cet.dashboard.studentsAbilityHistoryChart.utils.isIE()) {
          questionnaireTip.style("top", top + "px");
          questionnaireTip.style("left", left + "px");
        }
        else {
          questionnaireTip.style("transform", "translate(" + left + "px ," + top + "px )");
        }
        
        questionnaireTip.transition().duration(350).style("opacity", .8);
        
      })
        .on("mouseout", function (d) {

          questionnaireTip.transition().duration(350).style("opacity", .0).on("end", function () { questionnaireTip.style("display", "none") });

        });

      cet.dashboard.studentsAbilityHistoryChart.app.svg.selectAll('.tick text').classed('students-ability-chart__axis-tick-text', true);
      cet.dashboard.studentsAbilityHistoryChart.app.svg.selectAll('.tick line').classed('students-ability-chart__grid-line', true);
      cet.dashboard.studentsAbilityHistoryChart.app.svg.selectAll('.tick').classed('students-ability-chart__axis-tick', true);

    }


    return {
      yAxisScale: null,
      xAxisScale: null,
      init: init
    }

  })();

})();