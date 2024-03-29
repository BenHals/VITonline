
class sv_oneNum extends visBase {
	constructor(inputData, headingGroup, headingContinuous, statistic) {
		super(inputData, headingGroup, headingContinuous, statistic);
		this.windowHelper = setUpWindow3({'left':5, 'right':5, 'top':5, 'bottom':5}, false);
		// text labels for each section.
        this.sectionLabels = ['Data','Sample','Sampling Distribution'];
		this.sampleStatType = 'value';
		this.sampleSize = 20;
		this.calcLargeCI = false;
		//this.animationList = [this.populationDropDown,this.buildList, this.fadeIn, this.endNoDist, this.distDrop, this.endDist ];
		this.animationList = [this.populationDropDown.bind(this),
						this.fadeIn.bind(this), 
						this.endNoDist.bind(this), 
						this.distDrop.bind(this),
						this.endDist.bind(this)];
	}

	setUpPopCategory(items, scale, radius, top, bottom){
		// Sets the y value for all population circles in the category to make it look heaped. 
		heapYValues3(items, scale, radius, 0, top,bottom);
	}

	getSampleSize(){
		this.sampleSize = d3.select("#sampsize").property("value");
		return Math.min(this.sampleSize, this.allPop.length);
	}
	makeSample(populations, numSamples, sampleSize, statistic, saveSample){
		this.samples = [];
		let sample = [];
		for(var i = 0; i<numSamples;i++){
			// this.samples.push([[]]);
			let sample = [[]];
			var stats = [];

			var indexs = pickRand(sampleSize, this.allPop.length);
			for(var k = 0; k<sampleSize;k++){
				let s_item = {...this.allPop[indexs[k]]};
				s_item.order = k;
				sample[0].push(s_item);
			}

			this.handleSample(i, sample);
			if(saveSample){
				this.samples.push(sample);
			}
		}
	}
	setUpSampleCategory(items, scale, radius, sample, top, bottom){
		// Sets the y value for all population circles in the category to make it look heaped. 
		heapYValues3(items, scale, radius, sample, top,bottom);
	}
	fillBaseSampleSection(placeInto){
		return;
	}

