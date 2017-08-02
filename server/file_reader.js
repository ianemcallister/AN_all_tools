
//define dependencies
var fs = require('fs');

//define the module
var file_reader = {
	open: open,
	save: save
};

function open(path) {

	console.log(path);

	return new Promise(function(resolve, reject) {

		var object = JSON.parse(fs.readFileSync(path, 'utf8'));

		//console.log(object);

		resolve(object);
	});

}

function save(path, object) {

	console.log('saving changes', path, object);

	var dbString = JSON.stringify(object, null, '\t')

	fs.writeFileSync(path, dbString);
}

//export the module
module.exports = file_reader;