var viewBase = function(tabOwner, controller){
	this.tabOwner = tabOwner;
	this.dataScreen = null;
	this.controller = controller;
	this.windowHelper = setUpWindow(5);
}

viewBase.prototype.visPreveiw = function(disp){
		d3.select("#visControls").remove();
		//d3.select("#startButton").style("background","#094b85");
	}

viewBase.prototype.leaveVis = function(){
		d3.select("#visControls1").remove();
		d3.select("#visControls2").remove();
	}
viewBase.prototype.setUpTab2 = function(difference, avg_dev, sampleSize, within_sample = false, within_sample_checked){
	var self = this;
	var tab2Top = d3.select("#tab2Top");
	tab2Top.selectAll("*").remove();
	var tab2Bot = d3.select("#tab2Bot");
	tab2Bot.selectAll("*").remove();
	tab2Top.append("input").attr("type","button").attr("value","< Back to Data Input").attr("class","bluebutton").attr("id","backTab2").attr("disabled",null).attr("onClick","mainControl.switchTab1()").text("< Back to Data Input");
	// tab2Top.append("input").attr("type","button").attr("value","< Back to Data Input").attr("class","bluebutton").attr("id","backTab2").attr("disabled",null).attr("onClick","mainControl.switchTab1()")
	// 	.style("height","15%");
	
	if(sampleSize){
		tab2Top.append("label").text("Sample Size");
		tab2Top.append("input").attr("type","text").attr("value","20").attr("id","sampsize");
	}

	tab2Top.append("label").text("Statistic");
	tab2Top.append("select").attr("id","statSelect").append("option").text("Select variable");
	if(difference){
		tab2Top.append("select").attr("id","statTypeSelect").append("option").text(!avg_dev ? "Difference" : "Average Deviation");
	}
	if(within_sample){
		tab2Top.append("label").text("Sample within group: ")
		tab2Top.append("input").attr("type", "checkbox").attr("id", "withinSample").attr("checked", within_sample_checked ? "true" : null);
	}
	if(sampleSize){
		let SSize = document.getElementById("sampsize");
		SSize.onchange = function(e){
			self.controller.startVisPreveiw();
		}
	}
	if(within_sample){
		let ws = document.getElementById("withinSample");
		ws.onchange = function(e){
			self.controller.withinSampleChanged(e);
		}
	}
	var SS = document.getElementById("statSelect");
	SS.onchange = function(e){
		self.controller.statChanged(e);
	}
	tab2Top.append("input").attr("type","button").attr("value","Record my choices").classed("bluebutton", true).attr("id","Calculate").attr("disabled",null).attr("onClick","mainControl.startVisPressed()").text("Record my choices");
	// tab2Top.append("input").attr("type","button").attr("value","Record my choices").classed("bluebutton", true).attr("id","Calculate").attr("disabled",null).attr("onClick","mainControl.startVisPressed()")
	// 	.style("height","15%");
	//tab2Top.append("input").attr("type","button").attr("value","Pause").classed("bluebutton", true).attr("id","Pause").attr("disabled",true).attr("onClick","mainControl.pause()")
	//	.style("height","15%");
}

