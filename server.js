var express = require('express');

var app = express();

app.use(express.static('public'));

app.listen(8080);

const stocks = require('./scripts/stocks.js');
const search = require('./scripts/search.js');
const https = require('https');

app.get("/getUserData", function(req, res) {
	
});

app.get("/searchForSymbol", function(req, res) {
	(async () => {
		let response = await search.searchForSymbol("AAPL");
		let stockObject = await stocks.loadStock(response);
		
		console.log(stockObject);
		
		res.send(stockObject);
	})();
});

app.get("/getNews", function(req, res) {
	
});