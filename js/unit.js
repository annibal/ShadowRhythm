function Unit(unitIndex, lane) {
	
	var r = GeneralObject();
	
	r.zIndex = lane+5;
	r.x;
	r.y;
	r.startX = canvazator.stage.width*0.028;
	r.startY = canvazator.stage.height*0.1;
	r.targetX;
	r.targetY;
	r.id = unitIndex;
	r.hp;
	r.currentAmmo;
	r.state;
	r.img_icon;
	r.img_avatar;
	r.img_action;
	r.states = {
		STATE_ENTERING : 1,
		STATE_MOVING : 2,
		STATE_IDLE : 3,
		STATE_ACTION : 4,
		STATE_DEAD : 5
	}
	r.lane = lane;
	r.currentCooldown = 0;
	
	r.previousTime;
	r.deltaTime;
	r.activeTime;
	r.maxActiveTime = 600;
	
	
	
	// begin unit-specific variable
	r.hasBeenHit = false;
	r.shielderChooseFriend = false;
	r.blackHoleDelay = 2400;
	r.blackHoleHasRandomized = false
	
	r.inflictDamage = function(dmg,data) {
		if (this.state == this.states.STATE_ENTERING) return;
		this.hp -= ((100-Units[this.id].attributes.def)/100) * dmg;
		if (data == "throwback") {
			this.x -= 80;
		}
		if (this.hp <=0) {
			this.die();
			if (Units[this.id].slug == "bomber") {
				$("#wood1")[0].play();
			} else {
				$("#dirt_sand")[0].play();
			}
			
			var dieEffect = new Effect({
				startX:this.x+canvazator.stage.width*0.18,
				startY:this.y,
				startW:20,
				ySpeed:-1.3,
				xSpeed:-0.6,
				xGrow:1,
				xGrowDamper:1,
				duration:7500,
				opacityDecay:-0.01,
				damperOpacity:false,
				draw:function(g,data) {
					g.beginPath();
					g.arc(data.x, data.y, data.w, 0,Math.PI*2);
					g.fillStyle = "rgba(134,245,226,"+data.opacity+")";
					g.fill();
				}
			});
			dieEffect.start();
		}
		this.hasBeenHit = true;
		var hitEffect = new Effect({
			startX:this.x+canvazator.stage.width*0.18,
			startY:this.y,
			startW:20,
			xGrow:1.85,
			xGrowDamper:0.9,
			processColor:true,
			damperColor:true,
			startColor:{b:255,g:1,r:1},
			changeColor:{b:-10,g:30,r:30},
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
//		console.log(dmg,((100-Units[this.id].attributes.def)/100),((100-Units[this.id].attributes.def)/100) * dmg)
	}
	
	var laneVerticalPositions = [0.5, 0.76, 1.01, 1.29, 1.59];
	
	r.whenStart(function() {
		if (this.id >= Units.length) this.die();
		
		this.targetX = canvazator.stage.width * 0.2;
		this.targetY = canvazator.stage.height/2 * laneVerticalPositions[lane] + randomRange(-100,100)*0.1;
		this.x = this.startX;
		this.y = this.startY;
		if (Units[this.id].data.ammo != 0) {
			this.currentAmmo = Units[this.id].data.ammo;
		}
		this.state = this.states.STATE_ENTERING;
		this.img_icon = canvazator.imgCache[Units[this.id].slug+"_icon"];
		this.img_avatar = canvazator.imgCache[Units[this.id].slug+"_avatar"];
		this.img_action = canvazator.imgCache[Units[this.id].slug+"_action"];
		this.addClass("Unit");
		this.addClass(Units[this.id].slug);
		this.hp = Units[this.id].attributes.hp;
		
		this.previousTime = new Date().getTime();
		
	});
	r.whenUpdate(function() {
		this.deltaTime = new Date().getTime() - this.previousTime;
		if (this.x > canvazator.stage.width) this.die();
		
		
		if (this.state == this.states.STATE_ENTERING) {
			this.x += (this.targetX - this.x)*0.3;
			this.y += (this.targetY - this.y)*0.3;
			if (pointDistance(this.x, this.y, this.targetX, this.targetY) < 5 ) {
				this.x = this.targetX;
				this.y = this.targetY;
				this.state = this.states.STATE_MOVING;
			}
		} else {
			//console.log(this.x, this.y, this.state, Units[this.id].attributes.speed);
			if (this.state == this.states.STATE_MOVING) {
				this.x += Units[this.id].attributes.speed * obj.bpm/120;
			}
			
			// get all enemies in this obj's lane
			var laneFoes = [];
			for (i in canvazator.objects) {
				if (canvazator.objects[i].hasClass("Enemy") && canvazator.objects[i].lane == this.lane) {
					laneFoes.push(canvazator.objects[i]);
				}
				if (Units[this.id].slug == "shielder" && canvazator.objects[i].hasClass("Unit") && !this.shielderChooseFriend) {
					this.shielderChooseFriend = true;
					this.shielderFriend = canvazator.objects[i];
				}
			}
			
			
			if (this.activeTime > 0) {
				this.activeTime -= this.deltaTime;
				this.state = this.states.STATE_ACTION;
			} else {
				this.state = this.states.STATE_MOVING;
			}
			if (this.currentCooldown > 0) this.currentCooldown -= this.deltaTime;
			
			if (Units[this.id].slug == "bomber") {
				laneFoes = [];
				for (i in canvazator.objects) {
					if (canvazator.objects[i].hasClass("Enemy") && canvazator.objects[i].lane == this.lane && pointDistance(canvazator.objects[i].x,canvazator.objects[i].y,this.x+100,this.y) < 200 ) {
						laneFoes.push(canvazator.objects[i]);
					}
					if (canvazator.objects[i].hasClass("Enemy") && canvazator.objects[i].lane == this.lane-1 && pointDistance(canvazator.objects[i].x,canvazator.objects[i].y,this.x+100,this.y) < 200) {
						laneFoes.push(canvazator.objects[i]);
					}
					if (canvazator.objects[i].hasClass("Enemy") && canvazator.objects[i].lane == this.lane+1 && pointDistance(canvazator.objects[i].x,canvazator.objects[i].y,this.x+100,this.y) < 200) {
						laneFoes.push(canvazator.objects[i]);
					}
				}
				if (laneFoes.length > 0) {
					if (this.state != this.states.STATE_ACTION) this.state = this.states.STATE_IDLE;
					if (this.currentCooldown <=0) {
						this.currentCooldown = Units[this.id].attributes.recharge;
						for (var i=0; i<laneFoes.length; i++) {
							laneFoes[i].inflictDamage(Units[this.id].attributes.atk);
						}
						this.state = this.states.STATE_ACTION;
						var explosionEffect = new Effect({
								startX:this.x+canvazator.stage.width*0.18+100,
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
									g.fillStyle = "rgba(255,0,0,"+d.opacity+")";
									g.fill();
								}
							})
							explosionEffect.start();
							
							$("#explosion_fast")[0].play();
					}
				}
				
			} else { // not a bomber
				for (var i=0; i<laneFoes.length; i++) {
					if (pointDistance(this.x, this.y, laneFoes[i].x, laneFoes[i].y) < 80* Units[this.id].attributes.range) {
						if (this.state != this.states.STATE_ACTION) this.state = this.states.STATE_IDLE;
						if (this.currentCooldown <=0) {
							this.currentCooldown = Units[this.id].attributes.recharge;
							laneFoes[i].inflictDamage(Units[this.id].attributes.atk, Units[this.id].slug == "zombie");
							this.state = this.states.STATE_ACTION;
							var hasSoundPlayed = false;
							
							if (Units[this.id].slug == "archer") {
								hasSoundPlayed = true;
								$("#heavy_walk")[0].play();
								
								var arrowEffect = new Effect({
									startX:this.x+canvazator.stage.width*0.18,
									startY:this.y-65,
									startW:12,
									xGrow:0.95,
									xGrowDamper:1,
									xSpeed:15,
									ySpeed:-3,
									duration:600,
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
							}
							if (Units[this.id].slug == "mage") {
								hasSoundPlayed = true;
								$("#music_bomb")[0].play();
								
								var arrowEffect = new Effect({
									startX:this.x+canvazator.stage.width*0.18,
									startY:this.y-65,
									startW:12,
									xGrow:1,
									xGrowDamper:1,
									duration:600,
									damperOpacity:false,
									opacityDecay:-0.22,
									draw:function(g,d) {
										g.fillStyle = "rgba(255,255,255,"+d.opacity+")";
										g.beginPath();
										g.arc(d.x, d.y, d.w, 0,Math.PI*2);
										g.fill();
										
										g.beginPath();
										g.moveTo(d.x,d.y-d.w);
										g.lineTo(d.x+d.w*20,d.y+d.w*7);
										g.lineTo(d.x,d.y+d.w);
										g.closePath();
										g.fill();
									}
								})
								arrowEffect.start();
							}
						}
					}
				}
			}
			
			if (this.state != this.states.STATE_ACTION && Units[this.id].slug=="guard" && this.hasBeenHit) {
				this.state = this.states.STATE_IDLE;
				this.hp += 0.3;
				if (this.hp >= Units[this.id].attributes.hp) this.hp = Units[this.id].attributes.hp;
			}
			if (Units[this.id].slug == "shielder" && this.shielderChooseFriend && this.shielderFriend != undefined) {
				this.x = this.shielderFriend.x+20;
				//console.log("ue")
				if (this.shielderFriend.hp < Units[this.shielderFriend.id].attributes.hp) this.shielderFriend.hp += 0.5;
				this.state = this.states.STATE_IDLE;
			}
			
			if (Units[this.id].slug == "blackhole") {
				if (!this.blackHoleHasRandomized) {
					this.x = randomRange(canvazator.stage.width*0.243,canvazator.stage.width*0.79);
					this.blackHoleHasRandomized = true;
					
					var blackHoleEffect = new Effect({						
						startX:this.x+canvazator.stage.width*0.18,
						startY:this.y,
						startW : 150,
						xGrow:1.03,
						xGrowDamper:0.995,
						opacity:0.7,
						duration:3000,
						opacityDecay:1,
						draw:function(g,data) {							
							g.beginPath();
							g.arc(data.x, data.y, data.w, 0,Math.PI*2);
							g.fillStyle = "rgba(0,0,0,0.7)";
							g.fill();
						}
					})
					blackHoleEffect.start();
				}
				this.state = this.states.STATE_IDLE;
				if (this.blackHoleDelay < 1200) this.state = this.states.STATE_ACTION;
				this.blackHoleDelay -= this.deltaTime;
			}
			if (Units[this.id].slug == "shadow") {
				if (!this.blackHoleHasRandomized) {
					this.x = randomRange(canvazator.stage.width*0.243,canvazator.stage.width*0.79);
					this.blackHoleHasRandomized = true;
				}
				this.state = this.states.STATE_IDLE;
			}
			if ( (Units[this.id].slug == "kamikaze" && this.hasBeenHit) || (Units[this.id].slug == "blackhole" && this.blackHoleDelay <= 10) ) {
				var laneFoes = [];
				for (i in canvazator.objects) {
					if (canvazator.objects[i].hasClass("Enemy") && canvazator.objects[i].lane == this.lane && pointDistance(canvazator.objects[i].x,canvazator.objects[i].y,this.x,this.y) < 250 ) {
						laneFoes.push(canvazator.objects[i]);
					}
					if (canvazator.objects[i].hasClass("Enemy") && canvazator.objects[i].lane == this.lane-1 && pointDistance(canvazator.objects[i].x,canvazator.objects[i].y,this.x,this.y) < 250) {
						laneFoes.push(canvazator.objects[i]);
					}
					if (canvazator.objects[i].hasClass("Enemy") && canvazator.objects[i].lane == this.lane+1 && pointDistance(canvazator.objects[i].x,canvazator.objects[i].y,this.x,this.y) < 250) {
						laneFoes.push(canvazator.objects[i]);
					}
				}
				for (var i=0; i<laneFoes.length; i++) {
					laneFoes[i].inflictDamage(1000);
				}
				this.die();
				
				var explosionEffect = new Effect({
					startX:this.x+canvazator.stage.width*0.18,
					startY:this.y,
					startW:22,
					xGrow:2.15,
					xGrowDamper:0.89,
					duration:1200,
					damperOpacity:false,
					opacityDecay:-0.22,
					draw:function(g,d) {
						g.beginPath();
						g.arc(d.x, d.y, d.w, 0,Math.PI*2);
						g.fillStyle = "rgba(255,255,255,"+d.opacity+")";
						g.fill();
					}
				})
				explosionEffect.start();
			}

		}
		this.previousTime = new Date().getTime();
	});
	r.whenDraw(function(g) {
		if (this.state == this.states.STATE_ENTERING) {
			g.drawImage(this.img_icon, this.x, this.y, canvazator.stage.width*0.061, canvazator.stage.width*0.061);
		}
		if (this.state == this.states.STATE_MOVING || this.state == this.states.STATE_IDLE ) {
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
			g.lineTo(this.x+w*0.10+(this.hp*(w*0.08)/Units[this.id].attributes.hp)-2,this.y-w*0.13+3);
			g.lineTo(this.x+w*0.10+(this.hp*(w*0.08)/Units[this.id].attributes.hp)-2,this.y-w*0.13+12);
			g.lineTo(this.x+w*0.10+2,this.y-w*0.13+12);
			g.closePath();
			g.fillStyle = "green";
			g.fill();
		}
		
	});
	
	return r;
	
}