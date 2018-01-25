
(function () {
  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentsAbilityHistoryChart = window.cet.dashboard.studentsAbilityHistoryChart || {};
  cet.dashboard.studentsAbilityHistoryChart.abilities = (function () {
    var abilityTip;
    var tipsHtml = [];
    var measures;

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



    function init(measuresl) {
      measures = measuresl;
      abilityTip = d34.select(".students-ability-history-chart").append("div").attr("class", "ability-tip").style("opacity", 0);

      

      

        var abilities = cet.dashboard.studentsAbilityProgress.data.root.folder.abilities;

        for (var i = 0; i < abilities.length; i++) {
          abilities[i].tipHtml = buildAbilityTipHtml(abilities[i]);
        }

        var color = d34.scaleOrdinal().range(["#94af8c", "#74a9cf", "#3cbac9", "#dba388", "#ffaacb"]);


      var arc = d34.arc().innerRadius(0),
        pie = d34.pie();

      //var nodeData = root.children;
      var svg = cet.dashboard.studentsAbilityHistoryChart.app.svg.append("svg").classed("objects", true).attr("width", measures.gridWidth).attr("height", measures.gridHeight);


      var nodes = svg.selectAll("g.node")
        .data(abilities).enter().append("g")
        .attr("class", "node ability")
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
          return cet.dashboard.studentsAbilityHistoryChart.studentsColors.getStudentColor(d.studentId);
        });

      var abilities = cet.dashboard.studentsAbilityHistoryChart.app.svg.selectAll(".objects .ability");

      abilities.on("mouseover", showAbilityTooltip).on("mouseout", hideAbilityTooltip);

      abilities.on("click", function (event) {
        if (window.location.href.indexOf('.lab.') > -1) {
          console.log('%c Dashboard is in phase 1 mode. remove this if statement to go into phase 2', 'font-size:24px; color: red;');
          //return;
        }

        var selectedClass = 'selected-ability'
        var selectedAbility = document.querySelector('.' + selectedClass);

        if (selectedAbility) {
          selectedAbility.classList.remove(selectedClass);
        }

        this.classList.add(selectedClass);

        cet.dashboard.studentsAbilityProgress.data.setSelectedAbilities(event);
      })

    }

    return {
      init: init
    }

  })();

  

})();