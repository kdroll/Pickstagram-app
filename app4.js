/*eslint-env node */
var bodyParser = require('body-parser');
var pg = require('pg');
var conString = "postgres://quzvfygu:Utl4ROEQ6eeqfldf-9gm95PPwhV4R4BU@jumbo.db.elephantsql.com:5432/quzvfygu";
var express = require('express');
var cfenv = require('cfenv');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// create a new express server
var app = express();

pg.connect(conString, function(err, client, done) {

});


app.use(express.static(__dirname + '/public'));
var appEnv = cfenv.getAppEnv();
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  	console.log("server starting on " + appEnv.url);

});