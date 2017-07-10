
//define dependencies
var fetch = require('node-fetch');

//define the module
var httpCenter = {
	_stringToJSON: _stringToJSON,
	_get: _get,
	_getJSON: _getJSON,
	_GET: _GET,
	_accessSquareUp: _accessSquareUp,
	collectRequiredData: collectRequiredData
};

/*
*	String To JSON
*
*	Converts a string into JSON
*/
function _stringToJSON(string) {
	return JSON.parse(string);
}

/*
*	_get
*
*	This is where the actual get calls are made
*/
function _get(request) {
	
	//define local variables
	var url = request.url;
	var options = {
		method: 'GET',
		headers: request.headers
	};

	//TODO: REMOVE THIS LATER WHEN IT ISN'T NEEDED
	console.log("_getting");

	//return promise for async work
	return new Promise(function(resolve, reject) {
		
		//fetch required data
		fetch(url, options).then(function(response) {
			
			//TODO: REMOVE THIS LATER WHEN NOT NEEDED ANYMORE
			//console.log(url, response.headers._headers.link);

			//when the response comes back, look at the buffer
			response.buffer().then(function(data) {
				
				//TODO: REMOVE THIS LATER
				//console.log(JSON.parse(data.toString('utf8')));

				//if it's good put the data back together
				resolve(data.toString('utf8'));

			});

		}).catch(function(error) {
			//notify the user
			console.log('error', error);

			//if there was an error, reject
			reject(error);
		});

	});

};

/*
*	Get JSON
*
*	This method is used to aquire json through HTTP requests.
*/
function _getJSON(request) {

	//return promise for async work
	return new Promise(function(resolve, reject) {
		
		_get(request).then(function(response) {
		
			//format the returned value
			var newJSON = _stringToJSON(response);

			//pass it up
			resolve(newJSON);

		}).catch(function(e) {
			
			//if there was an error, let us know
			reject("error:", e);
		});

	});

};

/*
*	Get (HTTP Requests)
*
*	Handles all the get requests for this modeul
*/
function _GET(request) {

	//must determine the type of data we're trying to work with
	//define local variables
	var dataType = {
		"application/json": 0
	};

	//send back async work
	return new Promise(function(resolve, reject) {
		
		//TODO: TAKE THIS OUT LATER WHEN IT ISN'T NECESSARY TO KNOW
		console.log('in _GET');

		//execute based on the type of data expected to come through
		switch(dataType[request.headers.Accept]) {	
			case 0: 	//if we're dealing with json, then download accordingly

				//TODO: TAKE THIS OUT WHEN NOT USING IT ANYMORE
				console.log('in application/json switch');

				//if we need to get JSON data, reach out accordingly
				_getJSON(request).then(function(result) {


				}).catch(function(e) {

					//if there was an error, pass that along as well
					reject(e);

				});

				break;
			default:
				break;
		};

		//TODO: CHANGE THIS TO A RETURENED VALUE WHEN I HAVE ONE
		resolve(1);

	});

}

/*
*	Access Square Up
*
*	Any HTTP requests going through square up will pass through here
*/
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

					//when the request comes back, pass the response back up
					resolve(response);

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