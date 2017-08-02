
//define dependencies
var fetch = require('node-fetch');

//define the module
var httpCenter = {
	_squareSalesDataRequest: _squareSalesDataRequest,
	_squareSalesDataRequest_urlOnly: _squareSalesDataRequest_urlOnly,
	_fetch: _fetch,
	_distill_Sqr_Paginated_Link: _distill_Sqr_Paginated_Link,
	_stringToJSON: _stringToJSON,
	_get: _get,
	_getJSON: _getJSON,
	_square_get_possiblePagination: _square_get_possiblePagination,
	//_GET: _GET,
	_accessSquareUp: _accessSquareUp,
	_collectPaginatedSquareSalesData:_collectPaginatedSquareSalesData,
	dowloadSquareSalesData: dowloadSquareSalesData,
	collectRequiredData: collectRequiredData
};

/*
*	_squareSalesDataRequest_urlOnly
*/
function _squareSalesDataRequest_urlOnly(urlOnly) {

	//define local variables
	var requestObject = {
		service: 'squareup',
		url: urlOnly,
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + process.env.SQUARE_APP_TOKEN,
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}

	return requestObject;
};

/*
*	_squareSalesDataRequest
*/
function _squareSalesDataRequest(params) {

	//from the params build a request object
	var requestObject = {
		service: 'squareup',
		url: 'https://connect.squareup.com/v1/' + params.locationId + '/payments?begin_time=' + params.day.start + '&end_time=' + params.day.end,
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + process.env.SQUARE_APP_TOKEN,
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}

	return requestObject;
}

/*
*	String To JSON
*
*	Converts a string into JSON
*/

/*
*	_fetch
*
*
*/
function _fetch(request) {

	console.log('fetching'); 	//TODO: REMOVE THIS LATER

	//define local variables
	var url = request.url;
	var options = {
		method: 'GET',
		headers: request.headers
	};

	//return async work
	return new Promise(function(resolve, reject) {

		//console.log(request);	//TODO: TAKE THIS OUT LATER

		fetch(url, options).then(function(response) {

			//console.log(response);	//TODO: REMOVE THIS LATER

			//pass the response back
			resolve(response);

			//pass an error back up
		}).catch(function(e) {
			reject(e);
		});

	});

};

function _distill_Sqr_Paginated_Link(rawLink) {

	var newSplitLink = rawLink.split(';');
	var onlyLink = newSplitLink[0];
	var linkLength = onlyLink.length;
	var newLink = onlyLink.substring(1,linkLength-1);

	//console.log('_distill_Sqr_Paginated_Link', newLink);	//TODO: REMOVE THIS LATER

	return newLink;

};

/*
*	_stringToJSON
*/
function _stringToJSON(string) { return JSON.parse(string); }

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

	//return promise for async work
	return new Promise(function(resolve, reject) {
		
		//TODO: REMOVE THIS LATER WHEN IT ISN'T NEEDED
		//console.log("_getting");
		//console.log('url:', url);
		//console.log('options:', options);

		//fetch required data
		fetch(url, options).then(function(response) {
			
			//TODO: TAKE THIS OUT LATER
			console.log('got a response from fetch');
			//console.log(response);

			//pass the response back up
			resolve(response);

		}).catch(function(error) {
			//notify the user
			console.log('this error error', error);

			//if there was an error, reject
			reject(error);
		});

	});

};

