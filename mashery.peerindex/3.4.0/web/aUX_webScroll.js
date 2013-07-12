/**
 * aUX.web.scroller - a scrolling library for AppMobi Apps 
 * Copyright 2011 - AppMobi 
 */

if(!window.aUX)
	aUX={};

if (!aUX.web)
	aUX.web = {};

aUX.web.scroller = (function() {
	var translateOpen = 'm11' in new WebKitCSSMatrix() ? "3d(" : "(";
	var translateClose = 'm11' in new WebKitCSSMatrix() ? ",0)" : ")";
	var touchStarted=false;

	var scroller = function(elID, opts) {
		if (typeof elID == "string" || elID instanceof String) {
			this.el = document.getElementById(elID);
		} else {
			this.el = elID;
		}
		if (!this.el) {
			alert("Could not find element for scroller " + elID);
			return;
		}

		if (this instanceof scroller) {
			for (j in opts) {
				this[j] = opts[j];
			}
		} else {
			return new scroller(elID, opts);
		}
		try {
			this.container = this.el.parentNode;
			var that = this;
		/*	this.el.addEventListener('touchstart', function(e) {
				that.touchStart(e);
			}, false);*/
			this.el.addEventListener('touchmove', function(e) {
				that.touchMove(e);
			}, false);
			this.el.addEventListener('touchend', function(e) {
				that.touchEnd(e);
			}, false);
			var windowHeight = window.innerHeight;
			var windowWidth = window.innerWidth;
			if (this["verticalScroll"] && this["verticalScroll"] == true
					&& this["scrollBars"] == true) {
				var scrollDiv = createScrollBar(5,20);
				scrollDiv.style.top = "0px";
 
				scrollDiv.className=this.vScrollCSS;
				scrollDiv.style.opacity="0";
				this.container.appendChild(scrollDiv);
				
				this.vscrollBar = scrollDiv;
			}
			if (this["horizontalScroll"] && this["horizontalScroll"] == true
					&& this["scrollBars"] == true) {
				var scrollDiv = createScrollBar(20,5);
				scrollDiv.style.bottom = "0px";
				
				scrollDiv.className=this.hScrollCSS;
				scrollDiv.style.opacity="0";
				this.container.appendChild(scrollDiv);
				this.hscrollBar = scrollDiv;
			}
		} catch (e) {
			alert("error adding scroller" + e);
		}
	};

	function createScrollBar(width, height) {
		var scrollDiv = document.createElement("div");
		scrollDiv.style.position = 'absolute';
		scrollDiv.style.width = width + "px";
		scrollDiv.style.height = height + "px";
		scrollDiv.style.webkitBorderRadius = "2px";
		
		scrollDiv.className = 'scrollBar';
		scrollDiv.style.opacity = .7;
		scrollDiv.style.background="black";
		return scrollDiv;
	}

	scroller.prototype = {
		lockX : 0,
		lockY : 0,
		boolScrollLock : false,
		currentScrollingObject : null,
		bottomMargin : 0,
		maxTop : 0,
		startTop : 0,
		verticalScroll : true,
		horizontalScroll : false,
		scrollBars : true,
		vscrollBar : null,
		hscrollBar : null,
		hScrollCSS: "scrollBar",
		vScrollCSS: "scrollBar",
		divHeight : 0,
		lastScrollbar : "",
		timeMoved : 0,
		vdistanceMoved : 0,
		hdistanceMoved : 0,
		prevTime : 0,
		finishScrollingObject : null,
		container : null,
		// horizontal scrolling
		maxLeft : 0,
		startLeft : 0,
		rightMargin : 0,
		divWidth : 0,
		
		

		// handle the moving function
		touchMove : function(event) {
			try {
				if(!touchStarted){
					touchStarted=true;
					this.touchStart(event);
				}

				if (this.currentScrollingObject != null) {
					event.preventDefault();
					var scrollPoints = {
						x : 0,
						y : 0
					};
					var scrollbarPoints = {
						x : 0,
						y : 0
					};
					var newTop = 0, prevTop = 0, newLeft = 0, prevLeft = 0;
					if (this.verticalScroll) {
						var deltaY = this.lockY - event.touches[0].pageY;
						deltaY = -deltaY;
						var newTop = this.startTop + deltaY;
						var top = -newTop;

						var prevTop = new WebKitCSSMatrix(window
								.getComputedStyle(this.el).webkitTransform).f;
						scrollPoints.y = newTop;
					}
					if (this.horizontalScroll) {
						var deltaX = this.lockX - event.touches[0].pageX;
						deltaX = -deltaX;
						var newLeft = this.startLeft + deltaX;
						var left = newLeft;

						var prevLeft = -(new WebKitCSSMatrix(window
								.getComputedStyle(this.el).webkitTransform).e);
						scrollPoints.x = left;

					}
					this.scrollerMoveCSS(this.currentScrollingObject,
							scrollPoints, 0);

					if (this.vscrollBar) {
						// We must calculate the position. Since we don't allow
						// the page to scroll to the full content height, we use
						// maxTop as height to work with.

						var pos = (this.bottomMargin - numOnly(this.vscrollBar.style.height))
								- (((this.maxTop + newTop) / this.maxTop) * (this.bottomMargin - numOnly(this.vscrollBar.style.height)));
						this.scrollerMoveCSS(this.vscrollBar, {
							x : 0,
							y : pos
						}, 0);
					}
					if (this.hscrollBar) {
						// We must calculate the position. Since we don't allow
						// the page to scroll to the full content height, we use
						// maxTop as height to work with.
						var pos = (this.rightMargin - numOnly(this.hscrollBar.style.width))
								- (((this.maxLeft + newLeft) / this.maxLeft) * (this.rightMargin - numOnly(this.hscrollBar.style.width)));
						this.scrollerMoveCSS(this.hscrollBar, {
							x : pos,
							y : 0
						}, 0);
					}

					if (this.prevTime) {
						var tmpDistanceY = Math.abs(prevTop) - Math.abs(newTop);
						var tmpDistanceX = Math.abs(prevLeft)
								- Math.abs(newLeft);
						var tmpTime = event.timeStamp - this.prevTime;
						if (tmpTime < 1000) { // movement is under a second,
							// keep adding the differences
							this.timeMoved += tmpTime;
							this.vdistanceMoved += tmpDistanceY;
							this.hdistanceMoved += tmpDistanceX;
						} else { // We haven't moved in a second, lets reset
							// the variables
							this.timeMoved = 0;
							this.vdistanceMoved = 0;
							this.hdistanceMoved = 0;
						}
					}
					this.prevTime = event.timeStamp;
				}
			} catch (e) {
				alert("error in scrollMove: " + e);
			}
		},

		touchStart : function(event) {
			
			var container = this.container;
			var eleScrolling = this.el;
			if (!container)
				return;

			try {
				// Allow interaction to legit calls, like select boxes, etc.
				if (event.touches[0].target
						&& event.touches[0].target.type != undefined) {
					var tagname = event.touches[0].target.tagName.toLowerCase();
					if (tagname == "select" || tagname == "input"
							|| tagname == "button") // stuff we need to allow
						// access to
						return;
				}
				this.timeMoved = 0;
				this.vdistanceMoved = 0;
				this.hdistanceMoved = 0;
				this.prevTime = null;
				this.finishScrollingObject = null;
				this.bottomMargin = container.clientHeight > window.innerHeight ? window.innerHeight
						: container.clientHeight;
				this.maxTop = eleScrolling.clientHeight - this.bottomMargin;
				this.divHeight = eleScrolling.clientHeight;
				this.rightMargin = container.clientWidth > window.innerWidth ? window.innerWidth
						: container.clientWidth;
				this.maxLeft = eleScrolling.clientWidth - this.rightMargin;
				this.divWidth = eleScrolling.clientWidth;

				if (this.maxTop < 0)
					return;

				if (event.touches.length == 1 && this.boolScrollLock == false) {
					try {
						this.startTop = new WebKitCSSMatrix(window
								.getComputedStyle(eleScrolling).webkitTransform).f;
						this.startLeft = new WebKitCSSMatrix(window
								.getComputedStyle(eleScrolling).webkitTransform).e;
					} catch (e) {
						this.startTop = 0;
						this.startLeft = 0;
						console.log("error scroller touchstart " + e);
					}
					this.lockX = event.touches[0].pageX;
					this.lockY = event.touches[0].pageY;
					this.currentScrollingObject = eleScrolling;
					if (this.vscrollBar) {
						this.vscrollBar.style.height = (parseFloat(this.bottomMargin
								/ this.divHeight) * this.bottomMargin)
								+ "px";
						var pos = (this.bottomMargin - numOnly(this.vscrollBar.style.height))
								- (((this.maxTop + this.startTop) / this.maxTop) * (this.bottomMargin - numOnly(this.vscrollBar.style.height)));
						this.scrollerMoveCSS(this.vscrollBar, {
							x : 0,
							y : pos
						}, 0);
						
						
						if (this.container.clientWidth > window.innerWidth)
							this.vscrollBar.style.left = (window.innerWidth - numOnly(this.vscrollBar.style.width))
									+ "px";
						else
							this.vscrollBar.style.right = "0px";
						this.vscrollBar.webkitTransition = "opacity";
						this.vscrollBar.style.opacity = 1;

					}

					if (this.hscrollBar) {
						this.hscrollBar.style.width = (parseFloat(this.rightMargin
								/ this.divWidth) * this.rightMargin)
								+ "px";
						var pos = (this.rightMargin - numOnly(this.hscrollBar.style.width))
								- (((this.maxTop + this.startLeft) / this.maxtLeft) * (this.rightMargin - numOnly(this.hscrollBar.style.width)));
						this.scrollerMoveCSS(this.hscrollBar, {
							x : pos,
							y : 0
						}, 0);
						if (this.container.clientHeight > window.innerHeight)
							this.hscrollBar.style.top = (window.innerHeight - numOnly(this.hscrollBar.style.height))
									+ "px";
						else
							this.hscrollBar.style.bottom = "0px";
						this.hscrollBar.webkitTransition = "opacity";
						this.hscrollBar.style.opacity = 1;
						
					}

					event.preventDefault();
					// get the scrollbar
				}
			} catch (e) {
				alert("error in scrollStart: " + e);
			}
		},

		// touchend callback. Set the current scrolling object and scrollbar to
		// null
		touchEnd : function(event) {
			if (this.currentScrollingObject != null) {
			    event.preventDefault();
				event.stopPropagation();
				this.finishScrollingObject = this.currentScrollingObject;
				this.currentScrollingObject = null;
				var scrollPoints = {
					x : 0,
					y : 0
				};
				if (this.verticalScroll) {
					var myDistance = -this.vdistanceMoved;
					var dist = myDistance;
					var time = this.timeMoved;
					var friction = 2.0;
					var deceleration = 2.0;
					var speed = Math.abs(dist) / time * 1000;
					var distanceDelim = (Math.abs(dist) / time) * friction;

					var newDist = speed * speed / friction / 1000
							/ distanceDelim;
					newTime = 0;
					newDist = newDist * (dist < 0 ? -1 : 1);
					newTime = speed / deceleration;

					var move = new WebKitCSSMatrix(window
							.getComputedStyle(this.el).webkitTransform).f;
					if (move < 0)
						move = move - newDist;

					if (move > 0)
						move = 0;

					if (move < (-this.maxTop))
						move = -this.maxTop;
					scrollPoints.y = move;
				}
				if (this.horizontalScroll) {
					var myDistance = -this.hdistanceMoved;
					var dist = myDistance;
					var time = this.timeMoved;
					var friction = 2.0;
					var deceleration = 2.0;
					var speed = Math.abs(dist) / time * 1000;
					var distanceDelim = (Math.abs(dist) / time) * friction;

					var newDist = speed * speed / friction / 1000
							/ distanceDelim;
					newTime = 0;
					newDist = newDist * (dist < 0 ? -1 : 1);
					newTime = speed / deceleration;

					var move = new WebKitCSSMatrix(window
							.getComputedStyle(this.el).webkitTransform).e;

					if (move < 0)
						move = move - newDist;

					if (move > 0)
						move = 0;

					if (move < (-this.maxLeft))
						move = -this.maxLeft;
					scrollPoints.x = move;
				}
				var that=this;
				this.scrollerMoveCSS(this.finishScrollingObject, scrollPoints,
						300, "ease-out");
				if (this.vscrollBar) {
					var pos = (this.bottomMargin - numOnly(this.vscrollBar.style.height))
							- (((this.maxTop + scrollPoints.y) / this.maxTop) * (this.bottomMargin - numOnly(this.vscrollBar.style.height)));
					if (pos > this.bottomMargin)
						pos = this.bottomMargin;
					if (pos < 0)
						pos = 0;
					this.scrollerMoveCSS(this.vscrollBar, {
						x : 0,
						y : pos
					}, 300, "ease-out");
					this.vscrollBar.style.opacity = '0';
				}
				if (this.hscrollBar) {
					var pos = (this.rightMargin - numOnly(this.hscrollBar.style.width))
							- (((this.maxLeft + scrollPoints.x) / this.maxLeft) * (this.rightMargin - numOnly(this.hscrollBar.style.width)));
					if (pos > this.rightMargin)
						pos = this.rightMargin;
					if (pos < 0)
						pos = 0;
					this.scrollerMoveCSS(this.hscrollBar, {
						x : pos,
						y : 0
					}, 300, "ease-out");
					this.hscrollBar.style.opacity = '0';
				}
			}
			this.hdistanceMoved = 0;
			this.vdistanceMoved = 0;
			touchStarted=false;
		},

		scrollerMoveCSS : function(el, distanceToMove, time, timingFunction) {
			if (!time)
				time = 0;
			if (!timingFunction)
				timingFunction = "linear";

			el.style.webkitTransform = "translate" + translateOpen
					+ distanceToMove.x + "px," + distanceToMove.y + "px"
					+ translateClose;
			el.style.webkitTransitionDuration = time + "ms";
			el.style.webkitBackfaceVisiblity = "hidden";
			el.style.webkitTransitionTimingFunction = timingFunction;
		},

		scrollTo : function(pos) {
			this.scrollerMoveCSS(this.el, pos, 0);
		}
	};
	return scroller;
})();

// Helper function to get only
if (!window.numOnly) {
	function numOnly(val) {
		if (isNaN(parseFloat(val)))
			val = val.replace(/[^0-9.-]/, "");

		return parseFloat(val);
	}
}
