$(function() {
	
	/*Variables globales */
	/*Nom: globals
	Utilité: Contient les infos du joueur dans les variables suivantes
			-name : Le nom du joueur
			-unitNumber : Le nombre d'unités qu'il possède (ici des madamada)
			-generatorNumber : Le nombre de générateurs
			-boughGeneratorNumber : le nombre de générateurs qu'il a acheté (pour incrémenter le prix)
			-generatorceptionNumber : le nombre de générateurceptions qu'il a acheté*/
	var globals = {
		name : "",
		unitNumber : 0,
		generatorNumber : 0,
		boughGeneratorNumber : 0, // Pour différencier le nombre de générateurs achetés et possédés 
		generatorceptionNumber : 0
	};
	/* Nom: identified
	 * Utilité: pour savoir si l'utilisateur à envoyé son nom (et donc afficher la bonne partie de la page) 
	 */
	var identified = false;
	
	/* 	Mise à jour des valeurs sur la page toutes les secondes
	 */
	setInterval(function() {
		update();
	}, 1000);

	/* fonctions */
	
	/* 	Fonctionnalité : mise à jour
	 *	Nom de la fonction : update
	 *	Description : appelle les différentes fonctions de mise à jour
	 *	Paramètres : aucun
	 *	Sorties : aucune
	 */
	function update() {
		updateUnits();
		updateGenerators();
		updateReqGenerators();
		updateGeneratorceptions();
		updateReqGeneratorceptions();
	}

	/* 	Fonctionnalité : ajout d'unités
	 *	Nom de la fonction : addUnit
	 *	Description : incrémente le nombre d'unités et sauvegarde sur le serveur
	 *	Paramètres : aucun
	 *	Sorties : aucune
	 */
	function addUnit() {
		++globals.unitNumber;
		save();
	}
	
	/* 	Fonctionnalité : mise à jour du texte (compteur) sur la page
	 *	Nom de la fonction : update units
	 *	Description : Ajoute le nombre de générateurs et met à jour le texte du compteur sur la page
	 *	Paramètres : aucun
	 *	Sorties : aucune
	 */
	function updateUnits() {
		globals.unitNumber += globals.generatorNumber;
		$(" #nbMadamada ").text(globals.unitNumber);
	}
	
	/* 	Fonctionnalité : ajoute un générateur
	 *	Nom de la fonction : addGenerator
	 *	Description : Ajoute un générateur si il y a assez d'unités et déduit le nombre d'unités si
	 *					un générateur est acheté
	 *	Paramètres : aucun
	 *	Sorties : aucun
	 */
	function addGenerator() {
		var reqUnitNumber = 30 + globals.boughGeneratorNumber * 10;
		if (globals.unitNumber >= reqUnitNumber) {
			++globals.generatorNumber;
			++globals.boughGeneratorNumber;
			globals.unitNumber -= reqUnitNumber;
		}
	}
	/* 	Fonctionnalité : Mise à jour du nombre d'unités requises pour acheter un générateur
	 *	Nom de la fonction : updateReqGenerators
	 *	Description : Met à jour le nombre d'unités requises pour acheter un générateur
	 *	Paramètres : aucun
	 *	Sorties : aucun
	 */
	function updateReqGenerators() {
		$(" #reqNbGen ").text(30 + globals.boughGeneratorNumber * 10);
	}
	
	/* 	Fonctionnalité : Mise à jour du nombre de générateur
	 *	Nom de la fonction : updateGenerators
	 *	Description : Incrémente et met à jour le nombre de générateurs
	 *	Paramètres : aucun
	 *	Sorties : aucune
	 */
	function updateGenerators() {
		globals.generatorNumber += globals.generatorceptionNumber;
		$(" #nbGen ").text(globals.generatorNumber);
	}
	/* 	Fonctionnalité : ajoute un générateurception
	 *	Nom de la fonction : addGeneratorception
	 *	Description : ajouter un générateurception si il y a assez d'unités et déduit le nombre requis
	 *	Paramètres : aucun
	 *	Sorties : aucune
	 */
	function addGeneratorception() {
		var reqUnitNumber = 92 + globals.generatorceptionNumber * 1128;
		if (globals.unitNumber >= reqUnitNumber) {
			++globals.generatorceptionNumber;
			globals.unitNumber -= reqUnitNumber;
		}
	}
	/* 	Fonctionnalité : mise à jour du nombre d'unités requises pour un générateurception
	 *	Nom de la fonction : updateReqGeneratorceptions
	 *	Description : met à jour le nombre d'unités requises pour acheter un générateurception
	 *	Paramètres : aucun
	 *	Sorties : aucunes
	 */
	function updateReqGeneratorceptions() {
		$(" #reqNbGenception ").text(92 + globals.generatorceptionNumber * 1128);
	}
	/* 	Fonctionnalité : mise à jour du nombre de générateursceptions possédés
	 *	Nom de la fonction : updateGeneratorceptions
	 *	Description : met à jour le nombre de générateursceptions possédés
	 *	Paramètres : aucun
	 *	Sorties : aucun
	 */
	function updateGeneratorceptions() {
		$(" #nbGenception ").text(globals.generatorceptionNumber);
	}
	
	//Cache la partie de jeu par défaut (l'utilisateur doit donner son pseudo avant)
	$("#identified").hide();
	//Quand l'utilisateur click sur le bouton "jouer"
	$("#identButton").click(function(){
		play($("#name").val());
	});
	//Le handler du click sur l'image de madamada
	$(" #madamada ").click(function() {
		addUnit();
	})
	//Le handler du click sur l'image du générateur
	$(" #generateur ").click(function() {
		addGenerator();
	})
	//Le handler du clikc sur l'image du générateurception
	$(" #generateurception ").click(function() {
		addGeneratorception();
	})
	//L'interval de sauvegarde 
	setInterval(function() {
		save();
	}, 5000);//On sauvegarde toutes les 5 secondes
	
	/* 	Fonctionnalité : Envoi des données au serveur
	 *	Nom de la fonction : save
	 *	Description : on met dans un String l'objet globals, on le log et on l'envoie au serveur
	 *	Paramètres : aucun
	 *	Sorties : aucune
	 */
	function save() {
		if (identified) {
			var json = JSON.stringify(globals);
			console.log(json);
			$.get("http://localhost:8888/save", globals);
		}
	}
	
	/* 	Fonctionnalité : Initialisation du jeu pour le client
	 *	Nom de la fonction : play
	 *	Description : envoie le nom du joueur au serveur et récupère un objet JSON sous forme
	 *					de String. Transpose ensuite les données de cet objet dans la variable globale
	 *					globals
	 *	Paramètres : val(Le nom du joueur)
	 *	Sorties : 
	 */
	function play(val){
		if(val != null){
			globals.name = val;
			$("#identified").show();
			$("#notIdentified").hide();
			$("#nameSpan").text(val);
			identified = true;
			$.get("http://localhost:8888/load", globals).done(function( data ) {
			    if(data != null){
			    	data = JSON.parse(data);
			    	
			    	globals.name = data.name;
			    	globals.unitNumber =  parseInt(data.unitNumber);
			    	globals.generatorNumber =  parseInt(data.generatorNumber);
			    	globals.boughGeneratorNumber =  parseInt(data.boughGeneratorNumber);
			    	globals.generatorceptionNumber =  parseInt(data.generatorceptionNumber);
			    	
			    	console.log(globals);
			    }
			  });
		}
	}
});