viewBase.prototype.makeButtons = function(){
		d3.select("#stopButton").remove();
		d3.select("#tab2Top").append("input").attr("type","button").attr("value","Stop").classed("bluebutton", true).attr("id","stopButton").attr("disabled",null).attr("onClick","mainControl.stopPressed()").text("Stop");
		// d3.select("#tab2Top").append("input").attr("type","button").attr("value","Stop").classed("bluebutton", true).attr("id","stopButton").attr("disabled",null).attr("onClick","mainControl.stopPressed()")
		// 	.style("height","15%");
		var tab2 = d3.select("#tab2");
		var vs = tab2.select("#tab2Mid").append("div").attr("id","visControls1");
		vs.append("label").text("Sampling");
		vs.append("input").attr("type","radio").attr("name","Sampling").attr("value","1").attr("id","sampOne").attr("class","repSelect").attr("checked",true).text("1");
		vs.append("label").attr("for","sampOne").attr("class","repLabel").text("1");
		vs.append("input").attr("type","radio").attr("name","Sampling").attr("value","5").attr("id","sampFive").attr("class","repSelect").text("5");
		vs.append("label").attr("for","sampFive").attr("class","repLabel").text("5");
		vs.append("input").attr("type","radio").attr("name","Sampling").attr("value","20").attr("id","sampTwenty").attr("class","repSelect").text("20");
		vs.append("label").attr("for","sampTwenty").attr("class","repLabel").text("20");
		vs.append("input").attr("type","radio").attr("name","Sampling").attr("value","1000").attr("id","sampThousand").attr("class","repSelect").text("1000");
		vs.append("label").attr("for","sampThousand").attr("class","repLabel").text("1000");
		vs.append("input").attr("type","button").attr("value","Go").attr("class","bluebutton").classed("goButton",true).attr("id","startSampling").attr("disabled",null).attr("onClick","mainControl.startSampling(false)").text("Go");
		// vs.append("input").attr("type","button").attr("value","Go").attr("class","bluebutton").classed("goButton",true).attr("id","startSampling").attr("disabled",null).attr("onClick","mainControl.startSampling(false)")
		// 	.style("height","15%");

		vs = tab2.select("#tab2Bot").append("div").attr("id","visControls2");
		vs.append("label").text("Sampling Distribution");
		vs.append("input").attr("type","radio").attr("name","Dist").attr("value","1").attr("id","distOne").attr("class","repSelect").attr("checked",true).text("1");
		vs.append("label").attr("for","distOne").attr("class","repLabel").text("1");
		vs.append("input").attr("type","radio").attr("name","Dist").attr("value","5").attr("id","distFive").attr("class","repSelect").text("5");
		vs.append("label").attr("for","distFive").attr("class","repLabel").text("5");
		vs.append("input").attr("type","radio").attr("name","Dist").attr("value","20").attr("id","distTwenty").attr("class","repSelect").text("20");
		vs.append("label").attr("for","distTwenty").attr("class","repLabel").text("20");
		vs.append("input").attr("type","radio").attr("name","Dist").attr("value","1000").attr("id","distThousand").attr("class","repSelect").text("1000");
		vs.append("label").attr("for","distThousand").attr("class","repLabel").text("1000");
		vs.append("input").attr("type","button").attr("value","Go").attr("class","bluebutton").classed("goButton",true).attr("id","distSampling").attr("disabled",null).attr("onClick","mainControl.startSampling(true)").text("Go");
		// vs.append("input").attr("type","button").attr("value","Go").attr("class","bluebutton").classed("goButton",true).attr("id","distSampling").attr("disabled",null).attr("onClick","mainControl.startSampling(true)")
		// 	.style("height","15%");
		/*
		vs.append("input").attr("name", "do1").attr("type", "button").attr("value","1 sample").attr("onClick", "mainControl.startAnimation(1,true)");
		vs.append("input").attr("name", "do10").attr("type", "button").attr("value","10 samples").attr("onClick", "mainControl.startAnimation(10, false)");
		vs.append("input").attr("name", "do1000").attr("type", "button").attr("value","1000 samples").attr("onClick", "mainControl.startAnimation(1000, false)");
		vs.append("input").attr("name", "resetLines").attr("type", "button").attr("value","reset lines ").attr("onClick", "mainControl.resetScreen()");
		vs.append("input").attr("name", "stop").attr("type", "button").attr("value","stop ").attr("onClick", "mainControl.stopPressed()"); */
		//vs.append("input").attr("name", "back").attr("type", "button").attr("value","back ").attr("onClick", "mainControl.backPressed()");
		tab2.select("#tab2Bot").append("input").attr("type","button").attr("value","Distribution Focus").attr("class","bluebutton").classed("distFocus",true).attr("id","distFocus").attr("disabled",null).attr("onClick","mainControl.distFocusToggle()").text("Distribution Focus")
		.style("height","15%");
	}

