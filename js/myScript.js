$(function() {

	/*Variables globales */
	var globals = {
		name : "",
		unitNumber : 0,
		generatorNumber : 0,
		boughGeneratorNumber : 0, // Pour différencier le nombre de générateurs achetés et possédés 
		generatorceptionNumber : 0
	};

	setInterval(function() {
		update();
	}, 1000);

	/* fonctions */
	function update() {
		updateUnits();
		updateGenerators();
		updateReqGenerators();
		updateGeneratorceptions();
		updateReqGeneratorceptions();
	}

	function addUnit() {
		++globals.unitNumber;
		save();
	}

	function updateUnits() {
		globals.unitNumber += globals.generatorNumber;
		$(" #nbMadamada ").text(globals.unitNumber);
	}

	function addGenerator() {
		var reqUnitNumber = 30 + globals.boughGeneratorNumber * 10;
		if (globals.unitNumber >= reqUnitNumber) {
			++globals.generatorNumber;
			++globals.boughGeneratorNumber;
			globals.unitNumber -= reqUnitNumber;
		}
	}

	function updateReqGenerators() {
		$(" #reqNbGen ").text(30 + globals.boughGeneratorNumber * 10);
	}

	function updateGenerators() {
		globals.generatorNumber += globals.generatorceptionNumber;
		$(" #nbGen ").text(globals.generatorNumber);
	}

	function addGeneratorception() {
		var reqUnitNumber = 92 + globals.generatorceptionNumber * 108;
		if (globals.unitNumber >= reqUnitNumber) {
			++globals.generatorceptionNumber;
			globals.unitNumber -= reqUnitNumber;
		}
	}

	function updateReqGeneratorceptions() {
		$(" #reqNbGenception ").text(92 + globals.generatorceptionNumber * 108);
	}

	function updateGeneratorceptions() {
		$(" #nbGenception ").text(globals.generatorceptionNumber);
	}

	$(" #madamada ").click(function() {
		addUnit();
	})

	$(" #generateur ").click(function() {
		addGenerator();
	})

	$(" #generateurception ").click(function() {
		addGeneratorception();
	})

	setInterval(function() {
		save();
	}, 5000);//On sauvegarde toutes les 5 secondes

	function save() {
		var name = $("#name").val();
		if (name != null) {
			globals.name = name
			var json = JSON.stringify(globals);
			console.log(json);
			$.get("http://localhost:8888/save", globals);
		}
	}
});
