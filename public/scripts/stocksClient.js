function createStockObjectContainer(stockObject, addChart, showBorder, isSearch) {
	var titleObject = document.createElement("h2");
	titleObject.className = "stockObjectTitle";
	var priceObject = document.createElement("p");
	priceObject.className = "stockObjectPrice";
	var hiLoObject = document.createElement("p");
	hiLoObject.className = "stockObjectHiLo";
	var lastUpdatedObject = document.createElement("p");
	lastUpdatedObject.className = "stockObjectLastUpdated";
	
	titleObject.innerHTML = (stockObject["name"]+" ("+stockObject["symbol"]+")")
	priceObject.innerHTML = ("Current: "+stockObject["current"]+((stockObject["numShares"] != undefined) ? (" | "+stockObject["numShares"]+" Share"+((parseInt(stockObject["numShares"]) == 1) ? "" : "s")) : ""));
	hiLoObject.innerHTML = ("High/Low: "+stockObject["high"]+"/"+stockObject["low"]);
	lastUpdatedObject.innerHTML = "Last Updated: "+dateToString(new Date(stockObject["lastUpdated"]))+" (Cached)";
	
	let container = document.createElement("div");
	container.className = "stockInfoContainer";
	if(showBorder) {
		container.className += " module stockInfoContainerInList";
	}
	container.appendChild(titleObject);
	container.appendChild(priceObject);
	container.appendChild(hiLoObject);
	container.appendChild(lastUpdatedObject);
	container.id = "stockContainer"+((isSearch) ? "Search" : stockObject["symbol"]);
	return container;
}

function displayStock(stockObject, id, addChart, showBorder, isSearch = false) {
	let stockContainerObject = createStockObjectContainer(stockObject, addChart, showBorder, isSearch);
	
	document.getElementById(id).appendChild(stockContainerObject);
	
	if(addChart) {
		var graphContainer = document.createElement("div");
		graphContainer.id = "graphFor"+stockObject["symbol"];
		graphContainer.className = "graphContainer";
		graphContainer.style.width = "500px";
		graphContainer.style.height = "250px";
		stockContainerObject.appendChild(graphContainer);
		
		for(date of stockObject["history"]) {
			date["date"] = new Date(date["date"]);
		}
		
		generateChart(graphContainer.id, stockObject);
		
		let chartColorPicker = document.createElement("select");
		chartColorPicker.className = "chartColorPicker";
		chartColorPicker.oninput = function() {
			setChartColor(stockObject, this.value);
		}
		
		for(var i = 0; i < graphColors.length; i++) {
			let option = document.createElement("option");
			option.value = i;
			option.innerHTML = graphColors[i].name;
			chartColorPicker.appendChild(option);
		}
		
		chartColorPicker.value = (stockObject["color"] == undefined) ? 0 : stockObject["color"];
		
		
		stockContainerObject.appendChild(chartColorPicker);
	}
	
	if(!isSearch) {
		let loadInSearchContainer = document.createElement("button");
		loadInSearchContainer.className = "btn loadInSearchButton";
		loadInSearchContainer.addEventListener("click", () => {
			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
			document.getElementById("searchInput").value = "";
			search(stockObject["symbol"]);
		})
		loadInSearchContainer.innerHTML = "View Realtime Info";
		stockContainerObject.appendChild(loadInSearchContainer);
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
		
		var loadNews = false;
		
		if(storedStocks[stockObject["name"]] == undefined) {
			storedStocks[stockObject["name"]] = stockObject;
			storedStocks[stockObject["name"]]["numShares"] = 1;
			storedNews.push(stockObject["name"]);
			loadNews = true;
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
		loadAllStocks(loadNews);
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

function dateToString(date) {
	return ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes() + ":" + ((date.getSeconds() < 10) ? "0" : "") + date.getSeconds();
}