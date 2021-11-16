function createUser(e) {
	e.preventDefault();
	let newUsername = document.getElementById("usernameInput").value;
	let newPassword = document.getElementById("passwordInput").value;
	
	let req = new XMLHttpRequest();
	req.open("POST", "/createUser", true);
	req.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			console.log(this.response);
			let response = JSON.parse(this.response);
			if(response["error"]) {
				alert(response["error"]["message"]);
			} else {
				alert("user created");
				window.location = "/";
			}
		}
	}
	
	req.setRequestHeader('Content-Type','application/json');
	
	req.send(JSON.stringify({
		"username":newUsername,
		"password":newPassword
	}));
}

function logout() {
	clearSessionStorage();
	window.location = "/";
}

function login(e) {
	e.preventDefault();
	let inputUsername = document.getElementById("usernameInput").value;
	let inputPassword = document.getElementById("passwordInput").value;
	
	let req = new XMLHttpRequest();
	req.open("POST", "/getUserData", true);
	req.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			let response = JSON.parse(this.response);
			console.log(response);
			if(response["error"]) {
				alert(response["error"]["message"]);
			}
			if(response["code"] == 200) {
				let userData = response["userData"];
				sessionStorage.setItem("name", userData["username"]);
				sessionStorage.setItem("wallet", parseFloat(userData["wallet"]));
				sessionStorage.setItem("stocks", JSON.stringify(userData["stocks"]));
				sessionStorage.setItem("news", JSON.stringify(userData["news"]));
				sessionStorage.setItem("pfp", userData["pfp"]);
				window.location = "/home.html";
			}
		}
	}
	
	req.setRequestHeader('Content-Type','application/json');
	
	req.send(JSON.stringify({
		"username":inputUsername,
		"password":inputPassword
	}));
}

/***********************/

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

function clearSessionStorage() {
	sessionStorage.removeItem("username");
	sessionStorage.removeItem("wallet");
	sessionStorage.removeItem("stocks");
	sessionStorage.removeItem("news");
	sessionStorage.removeItem("pfp");
}

function getUserInfo() {
	return {
		"username": sessionStorage.getItem("name"),
		"wallet": parseFloat((sessionStorage.getItem("wallet") == null) ? 0 : sessionStorage.getItem("wallet")),
		"stocks": JSON.parse(sessionStorage.getItem("stocks")),
		"news": JSON.parse(sessionStorage.getItem("news")),
		"pfp": sessionStorage.getItem("pfp")
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