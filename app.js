//globals
var username;
var userwallet;
var userstocks=[];
var usernews=[];
var stockLoaded;
var newsLoaded;
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
    document.getElementById("nav-user").innerHTML = "<a class='nav-link' style='padding:10px;' href='user.html'>User: " + username + "<br>Wallet: " + userwallet.toFixed(2) + "</a>"
}

//displays current user in the nav bar highlighted
function showUsernameSpecial() {
    username = sessionStorage.getItem("name")
    document.getElementById("nav-user").innerHTML += "<a class='nav-link active' style='padding:10px;' href='user.html'>User: " + username + "<br>Wallet: $" + userwallet.toFixed(2) + "</a>"
    document.getElementById("user-username").innerHTML=username;
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

function displayUserPageWallet(){
    document.getElementById("user-userwallet").innerHTML="$"+userwallet;
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
function userInputWallet() {
    var dollars = parseFloat(document.getElementById("wallet").value)
    userwallet = dollars
    sessionStorage.setItem("wallet", userwallet)
    console.log(sessionStorage.getItem("wallet"))
    window.location = window.location;
}

//initializes the user's stock portfolio as empty. CALL ONLY ONCE.
function initUserStocks() {
    userstocks = [];
    usernews = [];
    sessionStorage.setItem("stocks", JSON.stringify(userstocks))
    sessionStorage.setItem("news", JSON.stringify(usernews))
}

//get stock portfolio on page loads
function getUserStocks() {
    userstocks = JSON.parse(sessionStorage.getItem("stocks"))
    usernews = JSON.parse(sessionStorage.getItem("news"))
}

//buy a stock, stock should be a string arg, price a float
function buyStock(stock, news, price) {
    price = parseFloat(price)
    console.log(price + " " + userwallet)
    if (price <= userwallet) {
        price = -price
        updateUserWallet(price)
        userstocks.push(stock)
        sessionStorage.setItem("stocks", JSON.stringify(userstocks))
        usernews.push(news)
        sessionStorage.setItem("news", JSON.stringify(usernews))
    } else {
        alert("Price of Stock exceeds wallet!")
    }
}

//sell a stock, stock should be a string arg, price a float
function sellStock(stock, news, price) {
    price = parseFloat(price)
    console.log(price + " " + userwallet)
    updateUserWallet(price)
    var index = userstocks.indexOf(stock)
    userstocks.splice(index, 1)
    sessionStorage.setItem("stocks", JSON.stringify(userstocks))

    var index = usernews.indexOf(news)
    usernews.splice(index, 1)
    sessionStorage.setItem("news", JSON.stringify(usernews))
}

function renderSellButton() {
    if (userstocks.includes(stockLoaded)) {
        document.getElementById("sell-button").innerHTML = "<button id=\"sellButton\" onclick=\"userSellsShare()\" class=\"btn interactStockButton\">Sell share from portfolio</button>"
    }
    else {
        document.getElementById("sell-button").innerHTML = ""
    }
}

//render stock info in the correct port when bought
//https://stackoverflow.com/questions/37365512/count-the-number-of-times-a-same-value-appears-in-a-javascript-array
function renderStockPortData() {
    var stocksObj = {}
    var countFunc = keys => {
        stocksObj[keys] = ++stocksObj[keys] || 1;
    }
    userstocks.forEach(countFunc);
    document.getElementById("stock-port-data").innerHTML = "";
    for (const [key, value] of Object.entries(stocksObj)) {
        document.getElementById("stock-port-data").innerHTML += key + ": " + value + " shares" + "<br>"
    }
}

//curry function that handles buying a new stock
function userSelectsStock() {
    var newStock = stockLoaded
    var newPrice = priceLoaded
    var newNews = newsLoaded
    buyStock(newStock, newNews, newPrice)
    renderStockPortData()
    renderSellButton()
    getNews()
    initAllStockViews()
}

//curry function that handles selling a new stock
function userSellsShare() {
    var soldStock = stockLoaded
    var soldPrice = priceLoaded
    var soldNews = newsLoaded
    sellStock(soldStock, soldNews, soldPrice)
    renderStockPortData()
    renderSellButton()
    getNews()
    initAllStockViews()
}

//API CODE

//New API functions
function columnFlipper(val) {
    if (val === "news-c1") {
        return "news-c2"
    }
    else {
        return "news-c1"
    }
}

function getNews() {
    var table = document.getElementById('table_holder')
    table.innerHTML = `<div class="row justify-content-center" style="padding: 10px;" id="table_holder">
        <div class="col justify-content-center" id="news-c1">
        </div>
        <div class="col justify-content-center" id="news-c2">
        </div>
    </div>`
    if (!usernews.length) {
        console.log("idiot")
        return;
    }
    var newsList;
    var column_flip = "news-c1" // flip this back and forth to fill collumns
    uniq_stocks = Array.from(new Set(usernews))
    console.log(uniq_stocks)
    var first_symb=[]
    uniq_stocks.forEach(
        s=>{
            flag=1;
            var array = s.split(" ")
            array.forEach(o=>{
                filter="LTD CO CORP INC INC-CLASS"
                if(filter.includes(o)){ 
                    flag = 0;
                }
            })
            if(flag){
                first_symb.push(s);
            }
            else{
                first_symb.push(array[0]);
            }
    })
    //awful code
    uniq_stocks = first_symb;
    console.log(uniq_stocks)
    //date setup 
    var currentDate = new Date();
    var pastDateNum = currentDate.getDate()-30;
    var pastDate = new Date();
    pastDate.setDate(pastDateNum)
    function add_zero(str){
        if(str.length==1){
            return "0"+str;
        }
        else{
            return str;
        }
    }
    current_string = currentDate.getFullYear().toString() + add_zero(currentDate.getMonth().toString()) + add_zero(currentDate.getDay().toString())
    past_string = pastDate.getFullYear().toString() + add_zero(pastDate.getMonth().toString()) + add_zero(pastDate.getDay().toString())
    console.log(past_string +" " + current_string)
    //trying Promises - https://codeburst.io/javascript-making-asynchronous-calls-inside-a-loop-and-pause-block-loop-execution-1cb713fbdf2d
    function processData(url) {
        return new Promise((resolve, reject) => {
            console.log(url);
            const options = {
                method: "GET",
                headers: {
                  "Accept": "application/json"
                },
            };
            fetch(url, options).then((res) => {
                return res.text()
            }).then((data) => {
                data = JSON.parse(data);
                data = data.response.docs
                resolve(data)
            })
        })
    }
    //loading stories
    var all_articles = []
        uniq_stocks.forEach(
        (stock) => {
            const apiKey = '0lRut9I2IboC0FlDg5wVabXmfIfb2hRU'
            const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=${past_string}&end_date=${current_string}&facet=false&q=${stock}&sort=relevance&api-key=${apiKey}`;
            all_articles = all_articles.concat(processData(url))
        })
    Promise.all(all_articles).then((full_article_list) => {
        console.log(full_article_list)
        cleaned_list=full_article_list
        cleaned_list = cleaned_list.flat()
        console.log(cleaned_list)
        //shuffling list -
        function fy(a,b,c,d){//array,placeholder,placeholder,placeholder
            c=a.length;while(c)b=Math.random()*(--c+1)|0,d=a[c],a[c]=a[b],a[b]=d
        }
        fy(cleaned_list,[],[])
        //creating pages - https://stackoverflow.com/questions/55331172/pass-array-to-includes-javascript
        cleaned_list.forEach(article => {
            if (article.multimedia.length === 0) {
                console.log("no image or bad title")
            }
            else {
                newsList = document.getElementById(column_flip)
                let div = document.createElement('div')
                let a = document.createElement('a');

                let img = document.createElement('img')
                let imgURL="https://www.nytimes.com/"+article.multimedia[0].url;
                img.src = imgURL;
                img.width = 300;
                img.height = 200;
                div.innerHTML = `<div style="margin: auto; width: 50%; text-allign:center">
                    <a href=${article.web_url} target="_blank">
                        <img src=${img.src}
                        width=${img.width} height=${img.height} style="display: blocked">
                    </a>
                    <div style="margin-top:4%; max-width:200px text-allign:center"><h4>${article.headline.main}</h4></div>
                </div>`
                newsList.appendChild(div);
                column_flip = columnFlipper(column_flip);
                newsList = document.getElementById(column_flip)
            }
        })
    })
}

//Stock Search Info
function search() {
    let id = "stockChartContainer";
    document.getElementById(id).innerHTML="";
    let infoID = "stockInfo";
    let term = document.getElementById("searchInput").value.toUpperCase();
    document.getElementById("stock-search-results").innerHTML=`<div class="module" id="stockInfo">
    <h2 style="text-decoration: underline;">Stock Info</h2>
    <p id="price">Price</p>
    <button onclick="userSelectsStock()" class="btn interactStockButton">Add to portfolio</button>
    <div id="sell-button">
    </div>
    </div>`
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
            if (parseInt(obj["count"]) > 0) {
                let firstResult = obj["result"][0];
                getPriceForObject(firstResult, infoID);
                getHistoryForObject(firstResult, id, true);
                initWebSocket(firstResult, infoID);
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

function initWebSocket(object, id) {
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

function getPriceForObject(object, id, shareCount) {
    let symbol = object["symbol"];

    let r = new XMLHttpRequest();
    r.open("GET", "https://finnhub.io/api/v1/quote?symbol=" + symbol + "&token=c548e3iad3ifdcrdgh80", true);
    r.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let obj = JSON.parse(this.response);
                currentPrice = parseFloat(obj["c"]);
                currentDiff = parseFloat(obj["d"]);
                console.log(obj);
                displayValue(object, obj, id, shareCount);
            } else if (this.status == 403) {
                document.getElementById("name").innerHTML = "Cannot access this symbol."
            }
        }
    }
    r.send();

}

function getHistoryForObject(object, id, replace = false) {
    let symbol = object["symbol"];
    let r = new XMLHttpRequest();
    r.open("GET", "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + symbol + "&interval=60min&outputsize=full&apikey=AN5BTH22T0R74PI0", true);
    r.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let responseObject = JSON.parse(this.response);
            displayHistory(responseObject["Time Series (60min)"], id, replace);
        }
    }
    r.send();
}

function displayHistory(object, id, replace = false) {
    let container = document.getElementById("stockHistoryInfo");
    var lowerBound = new Date();
    lowerBound.setDate(lowerBound.getDate() - 7);
    var newObject = [];
    
    for (key in object) {
        let d = new Date(key.replace(" ", "T"));
        if (d < lowerBound) { break; }
        let p = document.createElement("p");
        let openPrice = (object[key]["1. open"]);
        
        var dateObject = {};
        
        dateObject.date = d;
        dateObject.value = openPrice;
        
        newObject.push(dateObject);
    }
    
    loadChart(newObject, id, replace);
}

function displayValue(infoObject, priceObject, id, shareCount) {
    let d = new Date(priceObject['t']);
    console.log(infoObject)
    stockLoaded = infoObject["symbol"]
    newsLoaded = infoObject["description"]
    console.log(newsLoaded)
    priceLoaded = currentPrice
    document.getElementById("searchButton").innerHTML = "Search";
    
    let title = document.createElement("h2");
    title.innerHTML = newsLoaded;
    title.className = "stockViewTitle";
    
    let price = document.createElement("p");
    price.innerHTML = "Current: " + currentPrice + " (<span class=\"" + ((currentDiff < 0) ? "negativeStock\">" : "positiveStock\">+") + currentDiff + "</span>) at " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    price.className = "stockViewPrice";
    
    let highLow = document.createElement("p");
    highLow.innerHTML = "High/Low: " + priceObject["h"] + " / " + priceObject["l"];
    highLow.className = "stockViewHighLow";
    
    document.getElementById(id).append(title);
    document.getElementById(id).append(price);
    document.getElementById(id).append(highLow);
    renderSellButton();
    
    
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

window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", function(e) {
       updateChartColors();
});

function initAllStockViews() {
    var stocksObj = {}
    var countFunc = keys => {
        stocksObj[keys] = ++stocksObj[keys] || 1;
    }   
    userstocks.forEach(countFunc);
    document.getElementById("allStocksHolder").innerHTML = "";
    document.getElementById("stock-port-data").innerHTML = "";
    //evil i, change later
    var i = 0;
    for (const [key, value] of Object.entries(stocksObj)) {
        console.log(stocksObj);
        let div = document.createElement("div");
        div.className = "stockViewContainer module";
        div.id = key;
        
        let title = document.createElement("h1");
        title.innerHTML = key + "(Shares: " + value +")";
        
        div.appendChild(title);
        document.getElementById("allStocksHolder").appendChild(div);
        
        getPriceForObject({"symbol":key, "description":usernews[i]}, key, value);
        getHistoryForObject({"symbol":key}, key);
        i++;
    }
}