/*eslint-env node */
var isLoggedIn = false;
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var pg = require('pg');
var conString = "postgres://quzvfygu:Utl4ROEQ6eeqfldf-9gm95PPwhV4R4BU@jumbo.db.elephantsql.com:5432/quzvfygu";

//this initializes a connection pool
//it will keep idle connections open for a (configurable) 30 seconds
//and set a limit of 10 (also configurable)
/* pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT $1::int AS number', ['1'], function(err, result) {
    //call `done()` to release the client back to the pool
    done();

    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].number);
    //output: 1
  });
}); */

var express = require('express');
var cfenv = require('cfenv');


// create a new express server
var app = express();

//app.use(express.cookieParser('secret'));

//app.use(expressSession());

//app.use(express.bodyParser());

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));

function getIsLoggedIn() {
	return isLoggedIn;
}

function setIsLoggedIn(toggle) {
	if (toggle == true) {
		isLoggedIn = true;
	} else if (toggle == false) {
		isLoggedIn = false;		
	} else {
		print("Invalid use of method \"getIsLoggedIn\"");
	}
}

app.post('/register.html', function(request, response) {

	console.log(request.body.username + " " + request.body.password);
    
	var client = new pg.Client(conString);
	var usernamefixed = request.body.username;
	var passwordfixed = request.body.password;
	client.connect(function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}

		client.query('INSERT INTO user_info VALUES ($1, $2)', [usernamefixed, passwordfixed], function(err, result) {
			if(err) {
				return console.error('error running query', err);
			}
			//console.log(result);
		//	response.cookie = usernamefixed;
			isLoggedIn = true;

			client.end();
		});
		
	});

	response.redirect('/main.html');

	response.end();
});

app.post('/', function(request, response) {

	console.log(request.body.username + " " + request.body.password);
//	console.log("$$$ Cookies :  ", request.cookies);
    
	var client = new pg.Client(conString);
	var usernamefixed = request.body.username;
	var passwordfixed = request.body.password;
	var usernameExists = 0;
	client.connect(function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}

		// console.log("SELECT 1 FROM user_info WHERE username='"+usernamefixed+"' ORDER BY username LIMIT 1");
		client.query("SELECT * FROM user_info WHERE username=$1 AND password=$2", [usernamefixed, passwordfixed], function(err, result) {
			if(err) {
				return console.error('error running query', err);
			}
			if (result.rows.length > 0) usernameExists = 1;
			// console.log(result);
			if (usernameExists == 1) {
				//console.log("USERNAME & PASSWORD FOUND");
	//			request.session.userName = usernamefixed;
				isLoggedIn = true;
				response.redirect('/main.html');
				response.end();
				client.end();
			} else {
				isLoggedIn = false;
				response.redirect('/');
				response.end();
				client.end();
			}
			/*if (result.length > 0) {
				console.log("############FAIL############");
			} else {
				console.log("############SUCCESS##############");
			}
			console.log(result);
			console.log(typeof result);*/
			
			//client.end();
		});
		
	});

	//response.redirect('/main.html');
	//response.end();
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  	console.log("server starting on " + appEnv.url);

});