
var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    outerWidth = 1000,
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

var svg = d3.select(".report").append("svg").attr("width", outerWidth).attr("height", outerHeight).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var yAxisScale = d3.scaleLinear().domain([100, 0]).range([0, height]);
var yAxis = d3.axisLeft(yAxisScale);
var yAxisGroup = svg.append("g").classed("y axis", true).call(yAxis);

var xAxisScale = null;

var tip = d3.select(".report").append("div").attr("class", "d3-tip").style("opacity", 0);

d3.json("data.json", function (data) {

    data = loadDataFromQueryIfNecessary(data);

    xAxisScale = d3.scaleLinear().domain([0, data.folder.questionnaires.length]).range([0, width]);
    
    var xAxis = d3.axisBottom(xAxisScale).tickSize(-height).tickFormat(function (d) { return d == 0 ? '' : data.folder.questionnaires[d - 1].name; });
    var xAxisGroup = svg.append("g").classed("x axis", true).attr("transform", "translate(0," + height + ")").call(xAxis);
    
    var objects = svg.append("svg").classed("objects", true).attr("width", width).attr("height", height);
    objects.selectAll(".dot")
        .data(data.folder.abilities)
        .enter().append("circle")
        .classed("dot", true)
        .attr("r", "1")
        .attr("transform", transform)
        .style("fill", function (ability) { return ability.finished ? "#00CF00" : "#32BBFF"; })
        .on("mouseover", function (ability) {
            tip.html(function () {
                var result = "";
                for (var i = 0; i < ability.students.length; i++) {
                    result += ability.students[i].name + "<br>";
                }
                return result;
            });

            var top = yAxisScale(ability["value"]) + margin.top - (ability.students.length * 10) - (tip.node().getBoundingClientRect().height);
            var left = xAxisScale(ability["questionnaire-order"]) + margin.left - (tip.node().getBoundingClientRect().width / 2);
            tip.style("transform", "translate(" + left + "px ," + top + "px )")
                .style("opacity", .9);


        })
        .on("mouseout", function (d) {
            tip.style("opacity", 0);
        })    
        .transition().attr("r", function (ability) { return ability.students.length * 10; }).duration(1000);

});

function transform(ability) {
    return "translate(" + xAxisScale(ability["questionnaire-order"]) + "," + yAxisScale(ability["value"]) + ")";

}

function loadDataFromQueryIfNecessary(data) {
    if (decodeURIComponent(document.location.search))
        return JSON.parse(decodeURIComponent(document.location.search.substring(1)));
    return data;
}