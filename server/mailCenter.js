
//define the module
var mailCenter = {
	emailBuilder: emailBuilder,
	deliverDER: deliverDER,
	discrepencyResolveReqest: discrepencyResolveReqest
};

/*
*	E-mail Builder
*
*	This function accepts all the elements of an email object, and returns the full object
*	with all the elements needed for delivery.
*
*/
function emailBuilder(emailParams) {

	//emailParams contains = from, to, subject, cc, bcc, bodyTXT, bodyHTML, attachments;

	//TODO: TAKE THIS OUT LATER WHEN PROGRESS TRACKING ISN'T NECESSARY
	console.log('in emailBuilder');

	//required elements
	var mailObject = {
		from: emailParams.from, // sender address
		to: emailParams.to, // list of receivers
		cc: emailParams.cc, //list of cc's
		bcc: emailParams.bcc, //list of bcc's
		subject: emailParams.subject // Subject line
	};

	//optional elements
	if(emailParams.bodyTXT != undefined) { mailObject['text'] = emailParams.bodyTXT; }
	if(emailParams.bodyHTML != undefined) { mailObject['html'] = emailParams.bodyHTML; }
	if(emailParams.attachments != undefined) { mailObject['attachments'] = emailParams.attachments; }

	//put it all together nicely
	return mailObject

}

/*
*	Deliver a Daily Earnings Report
*/
function deliverDER(report) {

	//send back async work
	return new Promise(function(resolve, reject) {
		resolve('good delivery');
	});

}

/*
*	Deliver a Discrepency Resolution Request
*/
function discrepencyResolveReqest(request) {

	//send back async work
	return new Promise(function(resolve, reject) {
		resolve('good delivery');
	});

}

//export the module
module.exports = mailCenter;