viewBase.prototype.loadMain = function(dataHeadings){
		var self = this;
		showHelp();
		d3.select(".controls").selectAll("*").remove();
		var tab1 = d3.select(".controls").append("div").attr("id","tab1").attr("class","tab");
		var tab2 = d3.select(".controls").append("div").attr("id","tab2").attr("class","tab");
		tab1.style("display","block");
		tab2.append("div").attr("class","tab2Divider").attr("id","tab2Top");
		tab2.append("div").attr("class","tab2Divider").attr("id","tab2Mid");
		tab2.append("div").attr("class","tab2Divider").attr("id","tab2Bot");
		// var backToMain = tab1.append("a").attr("name", "backToMain").attr("class","bluebutton").attr("value","mainButton").attr("id","mainButton").attr("href","../index.php").text("< Back To Main Menu");
		var backToMain = tab1.append("input").attr("name", "backToMain").attr("class","bluebutton").attr("value","< Back To Main Menu").attr("id","mainButton").text("< Back To Main Menu");

		var importFileB = tab1.append("input").attr("name", "importfiles").attr("type", "file").attr("value","import files").attr("id","importButton");
		var label = tab1.append("label").attr("for", "importButton").text("Choose a Local file").attr("class","bluebutton");

		var URLInput = tab1.append("input").attr("name", "URLInput").attr("type", "text").attr("placeholder","import data from...").attr("id","URLInput");
		var importFromURL = tab1.append("input").attr("name", "importURL").attr("type", "button").attr("value","Data from URL").attr("id","importURL").attr("class","bluebutton").text("Data from URL");

		var textInput = tab1.append("textarea").attr("name", "textInput").attr("type", "text").attr("placeholder","paste csv data here...").attr("id","textInput");
		var importFromText = tab1.append("input").attr("name", "importText").attr("type", "button").attr("value","Data from Text").attr("id","importText").attr("class","bluebutton").attr("disabled", "true").text("Data from Text");

		var importFromPreset = tab1.append("input").attr("name", "importPreset").attr("type", "button").attr("value","Example Data").attr("id","importPreset").attr("class","bluebutton").text("Example Data");
		var presetSelect = tab1.append("div").attr("id","presetSelect");

		var usePreset = tab1.append("input").attr("class","bluebutton").attr("name", "dataPreset").attr("type", "button").attr("value","Use test data").attr("id","dataPreset").attr("onClick","mainControl.loadTestData()").text("Use test data");

		var useJSON = tab1.append("input").attr("class","bluebutton").attr("name", "use_json").attr("type", "button").attr("value","Use JSON").attr("id","dataPreset").attr("onClick","mainControl.loadJSONData()").text("Use JSON");

		var container = tab1.append("div").attr("id","inputContainer").attr("class","selectContainer");
		var varSelector = tab1.append("div").attr("id","varSelector").attr("class","selectContainer");
		var focusContainer = tab1.append("div").attr("id","focusContainer").attr("class","selectContainer");
		var vSelectContainer = tab1.append("div").attr("id","vSelectContainer").attr("class","selectContainer");
		var IB = document.getElementById("importButton");
		IB.onchange = function(e){
			self.controller.impButPressed(e);
		}
		var selectMenu = d3.select("#inputContainer").append("select").attr("size",dataHeadings.length).attr("multiple","multiple").attr("id","selectMenu");
		d3.select("#varSelector").append("label").attr("for","varSelector").text("Select Variables");
		var selectMenuV1 = d3.select("#varSelector").append("select").attr("size",dataHeadings.length).attr("id","selectMenuV1");
		var selectMenuV2 = d3.select("#varSelector").append("select").attr("size",dataHeadings.length).attr("id","selectMenuV2");
		var SM = document.getElementById("selectMenu");
		SM.onchange = function(e){
			self.controller.varSelected(e);
		}
		var SMV1 = document.getElementById("selectMenuV1");
		SMV1.onchange = function(e){
			let e1 = e.target.selectedOptions;
			let e2 = d3.selectAll("#selectMenuV2 option[selected = true]")[0];
			self.controller.varDropdownSelected(e1, e2);
		}
		var SMV2 = document.getElementById("selectMenuV2");
		SMV2.onchange = function(e){
			console.log(e);
			let e1 = d3.selectAll("#selectMenuV1 option[selected = true]")[0];
			let e2 = e.target.selectedOptions;
			self.controller.varDropdownSelected(e1, e2);
		}
		// var urlButton = document.getElementById("importURL");
		// urlButton.onchange = function(e){
		// 	controller.loadFromURL(document.getElementById("URLInput").value);
		// }
		$("#mainButton").click(function(){
			postKeepingJSON("../index.php");
		 })
		$("#importURL").click(function(){
		 	self.controller.loadFromURL($("#URLInput").val());
		 })
		$("#importPreset").click(function(){
			d3.select("#presetSelect").selectAll("*").remove();
			self.controller.getPresets();

			//self.controller.loadFromText(data);
		})
		$("#presetSelect").on('click', '.presetItems', function(){
			var data = this.innerText;
			$(".presetItems").css("background-color","white");
			$(this).css("background-color", "steelblue");
			self.controller.loadFromPreset(data);
		})
		$("#importText").click(function(){
			var data = $("#textInput").val();
			self.controller.loadFromText(data);
		})
		$("#textInput").on('change keyup paste', function() {
			if(!$.trim($("#textInput").val())){
    			$("#importText").prop("disabled", true);
			}else{
				$("#importText").prop("disabled", false);
			}
		});

	}
