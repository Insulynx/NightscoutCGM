function setTemp(type){
		if(type == "Engine Braking"){
			document.getElementById("basalduration").value = 30; 
			document.getElementById("basalpercent").value = -100; 	
			basalnotes = "Engine Braking";
		}
		if(type == "Super Bolus"){
			document.getElementById("basalduration").value = 60; 
			document.getElementById("basalpercent").value = -100; 
			basalnotes = "Super Bolus";
		}
	}

	function suggestExercise(){
	  eventType = "Exercise"; 
	  var exercisetime = document.getElementById("exerciseduration").value;
	  if(exerciseType == "Dance"){
		 exerciseSuggestion = "Expect a BG drop of "+ exercisetime + " to be adjusted by " + (exercisetime/currSens).toFixed(2) + " less insulin or " + (exercisetime/(currSens/currCarbRatio)).toFixed(0) + " carbs. Set a 12 hour post-exercise temp basal of -20%."
	  }
	  if(exerciseType == "Yoga"){
		 exerciseSuggestion = "30 mins prior to end of session, if BGs have not been dropping, do 2 units to cover post exercise high. Set a 12 hour post-exercise temp basal of -10%."
	  }
	  if(exerciseType == "Other"){
		  exerciseSuggestion = "If aerobic, expect a BG drop of "+ exercisetime + " to be adjusted by " + (exercisetime/currSens).toFixed(2) + " less insulin or " + (exercisetime/(currSens/currCarbRatio)).toFixed(0) + " carbs. Set a 12 hour post-exercise temp basal of -20%.<br/><br/>If anaerobic, 30 mins prior to end of session, if BGs have not been dropping, do 2 units to cover post exercise high. Set a 12 hour post-exercise temp basal of -10%."
	  }
          document.getElementById("submission_exercise").innerHTML = exerciseSuggestion; 
	}
				
	function postData(input, callback){
			var posting = $.post( treatmentsURL, input );
			  posting.done(function( data ) {
			    callback(data);
			  }); 
			  posting.fail(function( data) {
			    callback(data);
			  });
	}
  
  // ~~~~~~~~~~~~~~~~~~~~~~~~~ SET BUTTON ACTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~	
