//globals
var username;
var userwallet;

//prevents user from clicking nav before logging in
function loginBlock(){
    alert("Please Login to Access the Site")
}

//updates the user name and stores it
function updateUserName(){
    username = document.getElementById("name").value;
    sessionStorage.setItem("name",username)
}

//displays current user in the nav bar
function showUsername(){
    username = sessionStorage.getItem("name")
    document.getElementById("nav").innerHTML += "<span class='navbar-text' style='text-align:center'>Current User: " + username +"</span>"
}

//initializes the user wallet at zero. CALL ONLY ONCE.
function initUserWallet(){
    userwallet = 0;
    sessionStorage.setItem("wallet",userwallet)
}

//get wallet on page loads
function getUserWallet(){
    userwallet = sessionStorage.getItem("wallet")
}

//call when changing the wallet by adding funds or buying stocks
function updateUserWallet(change){
    userwallet = sessionStorage.getItem("wallet")
    userwallet += change
    sessionStorage.setItem("wallet", userwallet)
}