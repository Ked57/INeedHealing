var url = require('url');

var querystring = require("querystring"), fs = require("fs");

/* Variable globale
Nom: savedObj
Utilité: Contient un tableau d'objets, chaque objet contient les variables suivantes
		-name : Le nom du joueur
		-unitNumber : Le nombre d'unités qu'il possède (ici des madamada)
		-generatorNumber : Le nombre de générateurs
		-boughGeneratorNumber : le nombre de générateurs qu'il a acheté (pour incrémenter le prix)
		-generatorceptionNumber : le nombre de générateurceptions qu'il a acheté
*/
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

/* 	Fonctionnalité : Sauvegarde
 *	Nom de la fonction : save
 *	Description : Vérifie que l'initialisation à été faite, sinon on la fait
 *					On va ensuite créer un objet globals avec les variables reçues
 *					On regarde ensuite si l'objet est déjà dans le tableau
 *					Si oui on l'enlève
 *					Et on rajoute le nouveau
 *	Paramètres : response, request
 *	Sorties : aucune (envoi d'une réponse vide au client)
 */
function save(response, request) {
	console.log("Le gestionnaire de sauvegarde est appelé.");
	
	//Vérifie que l'initialisation à été faite, sinon on la fait
	if (savedObj.table[0] == null && !readTextFile('./save.json')) {
		init();
	}

	var q = url.parse(request.url, true);
	var qdata = q.query;

	
		//On va ensuite créer un objet globals avec les variables reçues
		var globals = {
			name : qdata.name,
			unitNumber : qdata.unitNumber,
			generatorNumber : qdata.generatorNumber,
			boughGeneratorNumber : qdata.boughGeneratorNumber, 
			generatorceptionNumber : qdata.generatorceptionNumber
		};
		
		//On regarde ensuite si l'objet est déjà dans le tableau
		savedObj.table.forEach(function(item, index, arr) {
			if (item.name === globals.name) {
				savedObj.table.splice(index, 1);//Si oui on l'enlève
			}
		});
		
		//Et on rajoute le nouveau
		savedObj.table.push(globals);

		/*var JSONString = JSON.stringify(savedObj);
		console.log("JSon string: " + JSONString);*/
	
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.writeHead(200, {
		"Content-Type" : "text/html"
	});
	response.end();
}
/* 	Fonctionnalité : Chargement
 *	Nom de la fonction : load
 *	Description : Envoie les données au client en fonction de son nom
 *	Paramètres : response, request
 *	Sorties : reponse au client (ses données)
 */
function load(response, request) {
	//Si l'initialisation n'a pas été faite, on la fait
	if (savedObj.table[0] == null && !readTextFile('./save.json')) {
		init();
	}

	var q = url.parse(request.url, true);
	var qdata = q.query;
	//On initialise l'objet globals avec toutes les variables nécéssaires
	var globals = {
		name : "",
		unitNumber : 0,
		generatorNumber : 0,
		boughGeneratorNumber : 0,
		generatorceptionNumber : 0
	};

	console.log("Getting player by name where name is :" + qdata.name);
	//Pour chaque objet sauvegardé on compare les noms 
	savedObj.table.forEach(function(item, index, arr) {
		if (item.name != null) {
			console.log(item);
			var compare = item.name.localeCompare(qdata.name);
			console.log(compare);
			if (compare == 0) {//Si c'est le même on rempli globals
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
	//On converti en String de JSON l'objet globals
	var resp = JSON.stringify(globals);
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.writeHead(200, {
		"Content-Type" : "text/html"
	});
	if (resp != null && resp.name != "") {//Si l'objet de retour n'est pas null on renvoie les données
		console.log("Sent respond");
		response.write(resp);
	} else
		response.write("error");

	response.end();

}
/* 	Fonctionnalité : Initialisation
 *	Nom de la fonction : init
 *	Description : Lecture du fichier JSON de sauvegarde
 *	Paramètres : aucun
 *	Sorties : aucun
 */
function init() {
	console.log("Chargement du fichier de sauvegarde JSON");
	// Get content from file
	var save = fs.readFileSync("save.json");
	save = JSON.parse(save);
	console.log(save);

	savedObj = save;
	
}
/* 	Fonctionnalité : Teste si un objet est vide
 *	Nom de la fonction : isEmpty
 *	Description : Teste si un objet est vide
 *	Paramètres : aucun
 *	Sorties : boolean
 */
function isEmpty(obj) {
	for ( var prop in obj) {
		if (obj.hasOwnProperty(prop))
			return false;
	}

	return true;
}
/* 	Fonctionnalité : lecture d'un fichier
 *	Nom de la fonction : readTextFile
 *	Description : lit un fichier text 
 *	Paramètres : filePath(le chemin du fichier)
 *	Sorties : boolean
 */
function readTextFile(filePath) {
	try {
		var save = fs.readFileSync(filePath);
	} catch (e) {
		console.log("Le fichier de sauvegarde n'éxiste pas");
		return false;
	}

	return isEmpty(save);
}

exports.save = save;
exports.load = load;
