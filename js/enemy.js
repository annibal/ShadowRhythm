function Enemy(audioPlayerID) {
	
	var r = GeneralObject();
	
	r.level = 1;
	r.previousLevel = 0;
	r.levelRaise = [0,94,186,257,357,451,537,620];
	r.mana=-2;
	r.bpm = 0;
	r.spawnDelay;
	r.previousTime = 0;
	r.byLevel = [[],[],[],[],[],[],[],[],[],[],[]];
	
	r.calcCompass = function(currentTime) {
		return Math.floor( (currentTime/60)*this.bpm );
	}
	
	if (audioPlayerID == undefined || audioPlayerID.length == 0) {
		throw "Erro - música não encontrada";
	}
	r.audioPlayerObj = $("#"+audioPlayerID)[0];
	r.displayedAlmostWin = false;
	
	r.whenStart(function() {
		var currentTime = this.audioPlayerObj.currentTime;
		this.currentCompass = this.calcCompass(currentTime);
		this.startCompass = this.currentCompass;
		this.previousCompass = this.currentCompass-1;
		this.previousTime = new Date().getTime();
		
		var chosenLane = randomRange(0,5);
		var enemyUnit = EnemyUnit(0, chosenLane);
		enemyUnit.start();
		this.spawnDelay = randomRange(2,6+(7-this.level))*1000;
		if(this.spawnDelay > 9000) this.spawnDelay = 9000;
		if (this.level > 5) {
			if (this.spawnDelay < 1000) {
				this.spawnDelay = 1000;
			}
		}
		
		for (var i=0; i<Enemies.length; i++) {
			this.byLevel[Enemies[i].attributes.level].push(i);
		}
		
	});
	r.whenUpdate(function() {
		deltaTime = new Date().getTime() - this.previousTime;
		if (this.audioPlayerObj.currentTime >= this.levelRaise[0]) this.level = 1;
		if (this.audioPlayerObj.currentTime >= this.levelRaise[1]) this.level = 2;
		if (this.audioPlayerObj.currentTime >= this.levelRaise[2]) this.level = 3;
		if (this.audioPlayerObj.currentTime >= this.levelRaise[3]) this.level = 4;
		if (this.audioPlayerObj.currentTime >= this.levelRaise[4]) this.level = 5;
		if (this.audioPlayerObj.currentTime >= this.levelRaise[5]) this.level = 6;
		if (this.audioPlayerObj.currentTime >= this.levelRaise[6]) this.level = 7;
		if (this.audioPlayerObj.currentTime >= this.levelRaise[7]) this.level = 0;
				if (this.audioPlayerObj.currentTime > this.levelRaise[7]-10 && !this.displayedAlmostWin) {
			this.displayedAlmostWin = true;
			console.log("10 segundos para ganhar!")
			var almostWinFX = Effect({
				startX:0,
				startY:0,
				xGrow:0,
				xGrowDamper:0,
				duration:3000,
				draw:function(g,data) {
					g.beginPath();
					g.moveTo(0,0);
					g.lineTo(0,canvazator.stage.height);
					g.lineTo(canvazator.stage.width,canvazator.stage.height);
					g.lineTo(canvazator.stage.width,0);
					g.closePath();
					g.fillStyle = "rgba(255,255,255,"+data.opacity+")";
					g.fill();
					
					g.font=((3000-data.data.duration)/500+50)+"px Calibri";
					g.fontWeight = "bold";
					g.textAlign="center";
					g.fillStyle = "rgba(255,255,255,"+ (data.data.duration > 500?1:(data.data.duration)/500 )+")";
					g.fillText("10 segundos para ganhar!", canvazator.stage.width*0.5, canvazator.stage.height*0.5)
				}
			});
			almostWinFX.start();
		}
		
		//if (this.x < canvazator.stage.width*0.3) this.remove();
		
		if (this.level != this.previousLevel && this.level != 0) {
			this.previousLevel = this.level;
			obj.lives++;
			obj.stackedMana = this.level==1?2:5;
			obj.stackedUnitsIndexes.push(randomRange(0,11));
			var passFX = Effect({
				startX:0,
				startY:0,
				xGrow:0,
				xGrowDamper:0,
				duration:1000,
				draw:function(g,data) {
					g.beginPath();
					g.moveTo(0,0);
					g.lineTo(0,canvazator.stage.height);
					g.lineTo(canvazator.stage.width,canvazator.stage.height);
					g.lineTo(canvazator.stage.width,0);
					g.closePath();
					g.fillStyle = "rgba(255,255,255,"+data.opacity+")";
					g.fill();
				}
			});
			var levelOpt = this.byLevel[this.level];
			var chosenEnemyIdOne = levelOpt[randomRange(0,levelOpt.length)];
			if (chosenEnemyIdOne == undefined) chosenEnemyIdOne=1;
			var eneme = EnemyUnit(chosenEnemyIdOne, randomRange(0,5));
			eneme.start();
			passFX.start();
			setTimeout(function(id) { $("#lvimg"+id).toggleClass("h"); },10,this.level)
			setTimeout(function(id) { $("#lvimg"+id).toggleClass("h"); },1900,this.level);
		}
		
		if (this.level == 0) {
			canvazator.pause();
			$("#pause").remove();
			$("#musicPlayer").remove();
			setTimeout(function() {
				window.location = "vitoria.html";
			}, 400 );
		}
		
		var currentTime = this.audioPlayerObj.currentTime;
		this.currentCompass = this.calcCompass(currentTime) - this.startCompass;
		if (this.previousCompass != this.currentCompass && false) {
			this.previousCompass = this.currentCompass;
			
			if (randomRange(0,6) == 2) this.mana+=1;
			if (this.level > 3) if (randomRange(0,10) == 2) this.mana+=1;
			if (this.level > 6) if (randomRange(0,10) == 2) this.mana+=1;
			if (this.mana > 5) this.mana = 5;
			//if (randomRange(0,15) == 2) this.mana++;
			
			var chosenEnemyId = randomRange(0,Enemies.length)
			var chosenEnemy = Enemies[chosenEnemyId];
			
			while (chosenEnemy.attributes.level > this.level) {
				chosenEnemyId = randomRange(0,Enemies.length)
				chosenEnemy = Enemies[chosenEnemyId];
			}
			
			if (chosenEnemy.attributes.mana <= this.mana && randomRange(0,3)==2) {
				var chosenLane = randomRange(0,5);
				if (chosenEnemyId == undefined) chosenEnemyId=1;
				var enemyUnit = EnemyUnit(chosenEnemyId, chosenLane);
				enemyUnit.start();
				//console.log(chosenEnemyId);
				//console.log(Enemies[enemyUnit.id].attributes.level,this.level)
				this.mana -= chosenEnemy.attributes.mana*2;
			}
			
			
		}
		
		if (this.spawnDelay > 0) this.spawnDelay-=deltaTime;
		if (this.spawnDelay <= 0) {
			var levelOpt = this.byLevel[randomRange(1,this.level+1)];
			var chosenEnemyIdOne = levelOpt[randomRange(0,levelOpt.length)]
			if (chosenEnemyIdOne == undefined) chosenEnemyIdOne=1;
			var espa1 = EnemyUnit(chosenEnemyIdOne, randomRange(0,5));
			espa1.start();
			this.spawnDelay = (Enemies[espa1.id].attributes.mana+randomRange(1.5,5+(7-this.level)) )*1000;
//			console.log(this.spawnDelay, espa1.id)
		}
		
		this.previousTime = new Date().getTime();
	});
	r.whenDraw(function(g) {
		
	});
	
	return r;
	
}