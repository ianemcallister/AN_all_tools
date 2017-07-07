
//define the module
var httpCenter = {
	_GET: _GET,
	_accessSquareUp: _accessSquareUp,
	collectRequiredData: collectRequiredData
};

function _GET(request) {

	//send back async work
	return new Promise(function(resolve, reject) {
		console.log('in _GET');

		resolve(1);

	});

}

function _accessSquareUp(request) {
	
	//define local variables
	var methods = {
		"GET": 0,
		"POST": 1
	}

	//send back async work
	return new Promise(function(resolve, reject) {

		//chose a path based on the method
		switch(methods[request.method]) {

			case 0: 	//if it's a get method, access the get function

				//send request via _GET
				_GET(request).then(function(response) {

					
				}).catch(function(e) {

					//if there was an error, pass that along as well
					reject(e);

				});

				break;
			case 1:
				//TODO: ADD A POST PATH LATER
				break;
			default:
				//TODO: ADD A DEFAULT PATH LATER
				break;
		};

		console.log('got this request', request);

		resolve(1);

	});

};

/*
*	Collect Required Data
*
*	This funcition is the access point to this module.  It controls and routs the request
*	to the proper service, then returns the data to the requesting module.
*
*/
function collectRequiredData(allRequets) { 

	//define local variables
	var allServices = {
		"squareup": 0,
		"firebase": 1
	};

	//send back async work
	return new Promise(function(resolve, reject) {

		//iterate through all requests
		allRequets.forEach(function(request) {

			//choose the path based on the designatd service
			switch(allServices[request.service]) {
				case 0: 	//squareup service route
					
					//access the squareup service
					_accessSquareUp(request).then(function(returnedData) {

						/*returned data looks like this
						* {
						*	successful: true/false
						*	rawData: {} if it was good
						*	errorMessage: {} details on the error
						* }
						*/

						//if the data is good, pass it back successfully
						if(!returnedData.successful) { 

							//pass back the sucess data
							resolve(returnedData.rawData);
						
						} else {	//otherwise send back as an error

							//pass back the error message
							reject(returnedData.errorMessage);

						}

					}).catch(function(e) {

						//if there was an error, pass that along as well
						reject(e);

					});

					break;
				case 1: 	//firebase service route
					//TODO: ADD A FIREBASE ACCESS POINT LATER
					break;
				default:
					//TODO: ADD A DEFAULT CASE SCENARIO LATER
					break;
			};

		});
		
		//send back the results
		resolve(1);

	});

}

//export the module
module.exports = httpCenter;