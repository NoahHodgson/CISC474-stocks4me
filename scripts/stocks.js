function loadStockPrice(symbol) {
	return new Promise(resolve => {
		let r = new XMLHttpRequest();
		r.open("GET", "https://finnhub.io/api/v1/quote?symbol=" + symbol + "&token=c548e3iad3ifdcrdgh80", true);
		r.onreadystatechange = function () {
			if (this.readyState == 4) {
				if (this.status == 200) {
					let obj = JSON.parse(this.response);
					resolve(obj);
				} else if (this.status == 403) {
					resolve("Cannot access this symbol.");
				}
			}
		}
		r.send();
	});
}

function loadStockHistory(symbol) {
	return new Promise(resolve => {
		let r = new XMLHttpRequest();
		r.open("GET", "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + symbol + "&interval=60min&outputsize=full&apikey=AN5BTH22T0R74PI0", true);
		r.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				var responseObject = JSON.parse(this.response);
				responseObject = responseObject["Time Series (60min)"];
				var newObject = [];
				var lowerBound = new Date();
				lowerBound.setDate(lowerBound.getDate() - 7);
				for (key in responseObject) {
					let d = new Date(key.replace(" ", "T"));
					if (d < lowerBound) { break; }
					let p = document.createElement("p");
					let openPrice = (responseObject[key]["1. open"]);
					
					var dateObject = {};
					
					dateObject.date = d;
					dateObject.value = openPrice;
					
					newObject.push(dateObject);
				}
				resolve(newObject);
			}
		}
		r.send();
	});
}

async function loadStock(object) {
	let symbol = object["symbol"]
	
	let priceObject = await loadStockPrice(symbol);
	let historyObject = await loadStockHistory(symbol);
	
	let outputObj = {
		"name":object["description"],
		"symbol":symbol,
		"current":priceObject["c"],
		"delta":priceObject["d"],
		"high":priceObject["h"],
		"low":priceObject["l"],
		"history":historyObject,
		"lastUpdated":new Date()
	}
	
	return outputObj;
}

function createStockObjectContainer(stockObject, addChart, showBorder) {
	var titleObject = document.createElement("h2");
	var priceObject = document.createElement("p");
	var hiLoObject = document.createElement("p");
	var lastUpdatedObject = document.createElement("p");
	
	titleObject.innerHTML = (stockObject["name"]+" ("+stockObject["symbol"]+")")+((stockObject["numShares"] != undefined) ? (": "+stockObject["numShares"]+" Share"+((parseInt(stockObject["numShares"]) == 1) ? "" : "s")) : "");
	priceObject.innerHTML = ("Current: "+stockObject["current"]);
	hiLoObject.innerHTML = ("High/Low: "+stockObject["high"]+"/"+stockObject["low"]);
	lastUpdatedObject.innerHTML = "Last Updated: "+stockObject["lastUpdated"];
	
	let container = document.createElement("div");
	container.className = "stockInfoContainer";
	if(showBorder) {
		container.className += " module stockInfoContainerInList";
	}
	container.appendChild(titleObject);
	container.appendChild(priceObject);
	container.appendChild(hiLoObject);
	container.appendChild(lastUpdatedObject);
	container.id = "stockContainer"+stockObject["symbol"];
	
	return container;
}

function displayStock(stockObject, id, addChart, showBorder) {
	let stockContainerObject = createStockObjectContainer(stockObject, addChart, showBorder);
	
	document.getElementById(id).appendChild(stockContainerObject);
	
	if(addChart) {
		var graphContainer = document.createElement("div");
		graphContainer.id = "graphFor"+stockObject["symbol"];
		graphContainer.style.width = "500px";
		graphContainer.style.height = "250px";
		stockContainerObject.appendChild(graphContainer);
		
		for(date of stockObject["history"]) {
			date["date"] = new Date(date["date"]);
		}
		
		generateChart(graphContainer.id, stockObject["history"]);
	}
	
	return stockContainerObject;
}

function buyShare(stockObject, numShares) {
	console.log("buying "+numShares+" shares");
	console.log(stockObject);
	
	let price = stockObject["current"];
	var wallet = getUserInfo()["wallet"];
	
	if (price <= wallet) {
		wallet-=price;
		
		var storedNews = getUserInfo()["news"];
		var storedStocks = getUserInfo()["stocks"];
		
		if(storedNews == null) {
			storedNews = []
		}
		
		if(storedStocks == null) {
			storedStocks = {};
		}
		
		if(storedStocks[stockObject["name"]] == undefined) {
			storedStocks[stockObject["name"]] = stockObject;
			storedStocks[stockObject["name"]]["numShares"] = 1;
			storedNews.push(stockObject["name"]);
		} else {
			oldObject = storedStocks[stockObject["name"]];
			storedStocks[stockObject["name"]] = stockObject;
			storedStocks[stockObject["name"]]["numShares"] = oldObject["numShares"]+1;
			storedStocks[stockObject["name"]]["lastUpdated"] = stockObject["lastUpdated"];
		}
		
		updateWallet(wallet);
		updateStocks(storedStocks);
		updateNews(storedNews);
		displayUserInfo();
		loadAllStocks();
	} else {
		alert("Price of Stock exceeds wallet!")
	}
}

function sellShare(stockObject, numShares) {
	console.log("selling "+numShares+" shares");
	console.log(stockObject);
	
	let price = stockObject["current"];
	var wallet = getUserInfo()["wallet"];
	
	wallet+=price;
	
	var storedNews = getUserInfo()["news"];
	var storedStocks = getUserInfo()["stocks"];
	
	if(storedStocks[stockObject["name"]]["numShares"] == 1) {
		delete storedStocks[stockObject["name"]];
		storedNews.splice(storedNews.indexOf(stockObject["name"]),1);
	} else {
		oldObject = storedStocks[stockObject["name"]];
		storedStocks[stockObject["name"]] = stockObject;
		storedStocks[stockObject["name"]]["numShares"] = oldObject["numShares"]-1;
		storedStocks[stockObject["name"]]["lastUpdated"] = new Date();
	}
	
	updateWallet(wallet);
	updateStocks(storedStocks);
	updateNews(storedNews);
	
	displayUserInfo();
	loadAllStocks();
}

function loadAllStocks() {
	var stocks = getUserInfo()["stocks"];
	console.log(stocks);
	
	var allStocksContainer = document.getElementById("allStocksHolder");
	allStocksHolder.innerHTML = "";
	
	if(stocks.length == 0) {
		allStocksContainer.innerHTML = "No stocks in your portfolio.";
	} else {
		for(var stock of Object.keys(stocks)) {
			displayStock(stocks[stock], "allStocksHolder", true, true);
		}
		
		getNews();
	}
}