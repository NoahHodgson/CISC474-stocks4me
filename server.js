var express = require('express');

var app = express();

app.use(express.static('public'));
app.use(express.json());

app.listen(8080);

const stocks = require('./scripts/stocks.js');
const search = require('./scripts/search.js');
const user = require('./scripts/user.js');
const news = require('./scripts/news.js');
const https = require('https');
const fs = require('fs');

app.post("/createUser", function(req, res) {
	(async () => {
		let response = await user.createUser(req.body["username"], req.body["password"]);
		
		res.json(response);
	})();
});

app.post("/getUserData", function(req, res) {
	(async () => {
		let response = await user.getUserInfo(req.body["username"], req.body["password"]);
		
		res.json(response);
	})();
});

app.put("/updateUserData", function(req, res) {
	(async () => {
		res.send("hi");
	})();
});

app.post("/searchForSymbol", function(req, res) {
	(async () => {
		let symbol = req.body["value"];
		let response = await search.searchForSymbol(symbol);
		let stockObject = await stocks.loadStock(response);
		
		console.log(stockObject);
		
		res.send(stockObject);
	})();
});

app.post("/getNews", function(req, res) {
	(async () => {
		let response = await news.getNews(req.body["stocks"], req.body["from"], req.body["to"]);
		
		res.json(response);
	})();
});

app.get("/getTopNews", function(req, res) {
	(async () => {
		let response = await news.getTopNewsStory();
		res.json(response);
	})();
});