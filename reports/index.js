


(function () {

  var texts = {
    questionnaires: "שאלונים",
    questionnaire: "שאלון",
    abilities: "יכולות",
    ability: "יכולת",
    legendGreenCircle: "מציין כי השאלון הינו האחרון בתיקיה עבור חלק מהתלמידים.",
    legendAbilityFinished: "התיקיה הסתיימה",
    legendAbility: "התיקיה לא הסתיימה"


  }

  var measures = (function () {
    var margin = { top: 40, right: 50, bottom: 50, left: 50 },
      outerWidth = 1000,
      outerHeight = 500,
      width = outerWidth - margin.left - margin.right,
      height = outerHeight - margin.top - margin.bottom,
      xLabelHeight = 10;
    return {
      margin: margin,
      outerWidth: outerWidth,
      outerHeight: outerHeight,
      width: width,
      height: height,
      xLabelHeight: xLabelHeight
    }


  })();

  var axes = (function () {
    var questionnaireTip = d3.select(".students-ability-chart").append("div").attr("class", "questionnaire-tip").style("opacity", 0);

    function init() {

      /**************************** Y AXIS **********************************/

      axes.yAxisScale = d3.scaleLinear().domain([100, 0]).range([0, measures.height]);
      var yAxis = d3.axisLeft(axes.yAxisScale).tickSize(measures.width);
      var yAxisGroup = app.svg.append("g")
        .classed("y axis", true)
        .call(yAxis)
        .attr("transform", "translate(" + measures.width + ", 0)");

        //set y axis title
      yAxisGroup.append("text")
        .classed("axis-label", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -measures.width - measures.margin.left)
        .attr("x", -(measures.height / 2 - 20))
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(texts.ability);


      /**************************** X AXIS **********************************/

      axes.xAxisScale = d3.scaleLinear().domain([0, data.root.folder.questionnaires.length]).range([0, measures.width]);
      var xAxis = d3.axisBottom(axes.xAxisScale).ticks(data.root.folder.questionnaires.length).tickSize(-measures.height).tickFormat(function (d) { return d; });
      var xAxisGroup = app.svg.append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + measures.height + ")")
        .call(xAxis);

      //set x axis title
      xAxisGroup.append("text")
        .classed("axis-label", true)
        .attr("x", measures.width / 2 + 30)
        .attr("y", measures.margin.bottom - 3)
        .style("text-anchor", "end")
        .text(texts.questionnaire);;

      //set x axis lables height
      var ticks = app.svg.selectAll('.x .tick text');
      ticks.attr("y", measures.xLabelHeight);


      //set ticks questionaire name tooltip
      ticks.on("mouseover", function (tick) {
        questionnaireTip.html(function () { return data.root.folder.questionnaires[tick - 1].name });

        var top = axes.yAxisScale(0) + measures.margin.top - questionnaireTip.node().getBoundingClientRect().height - 5;

        var left = axes.xAxisScale(tick) + measures.margin.left - (questionnaireTip.node().getBoundingClientRect().width / 2);;
        questionnaireTip.style("transform", "translate(" + left + "px ," + top + "px )")
          .style("opacity", .9);
      })
        .on("mouseout", function (d) {
          questionnaireTip.style("opacity", 0);
        });
    }


    return {
      yAxisScale: null,
      xAxisScale: null,
      init: init
    }

  })();

  var data = (function () {

    var root;

    function loadDataFromQueryIfNecessary(response) {
      if (decodeURIComponent(document.location.search))
        return JSON.parse(decodeURIComponent(document.location.search.substring(1)));
      return response;
    }

    function init(initData) {

      data.root = loadDataFromQueryIfNecessary(initData);

    }

    function getQuestionaireNameByOrder(order) {
      return data.root.folder.questionnaires[order - 1].name
    }


    return {

      init: init,
      root: root,
      getQuestionaireNameByOrder: getQuestionaireNameByOrder

    }

  })();

  var abilities = (function () {
    var abilityTip;

    function transform(ability) {
      return "translate(" + axes.xAxisScale(ability["questionnaire-order"]) + "," + axes.yAxisScale(ability["value"]) + ")";

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
          data.getQuestionaireNameByOrder(ability["questionnaire-order"]) +
          " - " + texts.ability + " " + ability["value"] +
          "</div>";

        for (var i = 0; i < ability.students.length; i++) {
          var student = "<span>" + ability.students[i].name + "</span>" + "<br>";
          if (ability.students[i].finished)
            student = student.replace("span", "span class='student--finished'");
          result += student;
        }
        return result;
      });

      abilityTip.style("display", "");
      var top = axes.yAxisScale(ability["value"]) + measures.margin.top - getAbilityRadius(ability) - (abilityTip.node().getBoundingClientRect().height);
      var left = axes.xAxisScale(ability["questionnaire-order"]) + measures.margin.left - (abilityTip.node().getBoundingClientRect().width / 2);
      abilityTip.style("transform", "translate(" + left + "px ," + top + "px )")
        .transition().duration(350).style("opacity", .8);


      app.svg.selectAll(".x.axis .tick:nth-child(" + (ability["questionnaire-order"] + 2) + ")").classed('strong', true);
      app.svg.selectAll(".y.axis .tick:nth-child(" + (12 - (ability["value"] / 10)) + ")").classed('strong', true);

    }
    function hideAbilityTooltip(ability) {

      abilityTip.transition().duration(350).style("opacity", .0).on("end", function () { abilityTip.style("display", "none") });
      app.svg.selectAll(".x.axis .tick:nth-child(" + (ability["questionnaire-order"] + 2) + ")").classed('strong', false);
      app.svg.selectAll(".y.axis .tick:nth-child(" + (12 - (ability["value"] / 10)) + ")").classed('strong', false);
    }

    function getAbilityRadius(ability) { return Math.sqrt(ability.students.length) * 13; }

    function init() {

      abilityTip = d3.select(".students-ability-chart").append("div").attr("class", "ability-tip").style("opacity", 0);
      var sortedAbilities = data.root.folder.abilities.sort(function (a, b) { return b.students.length - a.students.length; })
      var objects = app.svg.append("svg").classed("objects", true).attr("width", measures.width).attr("height", measures.height);
      objects.selectAll(".ability")
        .data(sortedAbilities)
        .enter().append("circle")
        .classed("ability", true)
        .classed("finished", hasFinishedStudent)
        .attr("r", "1")
        .attr("transform", transform)
        .on("mouseover", showAbilityTooltip)
        .on("mouseout", hideAbilityTooltip)
        .transition().attr("r", getAbilityRadius).duration(1000);
    }

    return {
      init: init
    }

  })();

  var app = (function () {

    function initLegend() {
      var legend = app.svg.append("g")
        .classed("legend", true)
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("circle")
        .attr("r", 10)
        .attr("cx", measures.width - 7)
        .attr("cy", -15)
        .classed("ability", true)
        .classed("finished", true);


      legend.append("text")
        .attr("y", -10)
        .text(texts.legendAbilityFinished)
        .attr("x", measures.width - 20);

      legend.append("circle")
        .classed("ability", true)
        .attr("r", 10)
        .attr("cx", measures.width - 135)
        .attr("cy", -15);


      legend.append("text")
        .attr("y", -10)
        .text(texts.legendAbility)
        .attr("x", measures.width - 148);
    }

    d3.json("data.json", function (response) {
      document.querySelector('.students-ability-chart__preloader').remove();
      app.svg = d3.select(".students-ability-chart").append("svg").attr("width", measures.outerWidth).attr("height", measures.outerHeight).append("g").attr("transform", "translate(" + measures.margin.left + "," + measures.margin.top + ")");
      data.init(response);
      axes.init();
      abilities.init();
      initLegend()



    });

    return {
      svg: null
    }

  })();


})()

