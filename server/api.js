
/*
*	allTools API
*
*	This API is used for a variety of functions and required tools.  Each Tool
*	operats out of its own seperate module, with the API acting as a dispatch center.
*
*/

//define dependencies
var reportCenter = require('./reportCenter');

//define the module
var api = {
	dailyEarningsReports: dailyEarningsReports
};


/* 
*	The Daily Earnings Report
*
*	Collects data from the database, and merchent services account to generate earnings
*	reports for each employee.  These reports are then emailed to them daily.  Unless a
*	discrepency is found, then the supervisor is emailed for confirmation first.
* 
*/
function dailyEarningsReports(params) {

	//send back async work
	return new Promise(function(resolve, reject) {
		
		//	working the process backwards, we'll either mail the DER to the employees,
		//	or we'll email a discrepency email to the supervisor. These e-mails
		//	will be built from compiled report data, based upon data collected
		// 	from the databse and the merchent services account

		//mail results (mail center)
		reportCenter.dailyEarningsReports(params).then(function(affirmativeResponse) {

			//notify user of success
			resolve(affirmativeResponse);

		//if there was an error
		}).catch(function(errorResponse){
			
			//notify user of error
			reject(errorResponse);

		});

	});

}

//export the module
module.exports = api;