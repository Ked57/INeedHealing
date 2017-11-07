$(function(){
	
	/*Variables globales */
	var unitNumber = 0;
	var generatorNumber = 0;
	var boughGeneratorNumber = 0; // Pour différencier le nombre de générateurs achetés et possédés 
	var generatorceptionNumber = 0;
	
	
	setInterval(function(){ update(); }, 1000);
	
	/* fonctions */
	function update(){
		updateUnits();
		updateGenerators();
		updateReqGenerators();
		updateGeneratorceptions();
		updateReqGeneratorceptions();
	}
	
	function addUnit(){
		++unitNumber;
	}
	
	function updateUnits(){
		unitNumber += generatorNumber; 
		$(" #nbMadamada ").text(unitNumber);
	}
	
	function addGenerator(){
		var reqUnitNumber = 30+boughGeneratorNumber*10;
		if(unitNumber >= reqUnitNumber){
			++generatorNumber;
			++boughGeneratorNumber;
			unitNumber -= reqUnitNumber;
		}
	}
	
	function updateReqGenerators(){
		$(" #reqNbGen ").text(30+boughGeneratorNumber*10);
	}
	
	function updateGenerators(){
		generatorNumber += generatorceptionNumber;
		$(" #nbGen ").text(generatorNumber);
	}
	
	function addGeneratorception(){
		var reqUnitNumber = 92+generatorceptionNumber*108;
		if(unitNumber >= reqUnitNumber){
			++generatorceptionNumber;
			unitNumber -= reqUnitNumber;
		}
	}
	
	function updateReqGeneratorceptions(){
		$(" #reqNbGenception ").text(92+generatorceptionNumber*108);
	}
	
	function updateGeneratorceptions(){
		$(" #nbGenception ").text(generatorceptionNumber);
	}
	
	$(" #madamada ").click(function(){
		addUnit();
	})
	
	$(" #generateur ").click(function(){
		addGenerator();
	})
	
	$(" #generateurception ").click(function(){
		addGeneratorception();
	})
});