viewBase.prototype.setupPresets = function(data){
	data.forEach(function(i){
		d3.select("#presetSelect").append("div").text(i).attr("class", "presetItems");
	});
}

viewBase.prototype.noVisAvail = function(){
		var svg = d3.select(".svg");

		svg.append("text")
			.attr("x", this.windowHelper.width/2)
			.attr("y", this.windowHelper.height/2)
			.text("No Visualisation Availiable")
			.attr("fill","grey")
			.style("font-size", this.windowHelper.height/20+"px")
			.attr("text-anchor","middle").style("opacity",0.6);
	}

viewBase.prototype.varSelected = function(e){
		d3.select("#helpBox").remove();
		d3.select("#startButton").attr("disabled", null);
		var vars = "";
		for(var i = 0; i<e.length;i++){
			vars = vars + " " +e[i].value;
		}
		d3.select("#variable").text("variable: " + vars+"; ");
	}
viewBase.prototype.focusSelector = function(headings, curCategory){
		var self = this;
		headings.sort();
		var focusContainer = d3.select("#focusContainer");
		focusContainer.append("label").attr("for","focusController").text("Choose Category to focus on.");
		var focusController = focusContainer.append("select").attr("size",headings.length).attr("id","focusController");
			headings.forEach(function(e){
			if(e != "NA"){
				focusController.append("option").attr("value",e).text(e);
			}
		});
		var SM = document.getElementById("focusController");
		SM.onchange = function(e){
			self.controller.focusSelected(e);
		}
	}
viewBase.prototype.makeVarSelector = function(cat1,cat2){
	var self = this;
		var vSelectContainer = d3.select("#vSelectContainer");
		vSelectContainer.append("label").attr("for","vSelectContainer").text("Choose variable to split on.")
		var vSelectController = vSelectContainer.append("select").attr("size",2).attr("id","vSelectController");
		vSelectController.append("option").attr("value",cat1).text(cat1);
		vSelectController.append("option").attr("value",cat2).text(cat2);

		var SM = document.getElementById("vSelectController");
		SM.onchange = function(e){
			self.controller.varChanged(e);
		}
	}
