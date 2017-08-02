/*
*	This is the DB API for accessing information in the 
*	local database
*
*/

//define dependencies
var fileReader = require('./file_reader.js');

//define the module
var dbapi = {
	_decreaseInv: _decreaseInv,
	create: create,
	read: read,
	update: update,
	del: del
}

function _decreaseInv(db, object) {

	var newDB = db;
	var destination = object['dest_warehouse'];

	//db[destination]

	return newDB;
}

function create() {}
function read() {}

/*
*	UPDATE
*
*	This function updates the databse when run.
*	It receives an object.  This object reflects
*	changes to be made in the database.
*	These changes are made, then the DB is resaved
*/
function update(object) {

	//define local variables
	var db_path = './ref_data/localDB.json';

	return new Promise(function(resolve, reject) {

		//open local database
		fileReader.open(db_path).then(function(db) {

			db = _decreaseInv(db, object);

			fileReader.save(db_path, db);
		});
		//update local databse
		//save local database
		//return result
		//resolve('done');

	});

}

function del() {}

//export the module
module.exports = dbapi;

