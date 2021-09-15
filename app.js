//globals
var username;

function loginBlock(){
    alert("Please Login to Access the Site")
}

function updateUserName(){
    username = document.getElementById("name").value;
    sessionStorage.setItem("name",username)
}

function showUsername(){
    username = sessionStorage.getItem("name")
    document.getElementById("nav").innerHTML += "<span class='navbar-text' style='text-align:center'>Current User: " + username +"</span>"
}