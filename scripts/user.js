var username;
var userwallet;



function resetStocksAndNews() {
	sessionStorage.removeItem("news");
	sessionStorage.removeItem("stocks");
	window.location.reload();
}

function updateUsername(newUsername) {
	sessionStorage.setItem("name", newUsername);
	window.location.reload();
}

function updatePassword(newPassword) {
	alert("not yet implemented");
}

function updatePFP() {
	alert("not yet implemented");
}

function updateWallet(newAmount, reload = false) {
	sessionStorage.setItem("wallet", (Math.round(newAmount*100))/100);
	if(reload) {
		window.location.reload();
	}
}

function updateStocks(newStocks) {
	sessionStorage.setItem("stocks", JSON.stringify(newStocks));
}

function updateNews(newNews) {
	sessionStorage.setItem("news", JSON.stringify(newNews));
	console.log(sessionStorage.getItem("news"))
}

function getUserInfo() {
	return {
		"username": sessionStorage.getItem("name"),
		"password": "not implemented yet",
		"wallet": parseFloat((sessionStorage.getItem("wallet") == null) ? 0 : sessionStorage.getItem("wallet")),
		"stocks": JSON.parse(sessionStorage.getItem("stocks")),
		"news": JSON.parse(sessionStorage.getItem("news")),
		"pfp": "/img/pfpPlaceholder.svg"
	};
}

function displayUserInfo() {
	var link = document.createElement("a");
	let userInfo = getUserInfo();
	link.href="user.html";
	link.className="nav-link";
	link.style.padding = "10px";
	var pfp = userInfo["pfp"];
	var wallet = userInfo["wallet"];
	
	var userInfoContainer = document.createElement("div");
	userInfoContainer.id = "userInfoContainerNavbar";
	
	let pfpPreview = document.createElement("img");
	pfpPreview.id = "userPFPNavbar";
	pfpPreview.src = pfp;
	pfpPreview.style.height = "10%";
	
	let walletAmountPreview = document.createElement("p");
	walletAmountPreview.id = "walletAmountPreviewNavbar";
	walletAmountPreview.innerHTML = "$"+wallet;
	
	userInfoContainer.appendChild(pfpPreview);
	userInfoContainer.appendChild(walletAmountPreview);
	
	link.appendChild(userInfoContainer);
	
	document.getElementById("nav-user").innerHTML = "";
	document.getElementById("nav-user").appendChild(link);
}