	cleanUpRepitition(){
		var self = this;
		d3.selectAll(".memLine").style("opacity",0.2).style("stroke","darkgrey").attr("y2", function(){ return d3.select(this).attr("y1")-self.windowHelper.lineHeight*2});
		d3.selectAll("#diffLine").remove();
	}
	setUpCI(statList){
			var CISplit = Math.abs(this.populationStatistic - statList[this.numSamples*0.95]);
			for(var k = 0; k < this.numSamples;k++){
				if(Math.abs(this.populationStatistic - this.sampleStatistics[k].value) >= CISplit){
					this.sampleStatistics[k].inCI = false;
				}else{
					this.sampleStatistics[k].inCI = true;
				}
			}
			this.CISplit = CISplit;
	}
	showCI(num, large){
		var self = this;
		var CIVar = this.CISplit;
		var svg = d3.select(".svg");
		if(num == "10000"){
			CIVar = this.LargeCISplit;
		}
		var container = svg.append("svg").attr("id","CISplitContainer");

		var middle = this.windowHelper.graphSection.S1.displayArea.getMiddleHeight();

        container.append("text").attr("x", self.sampleStatScale(self.populationStatistic)).attr("y", self.windowHelper.graphSection.S3.axisArea.y2).text(Math.round(self.populationStatistic*100)/100).style("stroke","blue").style("opacity",1).attr("dominant-baseline","hanging");
        container.append("line").attr("x1", self.sampleStatScale(self.populationStatistic)).attr("x2", self.sampleStatScale(self.populationStatistic)).attr("y1", self.windowHelper.graphSection.S3.displayArea.y2 - self.windowHelper.graphSection.S3.axisArea.height/2).attr("y2", self.windowHelper.graphSection.S3.axisArea.y2).style("stroke-width", 2).style("stroke", "blue");

        var visibleCircles = d3.selectAll(".notInCI").filter(function(){
            return this.attributes["fill-opacity"].value == "1";
        });
        visibleCircles.style("opacity",0.2).transition().duration(500).each("end",function(d,i){
            if(i==0){
            drawArrowDown(self.windowHelper.graphSection.S3.axisArea.y2, self.windowHelper.graphSection.S3.displayArea.y2 - self.windowHelper.graphSection.S3.displayArea.height/2, self.sampleStatScale(self.populationStatistic-CIVar), container, "ciDownArrow", 1, "red",0.75);
            drawArrowDown(self.windowHelper.graphSection.S3.axisArea.y2, self.windowHelper.graphSection.S3.displayArea.y2 - self.windowHelper.graphSection.S3.displayArea.height/2, self.sampleStatScale(self.populationStatistic+CIVar), container, "ciDownArrow", 1, "red",0.75);
            //d3.select("#CISplit").append("line").attr("y1",self.windowHelper.section3.bottom - self.windowHelper.section3.height/4).attr("y2",self.windowHelper.section3.bottom + self.windowHelper.section3.height/10).attr("x1",self.xScale2(self.populationStatistic-self.CISplit)).attr("x2",self.xScale2(self.populationStatistic-self.CISplit)).style("stroke","red");
            //d3.select("#CISplit").append("line").attr("y1",self.windowHelper.section3.bottom - self.windowHelper.section3.height/4).attr("y2",self.windowHelper.section3.bottom + self.windowHelper.section3.height/10).attr("x1",self.xScale2(self.populationStatistic+self.CISplit)).attr("x2",self.xScale2(self.populationStatistic+self.CISplit)).style("stroke","red");
            container.append("text").attr("y",self.windowHelper.graphSection.S3.axisArea.y2).attr("x",self.sampleStatScale(self.populationStatistic+CIVar)).text(Math.round((self.populationStatistic+self.CISplit)*100)/100).style("stroke","red").style("fill", "red").style("font-size", 12).attr("dominant-baseline","hanging");
            container.append("text").attr("y",self.windowHelper.graphSection.S3.axisArea.y2).attr("x",self.sampleStatScale(self.populationStatistic-CIVar)).text(Math.round((self.populationStatistic-self.CISplit)*100)/100).style("stroke","red").style("fill", "red").style("font-size", 12).attr("dominant-baseline","hanging")
                .transition().duration(500).each("end",function(){
                    container.append("line").attr("y1",self.windowHelper.graphSection.S3.displayArea.y1 + self.windowHelper.graphSection.S3.displayArea.height/2).attr("y2",self.windowHelper.graphSection.S3.displayArea.y1 + self.windowHelper.graphSection.S3.displayArea.height/2).attr("x1",self.sampleStatScale(self.populationStatistic-self.CISplit)).attr("x2",self.sampleStatScale(self.populationStatistic+self.CISplit)).style("stroke","red").style("stroke-width",5);

                });
            }
        });


	}
	showLargeCI() {
		var self = this;
		var tailText = d3.select("#tailCountText");
		if(tailText[0][0] != null){
			tailText.text(self.largeTailSize + " / 10000 = " + self.largeTailSize/10000)	
		}else{
			this.showCI("10", true);
		}
	}


	// *****************************ANIMATIONS********************************

	populationDropDown(settings, currentAnimation){
		var self = this;
		this.showSteps = false;
        for (let s of settings.sample){
            s.upTo = settings.indexUpTo + 1;
        }
		// Delete Old elements
		d3.select("#circleOverlay").selectAll("circle").data([]).exit().remove();
		var circleOverlay = settings.drawArea.select("#circleOverlay").selectAll("g").data([]);
		circleOverlay.exit().remove();

		// Add new elements in, appear on top of original population.
		circleOverlay = settings.drawArea.select("#circleOverlay").selectAll("circle").data(settings.sample);
		var circles = circleOverlay.enter().append("circle");
		circles.attr("class", "move")
	    .attr("cx", function(d, i) { 
	    	return settings.goSlow? d.xPerSample[0] : d.xPerSample[d.upTo]; })
	    .attr("cy", function(d) {
	    	return settings.goSlow? d.yPerSample[0] : d.yPerSample[d.upTo];
        })
        .attr("data-popID", function(d){
            return d.id;
        })
	    .attr("r", function(d) { return self.windowHelper.radius; })
	    .attr("fill-opacity", settings.goSlow? 0 : 1)
	    .attr("stroke", "#556270")
	    // .attr("stroke-opacity", settings.goSlow? 0 : 1)
	    .style("fill", "darkgrey").attr("class",function(d){return "c"+d.order});

		
		var powScale = d3.scale.pow();
		powScale.exponent(4);
		powScale.domain([0,settings.delay*2]);
		var fillInTime = this.transitionSpeed/1000;
		this.settings.circleOverlay = circleOverlay;
		this.settings.powScale = powScale;
		
		if(settings.goSlow){
			circleOverlay = circleOverlay.transition().delay(function(d,i){
				//return delay*2/sample.length * sample.indexOf(d)
				var test1 =settings.sample.indexOf(d);
				var test = (powScale.invert(test1 +2 )- powScale.invert(1 )) * fillInTime;
				return test;
			}).duration(settings.fadeIn).style("fill", "#FF7148").attr("fill-opacity", 1)
			.transition().duration(function(d,i){return settings.delay*2/settings.sample.length * (settings.sample.length - settings.sample.indexOf(d))}).each('end', function(d, i){
				if(d == settings.sample[0]){
					self.dropDown(settings, currentAnimation)
				}
			});
		}else{
			// circleOverlay = circleOverlay.style("fill", "#FF7148").attr("fill-opacity", 1).transition().duration(1).each('end', function(d, i){
			circleOverlay = circleOverlay.attr("fill-opacity", 1).transition().duration(1).each('end', function(d, i){
				if(d == settings.sample[0]){
					self.dropDown(settings, currentAnimation)
				}
			});
		}
		
	}

