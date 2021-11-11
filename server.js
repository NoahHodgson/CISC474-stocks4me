var express = require('express');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var app = express();

app.use(express.static('public'));

app.listen(8080);

const stocks = require('./scripts/stocks.js');
const fetch = require('cross-fetch');

app.post("/getUserData", function(req, res) {
	
});

app.get("/getStockInfo", function(req, res) {
	(async () => {
		try {
			const response = await stocks.loadStock({
				"symbol":"AAPL"
			});
			res.send(response);
		} catch (error) {
			console.log(error);
			res.send("nope");
		}
	})();
});

app.post("/getNews", function(req, res) {
	
});