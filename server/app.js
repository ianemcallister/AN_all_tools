/*
*	allTools Server App
*
*	This app runs the express server to server up all response
*
*/


// load all required modules
var express = require('express');
var bodyParser = require('body-parser');
var api = require('./api.js');

//return the express object
var app = express();

//environment variables
var port = process.env.PORT || 3000;

//get the URL encoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

//tell it the folder to serve
app.use(express.static('dist'));

//define our body parsers
app.use(jsonParser); // for parsing application/json
app.use(urlencodedParser); // for parsing application/x-www-form-urlencoded

//connecting middleware
//app.use('/assets', express.static(__dirname + '/public'));

//server up a statif folder
app.use(express.static('dist'));

//my own middleware
app.use('/', function(req, res, next) {
	//log the url to the console
	console.log('Request Url: ' + req.url);

	next();
});

//handle HTTP requests, for GET calls
app.get('/test', function(req, res) {

	//send back html
	res.send('success');

});

//open the port for local development
app.listen(port,function() {
	console.log('Express server is up and running on port ' + port);
})