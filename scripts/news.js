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

function getNews() {
	var table = document.getElementById('table_holder')
	table.innerHTML = ""
	
	var storedNews = getUserInfo();
	storedNews = storedNews["news"];
	console.log(storedNews);
	
	
	if (!storedNews.length) {
		console.log("idiot")
		return;
	}
	
	uniq_stocks = Array.from(new Set(storedNews))
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
	var newsList = document.getElementById("table_holder");
	//date setup 
	var currentDate = new Date();
	var pastDateNum = currentDate.getDate()-30;
	var pastDate = new Date();
	pastDate.setDate(pastDateNum)
	
	current_string = currentDate.getFullYear().toString() + ((currentDate.getMonth() < 10) ? "0" : "") + currentDate.getMonth().toString() + ((currentDate.getDay() < 10) ? "0" : "") + currentDate.getDay().toString()
	
	past_string = currentDate.getFullYear().toString() + ((currentDate.getMonth() < 10) ? "0" : "") + currentDate.getMonth().toString() + ((currentDate.getDay() < 10) ? "0" : "") + currentDate.getDay().toString()
	
	console.log(past_string +" " + current_string)
	//trying Promises - https://codeburst.io/javascript-making-asynchronous-calls-inside-a-loop-and-pause-block-loop-execution-1cb713fbdf2d
	//loading stories
	var all_articles = [];
		uniq_stocks.forEach(
		(stock) => {
			const apiKey = '0lRut9I2IboC0FlDg5wVabXmfIfb2hRU'
			const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=${past_string}&end_date=${current_string}&facet=false&q=${stock}&sort=relevance&api-key=${apiKey}`;
			
			console.log(url);
			
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
				let newsArticleObject = generateNewsArticleObject(article);
				newsList.appendChild(newsArticleObject);
			}
		})
	})
}

function generateNewsArticleObject(article) {
	let container = document.createElement("div");
	container.className = "newsArticle";
	container.style.textAlign = "center";
	
	let img = document.createElement('img')
	let imgURL="https://www.nytimes.com/"+article.multimedia[0].url;
	img.src = imgURL;
	img.style.width = "75%";
	img.className = "articleImage";
	
	let link = document.createElement("a");
	link.href=article.web_url;
	link.target = "_blank";
	
	link.appendChild(img);
	
	let headlineContent = document.createElement("p");
	headlineContent.innerHTML = article.headline.main;
	headlineContent.style.maxWidth = "50%";
	headlineContent.style.marginTop = "10px";
	
	container.appendChild(link);
	container.appendChild(headlineContent);
	
	return container;
}

function processHomeNewsData(url) {
	return new Promise((resolve, reject) => {
		console.log(url);
		const options = {
			method: "GET",
			headers: {
				"Accept": "application/json"
			},
		};
		fetch(url, options).then((res) => {
			//console.log(res.text())
			return res.text()
		}).then((data) => {
			data = JSON.parse(data);
			resolve(data)
		})
	})
}

function generateTopNewsStoryObject(article) {
	let title = article.title;
	let url = article.url;
	let abstract = article.abstract;
	let imageURL = article.multimedia[0].url;
	
	let container = document.createElement("div");
	container.className = "topNewsArticle";
	
	let img = document.createElement('img')
	let imgURL=imageURL;
	img.src = imgURL;
	img.className = "articleImage";
	img.style.width = "100%";
	
	let link = document.createElement("a");
	link.href=url;
	link.target = "_blank";
	
	link.appendChild(img);
	
	var headlineContent = document.createElement("p");
	headlineContent.innerHTML = title;
	headlineContent.style.marginBottom = "5px";
	headlineContent.style.fontWeight = "bold";
	headlineContent.style.fontSize = "1.3em";
	
	let headlineLink = document.createElement("a");
	headlineLink.href=url;
	headlineLink.target = "_blank";
	headlineLink.style.color = "var(--dark)";
	headlineLink.style.textDecoration = "none";
	
	headlineLink.appendChild(headlineContent);
	
	var abstractContent = document.createElement("p");
	abstractContent.innerHTML = abstract;
	abstractContent.style.fontSize = "1.3em";
	
	var titleLine = document.createElement("h2");
	titleLine.innerHTML = "Today's Top Story";
	titleLine.style.fontWeight = "bold";
	titleLine.style.marginBottom = "20px";
	
	let topNewsArticleContentContainer = document.createElement("div");
	topNewsArticleContentContainer.id = "topNewsArticleContentContainer";
	let leftTopNewsContent = document.createElement("div");
	leftTopNewsContent.id = "leftTopNewsContent";
	let rightTopNewsContent = document.createElement("div");
	rightTopNewsContent.id = "rightTopNewsContent";
	
	container.appendChild(titleLine);
	leftTopNewsContent.appendChild(link);
	
	rightTopNewsContent.appendChild(headlineLink);
	rightTopNewsContent.appendChild(abstractContent);
	
	topNewsArticleContentContainer.appendChild(leftTopNewsContent);
	topNewsArticleContentContainer.appendChild(rightTopNewsContent);
	
	container.appendChild(topNewsArticleContentContainer)
	
	return container;
}

async function getTopNewsStory() {
	var homeNewsDiv = document.getElementById("stockChartContainer");
	var topStoryURL = 'https://api.nytimes.com/svc/topstories/v2/business.json?api-key=0lRut9I2IboC0FlDg5wVabXmfIfb2hRU'
	var topStoryObj = await processHomeNewsData(topStoryURL)
	console.log(topStoryObj.results[0]);
	
	homeNewsDiv.appendChild(generateTopNewsStoryObject(topStoryObj.results[0]));
}