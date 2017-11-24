var url = require('url');

var querystring = require("querystring"), fs = require("fs");

var savedObj = {
	table : []
}

// On sauvegarde les données dans un fichier json toutes les 30 secondes
setInterval(function() {
	fs.writeFile('save.json', JSON.stringify(savedObj), 'utf8', function(err,
			data) {
		if (err) {
			console.log("Erreur pendant la sauvegarde des données :" + err);
		} else
			console.log("Sauvegarde effectuée");
	})
}, 30000);

function save(response, request) {
	console.log("Le gestionnaire de sauvegarde est appelé.");

	if (savedObj.table[0] == null && !readTextFile('./save.json')) {
		init();
	}

	var q = url.parse(request.url, true);
	var qdata = q.query;

	

		var globals = {
			name : qdata.name,
			unitNumber : qdata.unitNumber,
			generatorNumber : qdata.generatorNumber,
			boughGeneratorNumber : qdata.boughGeneratorNumber, // Pour
																// différencier
			// le nombre de
			// générateurs
			// achetés et
			// possédés
			generatorceptionNumber : qdata.generatorceptionNumber
		};

		savedObj.table.forEach(function(item, index, arr) {
			if (item.name === globals.name) {
				savedObj.table.splice(index, 1);
			}
		});

		savedObj.table.push(globals);

		var JSONString = JSON.stringify(savedObj);
		console.log("JSon string: " + JSONString);
	
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.writeHead(200, {
		"Content-Type" : "text/html"
	});
	response.end();
}

function load(response, request) {

	if (savedObj.table[0] == null && !readTextFile('./save.json')) {
		init();
	}

	var q = url.parse(request.url, true);
	var qdata = q.query;
	var globals = {
		name : "",
		unitNumber : 0,
		generatorNumber : 0,
		boughGeneratorNumber : 0,
		generatorceptionNumber : 0
	};

	console.log("Getting player by name where name is :" + qdata.name);
	savedObj.table.forEach(function(item, index, arr) {
		if (item.name != null) {
			console.log(item);
			var compare = item.name.localeCompare(qdata.name);
			console.log(compare);
			if (compare == 0) {
				console.log(item);
				globals.name = item.name;
				globals.unitNumber = item.unitNumber;
				globals.generatorNumber = item.generatorNumber;
				globals.boughGeneratorNumber = item.boughGeneratorNumber;
				globals.generatorceptionNumber = item.generatorceptionNumber;
			}
		}
	});
	console.log("Objet renvoyé");
	console.log(globals);
	var resp = JSON.stringify(globals);
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.writeHead(200, {
		"Content-Type" : "text/html"
	});
	if (resp != null && resp.name != "") {
		console.log("Sent respond");
		response.write(resp);
	} else
		response.write("error");

	response.end();

}

function init() {
	console.log("Chargement du fichier de sauvegarde JSON");
	// Get content from file
	var save = fs.readFileSync("save.json");
	save = JSON.parse(save);
	console.log(save);

	savedObj = save;
	
}

function isEmpty(obj) {
	for ( var prop in obj) {
		if (obj.hasOwnProperty(prop))
			return false;
	}

	return true;
}

function readTextFile(filePath) {
	try {
		var save = fs.readFileSync(filePath);
	} catch (e) {
		console.log("Le fichier de sauvegarde n'éxiste pas");
		return true;
	}

	return isEmpty(save);
}

exports.save = save;
exports.load = load;