viewBase.prototype.destroyFocus = function(){
		d3.select("#focusContainer").selectAll("*").remove();
	}
viewBase.prototype.destroyVSelect = function(){
		d3.select("#vSelectContainer").selectAll("*").remove();
	}
viewBase.prototype.finishSetUp = function(){
		//d3.select("#startButton").style("background-color","green");
		this.makeButtons();
		//var tab1 = d3.select("#tab1");
		//tab1.style("display","none");
	}
viewBase.prototype.setUpDataVeiw = function(dataHeadings){

		d3.select("#file").text("file: " + this.controller.model.fileName +"; ");
		var selectMenu = d3.select("#inputContainer select").attr("size",dataHeadings.length).attr("multiple","multiple");
		var selectMenuv1 = d3.select("#selectMenuV1").attr("size", 1);
		var selectMenuv2 = d3.select("#selectMenuV2").attr("size", 1);

		selectMenu.selectAll("*").remove();
		selectMenuv1.selectAll("*").remove();
		selectMenuv2.selectAll("*").remove();
		selectMenu.append("option").attr("value","placeholder").text("Please Choose a variable").attr("disabled",true).attr("selected",true).attr("hidden",true);
		selectMenuv1.append("option").attr("value","placeholder").text("Please Choose a variable").attr("disabled",true).attr("selected",true).attr("hidden",true);
		selectMenuv2.append("option").attr("value","placeholder").text("Please Choose a variable").attr("selected",true);
		dataHeadings.forEach(function(e){
			selectMenu.append("option").attr("value",e).text(e[0]+" ("+e[1]+")").attr("data", true);
			selectMenuv1.append("option").attr("value",e).text(e[0]+" ("+e[1]+")").attr("data", true);
			selectMenuv2.append("option").attr("value",e).text(e[0]+" ("+e[1]+")").attr("data", true);
		});

		d3.select("#startButton").remove();
		d3.select("#tab1").append("input").attr("type","button").attr("value","Analyse").attr("class","bluebutton").attr("id","startButton").attr("disabled","true").attr("onClick","mainControl.switchTab2()").text("Analyse");
	}

viewBase.prototype.setVarSelected = function(selected_variables){
	var selectMenuv1 = d3.select("#selectMenuV1");
	var selectMenuv2 = d3.select("#selectMenuV2");
	var selectMenuOptions = d3.selectAll("#selectMenu option")[0];
	var selectMenuV1Options = d3.selectAll("#selectMenuV1 option")[0];
	var selectMenuV2Options = d3.selectAll("#selectMenuV2 option")[0];
	var1Text = "placeholder";
	if([...selected_variables].length > 0){
		var1Text = [...selected_variables][0].value;
	}

	for(let i = 0; i < selectMenuOptions.length; i++){
		let option = selectMenuOptions[i]
		if(option.value == var1Text){
			option.setAttribute("selected",true);
		}else{
			option.removeAttribute("selected",false);
		}
	}

	for(let i = 0; i < selectMenuV1Options.length; i++){
		let option = selectMenuV1Options[i]
		if(option.value == var1Text){
			option.setAttribute("selected",true);
		}else{
			option.removeAttribute("selected",false);
		}
	}

	var2Text = "placeholder";
	if([...selected_variables].length > 1){
		var2Text = [...selected_variables][1].value;
	}
	for(let i = 0; i < selectMenuV2Options.length; i++){
		let option = selectMenuV2Options[i]

		if(option.value == var2Text){
			option.setAttribute("selected",true);
		}else{
			option.removeAttribute("selected",false);
		}
	}
	for(let i = 0; i < selectMenuOptions.length; i++){
		let option = selectMenuOptions[i]
		if(option.value == var1Text | option.value == var2Text){
			option.setAttribute("selected",true);
		}else{
			option.removeAttribute("selected",false);
		}
	}
	


}
viewBase.prototype.setUpStatSelection = function(category){
		var statSelection = d3.select("#statSelect");
		statSelection.selectAll("*").remove();
		var selectFirst = true;
		category.forEach(function(c){
			var nO = statSelection.append("option").attr("value",c).text(c);
			if(selectFirst){
				//nO.attr("selected","selected");
				selectFirst=false;
			}
		});
		statSelection.attr("value", 'Mean');
	}
