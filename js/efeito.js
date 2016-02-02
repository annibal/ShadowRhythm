function Effect(data) {
	var r = GeneralObject();
	
	if (data == undefined) data = {}
	if (data.startColor == undefined) data.startColor = {}
	if (data.changeColor == undefined) data.changeColor = {}
	if (data.startColor2 == undefined) data.startColor2 = {}
	if (data.changeColor2 == undefined) data.changeColor2 = {}
	var defaultData = {
		duration: data.duration==undefined ? 700 : data.duration,
		
		startX: data.startX==undefined ? 100 : data.startX,
		startY: data.startY==undefined ? 100 : data.startY,
		xSpeed: data.xSpeed==undefined ? 0 : data.xSpeed,
		ySpeed: data.ySpeed==undefined ? 0 : data.ySpeed,
		damperSpeed : data.damperSpeed==undefined ? false : data.damperSpeed, // true: speed *= damperSpeed, false: speed += damperSpeed
		xAccel: data.xAccel==undefined ? 0 : data.xAccel,
		yAccel: data.yAccel==undefined ? 0 : data.yAccel,
		damperAccel : data.damperAccel==undefined ? false : data.damperAccel,
		
		squared: data.startX==undefined ? true : data.squared, // ignores h
		
		startW: data.startW==undefined ? 1 : data.startW,
		startH: data.startH==undefined ? 1 : data.startH,
		xGrow: data.xGrow==undefined ? 5 : data.xGrow,
		yGrow: data.yGrow==undefined ? 5 : data.yGrow,
		damperGrow : data.damperGrow==undefined ? true : data.damperGrow,
		xGrowDamper: data.xGrowDamper==undefined ? 0.9 : data.xGrowDamper,
		yGrowDamper: data.yGrowDamper==undefined ? 0.9 : data.yGrowDamper,
		damperDamperGrow : data.damperDamperGrow==undefined ? true : data.damperDamperGrow,
		
		startOpacity: data.startOpacity==undefined ? 1 : data.startOpacity,
		opacityDecay: data.opacityDecay==undefined ? 0.9 : data.opacityDecay,
		damperOpacity : data.damperOpacity==undefined ? true : data.damperOpacity,
		
		
		processColor: data.processColor==undefined ? false : data.processColor,
		damperColor : data.damperColor==undefined ? true : data.damperColor,
		startColor: data.startColor==undefined ? {
			r: data.startColor.r==undefined ? 255 : data.startColor.r,
			g: data.startColor.g==undefined ? 255 : data.startColor.g,
			b: data.startColor.b==undefined ? 255 : data.startColor.b,
		} : data.startColor,
		
		changeColor: data.changeColor==undefined ? {
			r: data.changeColor.r==undefined ? 1 : data.changeColor.r,
			g: data.changeColor.g==undefined ? 1 : data.changeColor.g,
			b: data.changeColor.b==undefined ? 1 : data.changeColor.b,
		} : data.changeColor,
		
		startColor2: data.startColor2==undefined ? {
			r: data.startColor2.r==undefined ? 0 : data.startColor2.r,
			g: data.startColor2.g==undefined ? 0 : data.startColor2.g,
			b: data.startColor2.b==undefined ? 0 : data.startColor2.b,
		} : data.startColor2,
		
		changeColor2: data.changeColor2==undefined ? {
			r: data.changeColor2.r==undefined ? 1 : data.changeColor2.r,
			g: data.changeColor2.g==undefined ? 1 : data.changeColor2.g,
			b: data.changeColor2.b==undefined ? 1 : data.changeColor2.b,
		} : data.changeColor2,
		
		imgFill : data.imgFill==undefined ? null : data.imgFill,
		
		draw:function(g,data) {
			g.beginPath();
			g.arc(data.x, data.y, data.w, 0,Math.PI*2);
			g.fillStyle = "rgba(255,255,255,"+data.opacity+")";
			g.fill();
		}
	}
	
	if (data.draw != undefined) defaultData.draw = data.draw;
	r.data = defaultData;
	r.previousTime;
	r.zIndex=1000;
	
	r.whenStart(function() {
		this.previousTime = new Date().getTime();
		r.x = this.data.startX;
		r.y = this.data.startY;
		r.w = this.data.startW;
		r.h = this.data.startH;
		r.opacity = this.data.startOpacity;
		r.color = this.data.startColor;
		r.color2 = this.data.startColor2;
	})
	r.whenUpdate(function() {
		var deltaTime = new Date().getTime() - this.previousTime;
		
		this.data.duration -= deltaTime;
		if (this.data.duration <= 0) this.die();
		
		// x and y
		if (this.data.damperSpeed) {
			this.x *= this.data.xSpeed;
			if (this.data.squared) {
				this.y *= this.data.xSpeed;
			} else {
				this.y *= this.data.ySpeed;
			}
		} else {
			this.x += this.data.xSpeed;
			this.y += this.data.ySpeed;
		}
		
		// speed hor & ver
		if (this.data.damperAccel) {
			this.data.xSpeed *= this.data.xAccel;
			this.data.ySpeed *= this.data.yAccel;
		} else {
			this.data.xSpeed += this.data.xAccel;
			this.data.ySpeed += this.data.yAccel;
		}
		
		// x and y
		if (this.data.damperGrow) {
			this.w *= this.data.xGrow;
			if (this.data.squared) {
				this.h *= this.data.xGrow;
			} else {
				this.h *= this.data.yGrow;
			}
		} else {
			this.w += this.data.xGrow;
			if (this.data.squared) {
				this.h += this.data.xGrow;
			} else {
				this.h += this.data.yGrow;
			}
		}
		
		// grow damper damper
		if (this.data.damperDamperGrow) {
			this.data.xGrow *= this.data.xGrowDamper;
			if (this.data.squared) {
				this.data.yGrow *= this.data.xGrowDamper;
			} else {
				this.data.yGrow *= this.data.yGrowDamper;
			}
		} else {
			this.data.xGrow += this.data.xGrowDamper;
			if (this.data.squared) {
				this.data.yGrow += this.data.xGrowDamper;
			} else {
				this.data.yGrow += this.data.yGrowDamper;
			}
		}
		
		// opacity
		if (this.data.damperOpacity) {
			this.opacity *= this.data.opacityDecay;
		} else {
			this.opacity += this.data.opacityDecay;
		}
		if (this.data.opacity >= 1) this.opacity = 1;
		if (this.data.opacity <= 0) this.opacity = 0;
		
		// color
		if (this.data.processColor) {
			if (this.data.damperColor) {
				this.color.r *= this.data.changeColor.r;
				this.color.g *= this.data.changeColor.g;
				this.color.b *= this.data.changeColor.b;
				this.color2.r *= this.data.changeColor2.r;
				this.color2.g *= this.data.changeColor2.g;
				this.color2.b *= this.data.changeColor2.b;
			} else {
				this.color.r += this.data.changeColor.r;
				this.color.g += this.data.changeColor.g;
				this.color.b += this.data.changeColor.b;
				this.color2.r += this.data.changeColor2.r;
				this.color2.g += this.data.changeColor2.g;
				this.color2.b += this.data.changeColor2.b;
			}
			if (this.color.r >= 255) this.color.r = 255;
			if (this.color.g >= 255) this.color.g = 255;
			if (this.color.b >= 255) this.color.b = 255;
			if (this.color.r <= 0) this.color.r = 0;
			if (this.color.g <= 0) this.color.g = 0;
			if (this.color.b <= 0) this.color.b = 0;
			if (this.color2.r >= 255) this.color2.r = 255;
			if (this.color2.g >= 255) this.color2.g = 255;
			if (this.color2.b >= 255) this.color2.b = 255;
			if (this.color2.r <= 0) this.color2.r = 0;
			if (this.color2.g <= 0) this.color2.g = 0;
			if (this.color2.b <= 0) this.color2.b = 0;
		}
		
		
		this.previousTime = new Date().getTime();
	})
	r.whenDraw(function(g) {
		this.data.draw(g,this);
	})
	
	return r;
}