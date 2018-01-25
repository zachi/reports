(function () {
  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentsAbilityHistoryChart = window.cet.dashboard.studentsAbilityHistoryChart || {};
  cet.dashboard.studentsAbilityHistoryChart.legend = (function () {
    var self = this;

    


    function init(svg, chartClassName) {

      var namespace = cet.dashboard.studentsAbilityHistoryChart;
      
      var students = cet.dashboard.studentsAbilityProgress.data.getSelectedStudents();
      
      var self = this;
      var legend = svg.append("g")
        .classed("legend", true)
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

      var lastPixel = namespace.measures.gridWidth - 7;
      for (var i = 0; i < students.length; i++) {
        
        var c = legend.append("circle")
          .attr("r", 8)
          .attr("cx", lastPixel)
          .attr("cy", -15)
          .attr('fill', cet.dashboard.studentsAbilityHistoryChart.studentsColors.getStudentColor(students[i].id))
        lastPixel -= 10;
        
        var t = legend.append("text")
          .attr("y", -10)
          .text(students[i].lastName + ' ' + students[i].firstName)
          //.attr("x", measures.width - 20) //the correct calculation when 'direction:rtl' is working (not on IE11)
          .attr("font-family", cet.dashboard.studentsAbilityChart.texts.fontFamily)
          
          .classed(chartClassName + '__legend-text', true);

        
        lastPixel -= t.node().getBoundingClientRect().width;
        t.attr("x", lastPixel);
        lastPixel -= c.node().getBoundingClientRect().width ;
      }
      

      //legend.append("circle")
      //  .classed("ability", true)
      //  .attr("r", 8)
      //  .attr("cx", namespace.measures.gridWidth - 145)
      //  .attr("cy", -15);

      //legend.append("text")
      //  .attr("y", -10)
      //  .text(cet.dashboard.studentsAbilityChart.texts.legendAbility)
      //  .classed(chartClassName + '__legend-text', true)
      //  //.attr("x", measures.width - 108); //the correct calculation when 'direction:rtl' is working (not on IE11)
      //  .attr("x", namespace.measures.gridWidth - 276)
      //  .attr("font-family", cet.dashboard.studentsAbilityChart.texts.fontFamily);


    }

    return { init: init };




  })();

  




})();

