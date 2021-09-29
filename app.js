//globals
var username;
var userwallet;
var userstocks;

//prevents user from clicking nav before logging in
function loginBlock() {
    alert("Please Login to Access the Site")
}

//updates the user name and stores it
function updateUserName() {
    username = document.getElementById("name").value;
    sessionStorage.setItem("name", username)
}

//displays current user in the nav bar
function showUsername() {
    username = sessionStorage.getItem("name")
    document.getElementById("nav").innerHTML += "<a class='nav-link' style='padding:10px;' href='user.html'>"+ username +"</a>"
}

//displays current user in the nav bar highlighted
function showUsernameSpecial(){
    username = sessionStorage.getItem("name")
    document.getElementById("nav").innerHTML += "<a class='nav-link active' style='padding:10px;' href='user.html'>"+ username +"</a>"
}

//initializes the user wallet at zero. CALL ONLY ONCE.
function initUserWallet() {
    userwallet = 0;
    sessionStorage.setItem("wallet", userwallet)
}

//get wallet on page loads
function getUserWallet() {
    userwallet = parseFloat(sessionStorage.getItem("wallet"))
}


//call when changing the wallet by adding funds or buying stocks
function updateUserWallet(change) {
    userwallet = sessionStorage.getItem("wallet")
    userwallet += change
    sessionStorage.setItem("wallet", userwallet)
}

//wallet updated in the user-page
function userInputWallet(){
    var dollars = parseFloat(document.getElementById("wallet").value)
    userwallet = dollars
    sessionStorage.setItem("wallet", userwallet)
    console.log(sessionStorage.getItem("wallet"))
}

//initializes the user's stock portfolio as empty. CALL ONLY ONCE.
function initUserStocks() {
    userstocks = [];
    sessionStorage.setItem("stocks", JSON.stringify(userstocks))
}

//get stock portfolio on page loads
function getUserStocks() {
    userstocks = JSON.parse(sessionStorage.getItem("stocks"))
}

//buy a stock, stock should be a string arg, price a float
function buyStock(stock, price){
    updateUserWallet((-price))
    userstocks.push(stock)
    sessionStorage.setItem("stocks", JSON.stringify(userstocks))
}

//sell a stock, stock should be a string arg, price a float
function sellStock(stock, price){
    updateUserWallet(price)
    var index = userstocks.indexOf(stock)
    userstocks.splice(index, 1)
    sessionStorage.setItem("stocks", JSON.stringify(userstocks))
}


//Stock Search Info
function search() {
    let term = document.getElementById("searchInput").value.toUpperCase();

    if (term == "") {
        alert("please enter a search term");
        return;
    }

    if (currentSocket != undefined) {
        currentSocket.close();
    }

    document.getElementById("name").innerHTML = "Searching..."

    let r = new XMLHttpRequest();
    r.open("GET", "https://finnhub.io/api/v1/search?q=" + term + "&token=c548e3iad3ifdcrdgh80", true);
    r.onload = function () {
        if (this.status == 200) {
            document.getElementById("stock-search-results").style["visibility"] = "visible";
            let obj = JSON.parse(this.response);
            if(parseInt(obj["count"]) > 0) {
                let firstResult = obj["result"][0];
                getPriceForObject(firstResult);
                getHistoryForObject(firstResult);
                initWebSocket(firstResult);
            } else {
                document.getElementById("name").innerHTML = "Could not find symbol."
            }
        }
    }
    r.send();
}

var currentSocket;

function closeWebSocket() {
    if (currentSocket != undefined) {
        currentSocket.close();
    }
}

function initWebSocket(object) {
    let symbol = object["symbol"];

    let socket = new WebSocket("wss://ws.finnhub.io?token=c548e3iad3ifdcrdgh80");
    socket.onmessage = function (e) {
        let data = JSON.parse(e.data);
        if (data["type"] == "trade") {
            let date = new Date(data["data"][0]["t"]);
            let lastPrice = data["data"][0]["p"];

            let newDiff = Math.round((currentDiff - (currentPrice - lastPrice)) * 100) / 100;

            document.getElementById("price").innerHTML = "Current: " + lastPrice + " (" + ((newDiff >= 0) ? "+" : "") + newDiff + ") at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        }
    };
    socket.onopen = function (e) {
        socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': symbol }))
    };
    socket.onerror = function (e) {
        console.log(e.data);
    };

    currentSocket = socket;
}

var currentPrice;
var currentDiff;

function getPriceForObject(object) {
    let symbol = object["symbol"];

    let r = new XMLHttpRequest();
    r.open("GET", "https://finnhub.io/api/v1/quote?symbol=" + symbol + "&token=c548e3iad3ifdcrdgh80", true);
    r.onreadystatechange = function () {
        if (this.readyState == 4) {
            if(this.status == 200) {
                let obj = JSON.parse(this.response);
                currentPrice = parseFloat(obj["c"]);
                currentDiff = parseFloat(obj["d"]);
                console.log(obj);
                displayValue(object, obj);
            } else if(this.status == 403) {
               document.getElementById("name").innerHTML = "Cannot access this symbol." 
            }
        }
    }
    r.send();

}

function getHistoryForObject(object) {
    let symbol = object["symbol"];
    let r = new XMLHttpRequest();
    r.open("GET", "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + symbol + "&interval=60min&outputsize=full&apikey=AN5BTH22T0R74PI0", true);
    r.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let responseObject = JSON.parse(this.response);
            displayHistory(responseObject["Time Series (60min)"]);
        }
    }
    r.send();
}

function displayHistory(object) {
    let limit = 30;
    let container = document.getElementById("stockHistoryInfo");
    var lowerBound = new Date();
    lowerBound.setDate(lowerBound.getDate() - 7);
    for (key in object) {
        let d = new Date(key.replace(" ", "T"));
        if (d < lowerBound) { break; }
        let p = document.createElement("p");
        let openPrice = (object[key]["1. open"]);
        p.innerHTML = key + ": " + openPrice;
        container.appendChild(p);
    }
}

function displayValue(infoObject, priceObject) {
    let d = new Date(priceObject['t']);

    document.getElementById("name").innerHTML = infoObject["description"] + " (" + infoObject["symbol"] + ")";
    document.getElementById("price").innerHTML = "Current: " + currentPrice + " (" + ((currentDiff < 0) ? "" : "+") + currentDiff + ") at " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    document.getElementById("highLow").innerHTML = "High/Low: " + priceObject["h"] + " / " + priceObject["l"];
}

//search keylistener

function searchOnEnter(e) {
    if (e.code == "Enter") {
        search();
    }
}

function onSearchFocused() {
    document.addEventListener("keydown", searchOnEnter)
}

function onSearchBlurred() {
    document.removeEventListener("keydown", searchOnEnter);
}