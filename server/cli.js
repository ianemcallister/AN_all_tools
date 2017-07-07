
/* This is the allTools CLI.  It can be used to refined the server scripts for allTools.
*/

//define dependencies
var api = require('./api.js');

//define the paramaters that would come through an http request
var params = {
	locationId:"14E8S7P16JQDM",
	day: {
		start:"2017-07-01T00:03:00-08:00",
		end: "2017-07-02T00:02:59-08:00"
	}
};

//run the required function
api.dailyEarningsReports(params).then(function(result) {

	//notify with results
	console.log(result);

});