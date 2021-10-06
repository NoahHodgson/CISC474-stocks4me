function loadChart(data) {
  document.getElementById("emptyStockMessage").display = "none";
  var margin = 50;
  
  // append the svg object to the body of the page
  var container = d3.select("#stockChartContainer");
  container.html("");
  console.log(container.node());
  let width = container.node().scrollWidth;
  let height = container.node().scrollHeight;
  
  console.log(width, height);
  var svg = container
  .append("svg")
    .attr("width", width)
    .attr("height", height)
    .classed("chart", true);
  
  var graphContainer = svg.append("g")
    .attr("transform","scale("+((width-margin*2)/width)+") translate("+margin+",0)")
  
  /*
  //load data
  d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",
  
    // read/parse the csv file
    function(d){
      return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
    },
  
    // dataset:
    function(data) {
  
      // x axis 
      var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.date; }))
        .range([ 0, width ]);
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
  
      // y axis
      var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.value; })])
        .range([ height, 0 ]);
      svg.append("g")
        .call(d3.axisLeft(y));
  
      // line
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1.75)
        .attr("d", d3.line()
          .x(function(d) { return x(d.date) })
          .y(function(d) { return y(d.value) })
          )
  })*/
  
  console.log(d3.extent(data, function(d) {return d.date;}));
  
  // x axis 
  var x = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.date; }))
    .range([ 0, width ]);
  var xAxis = graphContainer.append("g")
    .attr("transform", "translate(0," + (height) + ")")
    .call(d3.axisBottom(x))
    .classed("axis", true);

  // y axis
  var y = d3.scaleLinear()
    .domain([d3.min(data, function(d) { return +d.value; }), d3.max(data, function(d) { return +d.value; })])
    .range([ height, 0 ]);
  graphContainer.append("g")
    .call(d3.axisLeft(y))
    .classed("axis", true);

  // line
  graphContainer.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", getGraphColor())
    .attr("stroke-width", 3)
    .attr("d", d3.line()
      .x(function(d) { return x(d.date) })
      .y(function(d) { return y(d.value) })
      )
    .classed("graphLine", true);
    
  svg
    .selectAll('text')
    .style("fill",(isDarkMode()) ? "white" : "black");
  svg
    .selectAll(".axis")
    .selectAll("path")
    .attr("stroke", (isDarkMode()) ? "white" : "black");
  svg
    .selectAll(".axis")
    .selectAll("line")
    .attr("stroke", (isDarkMode()) ? "white" : "black");
}

function isDarkMode() {
  return window.matchMedia("(prefers-color-scheme:dark)").matches;
}

let graphColors = [
  {
    light: "#ed4d6d",
    dark: "#ed4d6d"
  },
  {
    light: "#ed7658",
    dark: "#ed7658"
  },
  {
    light: "#eda83f",
    dark: "#eda83f"
  },
  {
    light: "#f2c93f",
    dark: "#f2d65d"
  },
  {
    light: "#74de66",
    dark: "#74de66"
  },
  {
    light: "#79d9b1",
    dark: "#79d9b1"
  },
  {
    light: "#70b4cf",
    dark: "#70b4cf"
  },
  {
    light: "#c1a3de",
    dark: "#c1a3de"
  },
  {
    light: "#eda3de",
    dark: "#eda3de"
  }
];

function getGraphColor() {
  let colorSelect = document.getElementById("colorSelect").value;
  if(isDarkMode()) {
    return(graphColors[colorSelect].dark);
  }
  return(graphColors[colorSelect].light);
}

function updateChartColors() {
  d3.select(".chart")
    .selectAll('.graphLine')
    .attr("stroke",getGraphColor());
  
  d3.select(".chart")
    .selectAll(".axis")
    .selectAll("path")
    .attr("stroke", (isDarkMode()) ? "white" : "black");
  d3.select(".chart")
    .selectAll(".axis")
    .selectAll("line")
    .attr("stroke", (isDarkMode()) ? "white" : "black");
  
  d3.select(".chart")
    .selectAll('text')
    .style("fill",(isDarkMode()) ? "white" : "black");
}