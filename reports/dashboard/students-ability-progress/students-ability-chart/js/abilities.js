
(function () {

  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {};
  cet.dashboard.studentsAbilityChart.abilities = (function () {
    var abilityTip;
    var tipsHtml = [];
    var titlesHeight;

    function transform(ability) {
      return "translate(" + cet.dashboard.studentsAbilityChart.axes.xAxisScale(ability["questionnaire-order"]) + "," + cet.dashboard.studentsAbilityChart.axes.yAxisScale(ability["value"]) + ")";

    }

    function getAbilityTitlesHeight() {
      if (!titlesHeight) {
        titlesHeight = document.querySelector('.students-ability-chart__title').getBoundingClientRect().height;
      }
      return titlesHeight;


      //var chart = document.querySelector('.students-ability-dashboard')
      //var svg;

      //if (!chart) return 0;

      //svg = chart.querySelector('svg');

      //if (!svg) return 0;

      //return svg.getBoundingClientRect().top - chart.getBoundingClientRect().top
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

        var student = "<span class='ability-tip__student'>" + ability.students[i].firstName + ' ' + ability.students[i].lastName + "</span>";
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
      //console.info('==========================')
      //console.info(result);
      //console.info('==========================')
      return result;
    }

    function getAbilityTipPosition(ability) {

      var titlesHeight = getAbilityTitlesHeight();
      var triangleHeight = 14;

      var top = titlesHeight
        + cet.dashboard.studentsAbilityChart.axes.yAxisScale(ability["value"])
        + cet.dashboard.studentsAbilityChart.measures.margin.top
        + getAbilityRadius(ability)
        + triangleHeight



      var left = cet.dashboard.studentsAbilityChart.axes.xAxisScale(ability["questionnaire-order"])
        + cet.dashboard.studentsAbilityChart.measures.margin.left
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
      cet.dashboard.studentsAbilityChart.app.svg.selectAll(".x.axis .students-ability-chart__axis-tick:nth-child(" + (ability["questionnaire-order"] + 2) + ")").classed('students-ability-chart__axis-tick--strong', true);
      cet.dashboard.studentsAbilityChart.app.svg.selectAll(".y.axis .students-ability-chart__axis-tick:nth-child(" + (12 - ability["value"]) + ")").classed('students-ability-chart__axis-tick--strong', true);

    }

    function hideAbilityTooltip(ability) {

      abilityTip.transition().duration(350).style("opacity", .0).on("end", function () { abilityTip.style("display", "none") });
      cet.dashboard.studentsAbilityChart.app.svg.selectAll(".x.axis .students-ability-chart__axis-tick:nth-child(" + (ability["questionnaire-order"] + 2) + ")").classed('students-ability-chart__axis-tick--strong', false);
      cet.dashboard.studentsAbilityChart.app.svg.selectAll(".y.axis .students-ability-chart__axis-tick:nth-child(" + (12 - ability["value"]) + ")").classed('students-ability-chart__axis-tick--strong', false);
    }

    function getAbilityRadius(ability) {

      var radius = Math.sqrt(ability.students.length) * 13;
      if (ability.finishedPart)
        radius = ability.finishedFraction * radius;
      return radius;
    }

    function init() {

      abilityTip = d34.select(".students-ability-chart").append("div").attr("class", "ability-tip").style("opacity", 0);

      var sortedAbilities = cet.dashboard.studentsAbilityProgress.data.getAbilitiesOfHighestSubmitted().sort(function (a, b) { return b.students.length - a.students.length; })

      var sortedAbilitiesDoubled = [];
      for (var i = 0; i < sortedAbilities.length; i++) {
        sortedAbilities[i].tipHtml = buildAbilityTipHtml(sortedAbilities[i]);

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
        .transition().attr("r", getAbilityRadius).duration(1000);


      var abilities = cet.dashboard.studentsAbilityChart.app.svg.selectAll(".objects .ability");

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
      //document.body.addEventListener('click', function (event) {
      //  abilityTip.transition().duration(350).style("opacity", .0).on("end", function () { abilityTip.style("display", "none") });
      //});
    }

    return {
      init: init
    }

  })();

})();