function loadChart(data) {
  console.log("LOADING CHART");
  var margin = 50;
  // append the svg object to the body of the page
  var container = d3.select("#stockChartContainer");
  console.log(container.node());
  let width = container.node().scrollWidth;
  let height = container.node().scrollHeight;
  
  console.log(width, height);
  var svg = container
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  
  var graphContainer = svg.append("g")
    .attr("transform","scale("+((width-margin*2)/width)+") translate("+margin+",0)")
  
  console.log(d3.extent(data, function(d) {return d.date;}));
  
  // x axis 
  var x = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.date; }))
    .range([ 0, width ]);
  graphContainer.append("g")
    .attr("transform", "translate(0," + (height) + ")")
    .call(d3.axisBottom(x));

  // y axis
  var y = d3.scaleLinear()
    .domain([d3.min(data, function(d) { return +d.value; }), d3.max(data, function(d) { return +d.value; })])
    .range([ height, 0 ]);
  graphContainer.append("g")
    .call(d3.axisLeft(y));

  // line
  graphContainer.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 1.75)
    .attr("d", d3.line()
      .x(function(d) { return x(d.date) })
      .y(function(d) { return y(d.value) })
      )
}