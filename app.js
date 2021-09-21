//globals
var username;
var userwallet;

//prevents user from clicking nav before logging in
function loginBlock(){
    alert("Please Login to Access the Site")
}

//updates the user name and stores it
function updateUserName(){
    username = document.getElementById("name").value;
    sessionStorage.setItem("name",username)
}

//displays current user in the nav bar
function showUsername(){
    username = sessionStorage.getItem("name")
    document.getElementById("nav").innerHTML += "<span class='navbar-text' style='text-align:center'>Current User: " + username +"</span>"
}

//initializes the user wallet at zero. CALL ONLY ONCE.
function initUserWallet(){
    userwallet = 0;
    sessionStorage.setItem("wallet",userwallet)
}

//get wallet on page loads
function getUserWallet(){
    userwallet = sessionStorage.getItem("wallet")
}

//call when changing the wallet by adding funds or buying stocks
function updateUserWallet(change){
    userwallet = sessionStorage.getItem("wallet")
    userwallet += change
    sessionStorage.setItem("wallet", userwallet)
}

//Stock Search Info
function search() {
    let term = document.getElementById("searchInput").value;
    
    if(term == "") {
        alert("please enter a search term");
        return;
    }
    
    if(currentSocket != undefined) {
        currentSocket.close();
    }
    
    document.getElementById("name").innerHTML = "Searching..."
    
    let r = new XMLHttpRequest();
    r.open("GET","https://finnhub.io/api/v1/search?q="+term+"&token=c548e3iad3ifdcrdgh80",true);
    r.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let obj = JSON.parse(this.response);
            let firstResult = obj["result"][0];
            getPriceForObject(firstResult);
            getHistoryForObject(firstResult);
            initWebSocket(firstResult);
        }
    }
    r.send();
}

var currentSocket;

function closeWebSocket() {
    if(currentSocket != undefined) {
        currentSocket.close();
    }
}

function initWebSocket(object) {
    let symbol = object["symbol"];
    
    let socket = new WebSocket("wss://ws.finnhub.io?token=c548e3iad3ifdcrdgh80");
    socket.onmessage = function(e) {
        let data = JSON.parse(e.data);
        if(data["type"] == "trade") {
            let date = new Date(data["data"][0]["t"]);
            let lastPrice = data["data"][0]["p"];
            
            document.getElementById("webSocketInfo").innerHTML = "Last Price: "+lastPrice+" at "+(date.toTimeString());
        } else {
            document.getElementById("webSocketTest").innerHTML = "WebSocket Pinged";
        }
    };
    socket.onopen = function(e) {
        socket.send(JSON.stringify({'type':'subscribe', 'symbol': symbol}))
        document.getElementById("webSocketTest").innerHTML = "WebSocket Opened";
        document.getElementById("webSocketInfo").innerHTML = "Listening for trades...";
        document.getElementById("closeButton").style.display = "block";
    };
    socket.onerror = function(e) {
        console.log(e.data);
    };
    
    socket.onclose = function(e) {
        document.getElementById("webSocketTest").innerHTML = "WebSocket Closed";
        document.getElementById("webSocketInfo").innerHTML = "Not listening";
        document.getElementById("closeButton").style.display = "none";
    }
    
    currentSocket=socket;
}

var currentPrice;
var currentDiff;

function getPriceForObject(object) {
    let symbol = object["symbol"];
    
    let r = new XMLHttpRequest();
    r.open("GET", "https://finnhub.io/api/v1/quote?symbol="+symbol+"&token=c548e3iad3ifdcrdgh80", true);
    r.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let obj = JSON.parse(this.response);
            currentPrice = parseInt(obj["c"]);
            currentDiff = parseInt(obj["d"]);
            displayValue(object, obj);
        }
    }
    r.send();
    
}

function getHistoryForObject(object) {
    let symbol = object["symbol"];
    let r = new XMLHttpRequest();
    r.open("GET", "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+symbol+"&interval=60min&outputsize=full&apikey=AN5BTH22T0R74PI0", true);
    r.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
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
    lowerBound.setDate(lowerBound.getDate()-7);
    for(key in object) {
        let d = new Date(key.replace(" ","T"));
        if(d < lowerBound) { break; }
        let p = document.createElement("p");
        let openPrice = (object[key]["1. open"]);
        p.innerHTML = key+": "+openPrice;
        container.appendChild(p);
    }
}

function displayValue(infoObject, priceObject) {
    document.getElementById("name").innerHTML = infoObject["description"]+" ("+infoObject["symbol"]+")";
    document.getElementById("price").innerHTML = "Current: "+priceObject["c"]+" ("+priceObject["d"]+")";
    document.getElementById("highLow").innerHTML = "High/Low: "+priceObject["h"]+" / "+priceObject["l"];
}

