//globals
var username;

function loginBlock() {
    alert("Please Login to Access the Site")
}

function updateUserName() {
    username = document.getElementById("name").value;
    sessionStorage.setItem("name", username)
}

function showUsername() {
    username = sessionStorage.getItem("name")
    document.getElementById("nav").innerHTML += "<span class='navbar-text' style='text-align:center'>Current User: " + username + "</span>"
}

function getNews() {
    
    let input = document.getElementById("searchInput").value
    const newsList = document.querySelector('.news-list');
    newsList.innerHTML = ''
    console.log(input)

    const apiKey = '94381b289d5b494eae3bea618848ad38'

    let url = `https://newsapi.org/v2/everything?q=${input}&apiKey=${apiKey}`
    
    console.log(url);

    fetch(url).then((res) => {
        return res.json()
    }).then((data) => {
        console.log(data);

        data.articles.forEach(article => {
            let li = document.createElement('li');
            let a = document.createElement('a');

            let img = document.createElement('img')
            let imgURL = article.urlToImage;
            img.src = imgURL;
            img.width = 300;
            img.height = 200;
            a.setAttribute('href', article.url);
            a.setAttribute('target', '_blank');
            a.textContent = article.title;
            img.setAttribute('image', article.urlToImage);

            li.appendChild(a);
            li.appendChild(img);
            newsList.appendChild(li);
        })
    })
}