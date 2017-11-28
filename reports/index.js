
var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    outerWidth = 1000,
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

var svgContainer = d3.select("body").append("svg").attr("width", outerWidth).attr("height", outerHeight).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.json("data.json", function (data) {

  var xAxisScale = d3.scaleLinear().domain([0, data.folder.questionnaires.length]).range([0, width]).nice();
  var xAxis = d3.axisBottom(xAxisScale).tickSize(-height);
  xAxis.tickFormat(function (d) {
      return d == 0 ? '' : data.folder.questionnaires[d - 1].name;
  });
  var xAxisGroup = svgContainer.append("g").classed("x axis", true).attr("transform", "translate(0," + height + ")").call(xAxis);

});



var yAxisScale = d3.scaleLinear().domain([100, 0]).range([0, height]);
var yAxis = d3.axisLeft(yAxisScale);
var yAxisGroup = svgContainer.append("g").classed("y axis", true).call(yAxis);