var stocksOnGraph = []

function getAllStocks() {
	let stocks = getUserInfo()["stocks"];
	
	var stockPrices = [];
	var dates = [];
	
	for(stock of Object.keys(stocks)) {
		
		for(price of stocks[stock]["history"]) {
			stockPrices = stockPrices.concat(parseFloat(price["value"]));
			if(!dates.includes(price["date"])) {
				dates = dates.concat(price["date"]);
			}
		}
	}
	
	let minVal = Math.min.apply(Math, stockPrices);
	let maxVal = Math.max.apply(Math, stockPrices);
	
	var graphContainer = createGraphContainer("stockChartContainer", minVal, maxVal, dates);
	
	var i = 0;
	for(stock of Object.keys(stocks)) {
		let stockObject = stocks[stock];
		
		stocksOnGraph = stocksOnGraph.concat({"name": stockObject["name"], "enabled": true});
		
		let color = graphColors[i]["light"];
		
		addStockToGraph(graphContainer[0], graphContainer[1], graphContainer[2], stockObject["history"], color);
		i = (i+1)%graphColors.length;
		
		addCheckboxToList(stockObject["name"], stockObject["symbol"], color);
	}
}

function createGraphContainer(id, minVal, maxVal, dates) {
	var margin = 50;
	
	  // append the svg object to the body of the page
	  var container = d3.select("#"+id);
	  container.innerHTML = "";
	  let width = container.node().clientWidth;
	  let height = container.node().clientHeight;
	  console.log(width, height);
	  var svg = container
	  .append("svg")
		.attr("width", width)
		.attr("height", height)
		.classed("chart", true)
	  
	  var graphContainer = svg.append("g")
		.attr("transform","scale("+((width-margin*2)/width)+") translate("+margin+",0)")
	  
	  // x axis 
	  var x = d3.scaleTime()
		.domain(d3.extent(dates, function(d) { return new Date(d); }))
		.range([ 0, width ]);
	  var xAxis = graphContainer.append("g")
		.attr("transform", "translate(0," + (height) + ")")
		.call(d3.axisBottom(x))
		.classed("axis", true);
	
	  // y axis
	  var y = d3.scaleLinear()
		.domain([minVal, maxVal])
		.range([ height, 0 ]);
	  graphContainer.append("g")
		.call(d3.axisLeft(y))
		.classed("axis", true);
		
	  svg
		.selectAll('text')
		.style("fill","black");
	  svg
		.selectAll(".axis")
		.selectAll("path")
		.attr("stroke", "black");
	  svg
		.selectAll(".axis")
		.selectAll("line")
		.attr("stroke", "black");
	
	return [graphContainer, x, y];
}

function addStockToGraph(graphContainer, x, y, data, color) {
	graphContainer.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", color)
		.attr("stroke-width", 3)
		.attr("d", d3.line()
		  .x(function(d) { return x(new Date(d.date)) })
		  .y(function(d) { return y(d.value) })
		  )
		.classed("graphLine", true);
}

function addCheckboxToList(name, symbol, color) {
	let listContainer = document.getElementById("searchContainer");
	
	/*
		<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
		  <label class="form-check-label" for="flexCheckDefault">
			Default checkbox
		  </label>
	*/
	
	let checkBox = document.createElement("input");
	checkBox.className = "form-check-input";
	checkBox.type = "checkbox";
	checkBox.checked = true;
	checkBox.name = "checkbox"+symbol;
	checkBox.style.backgroundColor = color;
	checkBox.style.borderColor = color;
	checkBox.style.marginRight = "10px";
	
	let labelElement = document.createElement("label");
	labelElement.setAttribute("for", "checkbox"+symbol);
	labelElement.className = "form-check-label";
	labelElement.innerHTML = name;
	
	listContainer.appendChild(checkBox);
	listContainer.appendChild(labelElement);
	listContainer.appendChild(document.createElement("br"));
}