/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// var connection = mysql.createConnection({});
// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~test");
var mysql = require('mysql');
var connection = mysql.createConnection({
 	host : 'us-cdbr-iron-east-03.cleardb.net',
	user : 'b2ec527dbce1db',
	password : '48ec4705'
});
//connection.connect(function() {
  // connected! (unless `err` is set)
//});
var post  = {id: 1, title: 'Hello MySQL'};
var query = connection.query('INSERT INTO posts SET ?', post, function(err, result) {
  // Neat!
});
console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
console.log(connection);
console.log("test~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  	console.log("server starting on " + appEnv.url);

});