viewBase.prototype.unPause = function(incDist){
		if(incDist){
			var tab = d3.select("#visControls2");
		}else{
			var tab = d3.select("#visControls1");
		}
		tab.select(".goButton").attr("disabled",null);
	}
viewBase.prototype.startedVis = function(incDist){
		d3.selectAll(".goButton").attr("disabled","true");
		d3.select("#pauseButton").remove();
		if(incDist){
			var tab = d3.select("#visControls2");
		}else{
			var tab = d3.select("#visControls1");
		}
		tab.select(".goButton").style("display","none");
		// tab.append("input").attr("type","button").attr("value","Pause").classed("bluebutton", true).attr("id","pauseButton").attr("disabled",null).attr("onClick","mainControl.pause()").style("height","15%");
		tab.append("input").attr("type","button").attr("value","Pause").classed("bluebutton", true).attr("id","pauseButton").attr("disabled",null).attr("onClick","mainControl.pause()").text("Pause");
	}
viewBase.prototype.doneVis = function(){
		d3.select("#pauseButton").remove();
		d3.selectAll(".goButton").attr("disabled",null).style("display","block");
	}
viewBase.prototype.tSDisable = function(){
		d3.select("#cBoxLabel").classed("disabled", true);
		d3.select("#trackCBox").attr("disabled",true);
	}
viewBase.prototype.tSUnDisable = function(){
		d3.select("#cBoxLabel").classed("disabled", null);
		d3.select("#trackCBox").attr("disabled",null);
	}
viewBase.prototype.fadeOn = function(){
		d3.select(".svg").append("rect").attr("id","fadeBox").attr("x",this.windowHelper.sampleSection-5).attr("y",this.windowHelper.section1.bottom + this.windowHelper.section1.height/10).attr("width", this.windowHelper.width).attr("height",this.windowHelper.height).style("opacity",0.8).style("fill","#F5F5F5");
	}
viewBase.prototype.fadeOff = function(){
		d3.select("#fadeBox").remove();
	}
viewBase.prototype.distFocus = function(){
		d3.select("#distFocus").text("Window Focus");
		d3.select("#distFocus").attr("value", "Window Focus");
	}
viewBase.prototype.distFocusOff = function(){
		d3.select("#distFocus").text("Distribution Focus");
		d3.select("#distFocus").attr("value", "Distribution Focus");
	}


function getJSONPostStringFromHTML(){
	let json_script = document.getElementById('json_post_data');
	let json_data = json_script.textContent;
	return json_data
}
function getJSONURLStringFromHTML(){
	let json_script = document.getElementById('json_url_data');
	let json_data = json_script.textContent;
	return json_data
}

function getJSONStringFromHTML(){
	// Check post data
	let json_data = getJSONPostStringFromHTML();

	// If no post data, try checking if URL data was set
	if (json_data.length == 0){
		json_script = getJSONURLStringFromHTML()
	}
	return json_data;
}


function getJSONPostFromHTML(){
	let jsonStr = getJSONPostStringFromHTML();
	let decoded = decodeHtml(jsonStr);
	return decoded ? JSON.parse(decoded) : null;
}

function getJSONURLFromHTML(){
	let jsonStr = getJSONURLStringFromHTML();
	let decoded = decodeHtml(jsonStr);
	return decoded ? JSON.parse(decoded) : null;
}