	// this.fadeIn = function(settings){
	// 	this.animationState = 1;
	// 	this.settings = settings;
	// 	if(!this.settings.restarting){
	// 		var sentFinish = false;

	// 		var self = this;
	// 		settings.sample = this.samples[settings.indexUpTo];
	// 		settings.svg = d3.select(".svg");
	// 		this.settings = settings;
	// 		var mLines = settings.svg.select(".sampleLines").selectAll("line").data(this.drawnMeans);
	// 		var opacity = 1;
	// 		if(settings.repititions == 1000) opacity = 0.2;
	// 		mLines.style("opacity",opacity).style("stroke", "steelblue").attr("y2", this.windowHelper.graphSection.S2.getDivisions(3)[0][1] +5);
	// 		var circle = settings.svg.select(".pop").selectAll("circle").attr("cy", function(d, i){return d.yPerSample[0];}).style("fill", "#C7D0D5").attr("fill-opacity",0.2);
	// 		//settings.svg.select(".sampleLines").selectAll("line").style("opacity",0.2).style("stroke", "steelblue").attr("y2", this.windowHelper.graphSection.S2.getDivisions(3)[0][1] +5);
	// 		var powScale = d3.scale.pow();
	// 		powScale.exponent(4);
	// 		powScale.domain([0,settings.delay*2]);

	// 		var circleOverlay = settings.svg.select("#circleOverlay").selectAll("circle").data(settings.sample, function(d){return d.id});
	// 			circleOverlay.attr("fill-opacity",0);
	// 			circleOverlay.exit().remove();
	// 			circleOverlay.enter().append("circle")
	// 		    .attr("cx", function(d, i) { 
	// 		    	return d.xPerSample[0]; })
	// 		    .attr("cy", function(d) {
	// 		    	return d.yPerSample[0];
	// 		    })
	// 		    .attr("r", function(d) { return self.radius; })
	// 		    .attr("fill-opacity", 0)
	// 		    .attr("stroke","#556270")
	// 		    .attr("stroke-opacity",1)
	// 		    .style("fill","#FF7148");
	// 	    var fillInTime = this.transitionSpeed/this.baseTransitionSpeed;
	// 	    this.settings.circleOverlay = circleOverlay;
	// 	    this.settings.powScale = powScale;
	// 	}else{
	// 		var circleOverlay = this.settings.circleOverlay;
	// 		var powScale = this.settings.powScale;
	// 		var self = this;
	// 	    var fillInTime = this.transitionSpeed/this.baseTransitionSpeed;
	// 	    this.settings.restarting = false;
	// 	}
	// 	if(settings.goSlow){
	// 		circleOverlay = circleOverlay.transition().delay(function(d,i){
	// 				//return delay*2/sample.length * sample.indexOf(d)
	// 				var test1 =settings.sample.indexOf(d);
	// 				var test = (powScale.invert(test1 +2 )- powScale.invert(1 )) * fillInTime;
	// 				return test;
	// 			}).duration(settings.fadeIn).style("fill", "#FF7148").attr("fill-opacity", 1)
	// 			.transition().duration(function(d,i){return settings.delay*2/settings.sample.length * (settings.sample.length - settings.sample.indexOf(d))}).each('end', function(d, i){
	// 				if(d == settings.sample[0]){
	// 					self.dropDown(settings)
	// 					sentFinish = true;
	// 				}
	// 			});
	// 	}else{
	// 		circleOverlay = circleOverlay.style("fill", "#FF7148").attr("fill-opacity", 1).transition().duration(1).each('end', function(d, i){
	// 				if(d == settings.sample[0]){
	// 					self.dropDown(settings)
	// 					sentFinish = true;
	// 				}
	// 			});
	// 	}
	// }

