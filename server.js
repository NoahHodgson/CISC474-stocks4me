var express = require('express');

var app = express();

app.use(express.static('public'));

app.listen(8080);

const stocks = require('./scripts/stocks.js');
const search = require('./scripts/search.js');
const https = require('https');

app.post("/getUserData", function(req, res) {
	
});

app.post("/searchForStock", function(req, res) {
	(async () => {
		let response = await search.searchForSymbol("AAPL");
		res.send(response);
	})();
});

app.post("/getNews", function(req, res) {
	
});