
/* This is the allTools CLI.  It can be used to refined the server scripts for allTools.
*/

//define dependencies
var api = require('./api.js');
var fileReader = require('./file_reader.js');
var dbAPI = require('./dbAPI.js');

/*
*	Parameters can be passed to this script
*	thus we must parse them to affect the actions
*	desired.
*
*/
process.argv.forEach(function (val, index, array) {
  
  //define paths variablle
  var paths = {
  	"dailysalesreport": 0,
  	"db": 1,
    "hourlysales": 2
  };
  //pick a path based on the param

  switch(paths[val]) {
  	case 0:
      console.log('running daily sales');
      dailyEarningsReports();
      break;
    case 1:
  		console.log('got to db',array[index+1]);
  		updateDB(array[index+1]);
  		break;
  	case 2:
      calculateHourlySales();
      break;
    default:
  		//console.log('nothing');
  		break;
  }


});

//run the required function for the DAILY REPORTS
/*
*   Run Daily Earnings Reports
*
*
*
*/
function dailyEarningsReports() {

  //define local variables
  var params = {
    locationId:"14E8S7P16JQDM",
    day: {
      start:"2017-07-01T00:03:00-08:00",
      end: "2017-07-02T00:02:59-08:00"
    }
  };
  
  //hit the api
  api.dailyEarningsReports(params).then(function(result) {

    //notify with results
    console.log(result);

  });

};

/*
*	UpdateDB Updates the database
*	
*
*
*/
function updateDB(path) {

	//go get the file
	fileReader.open('./ref_data/' + path).then(function(newData) {

		//pass this file to the db to update
		dbAPI.update(newData).then(function(result) {

			console.log('result', result);
		});

	});
	
}

/*
* 
*
*
*
*/
function calculateHourlySales() {

  console.log('calculating hourly sales');  //TODO: TAKE THIS OUT LATER

  //define local variables
  var params = {
    locationId:"14E8S7P16JQDM",
    day: {
      start:"2017-07-01T00:03:00-08:00",
      end: "2017-07-02T00:02:59-08:00"
    }
  };

  //hit the api
  api.calculateHourlySales(params).then(function(result) {

    console.log('got this back:', result); //TODO: TAKE THIS OUT LATER;

  }).catch(function(e) {
    console.log('an error occured', e);
  });

}
