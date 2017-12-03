


(function () {

  var texts = {
    questionnaires: "שאלונים",
    questionnaire: "שאלון",
    abilities: "יכולות",
    ability: "יכולת",
    legendGreenCircle: "מציין כי השאלון הינו האחרון בתיקיה עבור חלק מהתלמידים."


  }
  var colors = {
    texts: "#00000033",
    ability: "#32BBFF",
    abilityFinished: "#00CF00"

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
    var questionnaireTip = d3.select(".report").append("div").attr("class", "questionnaire-tip").style("opacity", 0);

    function init() {

      axes.yAxisScale = d3.scaleLinear().domain([100, 0]).range([0, measures.height]);
      var yAxis = d3.axisLeft(axes.yAxisScale).tickSize(measures.width);
      yAxisGroup = app.svg.append("g")
        .classed("y axis", true)
        .call(yAxis)
        .attr("transform", "translate(" + measures.width + ", 0)")
        .append("text")
        .classed("axis-label", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -measures.width - measures.margin.left)
        .attr("x", -(measures.height / 2 - 20))

        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(texts.ability);


      axes.xAxisScale = d3.scaleLinear().domain([0, data.root.folder.questionnaires.length]).range([0, measures.width]);
      var xAxis = d3.axisBottom(axes.xAxisScale).tickSize(-measures.height).tickFormat(function (d) { return d; });
      app.svg.append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + measures.height + ")")
        .call(xAxis)
        .append("text")
        .classed("axis-label", true)
        .attr("x", measures.width / 2 + 30)
        .attr("y", measures.margin.bottom)
        .style("text-anchor", "end")
        .text(texts.questionnaire);;

      var ticks = app.svg.selectAll('.x .tick text');
      ticks.attr("y", measures.xLabelHeight);

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
    function getAbilityColor(ability) {
      for (var i = 0; i < ability.students.length; i++) {
        if (ability.students[i].finished)
          return colors.abilityFinished;
      }
      return colors.ability;
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
      var top = axes.yAxisScale(ability["value"]) + measures.margin.top - (ability.students.length * 10) - (abilityTip.node().getBoundingClientRect().height);
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

    function init() {

      abilityTip = d3.select(".report").append("div").attr("class", "ability-tip").style("opacity", 0);
      var sortedAbilities = data.root.folder.abilities.sort(function (a, b) { return b.students.length - a.students.length; })
      var objects = app.svg.append("svg").classed("objects", true).attr("width", measures.width).attr("height", measures.height);
      objects.selectAll(".dot")
        .data(sortedAbilities)
        .enter().append("circle")
        .classed("dot", true)
        .attr("r", "1")
        .attr("transform", transform)
        .style("fill", getAbilityColor)
        .on("mouseover", showAbilityTooltip)
        .on("mouseout", hideAbilityTooltip)
        .transition().attr("r", function (ability) { return ability.students.length * 10; }).duration(1000);
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
          .attr("fill", colors.abilityFinished);

      legend.append("text")
          .attr("y", -10)
          .text(texts.legendGreenCircle)
          .attr("x", measures.width - 20);
    }
    

    d3.json("data.json", function (response) {
      app.svg = d3.select(".report").append("svg").attr("width", measures.outerWidth).attr("height", measures.outerHeight).append("g").attr("transform", "translate(" + measures.margin.left + "," + measures.margin.top + ")");
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

