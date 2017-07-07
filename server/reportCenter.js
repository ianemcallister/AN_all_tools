
//define dependencies
var httpCenter = require('./httpCenter');
var mailCenter = require('./mailCenter');

//define the module
var reportCenter = {
	_buildEmployeeDERemail: _buildEmployeeDERemail,
	_compileEarningsReport: _compileEarningsReport,
	dailyEarningsReports: dailyEarningsReports
};

/*
*	Build Employee Daily Earnings Report
*	
*	This will combine the report model with the report template and return an email
*	object with from, to, subject, cc, bcc, bodyTXT, bodyHTML, attachments.
*
*/
function _buildEmployeeDERemail(params) {

	//define all the data that will be requred for this report
	var dataRequests = [
		//list all the data requests here
		//employee deals from firebase
		//schedule from firebase
		//shifts from firebase
		//timecards from squareup
		{ 
			service: 'squareup', 
			url: 'https://connect.squareup.com/v1/me/timecards',
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + process.env.SQUARE_APP_TOKEN,
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			} 
		}
		//daily tranactions from squareup
		//employee records from squareup
	];

	//send back async work
	return new Promise(function(resolve, reject) {
		
		//TODO: TAKE THIS OUT LATER, WHEN PROGRESS TRACKING ISN'T NECESSARY
		//console.log('in _buildEmployeeDER');

		//all the data must be collected before it can be processed
		httpCenter.collectRequiredData(dataRequests).then(function(allData) {

			//what do we need to build the email?
			//from, = defined in admin specs 
			//to, = collected from employee details and ms account records
			//subject, = formated based on schedule, employee_details
			//cc, = collected from employee details (supervisor)
			//bcc, = collected from employee details (or admin)
			//bodyTXT, = combines report model with a template
			//bodyHTML, = combines report model with a template
			//attachments = not sure if we need attachments
			

			//define the local variables
			var emailParams = {};
				//emailParams['bodyTXT'] = false;		//this gets compliled seperately
				//emailParams['bodyHTML'] = false;	//this gets compliled seperately
				//emailParams['attachments'] = false;	//this gets compliled seperately

			var employeeDER = mailCenter.emailBuilder(emailParams);

			//pass back the results
			resolve(employeeDER);

		//allow for error handling
		}).catch(function(e) {

			//if there was an error, pass that along as well
			reject(e);

		});;

	});

}

/*
*	Compile Earnings Report
*
*	Combines all elements of the report or processing in order to either send a finished
*	report, or, pass along a discrepency email.
*
*/
function _compileEarningsReport(params) {

	//send back async work
	return new Promise(function(resolve, reject) {
		
		//define all required async work
		var finalReport = {
			discrepencies: false,	//TODO: ADD DISCREPENCY CHECKING LATER
			emplyeeReport: _buildEmployeeDERemail(params),
			supervisorReport: {}	//TODO: ADD A SUPERVISOR REPORT LATER
		};

		//run all promises, and wait for total completion
		Promise.all(
			[
				finalReport.discrepencies, 
				finalReport.emplyeeReport, 
				finalReport.supervisorReport
			]).then(function(allData) {

			//when everything is done, pass the results back
			resolve(allData);

		});
	
	});

}

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
		_compileEarningsReport(params).then(function(reportResult) {

			//define local variables
			var discrepencies = reportResult[0];
			var emplyeeReport = reportResult[1];
			var supervisorReport = reportResult[2];

			//TODO: TAKE THIS OUT LATER, BUT USED FOR REFERNECE NOW
			console.log(reportResult);

			//email the employee or the supervisor, based on the report results
			if(!discrepencies) {

				console.log('no discrepencies');

				//if there are no discrepencies, email the employee
				mailCenter.deliverDER(emplyeeReport, supervisorReport).then(function(status){

					//upon sucessfull delivery pass along a success message
					resolve('sent DER sucessfully');

					//TODO: ADD A REJECTION OPTION FOR UNSUCCESSFUL DELIVERY

				//make sure to handle errors
				}).catch(function(e) {

					//if there was an error, pass that along as well
					reject(e);

				});

			} else {

				console.log('there were discrepencies');

				//if there are discrepencies, email the supervisor
				mailCenter.discrepencyResolveReqest(supervisorReport).then(function(status){

					//upon sucessfull delivery pass along a success message
					resolve('sent discrepency sucessfully');

					//TODO: ADD A REJECTION OPTION FOR UNSUCCESSFUL DELIVERY

				//make sure to handle errors
				}).catch(function(e) {

					//if there was an error, pass that along as well
					reject(e);

				});

			}

		//if there was some other error
		}).catch(function(errorResponse){
			
			//notify user of error
			reject(errorResponse);

		});

	});
};

//export the module
module.exports = reportCenter;

