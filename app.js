//globals
var username;
var userwallet;
var userstocks;
var stockLoaded;
var priceLoaded;


//SITE CODE


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
    document.getElementById("nav-user").innerHTML = "<a class='nav-link' style='padding:10px;' href='user.html'>User: "+ username +"<br>Wallet: "+userwallet.toFixed(2)+"</a>"
}

//displays current user in the nav bar highlighted
function showUsernameSpecial(){
    username = sessionStorage.getItem("name")
    document.getElementById("nav-user").innerHTML += "<a class='nav-link active' style='padding:10px;' href='user.html'>User: "+ username +"<br>Wallet: $"+userwallet.toFixed(2)+"</a>"
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
    userwallet = parseFloat(userwallet)
    userwallet += parseFloat(change)
    sessionStorage.setItem("wallet", userwallet)
    showUsername()
}

//wallet updated in the user-page
function userInputWallet(){
    var dollars = parseFloat(document.getElementById("wallet").value)
    userwallet = dollars
    sessionStorage.setItem("wallet", userwallet)
    console.log(sessionStorage.getItem("wallet"))
    window.location = window.location;
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
    price = parseFloat(price)
    console.log(price +" "+ userwallet)
    if(price <= userwallet){
        price = -price
        updateUserWallet(price)
        userstocks.push(stock)
        sessionStorage.setItem("stocks", JSON.stringify(userstocks))
    } else{
        alert("Price of Stock exceeds wallet!")
    }
}

//sell a stock, stock should be a string arg, price a float
function sellStock(stock, price){
    price = parseFloat(price)
    console.log(price +" "+ userwallet)
    updateUserWallet(price)
    var index = userstocks.indexOf(stock)
    userstocks.splice(index, 1)
    sessionStorage.setItem("stocks", JSON.stringify(userstocks))
}

function renderSellButton(){
    if(userstocks.includes(stockLoaded)){
        document.getElementById("sell-button").innerHTML = "<button id=\"sellButton\" onclick=\"userSellsShare()\" class=\"btn interactStockButton\">Sell share from portfolio</button>"
    }
    else{
        document.getElementById("sell-button").innerHTML = ""
    }
}

//render stock info in the correct port when bought
//https://stackoverflow.com/questions/37365512/count-the-number-of-times-a-same-value-appears-in-a-javascript-array
function renderStockPortData(){
    var stocksObj = {}
    var countFunc = keys => {
        stocksObj[keys] = ++stocksObj[keys] || 1;
    }
    userstocks.forEach(countFunc);
    document.getElementById("stock-port-data").innerHTML = "";
    for (const [key, value] of Object.entries(stocksObj)){
        document.getElementById("stock-port-data").innerHTML += key+ ": " +value + " shares"+"<br>"
    }
}

//curry function that handles buying a new stock
function userSelectsStock(){
    var newStock = stockLoaded
    var newPrice = priceLoaded
    buyStock(newStock, newPrice)
    renderStockPortData()
    renderSellButton()
    getNews()
}

//curry function that handles selling a new stock
function userSellsShare(){
    var soldStock = stockLoaded
    var soldPrice = priceLoaded
    sellStock(soldStock, soldPrice)
    renderStockPortData()
    renderSellButton()
    getNews()
}

//API CODE

//New API functions
function columnFlipper(val){
    console.log("flipper :)")
    if(val === "news-c1"){
        return "news-c2"
    }
    else{
        return "news-c1"
    }   
}

function getNews() { 
    if(userstocks === []){
        console.log("idiot")
        return;
    } 
    var newsList;
    var column_flip = "news-c1" // flip this back and forth to fill collumns
    uniq_stocks = Array.from(new Set(userstocks))
    input = uniq_stocks[2]
    console.log(input)

    const apiKey = '94381b289d5b494eae3bea618848ad38'

    let url = `https://newsapi.org/v2/everything?q=${input}&apiKey=${apiKey}`
    
    console.log(url);

    fetch(url).then((res) => {
        return res.json()
    }).then((data) => {
        console.log(data);

        data.articles.forEach(article => {
            if(article.urlToImage === null || !article.title.includes(input)){
                console.log("no image")
            }
            else{
                newsList = document.getElementById(column_flip)
                let li = document.createElement('li');
                let a = document.createElement('a');

                let img = document.createElement('img')
                let imgURL = article.urlToImage;
                img.src = imgURL;
                img.width = 300;
                img.height = 200;
                a.setAttribute('href', article.url);
                a.setAttribute('target', '_blank');
                //a.textContent = article.title;
                img.setAttribute('image', article.urlToImage);

                li.appendChild(a);
                li.appendChild(img);
                newsList.appendChild(li);
                column_flip = columnFlipper(column_flip);
                newsList = document.getElementById(column_flip)
            }
        })
    })
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

    document.getElementById("searchButton").innerHTML = "Searching..."

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
            console.log("loaded price")
            document.getElementById("price").innerHTML = "Current: " + lastPrice + " (<span class=\"" + ((newDiff < 0) ? "negativeStock\">" : "positiveStock\">+") + newDiff + "</span>) at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
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
    stockLoaded = infoObject["symbol"]
    priceLoaded = currentPrice
    document.getElementById("searchButton").innerHTML = "Search";
    document.getElementById("name").innerHTML = infoObject["description"] + " (" + infoObject["symbol"] + ")";
    document.getElementById("price").innerHTML = "Current: " + currentPrice + " (<span class=\"" + ((currentDiff < 0) ? "negativeStock\">" : "positiveStock\">+") + currentDiff + "</span>) at " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    document.getElementById("highLow").innerHTML = "High/Low: " + priceObject["h"] + " / " + priceObject["l"];
    renderSellButton()
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