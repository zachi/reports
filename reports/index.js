


(function () {

  var measures = (function () {
    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
      outerWidth = 1000,
      outerHeight = 500,
      width = outerWidth - margin.left - margin.right,
      height = outerHeight - margin.top - margin.bottom;

    return {
      margin: margin,
      outerWidth: outerWidth,
      outerHeight: outerHeight,
      width: width,
      height: height
    }


  })();

  var axes = (function () {
    var questionnaireTip = d3.select(".report").append("div").attr("class", "questionnaire-tip").style("opacity", 0);

    function init(data, svg) {

      axes.yAxisScale = d3.scaleLinear().domain([100, 0]).range([0, measures.height]);
      var yAxis = d3.axisLeft(axes.yAxisScale);
      yAxisGroup = svg.append("g").classed("y axis", true).call(yAxis);

      axes.xAxisScale = d3.scaleLinear().domain([0, data.folder.questionnaires.length]).range([0, measures.width]);
      var xAxis = d3.axisBottom(axes.xAxisScale).tickSize(-measures.height).tickFormat(function (d) { return d == 0 ? '' : data.folder.questionnaires[d - 1].name; });
      svg.append("g").classed("x axis", true).attr("transform", "translate(0," + measures.height + ")").call(xAxis);
      var ticks = svg.selectAll('.tick text');
      ticks.on("mouseover", function (tick) {
        questionnaireTip.html(function () { return data.folder.questionnaires[tick - 1].name });

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

  var abilities = (function () {

    function transform(ability) {
      return "translate(" + axes.xAxisScale(ability["questionnaire-order"]) + "," + axes.yAxisScale(ability["value"]) + ")";

    }
    function init(data, svg) {

      var abilityTip = d3.select(".report").append("div").attr("class", "ability-tip").style("opacity", 0);

      var objects = svg.append("svg").classed("objects", true).attr("width", measures.width).attr("height", measures.height);
      objects.selectAll(".dot")
        .data(data.folder.abilities)
        .enter().append("circle")
        .classed("dot", true)
        .attr("r", "1")
        .attr("transform", transform)
        .style("fill", function (ability) { return ability.finished ? "#00CF00" : "#32BBFF"; })
        .on("mouseover", function (ability) {
          abilityTip.html(function () {
            var result = "";
            for (var i = 0; i < ability.students.length; i++) {
              result += ability.students[i].name + "<br>";
            }
            return result;
          });

          var top = axes.yAxisScale(ability["value"]) + measures.margin.top - (ability.students.length * 10) - (abilityTip.node().getBoundingClientRect().height);
          var left = axes.xAxisScale(ability["questionnaire-order"]) + measures.margin.left - (abilityTip.node().getBoundingClientRect().width / 2);
          abilityTip.style("transform", "translate(" + left + "px ," + top + "px )")
            .style("opacity", .9);


        })
        .on("mouseout", function (d) {
          abilityTip.style("opacity", 0);
        })
        .transition().attr("r", function (ability) { return ability.students.length * 10; }).duration(1000);

    }

    return {
      init: init
    }

  })();

  var svg = d3.select(".report").append("svg").attr("width", measures.outerWidth).attr("height", measures.outerHeight).append("g").attr("transform", "translate(" + measures.margin.left + "," + measures.margin.top + ")");

  d3.json("data.json", function (data) {

    data = loadDataFromQueryIfNecessary(data);
    axes.init(data, svg);
    abilities.init(data, svg);


  });


  function loadDataFromQueryIfNecessary(data) {
    if (decodeURIComponent(document.location.search))
      return JSON.parse(decodeURIComponent(document.location.search.substring(1)));
    return data;
  }


})()

