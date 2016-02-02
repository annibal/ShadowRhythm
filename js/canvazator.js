function verbose(str) { if (false) console.log(str); }

var canvazator = {
    // html DOM objects
    stage : {},
    imgCache : {},
    imgLoadPercentage : 0,
    objects : {},
    keys : {},
    updateDelay : 50,
	bgColor : "#FFF",
    isPaused : false,
    
    initialize : function(canvas_id, mobileLimit) {
        this.stage = document.getElementById(canvas_id);
        this.imgCache.htmlObject = document.createElement("div");
        this.imgCache.htmlObject.setAttribute("id","canvas-image-cache-object");
        this.imgCache.htmlObject.setAttribute("style","display:none;");
        document.body.appendChild(this.imgCache.htmlObject);
        
        if (this.stage.getAttribute("width") == undefined) {
            this.stage.setAttribute("width", this.stage.width = this.stage.parentElement.clientWidth -4);
        } else {
			this.stage.width = parseInt(this.stage.getAttribute("width"));
		}
        if (this.stage.getAttribute("height") == undefined) {
            this.stage.setAttribute("height", this.stage.height = this.stage.parentElement.clientHeight -4);
        } else {
			this.stage.height = parseInt(this.stage.getAttribute("height"));
		}
        this.stage.graphics = this.stage.getContext("2d");
        
		document.body.onkeydown = this.onkeydown.bind(this);
		document.body.onkeyup = this.onkeyup.bind(this);
		
		var isMobile = canvazator.stage.width < mobileLimit;
        // event handling
		if (!isMobile) {
			// not mobile
			document.body.onmousedown = this.onmousedown.bind(this);
			document.body.onmousemove = this.onmousemove.bind(this);
			document.body.onmouseup = this.onmouseup.bind(this);
		} else {
			// is mobile
			function mD(e) {
				canvazator.onmousedown({pageX:e.changedTouches[0].pageX, pageY:e.changedTouches[0].pageY, button:0});
				verbose("touch down");
			}
			function mU(e) {
				canvazator.onmouseup({pageX:e.changedTouches[0].pageX, pageY:e.changedTouches[0].pageY, button:0});
				verbose("touch up");
			}
			function mMV(e) {
				canvazator.onmousemove({pageX:e.changedTouches[0].pageX, pageY:e.changedTouches[0].pageY, button:0});
				verbose("touch up")
			}
			document.body.addEventListener("touchstart", mD, false);
			document.body.addEventListener("touchend", mU, false);
			document.body.addEventListener("touchmove", mMV, false);
		}
		
		/*
		window.blockMenuHeaderScroll = false;
		$(window).on('touchstart', function(e)
		{
			if (e.target.tagName == "CANVAS")
			{
				blockMenuHeaderScroll = true;
			}
		});
		$(window).on('touchend', function()
		{
			blockMenuHeaderScroll = false;
		});
		$(window).on('touchmove', function(e)
		{
			if (blockMenuHeaderScroll)
			{
				e.preventDefault();
			}
		});
        */
		
        this.updateID = setInterval(function() { canvazator.update(); }, this.updateDelay);
        this.drawID = setInterval(function() { canvazator.draw(); }, this.updateDelay);
        
        window.addEventListener("keydown", function(e) {
            // space and arrow keys
            window.e =e;
            if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        }, false);
        
    },
    pause : function() {
        this.isPaused = true;
    },
    play : function() {
        this.isPaused = false;
    },
	cacheImages : function(imageArray) {
        for (var imgIndex in imageArray) {
            var imageObj = document.createElement("img");
            imageObj.setAttribute("src",imageArray[imgIndex]);
            imageObj.setAttribute("data-loaded","false");
            imageObj.onload = function() { this.setAttribute("data-loaded","true");}
            this.imgCache.htmlObject.appendChild(imageObj);
            this.imgCache[imgIndex] = imageObj;
        }
	},
    waitForImageLoad : function() {
        this.loadIntervalId = setInterval(function() {
            var loaded = 0;
            var objs = 0;
            for ( var imgIndex in this.imgCache) {
                objs++;
                if (imgIndex != "htmlObject") {
                    loaded += (this.imgCache[imgIndex].getAttribute("data-loaded") == "true") ? 1 : 0;
                }
            }
            this.imgLoadPercentage = (loaded == 0 ? 0 : objs/loaded);
            this.updateLoadPercentage();
            if(this.imgLoadPercentage > 0.99) {
                clearInterval(this.loadIntervalId);
                this.onImageLoad();
            }
        }.bind(this),1 || this.updateDelay);
    },
    updateLoadPercentage : function() {
        // replace by your function
        //console.log(this.imgLoadPercentage);
    },
    onImageLoad : function() {
        // replace by your function
    },
    update : function() {
        if (!this.isPaused) {
            for (i in this.objects) {
                for (k in this.keys) { // for each key
                    if (this.keys[k] == true) { // if pressed;
                        var kStr = k.substr("eventkey_".length,k.length - "eventkey_".length);
                        if (this.objects[i].keyListeners.constant != undefined &&
                        typeof this.objects[i].keyListeners.constant[kStr] == "function") { // if object has listener
                            this.objects[i].keyListeners.constant[kStr].bind(this.objects[i])(); // call it.
                        }
                    }
                }
                if (this.objects[i] != undefined && this.objects[i].beforeUpdate != undefined   && typeof this.objects[i].beforeUpdate == "function")   this.objects[i].beforeUpdate();
                if (this.objects[i] != undefined && this.objects[i].update != undefined         && typeof this.objects[i].update == "function")         this.objects[i].update();
                if (this.objects[i] != undefined && this.objects[i].afterUpdate != undefined    && typeof this.objects[i].afterUpdate == "function")    this.objects[i].afterUpdate();
            }
        }
    },
    step : function() {
        if (!this.isPaused) {
            for (i in this.objects) {
                if (this.objects[i].step != undefined && typeof this.objects[i].step == "function") this.objects[i].step();
            }
            this.stage.graphics.fillStyle = this.bgColor;
            this.stage.graphics.fillRect(0,0,this.stage.width, this.stage.height);
            this.draw();
        }
    },
    draw : function() {
        if (!this.isPaused) {
            this.stage.graphics.fillStyle = this.bgColor;
            this.stage.graphics.fillRect(0,0,this.stage.width, this.stage.height);

            objArr = []

            for (var i in this.objects) {
                objArr.push(this.objects[i]);
            }
            objArr.sort(function(a,b) { 
                return a.zIndex-b.zIndex; 
            });
            for (i=0; i<objArr.length; i++) {
                objArr[i].draw(this.stage.graphics);
            }
        }
    },
    
    // event fn
    //TODO: cross browser mouse x,y, button
    onmousedown : function(e) {
        if (!this.isPaused) {
			verbose("mouse down "+e.button);
            var X = e.pageX - this.stage.offsetLeft;
            var Y = e.pageY - this.stage.offsetTop;
            for (i in this.objects) {
                this.objects[i].onmousedown(X, Y, e.button);
            }
        }
    },
    onmousemove : function(e) {
        if (!this.isPaused) {
			verbose("mouse move "+e.button);
            var X = e.pageX - this.stage.offsetLeft;
            var Y = e.pageY - this.stage.offsetTop;
            for (i in this.objects) {
                this.objects[i].onmousemove(X, Y, e.button);
            }
        }
    },
    onmouseup : function(e) {
        if (!this.isPaused) {
			verbose("mouse up "+e.button);
            var X = e.pageX - this.stage.offsetLeft;
            var Y = e.pageY - this.stage.offsetTop;
            for (i in this.objects) {
                window.e = e;
                this.objects[i].onmouseup(X, Y, e.button);
            }
        }
    },
    //TODO: cross browser keyCode
    onkeydown : function(e) {
        if (!this.isPaused) {
            this.keys["eventkey_"+e.keyCode] = true;

            for (i in this.objects) {
                if (this.objects[i].keyListeners.down != undefined &&
                typeof this.objects[i].keyListeners.down[e.keyCode+""] == "function") { // if object has listener
                    this.objects[i].keyListeners.down[e.keyCode+""].bind(this.objects[i])(); // call it.
                }
            }
        }
    },
    onkeyup : function(e) {
        if (!this.isPaused) {
            this.keys["eventkey_"+e.keyCode] = false;

            for (i in this.objects) {
                if (this.objects[i].keyListeners.up != undefined &&
                typeof this.objects[i].keyListeners.up[e.keyCode+""] == "function") { // if object has listener
                    this.objects[i].keyListeners.up[e.keyCode+""].bind(this.objects[i])(); // call it.
                }
            }
        }
    },
    //TODO: double key press
    
    add : function(obj) {
        var RegisterID = generateUUID();
        this.objects[RegisterID] = obj;
        obj.RegisterID = RegisterID;
    },
    remove : function(obj) {
        delete this.objects[obj.RegisterID];
    }
}

            

