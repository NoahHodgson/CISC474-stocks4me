var username;
var userwallet;

function resetStocksAndNews() {
	sessionStorage.removeItem("news");
	sessionStorage.removeItem("stocks");
}

function updateUsername(newUsername) {
	sessionStorage.setItem("name", newUsername);
}

function updatePassword(newPassword) {
	alert("not yet implemented");
}

function updatePFP(newPFP) {
	alert("not yet implemented");
}

function updateWallet(newAmount) {
	sessionStorage.setItem("wallet", (Math.round(newAmount*100))/100);
	console.log(sessionStorage.getItem("wallet"))
}

function updateStocks(newStocks) {
	sessionStorage.setItem("stocks", JSON.stringify(newStocks));
	console.log(sessionStorage.getItem("stocks"))
}

function updateNews(newNews) {
	sessionStorage.setItem("news", JSON.stringify(newNews));
	console.log(sessionStorage.getItem("news"))
}

function getUserInfo() {
	return {
		"username": sessionStorage.getItem("name"),
		"password": "not implemented yet",
		"wallet": parseFloat(sessionStorage.getItem("wallet")),
		"stocks": JSON.parse(sessionStorage.getItem("stocks")),
		"news": JSON.parse(sessionStorage.getItem("news")),
		"pfp": "not implemented yet"
	};
}

function displayUserInfo() {
	var link = document.createElement("a");
	let userInfo = getUserInfo();
	link.href="user.html";
	link.className="nav-link";
	link.style.padding = "10px";
	link.innerHTML = userInfo["username"]+"<br />$"+userInfo["wallet"];
	document.getElementById("nav-user").innerHTML = "";
	document.getElementById("nav-user").appendChild(link);
}