
// objeto = player = MusicTest;

function MusicTest(color, audioPlayerID) {
	
    var r = GeneralObject();
	
	r.colors = {U:{r:226,g:80,b:231}, D:{r:80,g:231,b:115}, L:{r:231,g:186,b:80}, R:{r:80,g:162,b:231}};
	r.deltaTime = 0;
	r.previousDeltaTime = 0;
	r.bpm = 150; // n compasses per minute = n/60 compasses per second
	r.currentCompass = 1;
	r.currentCompassLagged = 1;
	r.currentCompassAcTime = 0;
    r.x = canvazator.stage.width;
    r.y = canvazator.stage.height/2;
	r.beatDecay = 25; // percentage of compass
	r.radius=15;
    r.color = (color == undefined ? "#F00" : color);
    r.setClass("MusicTest");
	r.arrowSize = Math.round(canvazator.stage.width/40);
	r.lag = 140; // ms
	r.performedRitual = false;
	r.performedRitualUnitIndex = null;
	r.isPerformedRitualMana = false;
	r.stackedUnitsIndexes = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10];
	r.stackedMana = 12;
	r.manaRitual = ["L","L","U","L"];
	r.lives = 100;
	
	// tirar cheat
	//*
	r.lives = 4;
	r.stackedUnitsIndexes = [0,1,2];
	r.stackedMana = 2;
	// */
	
	if (audioPlayerID == undefined || audioPlayerID.length == 0) {
		throw "Erro - música não encontrada";
	}
	r.audioPlayerObj = $("#"+audioPlayerID)[0];
	
	r.pressDecay=9;
	r.pressSize=40;
	r.currentPressSize=0;
	
	r.keySequence = [];
	
	r.startCompass;
	r.previousCompass;
	r.maxCompassAcTime;
	r.AcTimeDecayLimiar;
	r.keyOffset;
	r.keepSequence = false;
	
	
	r.bgimage = canvazator.imgCache.stageLayout;
	r.manaImage = canvazator.imgCache.manaIcon;
	r.state
	r.states = {
		STATE_PLAYING : 1,
		STATE_PAUSED : 2
	}
	
	
	// =================== - =================
	
	r.calcCompass = function(currentTime) {
		return Math.floor( (currentTime/60)*this.bpm );
	}
	r.breakCombo = function() {
		
	}
	r.command = function(direction) {
		this.keyOffset = this.currentCompassAcTime/this.maxCompassAcTime;
		this.currentPressSize = this.pressSize;
		if (this.keepSequence == true) {
			this.keepSequence = false;
			this.breakCombo();
			this.keySequence = [];
		} else {
			this.keepSequence = true;
		}
		this.keySequence.push(direction);
		
		if (this.keySequence.join() == this.manaRitual.join() || this.keySequence.join().substr(-7) == this.manaRitual.join()) {
			this.isPerformedRitualMana = true;
			this.performedRitual = true;
		}
		for (var i=0; i<Units.length; i++) {
			if (Units[i].attributes.ritual.join() == this.keySequence.join() || Units[i].attributes.ritual.join() == this.keySequence.join().substr(-7)) {
				this.performedRitual = true;
				this.performedRitualUnitIndex = i;
			}
		}
	}
	
	r.whenStart(function() {
		this.state = this.states.STATE_PLAYING;
		this.bps = this.bpm/60;
		var date = new Date();
		var currentTime = this.audioPlayerObj.currentTime;
		this.currentCompass = this.calcCompass(currentTime);
		this.startCompass = this.currentCompass;
		this.previousCompass = this.currentCompass-1;
		this.audioPlayerObj.play();
		this.audioPlayerObj.loop = true;
		this.maxCompassAcTime = (currentTime/60)*this.bpm-this.startCompass;
		this.AcTimeDecayLimiar = this.maxCompassAcTime*this.beatDecay/100;
	});
	r.whenUpdate(function() {
		var date = new Date();
		var currentTime = this.audioPlayerObj.currentTime;
		this.deltaTime = currentTime - this.previousDeltaTime;
		this.currentCompassAcTime += this.deltaTime;
		
		this.currentCompass = this.calcCompass(currentTime) - this.startCompass;
		this.currentCompassLagged = this.calcCompass(currentTime-this.lag) - this.startCompass;
		if (this.previousCompass != this.currentCompassLagged) {
			this.previousCompass = this.currentCompassLagged;
			//console.log(this.currentCompass%4);
			this.currentCompassAcTime = 0;
			if (this.keepSequence == false) {
				this.keySequence = [];
				this.breakCombo();
			}
			this.keepSequence = false;
			
			if (this.keySequence.length > 12) {
				this.keySequence = [];
				this.breakCombo();
			}
			
			if (this.performedRitual == true) {
				this.performedRitual = false;
				if (this.isPerformedRitualMana) {
					this.stackedMana = this.stackedMana>=5?5:this.stackedMana+1;
				} else {
					if (this.stackedMana >= Units[this.performedRitualUnitIndex].attributes.mana && this.stackedUnitsIndexes.length<7) {
						this.stackedUnitsIndexes.push(this.performedRitualUnitIndex);
						this.stackedMana -= Units[this.performedRitualUnitIndex].attributes.mana;
					}
				}
				this.performedRitualUnitIndex = null;
				this.isPerformedRitualMana = false;
				this.keySequence = [];
				this.keepSequence = false;
			}
		}
		
		if (this.currentPressSize>0) this.currentPressSize-=this.pressDecay;
		if (this.currentPressSize<0) this.currentPressSize=0;
		
		this.previousDeltaTime = currentTime;
	});
	r.whenDraw(function(g) {
		var beaty = this.maxCompassAcTime + 1 + this.currentCompassAcTime/-0.8;
		
		
        g.drawImage(this.bgimage, 0, 0, canvazator.stage.width, canvazator.stage.height);
		
		for (var i=0; i<this.stackedMana; i++) {
			g.drawImage(this.manaImage, this.x*0.168, this.y*0.68 + i*canvazator.stage.width*0.05, canvazator.stage.width*0.04, canvazator.stage.width*0.04);
		}
		for (var i=0; i<this.stackedUnitsIndexes.length; i++) {
			var imgName = Units[this.stackedUnitsIndexes[i]].slug+"_icon";
			var imgObj = canvazator.imgCache[imgName];
			g.drawImage(imgObj, this.x*0.036, this.y*0.63 + i*canvazator.stage.width*0.05, canvazator.stage.width*0.071, canvazator.stage.width*0.071);
		}
		
		//console.log(beaty);
		g.strokeStyle = "rgba(255,255,255,"+beaty+")";
		
        /*
		g.beginPath();
        g.arc(r.x*(r.currentCompass%4+1)/5, r.y*0.7, r.currentPressSize, 0, 2 * Math.PI, false);
		g.fillStyle = "blue";
        g.fill();
		
        g.beginPath();
        g.arc(r.x*0.2, r.y*0.7, r.radius + ((r.currentCompass%4==0)?(beaty):0) , 0, 2 * Math.PI, false);
		g.fillStyle = r.color;
        g.fill();
		
        g.beginPath();
        g.arc(r.x*0.4, r.y*0.7, r.radius + ((r.currentCompass%4==1)?(beaty):0) , 0, 2 * Math.PI, false);
		g.fillStyle = r.color;
        g.fill();
		
        g.beginPath();
        g.arc(r.x*0.6, r.y*0.7, r.radius + ((r.currentCompass%4==2)?(beaty):0) , 0, 2 * Math.PI, false);
		g.fillStyle = r.color;
        g.fill();
		
        g.beginPath();
        g.arc(r.x*0.8, r.y*0.7, r.radius + ((r.currentCompass%4==3)?(beaty):0) , 0, 2 * Math.PI, false);
		g.fillStyle = r.color;
        g.fill();
		*/
		
		g.lineWidth = 3;
		for (var i=0; i<r.keySequence.length; i++) {
			g.beginPath();
			g.strokeStyle = "rgba(255,255,255,"+beaty+")";
			g.fillStyle = "rgba("+r.colors[r.keySequence[i]].r+","+r.colors[r.keySequence[i]].g+","+r.colors[r.keySequence[i]].b+","+beaty+")";
			var arws = r.arrowSize;
			if (this.performedRitual) {
				strokeStyle = "yellow";
				g.fillStyle = "yellow";
				arws*=1.2;
			}
			var cX = arws*8 + arws*2.2*(i+1)
			var cY = r.y*0.2;
			if (r.keySequence[i] == "U") {
				g.moveTo(cX-arws*0.5,cY);
				g.lineTo(cX-arws,cY);
				g.lineTo(cX,cY-arws);
				g.lineTo(cX+arws,cY);
				g.lineTo(cX+arws*0.5,cY);
				g.lineTo(cX+arws*0.5,cY+arws);
				g.lineTo(cX-arws*0.5,cY+arws);
				g.closePath();
			}
			if (r.keySequence[i] == "R") {
				g.moveTo(cX+arws,cY);
				g.lineTo(cX,cY+arws);
				g.lineTo(cX,cY+arws*0.5);
				g.lineTo(cX-arws,cY+arws*0.5);
				g.lineTo(cX-arws,cY-arws*0.5);
				g.lineTo(cX,cY-arws*0.5);
				g.lineTo(cX,cY-arws);
				g.closePath();
			}
			if (r.keySequence[i] == "D") {
				g.moveTo(cX-arws*0.5,cY);
				g.lineTo(cX-arws,cY);
				g.lineTo(cX,cY+arws);
				g.lineTo(cX+arws,cY);
				g.lineTo(cX+arws*0.5,cY);
				g.lineTo(cX+arws*0.5,cY-arws);
				g.lineTo(cX-arws*0.5,cY-arws);
				g.closePath();
			}
			if (r.keySequence[i] == "L") {
				g.moveTo(cX-arws,cY);
				g.lineTo(cX,cY+arws);
				g.lineTo(cX,cY+arws*0.5);
				g.lineTo(cX+arws,cY+arws*0.5);
				g.lineTo(cX+arws,cY-arws*0.5);
				g.lineTo(cX,cY-arws*0.5);
				g.lineTo(cX,cY-arws);
				g.closePath();
			}
			g.stroke();
			g.strokeStyle = "rgba("+r.colors[r.keySequence[i]].r+","+r.colors[r.keySequence[i]].g+","+r.colors[r.keySequence[i]].b+","+beaty+")";
		g.fill();
		}
		g.lineWidth = 6;
		
		g.beginPath();
		g.moveTo((3*beaty),(3*beaty));
		g.lineTo(canvazator.stage.width-(3*beaty),(3*beaty));
		g.lineTo(canvazator.stage.width-(3*beaty),canvazator.stage.height-(3*beaty));
		g.lineTo((3*beaty),canvazator.stage.height-(3*beaty));
		g.closePath();
		g.stroke();
		
		//draw lanes for debug 
		/*	
		g.beginPath();
		g.moveTo(r.x*0.243,r.y*0.5);
		g.lineTo(r.x*0.98,r.y*0.5);
		g.lineTo(r.x*0.98,r.y*0.76);
		g.lineTo(r.x*0.243,r.y*0.76);
		g.fillStyle = "rgba("+r.colors.U.r+","+r.colors.U.g+","+r.colors.U.b+",0.2)";
		g.fill();
		//
		g.beginPath();
		g.moveTo(r.x*0.243,r.y*0.76);
		g.lineTo(r.x*0.98,r.y*0.76);
		g.lineTo(r.x*0.98,r.y*1.01);
		g.lineTo(r.x*0.243,r.y*1.01);
		g.fillStyle = "rgba("+r.colors.D.r+","+r.colors.D.g+","+r.colors.D.b+",0.2)";
		g.fill();
		//
		g.beginPath();
		g.moveTo(r.x*0.243,r.y*1.01);
		g.lineTo(r.x*0.98,r.y*1.01);
		g.lineTo(r.x*0.98,r.y*1.29);
		g.lineTo(r.x*0.243,r.y*1.29);
		g.fillStyle = "rgba("+r.colors.L.r+","+r.colors.L.g+","+r.colors.L.b+",0.2)";
		g.fill();
		//
		g.beginPath();
		g.moveTo(r.x*0.243,r.y*1.29);
		g.lineTo(r.x*0.98,r.y*1.29);
		g.lineTo(r.x*0.98,r.y*1.59);
		g.lineTo(r.x*0.243,r.y*1.59);
		g.fillStyle = "rgba("+r.colors.R.r+","+r.colors.R.g+","+r.colors.R.b+",0.2)";
		g.fill();
		//
		g.beginPath();
		g.moveTo(r.x*0.243,r.y*1.59);
		g.lineTo(r.x*0.98,r.y*1.59);
		g.lineTo(r.x*0.98,r.y*1.915);
		g.lineTo(r.x*0.243,r.y*1.915);
		g.fillStyle = "rgba("+r.colors.D.r+","+r.colors.U.g+","+r.colors.L.b+",0.2)";
		g.fill();
		*/
		
		g.beginPath();
		g.fillStyle="red";
		g.font="40px Calibri";
		g.fillText(r.lives, canvazator.stage.width*0.91,canvazator.stage.height*0.12)
		g.fill();
		
		
		
	});
	
	
	
	// Listeners
	
    r.key_left = function() {
        this.command("L");
    }
    r.key_up = function() {
        this.command("U");
    }
    r.key_right = function() {
        this.command("R");
    }
    r.key_down = function() {
        this.command("D");
    }
	r.togglePause = function() {
		if (this.state == this.states.STATE_PAUSED) {
			canvazator.play();
			this.audioPlayerObj.play();
			this.state = this.states.STATE_PLAYING;
			return;
		}
		if (this.state == this.states.STATE_PLAYING) {
			canvazator.pause();
			this.audioPlayerObj.pause();
			this.state = this.states.STATE_PAUSED;
			return;
		}
	}
    
    r.keyListeners.down["65"] = r.key_left;     //A
    r.keyListeners.down["87"] = r.key_up;       //W
    r.keyListeners.down["68"] = r.key_right;    //D
    r.keyListeners.down["83"] = r.key_down;     //S
    r.keyListeners.down["37"] = r.key_left;
    r.keyListeners.down["38"] = r.key_up;
    r.keyListeners.down["39"] = r.key_right;
    r.keyListeners.down["40"] = r.key_down;
    
	
	r.keyListeners.down["80"] = r.togglePause;
	
	
	
	
	r.onmousedown = function(_x,_y,btn) {
		if (this.stackedUnitsIndexes.length > 0) {
			if ( pointRectangleIntersection({x:_x,y:_y},{x : this.x*0.243, y : this.y*0.5, w : this.x*0.79, h : this.y*0.2}) ) {
				var unit = new Unit(this.stackedUnitsIndexes.shift(),0);
				unit.start();
			}
			if ( pointRectangleIntersection({x:_x,y:_y},{x : this.x*0.243, y : this.y*0.76, w : this.x*0.79, h : this.y*0.22}) ) {
				var unit = new Unit(this.stackedUnitsIndexes.shift(),1);
				unit.start();
			}
			if ( pointRectangleIntersection({x:_x,y:_y},{x : this.x*0.243, y : this.y*1.01, w : this.x*0.79, h : this.y*0.28}) ) {
				var unit = new Unit(this.stackedUnitsIndexes.shift(),2);
				unit.start();
			}
			if ( pointRectangleIntersection({x:_x,y:_y},{x : this.x*0.243, y : this.y*1.29, w : this.x*0.79, h : this.y*0.3}) ) {
				var unit = new Unit(this.stackedUnitsIndexes.shift(),3);
				unit.start();
			}
			if ( pointRectangleIntersection({x:_x,y:_y},{x : this.x*0.243, y : this.y*1.59, w : this.x*0.79, h : this.y*0.32}) ) {
				var unit = new Unit(this.stackedUnitsIndexes.shift(),4);
				unit.start();
			}
		}
	}
	
	return r;
	
	
	
}