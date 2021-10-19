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

async function search(value) {
	let result = await searchForSymbol(value);
	let stockObject = await loadStock(result["symbol"]);
	console.log(stockObject);
}

function searchForSymbol(symbol) {
	return new Promise(resolve=> {
		let r = new XMLHttpRequest();
		r.open("GET", "https://finnhub.io/api/v1/search?q=" + symbol + "&token=c548e3iad3ifdcrdgh80", true);
		r.onload = function () {
			if (this.status == 200) {
				document.getElementById("stock-search-results").style["visibility"] = "visible";
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