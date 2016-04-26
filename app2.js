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
/* var connection = mysql.createConnection({
	host : 'us-cdbr-iron-east-03.cleardb.net',
	user : 'b2ec527dbce1db',
	password : '48ec4705',
	database : 'ad_0cfd024a6dabc7e'
});
connection.connect();
//var post  = {id: 1, title: 'Hello MySQL'};
//var query = connection.query('INSERT INTO posts SET ?', post, function(err, result) {
  // Neat!
//});
//console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
console.log(connection);
console.log("test~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
*/
var mysqlConfig = {'host': 'us-cdbr-iron-east-03.cleardb.net', 'user': 'b2ec527dbce1db', 'password' : '48ec4705', 'database': 'ad_0cfd024a6dabc7e'};
var mysqlClient = mysql.createConnection(mysqlConfig); // This is the global MySQL client
handleDisconnect(mysqlClient);
//var post  = {id: 1, title: 'Hello MySQL'};
//var query = mysqlClient.query('INSERT INTO posts SET ?', post, function(err, result) {
  // Neat!
//});
//console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

//app.post('/addUser', null, addUser('testuser', 'testpass'));

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  	console.log("server starting on " + appEnv.url);

});

function handleDisconnect(client) {
  client.on('error', function (error) {
    if (!error.fatal) return;
    if (error.code !== 'PROTOCOL_CONNECTION_LOST') throw error;

    console.error('> Re-connecting lost MySQL connection: ' + error.stack);

    // NOTE: This assignment is to a variable from an outer scope; this is extremely important
    // If this said `client =` it wouldn't do what you want. The assignment here is implicitly changed
    // to `global.mysqlClient =` in node.
    mysqlClient = mysql.createConnection(client.config);
    handleDisconnect(mysqlClient);
    mysqlClient.connect();
  });
}

function addUser(user, pass) {
	var mysqlConfig2 = {'host': 'us-cdbr-iron-east-03.cleardb.net', 'user': 'b2ec527dbce1db', 'password' : '48ec4705', 'database': 'ad_0cfd024a6dabc7e'};
	var mysqlClient2 = mysql.createConnection(mysqlConfig2); // This is the global MySQL client

	var post2  = {username: user, password: pass};
	var query2 = mysqlClient2.query('INSERT INTO user_info', post2, function(err, throws){});
	console.log(query2.sql);
	mysqlClient.end();
}