function setButtonActions(){		
      $("#BreakfastButton").click(function() { calcFoodBolus("Meal", "Breakfast"); });
      $("#LunchButton").click(function() { calcFoodBolus("Meal", "Lunch");  });
      $("#DinnerButton").click(function() { calcFoodBolus("Meal", "Dinner");  });
      $("#MornSnackButton").click(function() { calcFoodBolus("Snack", "Morning Snack"); });
      $("#AftSnackButton").click(function() { calcFoodBolus("Snack", "Afternoon Snack"); });
      $("#EveSnackButton").click(function() { calcFoodBolus("Snack", "Evening Snack"); });
      $("#suggest_meal").click(function() { 
	        prebolus = document.getElementById("prebolus").value;
		carbs = document.getElementById("carbs").value;
		fat = document.getElementById("fat").value;  
		protein = document.getElementById("protein").value;  
		fiber = document.getElementById("fiber").value;
	        eventType = "Meal Bolus";
	      	bolusCalcWFood("N/A");
      });  
      $("#carbdose_clear").click(function() { document.getElementById("carbdose_meal").value = 0.00; });
	$("#extdose_clear").click(function() { document.getElementById("extdose_meal").value = 0.00; });
	$("#corrdose_clear").click(function() { document.getElementById("corrdose_meal").value = 0.00; });
	$("#superdose_clear").click(function() { document.getElementById("super_meal").value = 0.00; });
	$("#combosplit_clear").click(function() { 
		document.getElementById("bolusnow_meal").value = 100; 
		document.getElementById("bolusext_meal").value = 0; 				
	});
	(document.getElementById("bolusnow_meal")).addEventListener("input", function(e){
		document.getElementById("bolusext_meal").value = 100-document.getElementById("bolusnow_meal").value;
	});
	(document.getElementById("bolusext_meal")).addEventListener("input", function(e){
		document.getElementById("bolusnow_meal").value = 100-document.getElementById("bolusext_meal").value;
	});
      $("#CorrOnly").click(function() { resetVars(); eventType = "Correction Bolus"; bolusCalc(); });
      $("#CarbsOnly").click(function() { resetVars(); eventType = "Carb Correction"; bolusCalc(); });
      $("#EngineBraking").click(function() { resetVars(); eventType = "Temp Basal"; setTemp("Engine Braking"); });
      $("#SuperBolus").click(function() { resetVars(); eventType = "Temp Basal"; setTemp("Super Bolus"); });
      //$("#TestButton").click(function() { eventType = "Meal Bolus"; runTest(); });
      $("#Dance").click(function(event) { 
	      resetVars();
	      exerciseType = "Dance";
	      suggestExercise();
      });
      $("#Yoga").click(function(event) { 
	      resetVars();
	      exerciseType = "Yoga";
	     suggestExercise();
      });
      $("#Other").click(function(event) { 
	      resetVars();
	      exerciseType = "Other";
	      suggestExercise();
      });	
      $("#mealform").submit(function( event ) {
          event.preventDefault();
	  cleardivs("Meal");
	  var $form = $( this ),
	  prebolus = $form.find( "select[id='prebolus']" ).val(),
	  finalcarbdose = parseFloat($form.find( "input[id='carbdose_meal']" ).val()),
	      finalextdose = parseFloat($form.find( "input[id='extdose_meal']" ).val()),
	      finalcorrdose = parseFloat($form.find( "input[id='corrdose_meal']" ).val()),
	      finalsuperdose = parseFloat($form.find( "input[id='super_meal']" ).val()),
	      finalbolusnowpercent = parseInt($form.find( "input[id='bolusnow_meal']" ).val()),
	      finalbolusextpercent = parseInt($form.find( "input[id='bolusext_meal']" ).val()),
	      finalextbolustime = parseInt($form.find( "select[id='extBolusTime']" ).val()) ;       
	  var newTotal = 0;
	  var newNow = 0;
	  var prevTotal = finalcarbdose+finalextdose;
	  if((finalcarbdose != parseFloat(newBolusCarbs.toFixed(2))) || (finalextdose != parseFloat(newBolusExt.toFixed(2))) || (finalcorrdose != parseFloat(newBolusCorr.toFixed(2))) || (finalsuperdose != parseFloat(newBolusSuper.toFixed(2))) || (finalbolusnowpercent != percentNow) || (finalbolusextpercent != percentExt) || (finalextbolustime != extBolusTime)){
		  if((finalbolusnowpercent != percentNow) || (finalbolusextpercent != percentExt)){
			finalextdose = prevTotal * (finalbolusextpercent/100);
			finalcarbdose = prevTotal * (finalbolusnowpercent/100);
			//finalextdose = finalextdose+(finalcarbdose*(finalbolusextpercent/100));  
			//finalcarbdose = finalcarbdose*(finalbolusnowpercent/100);
			newTotal = finalcarbdose+finalextdose+finalcorrdose+finalsuperdose;
			newNow = finalcarbdose+finalsuperdose+finalcorrdose;
			percentNow = Math.round((newNow/newTotal)*100);
			percentExt = 100-percentNow; //(finalextdose/newTotal)*100;   
		  }
		  else{
		  	newTotal = finalcarbdose+finalextdose+finalcorrdose+finalsuperdose;
		  	percentNow = Math.round(((finalcarbdose+finalcorrdose+finalsuperdose)/newTotal)*100);
		  	percentExt = 100-percentNow; //(finalextdose/newTotal)*100;    
		  }
		  if(finalextdose == 0){
			document.getElementById("submission_meal").innerHTML += "New total: "+newTotal.toFixed(2)+"<br/>";
		}
		else{
			var minutesToHours = finalextbolustime/60;
			  document.getElementById("submission_meal").innerHTML += "New total: "+newTotal.toFixed(2)+" ("+percentNow.toFixed(0)+"% / "+percentExt.toFixed(0)+"%)<br/>"+(finalcarbdose+finalcorrdose+finalsuperdose).toFixed(2)+" + "+finalextdose.toFixed(2)+" extended over "+minutesToHours+" hours.<br/>";
		}
	  } 
	      
	  var finalNonCorrNonExtDose = finalcarbdose+finalsuperdose+finalcorrdose;   
	  if(finalextdose > 0){ 
		  //Get time
		today = new Date(); // for now
		//Divide time
		var newDate = new Date(today);
		var extTimeIntervals = finalextbolustime/10.0;  
		  //finalextbolustime
		var insulinDiv = finalextdose/extTimeIntervals;
		var t;
		var UTCMonth;
		for (t = 0; t < parseInt(extTimeIntervals); t++){
			newDate.setTime(newDate.getTime() + 10*60*1000);
			//Format new time
			UTCtimeStr = newDate.toJSON();
			//Send fractional insulin amounts to NS
			postData({ "enteredBy":"BolusCalc","insulin":insulinDiv,"created_at":UTCtimeStr,"secret":secret },function(data){
			});	
		}
			     
	}
	if((finalNonCorrNonExtDose>0) || (netCarbs>0)){
	  if(finalNonCorrNonExtDose<0) { 
	  var posting = $.post( treatmentsURL, { "enteredBy":"BolusCalc","carbs":netCarbs,"insulin":0,"eventType":eventType,"preBolus":prebolus,"secret":secret } );
	  }
	  else{	
          var posting = $.post( treatmentsURL, { "enteredBy":"BolusCalc","carbs":netCarbs,"insulin":finalNonCorrNonExtDose,"eventType":eventType,"preBolus":prebolus,"secret":secret } );
	  }
          posting.done(function( data ) {
            document.getElementById("submission_meal").innerHTML += "Data submitted &#x1F44D";
          }); 
	  posting.fail(function( data) {
	    document.getElementById("submission_meal").innerHTML += "Data NOT submitted &#x1F44E";  
	  });
	}
	if(finalcorrdose>0){
	  var posting2 = $.post( treatmentsURL, { "enteredBy":"BolusCalc","insulin":finalcorrdose,"eventType":"Correction Bolus","secret":secret } );
          posting2.done(function( data ) {
	    if((finalNonCorrNonExtDose==0) && (netCarbs==0)){ document.getElementById("submission_meal").innerHTML += "Data submitted &#x1F44D"; }
            //document.getElementById("submission_meal").innerHTML += " plus correction bolus";
          }); 
	  posting2.fail(function( data) {
	    document.getElementById("submission_meal").innerHTML += " WITHOUT correction bolus";  
	  });
	}
	if(finalsuperdose>0){
		  var posting3 = $.post( treatmentsURL, { "enteredBy":"BolusCalc","duration":60,"percent":-100,"eventType":"Temp Basal","notes":"Super bolus","secret":secret } );
		  // Put the results in a div
		  posting3.done(function( data ) {
		    if((finalNonCorrNonExtDose==0) && (netCarbs==0) && (finalcorrdose==0)){ document.getElementById("submission_meal").innerHTML += "Data submitted &#x1F44D"; }
		    //document.getElementById("submission_meal").innerHTML += " plus super bolus temp basal.";
		  }); 
		  posting3.fail(function( data) {
		    document.getElementById("submission_meal").innerHTML += ", WITHOUT super bolus temp basal.";  
		  });
	  }  
        });
	$("#correctionform").submit(function( event ) {
          // Stop form from submitting normally
          event.preventDefault();
	  cleardivs("Correction");
          // Get some values from elements on the page
	  var $form = $( this ),
	    corrdose = $form.find( "input[id='corrdose']" ).val();
          // Send the data using post 
          var posting = $.post( treatmentsURL, { "enteredBy":"BolusCalc","insulin":corrdose,"eventType":"Correction Bolus","secret":secret } );
          // Put the results in a div
          posting.done(function( data ) {
            document.getElementById("submission_correction").innerHTML = "Data submitted &#x1F44D";
          }); 
	  posting.fail(function( data) {
	    document.getElementById("submission_correction").innerHTML = "Data NOT submitted &#x1F44E";  
	  });
	  if(corrdose == newBolusCorr){     
		  if(newBolusSuper>0){
			  var posting2 = $.post( treatmentsURL, { "enteredBy":"BolusCalc","duration":60,"percent":-100,"eventType":"Temp Basal","notes":basalnotes,"secret":secret } );
			  // Put the results in a div
			  posting2.done(function( data ) {
			    document.getElementById("submission_correction").innerHTML += " plus super bolus temp basal.";
			  }); 
			  posting2.fail(function( data) {
			    document.getElementById("submission_correction").innerHTML += " WITHOUT super bolus temp basal.";  
			  });
		  }
	  }
        });
	      
	$("#carbsonlyform").submit(function( event ) {
          event.preventDefault();
	  cleardivs("Carbs");
	  var $form = $( this ),
	    corrCarbs = $form.find( "input[id='corrCarbs']" ).val();
	  eventType = "Carb Correction";
          var posting = $.post( treatmentsURL, { "enteredBy":"BolusCalc","carbs":corrCarbs,"eventType":eventType,"notes":"Low","secret":secret } );
          posting.done(function( data ) {
            document.getElementById("submission_carbsonly").innerHTML = "Data submitted &#x1F44D";
          }); 
	  posting.fail(function( data) {
	    document.getElementById("submission_carbsonly").innerHTML = "Data NOT submitted &#x1F44E";  
	  });
        });
	      
	$("#tempbasalform").submit(function( event ) {
          event.preventDefault();
	  cleardivs("N/A");
	  var $form = $( this ),
	    basald = $form.find( "input[id='basalduration']" ).val(),
	    basalp = $form.find( "input[id='basalpercent']" ).val();
	  if(eventType == '') { eventType = "Temp Basal"; }
          var posting = $.post( treatmentsURL, { "enteredBy":"BolusCalc","duration":basald,"percent":basalp,"eventType":eventType,"notes":basalnotes,"secret":secret } );
          posting.done(function( data ) {
            document.getElementById("submission_tempbasal").innerHTML = "Data submitted &#x1F44D";
          }); 
	  posting.fail(function( data) {
	    document.getElementById("submission_tempbasal").innerHTML = "Data NOT submitted &#x1F44E";  
	  });
        });
	$("#exerciseform").submit(function( event ) {
          event.preventDefault();
	  cleardivs("Exercise");
	  var $form = $( this ),
	    exercisetime = $form.find( "input[id='exerciseduration']" ).val();
	  var posting = $.post( treatmentsURL, { "enteredBy":"BolusCalc","duration":exercisetime,"notes":exerciseType,"eventType":eventType,"secret":secret } );
          posting.done(function( data ) {
            document.getElementById("submission_exercise").innerHTML += "Data submitted &#x1F44D ";
          }); 
	  posting.fail(function( data) {
	    document.getElementById("submission_exercise").innerHTML += "Data NOT submitted &#x1F44E ";  
	  });
        });   
	$("#removepumpform").submit(function( event ) {
          event.preventDefault();
	  cleardivs("N/A");
	  var $form = $( this ),
	    pumpoffduration = $form.find( "input[id='pumpoffduration']" ).val();
	  var insulinreco = (pumpoffduration/60)*currBasal;
	  var addToReco = '';
	  if(currBG >= BGgoal){
		  var posting = $.post( treatmentsURL, { "enteredBy":"BolusCalc","insulin":insulinreco,"notes":"Shower","secret":secret } );
		  posting.done(function( data ) {
		    document.getElementById("submission_removepump").innerHTML = "Data submitted &#x1F44D Bolus "+insulinreco+" units before removing. ";
		  }); 
		  posting.fail(function( data) {
		    document.getElementById("submission_removepump").innerHTML = "Data NOT submitted &#x1F44E Bolus "+insulinreco+" units before removing. ";  
		  });
	  }
	  else{
		  addToReco = " No bolus required.";
	  }
	  var posting2 = $.post( treatmentsURL, { "enteredBy":"BolusCalc","eventType":"Temp Basal","duration":pumpoffduration,"notes":"Shower","secret":secret } );
          posting2.done(function( data ) {
            document.getElementById("submission_removepump").innerHTML += "Temp basal set."+addToReco;
          }); 
	  posting2.fail(function( data) {
	    document.getElementById("submission_removepump").innerHTML += "Temp basal NOT set."+addToReco;  
	  });
        });
}
