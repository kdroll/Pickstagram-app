/*eslint-env browser */
function goToRegisterPage() {
	//console.log("TEST~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

	//var submittedName = document.getElementById('name').value;
	//alert("Hello, " + submittedName + "!");
	
	window.location = 'register.html';
}

function login() {
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;

	if (username == "" || password == ""){
		alert("Please enter a username and password");
	} else {
		window.location = 'main.html';
	}
}