function EnemyUnit(enemyUnitIndex, lane) {
	var r = GeneralObject();
	
	r.zIndex = lane+5;
	r.x;
	r.y;
	r.id = enemyUnitIndex;
	r.hp;
	r.currentAmmo;
	r.state;
	r.img_avatar;
	r.img_action;
	r.states = {
		STATE_MOVING : 1,
		STATE_IDLE : 2,
		STATE_ACTION : 3,
		STATE_DEAD : 4
	}
	r.lane = lane;
	r.currentCooldown = 0;
	
	r.previousTime;
	r.deltaTime;
	r.activeTime;
	r.maxActiveTime = 300;
	
	r.inflictDamage = function(dmg, zombie) {
		if (this.x > canvazator.stage.width*0.85) return;
							
		zombie = (zombie == undefined? false:zombie);
		this.hp -= ((100-Enemies[this.id].attributes.def)/100) * dmg;
		var hitEffect = new Effect({
			startX:this.x+canvazator.stage.width*0.18,
			startY:this.y,
			startW:20,
			xGrow:1.85,
			xGrowDamper:0.9,
			processColor:true,
			damperColor:true,
			startColor:{r:255,g:1,b:1},
			changeColor:{r:-10,g:30,b:30},
			damperColor:false,
			damperOpacity:false,
			opacityDecay:-0.22,
			draw:function(g,d) {
				g.beginPath();
				g.arc(d.x, d.y, d.w, 0,Math.PI*2);
				g.strokeStyle = "rgba("+d.color.r+","+d.color.g+","+d.color.b+","+d.opacity+")";
				g.lineWidth=10;
				g.stroke();
			}
		})
		hitEffect.start();
		if (this.hp <=0) {
			
			var dieEffect = new Effect({
				startX:this.x+canvazator.stage.width*0.18,
				startY:this.y,
				startW:20,
				ySpeed:-1.3,
				xSpeed:0.6,
				xGrow:1,
				xGrowDamper:1,
				duration:7500,
				opacityDecay:-0.01,
				damperOpacity:false,
				draw:function(g,data) {
					g.beginPath();
					g.arc(data.x, data.y, data.w, 0,Math.PI*2);
					g.fillStyle = "rgba(255,255,0,"+data.opacity+")";
					g.fill();
				}
			});
			dieEffect.start();
			this.die();
			if (Units[this.id].slug == "catapult") {
				$("#wood1")[0].play();
			} else {
				$("#dirt_sand")[0].play();
			}
			
			if (zombie) {
				var unit = new Unit(10,randomRange(0,5));
				unit.start();
			}
		}
	}
	
	var laneVerticalPositions = [0.5, 0.76, 1.01, 1.29, 1.59];
	
	r.whenStart(function() {
		if (this.id >= Enemies.length) this.die();
		
		this.x = canvazator.stage.width * 1.2;
		this.y = canvazator.stage.height/2 * laneVerticalPositions[lane] + randomRange(50,350)*0.1;
		if (Enemies[this.id].data.ammo != 0) {
			this.currentAmmo = Enemies[this.id].data.ammo;
		}
		this.state = this.states.STATE_MOVING;
		this.img_avatar = canvazator.imgCache[Enemies[this.id].slug+"_avatar"];
		this.img_action = canvazator.imgCache[Enemies[this.id].slug+"_action"];
		this.addClass("Enemy");
		this.addClass(Enemies[this.id].slug);
		this.hp = Enemies[this.id].attributes.hp;
		
		this.previousTime = new Date().getTime();
	});
	r.whenUpdate(function() {
		this.deltaTime = new Date().getTime() - this.previousTime;
		
		if (this.state == this.states.STATE_MOVING && this.x > canvazator.stage.width*0.2) {
			this.x -= Enemies[this.id].attributes.speed * obj.bpm/120;
			if (this.x < canvazator.stage.width*0.21) {
				
				obj.lives--;
				this.die();
				if (obj.lives <= 0) {
					
					canvazator.pause();
					$("#pause").remove();
					$("#musicPlayer").remove();
					setTimeout(function() {
						window.location = "derrota.html";
					}, 400 );
				}
			}
		}
		
		if (this.activeTime > 0) {
			this.activeTime -= this.deltaTime;
			this.state = this.states.STATE_ACTION;
		} else {
			this.state = this.states.STATE_MOVING;
		}
		if (this.currentCooldown > 0) this.currentCooldown -= this.deltaTime;
				
		
		var laneFoes = [];
		if (Enemies[this.id].slug == "alchemist") {
			if (this.currentCooldown <=0) {
				this.state = this.states.STATE_ACTION;
				this.currentCooldown = Enemies[this.id].attributes.recharge;
				for (i in canvazator.objects) {
					if (canvazator.objects[i].hasClass("Unit") && canvazator.objects[i].lane == this.lane && pointDistance(canvazator.objects[i].x, canvazator.objects[i].y, this.x-100, this.y) < 200 ) {
						laneFoes.push(canvazator.objects[i]);
					}
					if (canvazator.objects[i].hasClass("Unit") && canvazator.objects[i].lane == this.lane+1 && pointDistance(canvazator.objects[i].x, canvazator.objects[i].y, this.x-100, this.y) < 200) {
						laneFoes.push(canvazator.objects[i]);
					}
					if (canvazator.objects[i].hasClass("Unit") && canvazator.objects[i].lane == this.lane-1 && pointDistance(canvazator.objects[i].x, canvazator.objects[i].y, this.x-100, this.y) < 200) {
						laneFoes.push(canvazator.objects[i]);
					}
				}
				for (var i=0; i<laneFoes.length; i++) {
					laneFoes[i].inflictDamage(Enemies[this.id].attributes.atk,"");
				}
				if (laneFoes.length > 0) {
					var explosionEffect = new Effect({
						startX:this.x+canvazator.stage.width*0.18-100,
						startY:this.y,
						startW:200,
						xGrow:0.87,
						xGrowDamper:0.89,
						duration:1200,
						damperOpacity:false,
						startOpacity:.7,
						opacityDecay:-0.22,
						draw:function(g,d) {
							g.beginPath();
							g.arc(d.x, d.y, d.w, 0,Math.PI*2);
							g.fillStyle = "rgba(255,0,255,"+d.opacity+")";
							g.fill();
						}
					})
					explosionEffect.start();
					$("#explosion_fast")[0].play();
				}
			}
		} else {
			for (i in canvazator.objects) {
				if (canvazator.objects[i].hasClass("shadow") && Enemies[this.id].slug != "villager_torch") {
				} else {
					if (canvazator.objects[i].hasClass("Unit") && canvazator.objects[i].lane == this.lane) {
						laneFoes.push(canvazator.objects[i]);
					}
				}
			}
			for (var i=0; i<laneFoes.length; i++) {
				if (pointDistance(this.x, this.y, laneFoes[i].x, laneFoes[i].y) < 80* Enemies[this.id].attributes.range) {
					if (this.state != this.states.STATE_ACTION) this.state = this.states.STATE_IDLE;
					if (this.currentCooldown <=0) {
						this.currentCooldown = Enemies[this.id].attributes.recharge;
						
						var data = "";
						if (Enemies[this.id].slug == "villager_torch") {data="throwback"; }
						laneFoes[i].inflictDamage(Enemies[this.id].attributes.atk,data);
						this.state = this.states.STATE_ACTION;
						
						if (Enemies[this.id].slug == "villager_rock" || Enemies[this.id].slug == "catapult") {
							var arrowEffect = new Effect({
								startX:this.x+canvazator.stage.width*0.18-40,
								startY:this.y-45,
								startW:18,
								xGrow:0.95,
								xGrowDamper:1,
								xSpeed:-15,
								ySpeed:-3,
								duration:900,
								damperOpacity:false,
								opacityDecay:-0.22,
								draw:function(g,d) {
									g.beginPath();
									g.arc(d.x, d.y, d.w, 0,Math.PI*2);
									g.fillStyle = "rgba(255,255,255,"+d.opacity+")";
									g.fill();
								}
							})
							arrowEffect.start();
							$("#heavy_walk")[0].play();
						} else {
							$("#cut"+randomRange(0,4))[0].play();
						}
					}
				}
			}
		}
		
		if (Enemies[this.id].slug == "catapult" && this.x < canvazator.stage.width*0.7) {
			this.state = this.states.STATE_IDLE;
		}
		if (Enemies[this.id].slug == "chivalry" && this.x < canvazator.stage.width*0.7) {
			this.state = this.states.STATE_MOVING;
		}
		if (Enemies[this.id].slug == "hunter" && this.x < canvazator.stage.width*0.7) {
			if (randomRange(0,60) ==3) {
				var moveUp = (randomRange(0,1)==1);
				if (moveUp && this.lane == 0) moveUp = false;
				if (!moveUp && this.lane == 4) moveUp = true;
				
				if (moveUp) {this.lane--;} else {this.lane++;}
				this.y = canvazator.stage.height/2 * laneVerticalPositions[this.lane] + randomRange(50,350)*0.1;
			}
		}		
		
		this.previousTime = new Date().getTime();
	});
	r.whenDraw(function(g) {
		if (this.state == this.states.STATE_MOVING || this.state == this.states.STATE_IDLE) {
			g.drawImage(this.img_avatar, this.x, this.y-canvazator.stage.height*0.225, canvazator.stage.width*0.3, canvazator.stage.height*0.361);
		}
		if (this.state == this.states.STATE_ACTION) {
			g.drawImage(this.img_action, this.x, this.y-canvazator.stage.height*0.225, canvazator.stage.width*0.3, canvazator.stage.height*0.361);
		}
		if (this.state != this.states.STATE_ENTERING) {
			g.beginPath();
			var w = canvazator.stage.width;
			g.moveTo(this.x+w*0.10,this.y-w*0.13);
			g.lineTo(this.x+w*0.18,this.y-w*0.13);
			g.lineTo(this.x+w*0.18,this.y-w*0.13+15);
			g.lineTo(this.x+w*0.10,this.y-w*0.13+15);
			g.closePath();
			g.fillStyle="#BBB";
			g.strokeStyle="black"
			g.lineWidth=1;
			g.fill();
			g.stroke();
			//
			g.beginPath();
			g.moveTo(this.x+w*0.10+2,this.y-w*0.13+3);
			g.lineTo(this.x+w*0.10+(this.hp*(w*0.08)/Enemies[this.id].attributes.hp)-2,this.y-w*0.13+3);
			g.lineTo(this.x+w*0.10+(this.hp*(w*0.08)/Enemies[this.id].attributes.hp)-2,this.y-w*0.13+12);
			g.lineTo(this.x+w*0.10+2,this.y-w*0.13+12);
			g.closePath();
			g.fillStyle = "red";
			g.fill();
		}
	});
	
	return r;
}