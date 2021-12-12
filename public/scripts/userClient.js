function createUser(e) {
	e.preventDefault();
	let newUsername = document.getElementById("usernameInput").value;
	let newPassword = document.getElementById("passwordInput").value;

	let req = new XMLHttpRequest();
	req.open("POST", "/createUser", true);
	req.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			console.log(this.response);
			let response = JSON.parse(this.response);
			if (response["error"]) {
				alert(response["error"]["message"]);
			} else {
				alert("user created");
				window.location = "/";
			}
		}
	}

	req.setRequestHeader('Content-Type', 'application/json');

	req.send(JSON.stringify({
		"username": newUsername,
		"password": newPassword
	}));
}

function logout() {
	clearlocalStorage();
	window.location = "/";
}

function getPortfolioValue(stocks, wallet) {
	var portVal = wallet;
	for (const [key, value] of Object.entries(stocks)) {
		console.log(value.current)
		console.log(value.numShares)
		if (value.numShares === undefined) {
			portVal += value.current
		}
		else {
			portVal += value.current * value.numShares;
		}
	}
	return portVal
}

async function refreshStock() {
	stocksCopy = JSON.parse(localStorage.getItem("stocks"));
	console.log(stocksCopy);
	var promise = new Promise(function refreshLoop() {
		for (stock of Object.keys(stocksCopy)) {
			var stockObject = stocksCopy[stock];
			console.log(stockObject)
			if (stocksCopy.length > 5) {
				setTimeout(async () => {
					console.log(stockObject["symbol"])
					stockObject["history"] = await loadStockHistory(stockObject["symbol"]);
				}, 12000);
			} else {
				(async () => {
					console.log(stockObject["symbol"])
					stockObject["history"] = await loadStockHistory(stockObject["symbol"]);
				})();
			}
		}
		return stocksCopy
	});
	promise.then(
		updateStocks(promise),
		localStorage.setItem("refreshStocks", false),
		console.log("I am in then"))
}

function login(e) {
	e.preventDefault();
	let inputUsername = document.getElementById("usernameInput").value;
	let inputPassword = document.getElementById("passwordInput").value;

	let req = new XMLHttpRequest();
	req.open("POST", "/getUserData", true);
	req.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			let response = JSON.parse(this.response);
			console.log(response);
			if (response["error"]) {
				alert(response["error"]["message"]);
			}
			if (response["code"] == 200) {
				let userData = response["userData"];
				localStorage.setItem("loggedin", true);
				localStorage.setItem("name", userData["username"]);
				localStorage.setItem("refreshStocks", true);
				localStorage.setItem("wallet", parseFloat(userData["wallet"]));
				localStorage.setItem("stocks", JSON.stringify(userData["stocks"]));
				localStorage.setItem("news", JSON.stringify(userData["news"]));
				localStorage.setItem("pfp", userData["pfp"]);
				window.location = "/home.html";
			}
		}
	}

	req.setRequestHeader('Content-Type', 'application/json');

	req.send(JSON.stringify({
		"username": inputUsername,
		"password": inputPassword
	}));
}

/***********************/

function resetStocksAndNews() {
	localStorage.removeItem("news");
	localStorage.removeItem("stocks");
	window.location.reload();
}

function updateUsername(newUsername) {
	localStorage.setItem("name", newUsername);
	pushUserInfoToDatabase();
	window.location.reload();
}

function updatePFP() {
	alert("not yet implemented");
}

function updateWallet(newAmount, reload = false) {
	localStorage.setItem("wallet", (Math.round(newAmount * 100)) / 100);
	pushUserInfoToDatabase();
	if (reload) {
		window.location.reload();
	}
}

function updateStocks(newStocks) {
	localStorage.setItem("stocks", JSON.stringify(newStocks));
	pushUserInfoToDatabase();
}

function updateNews(newNews) {
	localStorage.setItem("news", JSON.stringify(newNews));
	console.log(localStorage.getItem("news"));
	pushUserInfoToDatabase();
}

function clearlocalStorage() {
	localStorage.removeItem("name");
	localStorage.removeItem("wallet");
	localStorage.removeItem("stocks");
	localStorage.removeItem("news");
	localStorage.removeItem("pfp");
	localStorage.removeItem("loggedin");
	localStorage.removeItem("total value");
}

var timer;

function pushUserInfoToDatabase() {
	if (timer) {
		clearTimeout(timer);
	}

	timer = setTimeout(function () {
		let req = new XMLHttpRequest();
		req.open("PUT", "/updateUserData", true);
		req.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.response);
			}
		}
		req.setRequestHeader("Content-Type", "application/json");

		req.send(JSON.stringify({
			"username": getUserInfo()["username"],
			"data": getUserInfo(false)
		}));
	}, 500);
}

function getUserInfo(includeLogin = true) {
	if (localStorage.getItem("loggedin") != undefined) {
		if (includeLogin) {
			return {
				"loggedin": localStorage.getItem("loggedin"),
				"username": localStorage.getItem("name"),
				"wallet": parseFloat((localStorage.getItem("wallet") == null) ? 0 : localStorage.getItem("wallet")),
				"stocks": JSON.parse(localStorage.getItem("stocks")),
				"news": JSON.parse(localStorage.getItem("news")),
				"pfp": localStorage.getItem("pfp")
			};
		} else {
			return {
				"username": localStorage.getItem("name"),
				"wallet": parseFloat((localStorage.getItem("wallet") == null) ? 0 : localStorage.getItem("wallet")),
				"stocks": JSON.parse(localStorage.getItem("stocks")),
				"news": JSON.parse(localStorage.getItem("news")),
				"pfp": localStorage.getItem("pfp")
			};
		}
	} else {
		return {
			"loggedin": false
		}
	}
}

function displayUserInfo() {
	var link = document.createElement("a");
	let userInfo = getUserInfo();
	link.href = "user.html";
	link.className = "nav-link";
	link.style.padding = "10px";
	var pfp = userInfo["pfp"];
	var wallet = userInfo["wallet"];
	var stocks = JSON.parse(localStorage.getItem("stocks"));
	var portfolioVal = getPortfolioValue(stocks, wallet);

	var userInfoContainer = document.createElement("div");
	userInfoContainer.id = "userInfoContainerNavbar";

	let pfpPreview = document.createElement("img");
	pfpPreview.id = "userPFPNavbar";
	pfpPreview.src = pfp;
	pfpPreview.style.height = "10%";


	let moneyContainer = document.createElement("div");
	moneyContainer.className = "navbarMoneyContainer";


	let walletAmountPreview = document.createElement("p");
	walletAmountPreview.id = "walletAmountPreviewNavbar";
	walletAmountPreview.innerHTML = "Current Wallet: $" + wallet;

	userInfoContainer.appendChild(pfpPreview);
	moneyContainer.appendChild(walletAmountPreview);
	userInfoContainer.appendChild(moneyContainer);

	link.appendChild(userInfoContainer);

	document.getElementById("nav-user").innerHTML = "";
	document.getElementById("nav-user").appendChild(link);
}