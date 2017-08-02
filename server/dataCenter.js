
/*
*	allTools dataCenter
*
*	
*
*/

var dataCenter = {
	squareSales_to_hourlySales: squareSales_to_hourlySales
};

function squareSales_to_hourlySales(allSalesRecords) {

	//return async work
	return new Promise(function(resolve, reject) {
		resolve(1);
	});

}
//export the module
module.exports = dataCenter;


