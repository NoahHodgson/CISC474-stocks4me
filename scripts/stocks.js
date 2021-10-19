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
					return "Cannot access this symbol.";
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
				let responseObject = JSON.parse(this.response);
				resolve(responseObject);
			}
		}
		r.send();
	});
}

async function loadStock(symbol) {
	let priceObject = await loadStockPrice(symbol);
	let historyObject = await loadStockHistory(symbol);
	
	let outputObj = {
		"symbol":symbol,
		"current":priceObject["p"],
		"delta":priceObject["d"],
		"high":priceObject["h"],
		"low":priceObject["l"],
		"history":historyObject["Time Series (60min)"]
	}
	
	console.log(outputObj);
	
	return outputObj;
}
function displayStock(stockObject, id) {
	
}

function buyShare(stockObject, numShares) {
	
}

function sellShare(stockObject, numShares) {
	
}