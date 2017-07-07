

//define the module
var reportCenter = {
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
		
		resolve('great');

	});
};

//export the module
module.exports = reportCenter;