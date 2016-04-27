/*eslint-env node */
var isLoggedIn = false;
var bodyParser = require('body-parser');
var pg = require('pg');
var conString = "postgres://quzvfygu:Utl4ROEQ6eeqfldf-9gm95PPwhV4R4BU@jumbo.db.elephantsql.com:5432/quzvfygu";
var bcrypt = require('bcrypt-nodejs');

var salt;
bcrypt.genSalt(10, function(error, result) {
	salt = result;
});
var hash;
bcrypt.hash('password', salt, null, function(error, result) {
	hash = result;
	bcrypt.compare('password', hash, function(error, result) {
		console.log(hash);
		console.log(result);
	});
});

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

app.post('/register.html', function(request, response) {

	//console.log(request.body.username + " " + request.body.password);
    
	var client = new pg.Client(conString);
	var usernamefixed = request.body.username;
	var passwordfixed = request.body.password;
	bcrypt.hash(passwordfixed, salt, null, function(error, result) {
		passwordfixed = result;
	});
	
	var usernameExists = 0;
	client.connect(function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}

		client.query('INSERT INTO user_info VALUES ($1, $2)', [usernamefixed, passwordfixed], function(err, result) {
		//client.query("IF EXISTS(SELECT * FROM user_info WHERE username=$1) BEGIN SELECT 'This record already exists!' END ELSE BEGIN INSERT INTO user_info(username, password) VALUES ($1, $2)", [usernamefixed, passwordfixed], function(err, result) {
			if(err) {
				return console.error('error running query', err);
			}
			//console.log(result);
			isLoggedIn = true;

			client.end();
		});
	});

	response.redirect('/feed.html');

	response.end();
});

app.post('/login.html', function(request, response) {

	//console.log(request.body.username + " " + request.body.password);
    
	var client = new pg.Client(conString);
	var usernamefixed = request.body.username;
	var passwordfixed = request.body.password;
	bcrypt.hash(passwordfixed, salt, null, function(error, result) {
		passwordfixed = result;
	});
	
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
			if (usernameExists == 1) {
				//console.log("USERNAME & PASSWORD FOUND");
				isLoggedIn = true;
				response.redirect('/feed.html');
				response.end();
				client.end();
			} else {
				isLoggedIn = false;
				response.redirect('/login_error.html');
				response.end();
				client.end();
			}
			
			//client.end();
		});
		
	});

	//response.redirect('/main.html');
	//response.end();
});

app.post('/main.html', function(request, response) {
	var client = new pg.Client(conString);
	
	var datafixed = request.body.data;
	var usernamefixed = request.body.username;
	var datefixed = request.body.date;
	client.connect(function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}

		client.query('INSERT INTO drawings VALUES ($1, $2, $3)', [datafixed, usernamefixed, datefixed], function(err, result) {
			if(err) {
				return console.error('error running query', err);
			}

			client.end();
		});
		
	});

	response.redirect('/main.html');

	response.end();
});

app.post('/feed.html', function(request, response) {
	var client = new pg.Client(conString);
	
	var datafixed = request.body.data;
	var usernamefixed = request.body.username;
	var datefixed = request.body.date;
	var data; 
	var author; 
	var date;
	client.connect(function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}

		client.query('SELECT * FROM drawings ORDER BY date DESC LIMIT 1', function(err, result) {
			if(err) {
				return console.error('error running query', err);
			}
			// data = result.rows[0].data;
			// author = result.rows[0].author;
			// date = result.rows[0].date;
			// console.log(result);
			
			response.send(result.rows[0]);
			response.end();
			client.end();
		});
		
	});
	//response.set('Content-Type', 'text/html');
	//response.send("" + date + " " + author + " " + data);
	//response.send(data, author, date);
	//response.end();
});

app.post('/feed2.html', function(request, response) {
	var client = new pg.Client(conString);
	
	var datafixed = request.body.data;
	var usernamefixed = request.body.username;
	var datefixed = request.body.date;
	var data; 
	var author; 
	var date;
	client.connect(function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}

		client.query('SELECT * FROM drawings ORDER BY date DESC OFFSET 1 LIMIT 1', function(err, result) {
			if(err) {
				return console.error('error running query', err);
			}
			// data = result.rows[0].data;
			// author = result.rows[0].author;
			// date = result.rows[0].date;
			// console.log(result);
			
			response.send(result.rows[0]);
			response.end();
			client.end();
		});
		
	});
	//response.set('Content-Type', 'text/html');
	//response.send("" + date + " " + author + " " + data);
	//response.send(data, author, date);
	//response.end();
});

app.post('/feed3.html', function(request, response) {
	var client = new pg.Client(conString);
	
	var datafixed = request.body.data;
	var usernamefixed = request.body.username;
	var datefixed = request.body.date;
	var data; 
	var author; 
	var date;
	client.connect(function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}

		client.query('SELECT * FROM drawings ORDER BY date DESC OFFSET 2 LIMIT 1', function(err, result) {
			if(err) {
				return console.error('error running query', err);
			}
			// data = result.rows[0].data;
			// author = result.rows[0].author;
			// date = result.rows[0].date;
			// console.log(result);
			
			response.send(result.rows[0]);
			response.end();
			client.end();
		});
		
	});
	//response.set('Content-Type', 'text/html');
	//response.send("" + date + " " + author + " " + data);
	//response.send(data, author, date);
	//response.end();
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  	//console.log("server starting on " + appEnv.url);

});