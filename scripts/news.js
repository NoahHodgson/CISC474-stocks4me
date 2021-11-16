const https = require('https');
module.exports = {getNews, getTopNewsStory};

function processData(url) {
	return new Promise((resolve, reject) => {
		// console.log(url);
		// const options = {
		// 	method: "GET",
		// 	headers: {
		// 	  "Accept": "application/json"
		// 	},
		// };
		// 
		// fetch(url, options).then((res) => {
		// 	return res.text()
		// }).then((data) => {
		// 	data = JSON.parse(data);
		// 	data = data.response.docs
		// 	resolve(data)
		// })
		
		https.get(url, (resp) => {
			let data = '';
			
			resp.on('data', (chunk) => {
				data+=chunk;
			});
			
			resp.on('end', () => {
				var object = JSON.parse(data);
				resolve(object.response.docs);
			})
		})
	})
}

function getNews(stocks, from, to) {
	console.log(from, to);
	return new Promise(resolve => {
		var all_articles = [];
		console.log(stocks);
		for(stock of stocks) {
			const apiKey = '0lRut9I2IboC0FlDg5wVabXmfIfb2hRU'
			const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=${from}&end_date=${to}&facet=false&q=${stock}&sort=relevance&api-key=${apiKey}`;
			
			console.log(url);
			
			all_articles = all_articles.concat(processData(url));
		}
		Promise.all(all_articles).then((full_article_list) => {
			resolve({
				"code":200,
				"articles": {
					full_article_list
				}
			});
		});
	});
}

function processHomeNewsData(url) {
	return new Promise((resolve, reject) => {
		https.get(url, (resp) => {
			let data = '';
			
			resp.on('data', (chunk) => {
				data+=chunk;
			});
			
			resp.on('end', () => {
				var object = JSON.parse(data);
				resolve(object);
			})
		})
	})
}

async function getTopNewsStory() {
	return new Promise(async (resolve) => {
		var topStoryURL = 'https://api.nytimes.com/svc/topstories/v2/business.json?api-key=0lRut9I2IboC0FlDg5wVabXmfIfb2hRU'
		var topStoryObj = await processHomeNewsData(topStoryURL)
		console.log(topStoryObj.results[0]);
		
		resolve(topStoryObj.results[0]);
	});
}