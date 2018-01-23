
(function () {
  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentsAbilityHistoryChart = window.cet.dashboard.studentsAbilityHistoryChart || {};
  cet.dashboard.studentsAbilityHistoryChart.abilities = (function () {
    var abilityTip;
    var tipsHtml = [];

    function transform(ability) {
      return "translate(" + cet.dashboard.studentsAbilityHistoryChart.axes.xAxisScale(ability["questionnaire-order"]) + "," + cet.dashboard.studentsAbilityHistoryChart.axes.yAxisScale(ability["value"]) + ")";

    }

    function getAbilityTitlesHeight() {
      var chart = document.querySelector('.students-ability-dashboard')
      var svg;

      if (!chart) return 0;

      svg = chart.querySelector('svg');

      if (!svg) return 0;

      return svg.getBoundingClientRect().top - chart.getBoundingClientRect().top
    }

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

        var student = "<span class='ability-tip__student'>" + ability.students[i].name + "</span>";
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
      var tooltipTopMarginToPreventFlickering = getAbilityTitlesHeight();
      var top = cet.dashboard.studentsAbilityHistoryChart.axes.yAxisScale(ability["value"])
        + cet.dashboard.studentsAbilityHistoryChart.measures.margin.top
        + getAbilityRadius(ability)
        //+ (abilityTip.node().getBoundingClientRect().height)
        + tooltipTopMarginToPreventFlickering;
      var left = cet.dashboard.studentsAbilityHistoryChart.axes.xAxisScale(ability["questionnaire-order"])
        + cet.dashboard.studentsAbilityHistoryChart.measures.margin.left
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
      if (cet.dashboard.studentsAbilityChart.utils.isIE()) {
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



    function init() {

      //abilityTip = d34.select(".students-ability-history-chart").append("div").attr("class", "ability-tip").style("opacity", 0);

      //var abilities = cet.dashboard.studentsAbilityHistoryChart.app.svg.selectAll(".objects .ability");
      //abilities.on("mouseover", showAbilityTooltip).on("mouseout", hideAbilityTooltip);
      //abilities.on("click", function (e) {
      //  cet.dashboard.studentsAbilityProgress.data.setSelectedAbilities(e);
      //})
      ////document.body.addEventListener('click', function (event) {
      ////  abilityTip.transition().duration(350).style("opacity", .0).on("end", function () { abilityTip.style("display", "none") });
      ////});


      var data = cet.dashboard.studentsAbilityProgress.data.root.folder.abilities;
      var color = d34.scaleOrdinal().range(["#94af8c", "#74a9cf", "#3cbac9", "#dba388", "#ffaacb"]);


      var arc = d34.arc().innerRadius(0),
          pie = d34.pie();

      //var nodeData = root.children;
      var svg = cet.dashboard.studentsAbilityHistoryChart.app.svg.append("svg").classed("objects", true).attr("width", cet.dashboard.studentsAbilityHistoryChart.measures.width).attr("height", cet.dashboard.studentsAbilityHistoryChart.measures.height);


      var nodes = svg.selectAll("g.node")
          .data(data).enter().append("g")
          .attr("class", "node")
          .attr("transform", transform);

      nodes.selectAll("circle")
        .data(function (d) { return [d]; })
        .enter().append("circle")
        .attr("r", function (ability) {
          return Math.sqrt(ability.students.length) * 13;
        });

      var arcsData = nodes.selectAll("g.arc")
          .data(function (d) {
            //every student has the same weight: arcs are equal 
            var weights = d.students.map(function (s) { return 1; })
            var arcsData = pie(weights);
            var radius = Math.sqrt(d.students.length) * 13;
            for (var j = 0; j < arcsData.length; j++) {
              arcsData[j].radius = radius;
              arcsData[j].studentId = d.students[j].id
            }
            return arcsData;
          });


      arcsData.enter()
        .append("g")
        .attr("class", "arc")
        .append("path")
        .attr("d", function (d) {
          arc.outerRadius(d.radius)(d);
          return arc(d);
        })
        .style("fill", function (d, i) {
          return studentsColors.getStudentColor(d.studentId);
        });

    }

    return {
      init: init
    }

  })();

  var studentsColors = (function () {
    var colorBank = ["#ffaacb", "#dba388", "#3cbac9", "#74a9cf", "#94af8c"];
    var dynamicColors = JSON.parse(JSON.stringify(colorBank));
    var currentAllocation = {};
    function reset() {
      currentAllocation = {};
      dynamicColors = JSON.parse(JSON.stringify(colorBank));
    }
    function getStudentColor(id) {
      if (!currentAllocation[id])
        currentAllocation[id] = dynamicColors.pop();
      return currentAllocation[id];
    }

    return {
      getStudentColor: getStudentColor,
      reset: reset
    }
  })();

})();