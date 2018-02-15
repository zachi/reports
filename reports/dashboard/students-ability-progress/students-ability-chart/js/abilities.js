
(function () {

  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {};
  cet.dashboard.studentsAbilityChart.abilities = (function () {
    var abilityTip;
    var questionsPopup;
    var questionsTable;
    var tipsHtml = [];
    var titlesHeight;
    var measures;
    var mouseleaveTimeout;
    var timeTillHidingTipMs = 100;

    function transform(ability) {
      return "translate(" + cet.dashboard.studentsAbilityChart.axes.xAxisScale(ability["questionnaire-order"] + 1 ) + "," + cet.dashboard.studentsAbilityChart.axes.yAxisScale(ability["value"]) + ")";

    }

    function getAbilityTitlesHeight() {
      if (!titlesHeight) {
        titlesHeight = document.querySelector('.students-ability-chart__title').getBoundingClientRect().height;
      }
      return titlesHeight;
    }

    function hasFinishedStudent(ability) {
      for (var i = 0; i < ability.students.length; i++) {
        if (ability.students[i].finished)
          return true;
      }
      return false;
    }

    function buildAbilityTipHtml(ability) {

      var result = [
        "<div data-questionnaire-order='", ability["questionnaire-order"], "' class='ability-tip__title' >",
          cet.dashboard.studentsAbilityChart.texts.ability, " ", ability["value"], "<br>", cet.dashboard.studentsAbilityProgress.data.getQuestionaireNameByOrder(ability["questionnaire-order"]),
        "</div>"].join('');

      var firstColumnStudents = "";
      var secondColumnStudents = "";

      for (var i = 0; i < ability.students.length; i++) {

        var student = [
          "<span class='ability-tip__student' data-avg-ability='", ability.students[i].avgAbility, "' data-id='", ability.students[i].id, "' >",
            ability.students[i].firstName, ' ', ability.students[i].lastName,
          "</span>"].join('');

        if (ability.students[i].finished)
          student = student.replace("ability-tip__student", "ability-tip__student ability-tip__student--finished");

        //student = [
        //  "<a target='_blank' href='", ability.students[i].taskUrl, "'>",
        //    student,
        //  "</a>"].join('');

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
        + cet.dashboard.studentsAbilityChart.measures.gridMargin.top
        + getAbilityRadius(ability)
        + triangleHeight



      var left = cet.dashboard.studentsAbilityChart.axes.xAxisScale(ability["questionnaire-order"] + 1)
        + cet.dashboard.studentsAbilityChart.measures.gridMargin.left
        - (abilityTip.node().getBoundingClientRect().width / 2);

      return {
        top: top,
        left: left
      }
    }


    function showAbilityTooltip(ability) {

      clearTimeout(mouseleaveTimeout);

      abilityTip.html(ability.tipHtml);
      abilityTip.style("display", "");

      var tipPosition = getAbilityTipPosition(ability);
      if (cet.dashboard.studentsAbilityProgress.utils.isIE()) {
        abilityTip.style("top", (tipPosition.top + 10) + "px");
        abilityTip.style("left", tipPosition.left + "px");
      }
      else {
        abilityTip.style("transform", "translate(" + tipPosition.left + "px ," + tipPosition.top + "px )");
      }

      abilityTip.transition().duration(350).style("opacity", .8);

      //highlight axes 
      clearCoordinatesLabelsMarking();
      markCoordinatesLabels(ability["questionnaire-order"], ability["value"]);

      abilityTip.selectAll('.ability-tip__student').on('click', function () {
        cet.dashboard.studentsAbilityChart.questionsAbility.show(this);
      
      })

    }

    function handleAbilityMouseLeave(ability) {
      mouseleaveTimeout = setTimeout(function () {
        abilityTip.transition().duration(350).style("opacity", .0).on("end", function () { abilityTip.style("display", "none") });
        clearCoordinatesLabelsMarking();
      }, timeTillHidingTipMs);
    }

    function handleTipMouseOver() {
      clearTimeout(mouseleaveTimeout);
    }

    function handleTipMouseLeave() {
      abilityTip.transition().duration(350).style("opacity", .0).on("end", function () { abilityTip.style("display", "none") });
      clearCoordinatesLabelsMarking();
    }

    function markCoordinatesLabels(x, y) {
      cet.dashboard.studentsAbilityChart.app.svg.selectAll(".x.axis .students-ability-chart__axis-tick:nth-child(" + (x + 2) + ")").classed('students-ability-chart__axis-tick--strong', true);
      cet.dashboard.studentsAbilityChart.app.svg.selectAll(".y.axis .students-ability-chart__axis-tick:nth-child(" + (12 - y) + ")").classed('students-ability-chart__axis-tick--strong', true);
    }

    function clearCoordinatesLabelsMarking() {
      cet.dashboard.studentsAbilityChart.app.svg.selectAll(".x.axis .students-ability-chart__axis-tick").classed('students-ability-chart__axis-tick--strong', false);
      cet.dashboard.studentsAbilityChart.app.svg.selectAll(".y.axis .students-ability-chart__axis-tick").classed('students-ability-chart__axis-tick--strong', false);
    }

    function getAbilityRadius(ability) {

      var radius = Math.sqrt(ability.students.length) * 13;
      if (ability.finishedPart)
        radius = ability.finishedFraction * radius;
      return radius;
    }

    function init() {
      measures = measures = cet.dashboard.studentsAbilityChart.measures;
            
      abilityTip = d34.select(".students-ability-chart").append("div").attr("class", "students-ability-chart__ability-tip").style("opacity", 0);
      abilityTip.on("mouseover", handleTipMouseOver).on("mouseleave", handleTipMouseLeave);

      var sortedAbilities = cet.dashboard.studentsAbilityProgress.data.getAbilitiesOfHighestSubmitted().sort(function (a, b) { return b.students.length - a.students.length; })

      var sortedAbilitiesDoubled = [];
      for (var i = 0; i < sortedAbilities.length; i++) {
        sortedAbilities[i].tipHtml = buildAbilityTipHtml(sortedAbilities[i]);

        sortedAbilitiesDoubled.push(sortedAbilities[i]);
        var abilityFinishedPart = JSON.parse(JSON.stringify(sortedAbilities[i]));
        abilityFinishedPart.finishedPart = true;
        sortedAbilitiesDoubled.push(abilityFinishedPart);
      }

      var abilitiesContainer = cet.dashboard.studentsAbilityChart.app.svg.insert("svg", ":first-child").classed("students-ability-chart__abilities", true).attr("width", measures.width).attr("height", measures.height);
      abilitiesContainer.selectAll(".students-ability-chart__ability")
        .data(sortedAbilitiesDoubled)
        .enter().append("circle")
        .classed("students-ability-chart__ability", function (ability) { return !ability.finishedPart; })
        .classed("students-ability-chart__ability-finished-part", function (ability) { return ability.finishedPart; })
        .attr("r", "1")
        .attr("transform", transform)
        .transition().attr("r", getAbilityRadius).duration(1000);


      var abilities = cet.dashboard.studentsAbilityChart.app.svg.selectAll(".students-ability-chart__abilities .students-ability-chart__ability");

      abilities.on("mouseover", showAbilityTooltip).on("mouseleave", handleAbilityMouseLeave);

      abilities.on("click", function (event) {

        var selectedClass = 'students-ability-chart__ability--selected'
        var selectedAbility = document.querySelector('.' + selectedClass);

        if (selectedAbility) {
          selectedAbility.setAttribute('class', selectedAbility.getAttribute('class').replace(selectedClass, ''));
          selectedAbility.nextSibling.setAttribute('class', selectedAbility.nextSibling.getAttribute('class').replace(selectedClass, ''));
        }

        this.setAttribute('class', this.getAttribute('class') + ' ' + selectedClass);
        if (this.getAttribute('r') === this.nextSibling.getAttribute('r')) {
          this.nextSibling.setAttribute('class', this.nextSibling.getAttribute('class') + ' ' + selectedClass);
        }
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