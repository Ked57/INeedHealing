$(function() {
	
	/*Variables globales */
	var globals = {
		name : "",
		unitNumber : 0,
		generatorNumber : 0,
		boughGeneratorNumber : 0, // Pour différencier le nombre de générateurs achetés et possédés 
		generatorceptionNumber : 0
	};
	
	var identified = false;
	

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
		var reqUnitNumber = 92 + globals.generatorceptionNumber * 1128;
		if (globals.unitNumber >= reqUnitNumber) {
			++globals.generatorceptionNumber;
			globals.unitNumber -= reqUnitNumber;
		}
	}

	function updateReqGeneratorceptions() {
		$(" #reqNbGenception ").text(92 + globals.generatorceptionNumber * 1128);
	}

	function updateGeneratorceptions() {
		$(" #nbGenception ").text(globals.generatorceptionNumber);
	}
	
	$("#identified").hide();
	$("#identButton").click(function(){
		play($("#name").val());
	});

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
		if (identified) {
			var json = JSON.stringify(globals);
			console.log(json);
			$.get("http://localhost:8888/save", globals);
		}
	}
	
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