	 dropDown(settings, currentAnimation){
		if(!this.settings.restarting){
			var sentFinish = false;

			var self = this;

			var circleOverlay = this.settings.circleOverlay;

			// var sampMean = this.preCalculatedTStat.slice(settings.indexUpTo, settings.indexUpTo+settings.jumps);
			// if(sampMean.length > 1){
			// 	this.drawnMeans = this.drawnMeans.concat(sampMean.slice(0,-1));
			// 	mLines = settings.svg.select(".sampleLines").selectAll("line").data(this.drawnMeans);
			// 	mLines.enter().append("line").attr("y1", this.windowHelper.graphSection.S2.getDivisions(3)[0][1]+this.windowHelper.lineHeight).attr("y2", this.windowHelper.graphSection.S2.getDivisions(3)[0][1] -this.windowHelper.lineHeight).attr("x1", function(d){return self.xScale(d.value)}).attr("x2", function(d){return self.xScale(d.value)}).style("stroke-width", 2).style("stroke", "green").style("opacity", 1);
				
			// 	//mLines.style("opacity",0.2).style("stroke", "steelblue").attr("y2", this.windowHelper.graphSection.S2.getDivisions(3)[0][1] +5);
			// 	this.drawnMeans.push(sampMean[sampMean.length-1]);
			// }else{
			// 	this.drawnMeans = this.drawnMeans.concat(sampMean);
			// }
			// var mLines = settings.svg.select(".sampleLines").selectAll("line").data(this.drawnMeans);
			// var opacity = 1;
			// if(settings.repititions == 1000) opacity = 0.2;
			// mLines.style("opacity",opacity).style("stroke", "steelblue").attr("y2", this.windowHelper.graphSection.S2.getDivisions(3)[0][1] +5);
			// var meanLines = mLines.enter().append("line").attr("y1", this.windowHelper.graphSection.S2.getDivisions(3)[0][1]+this.windowHelper.lineHeight).attr("y2", this.windowHelper.graphSection.S2.getDivisions(3)[0][1]-this.windowHelper.lineHeight).attr("x1", function(d){return self.xScale(d.value)}).attr("x2", function(d){return self.xScale(d.value)}).style("stroke-width", 2).style("stroke", "green").style("opacity", 0);

			// this.settings.circle = circle;
			// this.settings.sampMean = sampMean;
			// this.settings.mLines = mLines;
			// this.settings.meanLines = meanLines;

		}else{
			var self = this;
			var circle = this.settings.circle;
			var sampMean = this.settings.sampMean;
			var mLines = this.settings.mLines;
			var meanLines = this.settings.meanLines;
			this.settings.restarting = false;
			var circleOverlay = this.settings.circleOverlay;
		}

		
		if(settings.goSlow){
			circleOverlay = circleOverlay.transition().duration(settings.fadeIn).style("fill", "#FF7148").attr("fill-opacity", 1)
					.transition().duration(settings.pauseDelay)
					.transition().duration(this.transitionSpeed).style("fill", "darkgrey").attr("cy", function(d, i){return d.yPerSample[settings.indexUpTo+1]})
					.each('end', function(d, i){
						if(d == settings.sample[0]){
							self.animationController(settings, currentAnimation);
						}
					});

				// meanLines = meanLines.transition().duration(settings.fadeIn)
				// 	.transition().duration(settings.pauseDelay * 2)
				// 	.transition().duration(this.transitionSpeed).style("opacity",1).attr("y1", this.windowHelper.graphSection.S2.getDivisions(3)[0][1]+this.windowHelper.lineHeight).attr("y2", this.windowHelper.graphSection.S2.getDivisions(3)[0][1] -this.windowHelper.lineHeight)


		}else{
			circleOverlay = circleOverlay.attr("cy", function(d, i){return d.yPerSample[settings.indexUpTo+1]}).attr("fill-opacity", 1)
				.transition().duration(this.transitionSpeed * 2)
				.each('end', function(d, i){
						if(d == settings.sample[0]){
							self.animationController(settings, currentAnimation);
						}
					});

				// meanLines = meanLines.attr("y1", this.windowHelper.graphSection.S2.getDivisions(3)[0][1]+this.windowHelper.lineHeight).attr("y2", this.windowHelper.graphSection.S2.getDivisions(3)[0][1] -this.windowHelper.lineHeight).style("stroke", "green").style("opacity",1);
		}
		

	}

	fadeIn(settings, currentAnimation){
		sharedSingleFadeIn.apply(this, [settings, currentAnimation]);
	}


	distDrop(settings, currentAnimation){
		sharedSingleStatDistDrop.apply(this, [settings, currentAnimation]);
	}
}

