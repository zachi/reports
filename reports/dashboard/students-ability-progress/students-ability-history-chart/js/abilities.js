
(function () {
  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentsAbilityHistoryChart = window.cet.dashboard.studentsAbilityHistoryChart || {};
  cet.dashboard.studentsAbilityHistoryChart.abilities = (function () {
    var abilityTip;
    //var tipsHtml = {};
    var measures;
    const CONSTS = {
      RADIUS_FACTOR: 13,
      LINE_WIDTH: 2,
      TIGHT_FACTOR: 1.5,
      CURVE_FACTOR: 10,
      LINE_DASH: "10,5"
    }

    function transform(ability) {
      return "translate(" + cet.dashboard.studentsAbilityHistoryChart.axes.xAxisScale(ability["questionnaire-order"]) + "," + cet.dashboard.studentsAbilityHistoryChart.axes.yAxisScale(ability["value"]) + ")";

    }

    /*function getAbilityTitlesHeight() {
      var chart = document.querySelector('.students-ability-dashboard')
      var svg;
  
      if (!chart) return 0;
  
      svg = chart.querySelector('svg');
  
      if (!svg) return 0;
  
      return svg.getBoundingClientRect().top - chart.getBoundingClientRect().top
    }*/

    function hasFinishedStudent(ability) {
      for (var i = 0; i < ability.students.length; i++) {
        if (ability.students[i].finished)
          return true;
      }
      return false;
    }

    function buildAbilityTipHtml(ability) {
      var result = "<div class=\"ability-tip__title\" >" +
        cet.dashboard.studentsAbilityChart.texts.ability + " " + ability["value"] + "<br>" + cet.dashboard.studentsAbilityProgress.data.getQuestionaireNameByOrder(ability["questionnaire-order"]) +
        "</div>";

      var firstColumnStudents = "";
      var secondColumnStudents = "";

      for (var i = 0; i < ability.students.length; i++) {

        var student = "<span class='ability-tip__student' style=\"color: " + cet.dashboard.studentsAbilityHistoryChart.studentsColors.getStudentColor(ability.students[i].id) + "\" >" + ability.students[i].firstName + ' ' + ability.students[i].lastName + "</span>";
        if (ability.students[i].finished)
          student = student.replace("ability-tip__student", "ability-tip__student ability-tip__student--finished");

        if (i % 2 === 0)
          firstColumnStudents += student;
        else
          secondColumnStudents += student;


      }

      result += "<div class=\"ability-tip__students\">" +
        " <div class=\"ability-tip__students-column\">" + firstColumnStudents + "</div>" +
        " <div class=\"ability-tip__students-column\">" + secondColumnStudents + "</div>" +
        "</div>";

      return result;
    }

    function getAbilityTipPosition(ability) {
      var tooltipTopMarginToPreventFlickering = 0;//getAbilityTitlesHeight();
      var top = cet.dashboard.studentsAbilityHistoryChart.axes.yAxisScale(ability["value"])
        + measures.titleHeight
        + measures.gridMargin.top
        + getAbilityRadius(ability);
      //+ (abilityTip.node().getBoundingClientRect().height)
      //+ tooltipTopMarginToPreventFlickering;
      var left = cet.dashboard.studentsAbilityHistoryChart.axes.xAxisScale(ability["questionnaire-order"])
        + measures.gridMargin.left
        - (abilityTip.node().getBoundingClientRect().width / 2);

      return {
        top: top,
        left: left
      }
    }

    function showAbilityTooltip(ability) {

      abilityTip.html(ability.tipHtml);
      abilityTip.style("display", "");

      var tipPosition = getAbilityTipPosition(ability);
      if (cet.dashboard.studentsAbilityProgress.utils.isIE()) {
        abilityTip.style("top", (tipPosition.top - 10) + "px");
        abilityTip.style("left", tipPosition.left + "px");
      }
      else {
        abilityTip.style("transform", "translate(" + tipPosition.left + "px ," + tipPosition.top + "px )");
      }

      abilityTip.transition().duration(350).style("opacity", .8);

      //highlight axes 
      cet.dashboard.studentsAbilityHistoryChart.app.svg.selectAll(".x.axis .students-ability-chart__axis-tick:nth-child(" + (ability["questionnaire-order"] + 2) + ")").classed('students-ability-chart__axis-tick--strong', true);
      cet.dashboard.studentsAbilityHistoryChart.app.svg.selectAll(".y.axis .students-ability-chart__axis-tick:nth-child(" + (12 - ability["value"]) + ")").classed('students-ability-chart__axis-tick--strong', true);

    }

    function hideAbilityTooltip(ability) {

      abilityTip.transition().duration(350).style("opacity", .0).on("end", function () { abilityTip.style("display", "none") });
      cet.dashboard.studentsAbilityHistoryChart.app.svg.selectAll(".x.axis .students-ability-chart__axis-tick:nth-child(" + (ability["questionnaire-order"] + 2) + ")").classed('students-ability-chart__axis-tick--strong', false);
      cet.dashboard.studentsAbilityHistoryChart.app.svg.selectAll(".y.axis .students-ability-chart__axis-tick:nth-child(" + (12 - ability["value"]) + ")").classed('students-ability-chart__axis-tick--strong', false);
    }

    function getAbilityRadius(ability) {
      var radius = Math.sqrt(ability.students.length) * 13;
      if (ability.finishedPart)
        radius = ability.finishedFraction * radius;
      return radius;
    }

    function reload(dontShowPaths) {
      var abilities = cet.dashboard.studentsAbilityProgress.data.getSelectedStudentsAbilities();
      if (!abilities)
        return;

      for (var i = 0; i < abilities.length; i++) {
        abilities[i].tipHtml = buildAbilityTipHtml(abilities[i]);
      }

      var color = d34.scaleOrdinal().range(["#94af8c", "#74a9cf", "#3cbac9", "#dba388", "#ffaacb"]);


      var arc = d34.arc().innerRadius(0),
        pie = d34.pie();

      cet.dashboard.studentsAbilityHistoryChart.app.svg.selectAll("svg.students-ability-chart__abilities").remove();

      var svg = cet.dashboard.studentsAbilityHistoryChart.app.svg.append("svg").classed("students-ability-chart__abilities", true).attr("width", measures.gridWidth).attr("height", measures.gridHeight);

      if (!dontShowPaths) {
        drawPaths(svg, cet.dashboard.studentsAbilityProgress.data.getSelectedStudentsLines());
      }

      var nodes = svg.selectAll("g.students-ability-history-chart__ability")
        .data(abilities).enter().append("g")
        .attr("class", "students-ability-history-chart__ability")
        .attr("transform", transform);

      nodes.selectAll("circle")
        .data(function (d) { return [d]; })
        .enter().append("circle")
        .attr("r", function (ability) {
          return Math.sqrt(ability.students.length) * CONSTS.RADIUS_FACTOR;
        });

      var arcsData = nodes.selectAll("g.students-ability-history-chart__ability-arc")
        .data(function (d) {
          //every student has the same weight: arcs are equal 
          var weights = d.students.map(function (s) { return 1; })
          var arcsData = pie(weights);
          var radius = Math.sqrt(d.students.length) * CONSTS.RADIUS_FACTOR;
          for (var j = 0; j < arcsData.length; j++) {
            arcsData[j].radius = radius;
            arcsData[j].studentId = d.students[j].id
          }
          return arcsData;
        });


      arcsData.enter()
        .append("g")
        .attr("class", "students-ability-history-chart__ability-arc")
        .append("path")
        .attr("d", function (d) {
          arc.outerRadius(d.radius)(d);
          return arc(d);
        })
        .style("fill", function (d, i) {
          return cet.dashboard.studentsAbilityHistoryChart.studentsColors.getStudentColor(d.studentId);
        });

      var abilities = cet.dashboard.studentsAbilityHistoryChart.app.svg.selectAll(".students-ability-chart__abilities .students-ability-history-chart__ability");

      abilities.on("mouseover", showAbilityTooltip).on("mouseout", hideAbilityTooltip);

    }


    function init() {
      measures = cet.dashboard.studentsAbilityHistoryChart.measures;
      abilityTip = d34.select(".students-ability-history-chart").append("div").attr("class", "students-ability-chart__ability-tip").style("opacity", 0);

      reload();
    }

    function drawPaths(svg, linesData) {
      let lines = [];

      const curveFunction = d34.line()
       .x(function (d) { return d.x; })
       .y(function (d) { return d.y; })
       .curve(d34.curveBasis);
      const xAxisScale = cet.dashboard.studentsAbilityHistoryChart.axes.xAxisScale;
      const yAxisScale = cet.dashboard.studentsAbilityHistoryChart.axes.yAxisScale;
      const getStudentColor = cet.dashboard.studentsAbilityHistoryChart.studentsColors.getStudentColor;
      const distance = function (x1, y1, x2, y2) { return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) }
      const duplicateShift = function (duplicateIndex) {
        let num = Math.ceil(duplicateIndex / 2);
        let sign = num - duplicateIndex / 2 === 0 ? 1 : -1;
        return num * sign
      }

      linesData.forEach(function (lineData) {
        let x1 = xAxisScale(lineData.from.x);
        let y1 = yAxisScale(lineData.from.y);
        let x2 = xAxisScale(lineData.to.x);
        let y2 = yAxisScale(lineData.to.y);
        let shift = lineData.duplicates ? duplicateShift(lineData.duplicateIndex) * CONSTS.TIGHT_FACTOR : 0;

        let line =
          {
            points: [
            { x: x1, y: y1 + shift * CONSTS.LINE_WIDTH },
            { x: x2, y: y2 + shift * CONSTS.LINE_WIDTH }
            ],
            color: getStudentColor(lineData.studentId),
            width: CONSTS.LINE_WIDTH,
          };

        if (lineData.skip) {
          let dist = distance(lineData.from.x, lineData.from.y, lineData.to.x, lineData.to.y);
          let curvePoint = {
            x: (x1 + x2) / 2 + dist,
            y: (y1 + y2) / 2 - dist * CONSTS.CURVE_FACTOR
          }
          line.points.splice(1, 0, curvePoint);
        }
        lines.push(line);
      });

      svg.selectAll("path")
        .data(lines)
        .enter()
        .append("path")
        .attr("d", function (line) { return curveFunction(line.points) })
        .attr("class", function (line) { return line.points.length > 2 ? 'curve' : 'straight' })
        .attr("stroke", function (line) { return line.color })
        .attr("stroke-width", function (line) { return line.width })
        .attr("stroke-dasharray", function (line) { return line.points.length > 2 ? CONSTS.LINE_DASH : 0 })
        .attr("fill", "none");
    }

    return {
      init: init,
      reload: reload
    }

  })();
})();