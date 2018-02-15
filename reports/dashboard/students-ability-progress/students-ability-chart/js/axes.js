
(function () {

  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; cet.dashboard.studentsAbilityChart = cet.dashboard.studentsAbilityChart || {}
  cet.dashboard.studentsAbilityChart.axesClass = function (svg, measures, chartClassName) {
    var self = this;
    var texts = cet.dashboard.studentsAbilityChart.texts
    self.questionnaireTip = d34.select("." + chartClassName).append("div").attr("class", "students-ability-chart__questionnaire-tip").style("opacity", 0);
    
    /**************************** Y AXIS **********************************/

    self.yAxisScale = d34.scaleLinear().domain([10, 0]).range([0, measures.gridHeight]);
    var yAxis = d34.axisLeft(this.yAxisScale).tickSize(measures.gridWidth).tickFormat(function (d) {
      return d === 0 ? "" : d;
    });
    var yAxisGroup = svg.append("g")
      .classed("y axis", true)
      .call(yAxis)
      .attr("transform", "translate(" + measures.gridWidth + ", 0)");

    //set y axis title
    var yAxisTitle = yAxisGroup.append("text")
      .classed("students-ability-chart__axis-label", true)
      .attr("transform", "rotate(-90)")
      .attr("font-family", texts.fontFamily)
      .attr("y", -measures.gridWidth - measures.gridMargin.left + 16)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(texts.ability);
    yAxisTitle.attr("x", -((measures.gridHeight - yAxisTitle.node().getBoundingClientRect().height) / 2))

    /**************************** X AXIS **********************************/

    self.xAxisScale = d34.scaleLinear().domain([0, cet.dashboard.studentsAbilityProgress.data.root.folder.questionnaires.length]).range([0, measures.gridWidth]);
    var xAxis = d34.axisBottom(this.xAxisScale).ticks(cet.dashboard.studentsAbilityProgress.data.root.folder.questionnaires.length).tickSize(-measures.gridHeight).tickFormat(function (d) { return d === 0 ? "" : d; });
    var xAxisGroup = svg.append("g")
      .classed("x axis", true)
      .attr("transform", "translate(0," + measures.gridHeight + ")")
      .call(xAxis);

    //set x axis title
    var xAxisTitle = xAxisGroup.append("text")
      .classed("students-ability-chart__axis-label", true)
      .attr("y", 40)
      .attr("font-family", texts.fontFamily)
      .style("text-anchor", "end")
      .text(texts.questionnaire);
    xAxisTitle.attr("x", (measures.gridWidth + xAxisTitle.node().getBoundingClientRect().width) / 2);

    //set x axis lables height
    var xTicks = svg.selectAll('.x .tick text');
    xTicks.attr("y", measures.xLabelHeight);



    //set ticks questionaire name tooltip
    xTicks.on("mouseover", function (tick) {
      if (tick === 0)
        return;
      self.questionnaireTip.style("display", "");
      self.questionnaireTip.html(function () { return cet.dashboard.studentsAbilityProgress.data.root.folder.questionnaires[tick - 1].name });

      var top = self.yAxisScale(0)
        + measures.titleHeight
        + measures.gridMargin.top
        - self.questionnaireTip.node().getBoundingClientRect().height;

      var left = self.xAxisScale(tick)
        + measures.gridMargin.left
        - (self.questionnaireTip.node().getBoundingClientRect().width / 2);

      if (cet.dashboard.lib.utils.isIE()) {
        self.questionnaireTip.style("top", top + "px");
        self.questionnaireTip.style("left", left + "px");
      }
      else {
        self.questionnaireTip.style("transform", "translate(" + left + "px ," + top + "px )");
      }

      self.questionnaireTip.transition().duration(350).style("opacity", .8);

    })
      .on("mouseout", function (d) {

        self.questionnaireTip.transition().duration(350).style("opacity", .0).on("end", function () { self.questionnaireTip.style("display", "none") });

      });

    svg.selectAll('.tick text').classed('students-ability-chart__axis-tick-text', true);
    svg.selectAll('.tick line').classed('students-ability-chart__grid-line', true);
    svg.selectAll('.tick').classed('students-ability-chart__axis-tick', true);

  }






})();