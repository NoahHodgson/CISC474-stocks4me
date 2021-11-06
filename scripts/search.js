function searchOnEnter(e) {
	if (e.code == "Enter") {
		search(e.originalTarget.value);
	}
}

function onSearchFocused() {
	document.addEventListener("keydown", searchOnEnter)
}

function onSearchBlurred() {
	document.removeEventListener("keydown", searchOnEnter);
}

function createBuyShareButton(stockObject) {
	let button = document.createElement("button");
	button.className = "btn interactStockButton";
	button.id = "buyButton";
	button.addEventListener("click", () => {
		buyShare(stockObject, 1);
	})
	button.innerHTML = "Buy Share";
	return button;
}

function createSellShareButton(stockObject) {
	let button = document.createElement("button");
	button.className = "btn interactStockButton";
	button.id = "sellButton";
	button.addEventListener("click", () => {
		sellShare(stockObject, 1);
	})
	button.innerHTML = "Sell Share";
	return button;
}

async function search(value) {
	if(value == undefined) {
		value = document.getElementById("searchInput").value;
	}
	var searchContainer = document.getElementById("stockInfo");
	var stockChartContainer = document.getElementById("stockChartContainer");
	
	searchContainer.innerHTML = "";
	stockChartContainer.innerHTML = "";
	
	
	let result = await searchForSymbol(value);
	let stockObject = await loadStock(result);
	
	let stockContainer = displayStock(stockObject, "stockInfo", false, false);
	
	stockContainer.appendChild(createBuyShareButton(stockObject));
	stockContainer.appendChild(createSellShareButton(stockObject));
	
	generateChart("stockChartContainer", stockObject["history"]);
}

function searchForSymbol(symbol) {
	return new Promise(resolve=> {
		let r = new XMLHttpRequest();
		r.open("GET", "https://finnhub.io/api/v1/search?q=" + symbol + "&token=c548e3iad3ifdcrdgh80", true);
		r.onload = function () {
			if (this.status == 200) {
				document.getElementById("stockInfo").style["visibility"] = "visible";
				let obj = JSON.parse(this.response);
				if (parseInt(obj["count"]) > 0) {
					let firstResult = obj["result"][0];
					resolve(firstResult);
				} else {
					document.getElementById("name").innerHTML = "Could not find symbol."
				}
			}
		}
		r.send();
	})
}