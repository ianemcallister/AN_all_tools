/*
*	allTools fileCenter
*
*	
*
*/

var fileCenter = {
	saveJSON_to_file: saveJSON_to_file
};

function saveJSON_to_file(allSalesRecords) {

	//return async work
	return new Promise(function(resolve, reject) {
		resolve(1);
	});

}
//export the module
module.exports = fileCenter;