function GeneralObject() {
    var r = {
        RegisterID:null,
        x:0,y:0,
        className : "GeneralObject",
        classes : [],
        zIndex:0,
        hasClass : function(className) {
            if (className == this.className) return true;
            for (var classIndex in this.classes) {
                if (this.classes[classIndex] == className) return true;
            }
            return false;
        },
        addClass : function(className) { this.classes.push(className); },
        setClass : function(className) { this.addClass(this.className); this.className = className; },
        removeClass : function(className) {
            for (var classIndex in this.classes) {
                if (this.classes[classIndex] == className) {
                    return this.classes.splice(classIndex,1);
                }
            }
        },
        keyListeners:{constant:[], down:[], up:[]},
        beforeUpdateListeners : [],
        updateListeners : [],
        afterUpdateListeners : [],
        stepListeners : [],
        drawListeners : [],
        startListeners : [],
        dieListeners : [],
        
        whenBeforeUpdate : function(fn) { this.beforeUpdateListeners.push(fn); },
        whenUpdate : function(fn) { this.updateListeners.push(fn); },
        whenAfterUpdate : function(fn) { this.afterUpdateListeners.push(fn); },
        whenStep : function(fn) { this.stepListeners.push(fn); },
        whenDraw : function(fn) { this.drawListeners.push(fn); },
        whenStart : function(fn) { this.startListeners.push(fn); },
        whenDie : function(fn) { this.dieListeners.push(fn); },
        
        beforeUpdate:function() {
            for (L in this.beforeUpdateListeners) {
                if (this.beforeUpdateListeners[L] != undefined
                && typeof this.beforeUpdateListeners[L] == "function")
                    this.beforeUpdateListeners[L].bind(this)();
            }
        },
        update:function() {
            for (L in this.updateListeners) {
                if (this.updateListeners[L] != undefined
                && typeof this.updateListeners[L] == "function")
                    this.updateListeners[L].bind(this)();
            }
        },
        step:function() {
            for (L in this.stepListeners) {
                if (this.stepListeners[L] != undefined
                && typeof this.stepListeners[L] == "function")
                    this.stepListeners[L].bind(this)();
            }
        },
        afterUpdate:function() {
            for (L in this.afterUpdateListeners) {
                if (this.afterUpdateListeners[L] != undefined
                && typeof this.afterUpdateListeners[L] == "function")
                    this.afterUpdateListeners[L].bind(this)();
            }
        },
        draw:function(g) {
            for (L in this.drawListeners) {
                if (this.drawListeners[L] != undefined
                && typeof this.drawListeners[L] == "function")
                    this.drawListeners[L].bind(this)(g);
            }
        },
        start : function() {
            for (L in this.startListeners) {
                if (this.startListeners[L] != undefined
                && typeof this.startListeners[L] == "function")
                    this.startListeners[L].bind(this)();
            }
        },
        die : function() {
            for (L in this.dieListeners) {
                if (this.dieListeners[L] != undefined
                && typeof this.dieListeners[L] == "function")
                    this.dieListeners[L].bind(this)();
            }
        },
        onmousedown:function() {},
        onmousemove:function() {},
        onmouseup:function() {}
    }
    r.whenStart(function() {
        canvazator.add(this);
    });
    r.whenDie(function() {
        canvazator.remove(this);
    });
    return r;
}
function ExampleObject(color) {
    var r = GeneralObject();
    r.x = canvazator.stage.width/2;
    r.y = canvazator.stage.height/2;
    r.color = (color == undefined ? "#F00" : color);
    r.radius = 21;
    r.minRadius = r.radius-3;
    r.maxRadius = r.radius;
    r.radiusChangeAmount = 0.1;
    r.radiusChangeDir = -1;
    r.setClass("ExampleObject");
    r.whenStart(function() {
        this.minRadius = this.radius-3;
        this.maxRadius = this.radius;
    });
    r.whenUpdate(function() {
        this.radius += this.radiusChangeAmount * this.radiusChangeDir;
        if (this.radius >= this.maxRadius) {
            this.radiusChangeDir = -1;
        }
        if (this.radius <= this.minRadius) {
            this.radiusChangeDir = 1;
        }
    });
    r.whenDraw(function(g) {
        g.beginPath();
        g.arc(r.x, r.y, r.radius, 0, 2 * Math.PI, false);
        g.fillStyle = r.color;
        g.fill();
    });
    return r;
}

//g.drawImage(imgObj,x,y);