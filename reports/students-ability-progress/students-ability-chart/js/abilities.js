
(function () {

  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {};
  cet.dashboard.studentsAbilityChart.abilities = (function () {
    var abilityTip;

    function transform(ability) {
      return "translate(" + cet.dashboard.studentsAbilityChart.axes.xAxisScale(ability["questionnaire-order"]) + "," + cet.dashboard.studentsAbilityChart.axes.yAxisScale(ability["value"]) + ")";

    }

    function hasFinishedStudent(ability) {
      for (var i = 0; i < ability.students.length; i++) {
        if (ability.students[i].finished)
          return true;
      }
      return false;
    }

    function showAbilityTooltip(ability) {
      abilityTip.html(function () {
        var result = "<div class=\"ability-tip__title\" >" +
          ability["value"] + " " + cet.dashboard.studentsAbilityChart.texts.ability + "<br>" + cet.dashboard.studentsAbilityChart.data.getQuestionaireNameByOrder(ability["questionnaire-order"]) +
          "</div>";

        for (var i = 0; i < ability.students.length; i++) {
          var student = "<span class='ability-tip__student'>" + ability.students[i].name + "</span>";
          if (ability.students[i].finished)
            student = student.replace("ability-tip__student", "ability-tip__student ability-tip__student--finished");
          
          if( i%2 === 1 )
            student = student + "<br>";

          result += student;
        }
        return result;
      });
      var tooltipTopMarginToPreventFlickering = -6;
      abilityTip.style("display", "");
      var top = cet.dashboard.studentsAbilityChart.axes.yAxisScale(ability["value"])
        + cet.dashboard.studentsAbilityChart.measures.margin.top
        - getAbilityRadius(ability)
        - (abilityTip.node().getBoundingClientRect().height)
        - tooltipTopMarginToPreventFlickering;
      var left = cet.dashboard.studentsAbilityChart.axes.xAxisScale(ability["questionnaire-order"]) + cet.dashboard.studentsAbilityChart.measures.margin.left - (abilityTip.node().getBoundingClientRect().width / 2);
      abilityTip.style("top", top + "px");
      abilityTip.style("left", left + "px");
      abilityTip.transition().duration(350).style("opacity", .8);


      cet.dashboard.studentsAbilityChart.app.svg.selectAll(".x.axis .students-ability-chart__axis-tick:nth-child(" + (ability["questionnaire-order"] + 2) + ")").classed('students-ability-chart__axis-tick--strong', true);
      cet.dashboard.studentsAbilityChart.app.svg.selectAll(".y.axis .students-ability-chart__axis-tick:nth-child(" + (12 - (ability["value"] / 10)) + ")").classed('students-ability-chart__axis-tick--strong', true);

    }

    function hideAbilityTooltip(ability) {

      abilityTip.transition().duration(350).style("opacity", .0).on("end", function () { abilityTip.style("display", "none") });
      cet.dashboard.studentsAbilityChart.app.svg.selectAll(".x.axis .students-ability-chart__axis-tick:nth-child(" + (ability["questionnaire-order"] + 2) + ")").classed('students-ability-chart__axis-tick--strong', false);
      cet.dashboard.studentsAbilityChart.app.svg.selectAll(".y.axis .students-ability-chart__axis-tick:nth-child(" + (12 - (ability["value"] / 10)) + ")").classed('students-ability-chart__axis-tick--strong', false);
    }

    function getAbilityRadius(ability) {

      var radius = Math.sqrt(ability.students.length) * 13;
      if (ability.finishedPart)
        radius = ability.finishedFraction * radius;
      return radius;
    }

    function init() {

      abilityTip = d34.select(".students-ability-chart").append("div").attr("class", "ability-tip").style("opacity", 0);
      var sortedAbilities = cet.dashboard.studentsAbilityChart.data.root.folder.abilities.sort(function (a, b) { return b.students.length - a.students.length; })

      var sortedAbilitiesDoubled = [];
      for (var i = 0; i < sortedAbilities.length; i++) {
        sortedAbilitiesDoubled.push(sortedAbilities[i]);
        var abilityFinishedPart = JSON.parse(JSON.stringify(sortedAbilities[i]));
        abilityFinishedPart.finishedPart = true;
        sortedAbilitiesDoubled.push(abilityFinishedPart);
      }

      var objects = cet.dashboard.studentsAbilityChart.app.svg.append("svg").classed("objects", true).attr("width", cet.dashboard.studentsAbilityChart.measures.width).attr("height", cet.dashboard.studentsAbilityChart.measures.height);
      objects.selectAll(".ability")
        .data(sortedAbilitiesDoubled)
        .enter().append("circle")
        .classed("ability", function (ability) { return !ability.finishedPart; })
        .classed("finished-part", function (ability) { return ability.finishedPart; })
        .attr("r", "1")
        .attr("transform", transform)
        //.on("mouseover", showAbilityTooltip)
        //.on("mouseout", hideAbilityTooltip)
        .transition().attr("r", getAbilityRadius).duration(1000);


      var fullAbilities = cet.dashboard.studentsAbilityChart.app.svg.selectAll(".ability");
      fullAbilities.on("mouseover", showAbilityTooltip).on("mouseout", hideAbilityTooltip);


    }

    return {
      init: init
    }

  })();

})();