/*
*	_square_get_possiblePagination
*
*	This method is designed as a recursive method that can handle
*	paginated responses if need be.
*
*/
function _square_get_possiblePagination(request) {

	//define local variables
	var url = request.url;
	var options = {
		method: 'GET',
		headers: request.headers
	};

	//return promise for async work
	return new Promise(function(resolve, reject) {

		//TODO: REMOVE THIS LATER WHEN IT ISN'T NEEDED
		//console.log("_getting");
		//console.log('url:', url);
		//console.log('options:', options);

		//fetch required data
		fetch(url, options).then(function(response) {
			
			//TODO: TAKE THIS OUT LATER
			console.log('got a response from fetch');
			//console.log(response.headers._headers.link);

			//when successful data comes back if there is a link, follow the link
			if(response.headers._headers.link != undefined) {
				
				//local variable
				var newRawLink = response.headers._headers.link[0];
				var newSplitLink = newRawLink.split(';');
				var onlyLink = newSplitLink[0];
				var linkLength = onlyLink.length;
				var newLink = onlyLink.substring(1,linkLength-1);

				//if there is a link then it is a paginated response
				console.log('there was a LINK', newLink); //TODO: TAKE THIS OUT LATER

				//rebuild the request
				request.url = newLink;

				//send it again
				_square_get_possiblePagination(request).then(function(response) {
					console.log('good response');
				}).catch(function(e) {
					console.log('shitty response');
				});


			} else {

				//if no link exists return the data as is.
				console.log('there was NO LINK'); //TODO: TAKE THIS OUT LATER
				
				response.buffer().then(function(data) {
						
					//TODO: REMOVE THIS LATER
					//console.log(JSON.parse(data.toString('utf8')));

					//if it's good put the data back together
					resolve(data.toString('utf8'));

				});
			}
			
			//pass the response back up
			//resolve(response);

		}).catch(function(error) {
			//notify the user
			console.log('this error error', error);

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

			//TODO: REMOVE THIS LATER
			//console.log(newJSON);

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

					//TODO: REMOVE THIS LATER
					console.log(result.length);

					//pass the data back up
					resolve(1);

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
	
	//TODO: TAKE THIS OUT LATER
	console.log('got to _accessSquareUp');

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

				//TODO: TAKE THIS OUT LATER
				console.log('in GET switch');

				//send request via _get
				_square_get_possiblePagination(request).then(function(response) {

				}).catch(function(e) {
					console.log('back in _accessSquareUp, an error occured', e);
					reject(e);
				});
				/*_get(request).then(function(response) {

					//when the response comes back, look for pagination
					if(response.headers._headers.link != undefined) {

						//if there is a link then it is a paginated response
						console.log('there was a LINK'); //TODO: TAKE THIS OUT LATER



					} else {

						//if no link exists return the data as is.
						console.log('there was NO LINK'); //TODO: TAKE THIS OUT LATER
					}


					//when the response comes back, look at the buffer
					//response.buffer().then(function(data) {
						
						//TODO: REMOVE THIS LATER
					//	console.log(JSON.parse(data.toString('utf8')));

						//if it's good put the data back together
					//	resolve(data.toString('utf8'));

					//});


					resolve(1);
					
				}).catch(function(e) {
					console.log('back in _accessSquareUp, an error occured', e);
					reject(e);
				});*/

				break;
			case 1:
				//TODO: ADD A POST PATH LATER
				break;
			default:
				//TODO: ADD A DEFAULT PATH LATER
				break;
		};

		//console.log('got this request', request);

		resolve(1);

	});

};

/*
*	_collectPaginatedSquareSalesData
*
*
*/
function _collectPaginatedSquareSalesData(request) {

	console.log('_collectPaginatedSquareSalesData');	//TODO: Take this out later

	//return async work
	return new Promise(function(resolve, reject) {

		//fetch data
		_fetch(request).then(function(response) {

			//if the response contains a link, recurse
			if(response.headers._headers.link != undefined) {

				//build the new request
				var newURL = _distill_Sqr_Paginated_Link(response.headers._headers.link[0]);
				var newRequest = _squareSalesDataRequest_urlOnly(newURL);

				_collectPaginatedSquareSalesData(newRequest).then(function(newResponse) {

					//when responses comes back from this promise
					//turn the old response into an object
					
					//access the data buffer
					response.buffer().then(function(data) {
							
						//console.log(JSON.parse(data.toString('utf8'))); //TODO: REMOVE THIS LATER

						//turn the response into an object
						var salesDataObject = data.toString('utf8');

						//add the data to the array
						newResponse.push(salesDataObject);

						//and pass it back up the chain
						resolve(newResponse);

					});

					//if there's an error pass it back up
				}).catch(function(e) {
					reject(e);
				});

			} else {

				//if no link is found you've reached the bottom
				
				//define local array
				var responseArray = [];

				//access the data buffer
				response.buffer().then(function(data) {
						
					//console.log(JSON.parse(data.toString('utf8'))); //TODO: REMOVE THIS LATER

					//turn the response into an object
					var salesDataObject = data.toString('utf8');

					//add the data to the array
					responseArray.push(salesDataObject);

					//and pass it back up the chain
					resolve(responseArray);

				});

			}

			//if there's an error pass it back up
		}).catch(function(e) {
			reject(e);
		});
	
	});

}

/*
*	dowloadSalesData(params)
*
*	This function collects all the raw sales data as defined
*	by the parameters
*
*/
function dowloadSquareSalesData(params) {

	//define local variables
	var request = _squareSalesDataRequest(params);

	//return async work
	return new Promise(function(resolve, reject) {
		
		//get an array of data
		_collectPaginatedSquareSalesData(request).then(function(rawSqrSalesData) {

			console.log(rawSqrSalesData);	//TODO: TAKE THIS OUT LATER

			//pass the number of records back
			resolve(rawSqrSalesData.length);

			//if we cameback with problems, pass them up
		}).catch(function(e) {
			reject(e);
		});

	});

}

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