function generateChart(id, data) {
	var margin = 50;
	
	  // append the svg object to the body of the page
	  var container = d3.select("#"+id);
	  console.log(container.node());
	  let width = container.node().clientWidth;
	  let height = container.node().clientHeight;
	  
	  console.log(width, height);
	  var svg = container
	  .append("svg")
		.attr("width", width)
		.attr("height", height)
		.classed("chart", true);
	  
	  var graphContainer = svg.append("g")
		.attr("transform","scale("+((width-margin*2)/width)+") translate("+margin+",0)")
	  
		console.log(data);
		console.log(d3.extent(data, function(d) {return d.date;}));
		console.log(d3.extent(data, function(d) {return d.value;}));
	  
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
  if(isDarkMode()) {
	return(graphColors[0].dark);
  }
  return(graphColors[0].light);
}

function updateChartColor(chart) {
	
}

function updateAllChartColors() {
	
}