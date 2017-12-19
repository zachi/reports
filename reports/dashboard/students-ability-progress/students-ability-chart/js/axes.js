
(function () {

  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; cet.dashboard.studentsAbilityChart = cet.dashboard.studentsAbilityChart || {}
  cet.dashboard.studentsAbilityChart.axes =  (function () {

    function init() {

      var questionnaireTip = d34.select(".students-ability-chart").append("div").attr("class", "questionnaire-tip").style("opacity", 0);

      /**************************** Y AXIS **********************************/

      cet.dashboard.studentsAbilityChart.axes.yAxisScale = d34.scaleLinear().domain([100, 0]).range([0, cet.dashboard.studentsAbilityChart.measures.height]);
      var yAxis = d34.axisLeft(cet.dashboard.studentsAbilityChart.axes.yAxisScale).tickSize(cet.dashboard.studentsAbilityChart.measures.width).tickFormat(function (d) {
        
        return d === 0 ? "" : (d / 10) ;
      });
      var yAxisGroup = cet.dashboard.studentsAbilityChart.app.svg.append("g")
        .classed("y axis", true)
        .call(yAxis)
        .attr("transform", "translate(" + cet.dashboard.studentsAbilityChart.measures.width + ", 0)");

      //set y axis title
      var yAxisTitle = yAxisGroup.append("text")
        .classed("students-ability-chart__axis-label", true)
        .attr("transform", "rotate(-90)")
        .attr("font-family", cet.dashboard.studentsAbilityChart.texts.fontFamily)
        .attr("y", -cet.dashboard.studentsAbilityChart.measures.width - cet.dashboard.studentsAbilityChart.measures.margin.left + 16)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(cet.dashboard.studentsAbilityChart.texts.ability);
      yAxisTitle.attr("x", -(( cet.dashboard.studentsAbilityChart.measures.height - yAxisTitle.node().getBoundingClientRect().height) / 2))

      /**************************** X AXIS **********************************/

      cet.dashboard.studentsAbilityChart.axes.xAxisScale = d34.scaleLinear().domain([0, cet.dashboard.studentsAbilityChart.data.root.folder.questionnaires.length]).range([0, cet.dashboard.studentsAbilityChart.measures.width]);
      var xAxis = d34.axisBottom(cet.dashboard.studentsAbilityChart.axes.xAxisScale).ticks(cet.dashboard.studentsAbilityChart.data.root.folder.questionnaires.length).tickSize(-cet.dashboard.studentsAbilityChart.measures.height).tickFormat(function (d) { return d === 0 ? "" : d; });
      var xAxisGroup = cet.dashboard.studentsAbilityChart.app.svg.append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + cet.dashboard.studentsAbilityChart.measures.height + ")")
        .call(xAxis);

      //set x axis title
      var xAxisTitle = xAxisGroup.append("text")
        .classed("students-ability-chart__axis-label", true)
        .attr("y", cet.dashboard.studentsAbilityChart.measures.margin.bottom - 8)
        .attr("font-family", cet.dashboard.studentsAbilityChart.texts.fontFamily)
        .style("text-anchor", "end")
        .text(cet.dashboard.studentsAbilityChart.texts.questionnaire);
      xAxisTitle.attr("x", (cet.dashboard.studentsAbilityChart.measures.width + xAxisTitle.node().getBoundingClientRect().width) / 2);

      //set x axis lables height
      var xTicks = cet.dashboard.studentsAbilityChart.app.svg.selectAll('.x .tick text');
      xTicks.attr("y", cet.dashboard.studentsAbilityChart.measures.xLabelHeight);



      //set ticks questionaire name tooltip
      xTicks.on("mouseover", function (tick) {
        if (tick == 0)
          return;
        questionnaireTip.style("display", "");
        questionnaireTip.html(function () { return cet.dashboard.studentsAbilityChart.data.root.folder.questionnaires[tick - 1].name });

        var top = cet.dashboard.studentsAbilityChart.axes.yAxisScale(0) + cet.dashboard.studentsAbilityChart.measures.margin.top - questionnaireTip.node().getBoundingClientRect().height + 15;
        var left = cet.dashboard.studentsAbilityChart.axes.xAxisScale(tick) + cet.dashboard.studentsAbilityChart.measures.margin.left - (questionnaireTip.node().getBoundingClientRect().width / 2);;

        if (cet.dashboard.studentsAbilityChart.utils.isIE()) {
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

      cet.dashboard.studentsAbilityChart.app.svg.selectAll('.tick text').classed('students-ability-chart__axis-tick-text', true);
      cet.dashboard.studentsAbilityChart.app.svg.selectAll('.tick line').classed('students-ability-chart__grid-line', true);
      cet.dashboard.studentsAbilityChart.app.svg.selectAll('.tick').classed('students-ability-chart__axis-tick', true);

    }


    return {
      yAxisScale: null,
      xAxisScale: null,
      init: init
    }

  })();

})();