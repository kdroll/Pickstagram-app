/*eslint-env browser */

function goToRegisterPage() {
	window.location = 'register.html';
}
function goToLoginPage() {
	window.location = 'login.html';
}
function goToFeedPage() {
	window.location = 'feed.html';
}
function goToMainPage() {
	window.location = 'main.html';
}

function login() {
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	
	if (username == "" || password == ""){
		alert("Please enter a username and password");
	} else {
		sessionStorage.username = username;

		window.location = 'feed.html';
	}
}

function register() {
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	
	sessionStorage.username = username;
	
	window.location = 'feed.html';
}