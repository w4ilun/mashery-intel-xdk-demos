/**
 * AppMobi.toolkit.swipe - a library to detect swipe events for AppMobi Apps
 * Copyright 2011 - AppMobi 
 * Executes a callback function and passes in the direction return
 * @string (left,right,up,down)
 */

if(!window.aUX)
	aUX={};
if (!aUX.web)
	aUX.web = {};

aUX.web.swipeListener = (function() {
	var swipeListener = function(elID, opts) {
		var that = this;
		if(typeof(elID)=="string")
			this.el = document.getElementById(elID);
		else
			this.el=elID
		if (!this.el) {
			alert("Error adding swipe listener for " + elID);
			return;
		}
		//this.el.addEventListener('touchstart', function(e) {
		//	that.touchStart(e);
		//}, false);
		this.el.addEventListener('touchmove', function(e) {
			that.touchMove(e);
		}, false);
		this.el.addEventListener('touchend', function(e) {
			that.touchEnd(e);
		}, false);
		for (j in opts) {
			this[j] = opts[j];
		}
	};

	swipeListener.prototype = {
		startX : 0,
		startY : 0,
		movingX : 0,
		movingY : 0,
		vthreshold : 50,
		hthreshold : 50,
		movingElement : false,
		swipeDirection : {
			north : false,
			south : false,
			east : false,
			west : false
		},
		callBack : null,

		cancel : function() {
			this.startX = 0;
			this.startY = 0;
			this.movingX = 0;
			this.movingY = 0;
			this.movingElement = false;
			this.swipeDirection = {
				north : false,
				south : false,
				east : false,
				west : false
			};
		},
		touchStart : function(event) {
			if (event.touches[0].target
					&& event.touches[0].target.type != undefined) {
				return;
			}
			if (event.touches.length == 1) {
				this.movingElement = true;
				this.startX = event.touches[0].pageX;
				this.startY = event.touches[0].pageY;
				event.preventDefault();
			}
		},
		touchMove : function(event) {
		   if(this.movingElement==false)
		      this.touchStart(event);
			event.preventDefault();
			if (event.touches.length > 1 || !this.movingElement) {
				this.cancel();
				return;
			}
			this.movingX = event.touches[0].pageX - this.startX;
			this.movingY = event.touches[0].pageY - this.startY;
		},
		touchEnd : function(event) {
			if (!this.movingElement)
				return;
			event.preventDefault();
			var swiped = false;
			if (Math.abs(this.movingX) > this.hthreshold) {
				this.swipeDirection.east = this.movingX > 0;
				this.swipeDirection.west = this.movingX < 0;
				swiped = true;
			}
			if (Math.abs(this.movingY) > this.vthreshold) {
				this.swipeDirection.north = this.movingY < 0;
				this.swipeDirection.south = this.movingY > 0;
				swiped = true;
			}
			if (swiped && typeof (this.callBack == "function"))
				this.callBack(this.swipeDirection);

			this.cancel();
		}
	};
	return swipeListener;
})();

// Helper function to get only
if (!window.numOnly) {
	function numOnly(val) {
		if (isNaN(parseFloat(val)))
			val = val.replace(/[^0-9.-]/, "");

		return parseFloat(val);
	}
}