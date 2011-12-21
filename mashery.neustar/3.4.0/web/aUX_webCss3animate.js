/**
 * aUX.web.css3Animator 
 * @copyright 2011 - AppMobi
 */
 if(!window.aUX)
	aUX={};
if(!aUX.web)
	aUX.web={};
aUX.web.css3Animate = (function() {

	var translateOpen = 'm11' in new WebKitCSSMatrix() ? "3d(" : "(";
	var translateClose = 'm11' in new WebKitCSSMatrix() ? ",0)" : ")";
	var webkitTransitionCallbacks = {};

	var css3Animate = function(elID, options) {
		if (typeof elID == "string" || elID instanceof String) {
			this.el = document.getElementById(elID);
		} else {
			this.el = elID;
		}
		if (!this instanceof css3Animate) {
			return new css3Animate(elID, options);
		}
		if(!this.el)
			return;
		if(!options)
		{
			alert("Please provide configuration options for animation of "+elID);
			return;
		}
		this.el.addEventListener("webkitTransitionEnd", finishAnimation, false);
		if (options["opacity"]) {
			this.el.style.opacity = options["opacity"];

		}
		if(!options["y"])
			options["y"]=0;
		if(!options["x"])
			options["x"]=0;
		if (options["previous"]) {
			options.y += new WebKitCSSMatrix(
					window.getComputedStyle(this.el).webkitTransform).f;
			options.x += new WebKitCSSMatrix(
					window.getComputedStyle(this.el).webkitTransform).e;
		}
		if(!options["origin"])
		   options.origin="0% 0%";
		
		if(!options["scale"])
		   options.scale="1";
		
		if(!options["rotateY"])
		   options.rotateY="0";
		if(!options["rotateX"])
		   options.rotateX="0";
		if(!options["skewY"])
		   options.skewY="0";
		if(!options["skewX"])
		   options.skewX="0";
		   
		if(!options["timingFunction"])
			options["timingFunction"]="linear";
		
		//check for percent or numbers
		
		
		if(typeof(options.x)=="number"||(options.x.indexOf("%")==-1&&options.x.toLowerCase().indexOf("px")==-1&&options.x.toLowerCase().indexOf("deg")==-1))
		   options.x=parseInt(options.x)+"px";
		if(typeof(options.y)=="number"||(options.y.indexOf("%")==-1&&options.y.toLowerCase().indexOf("px")==-1&&options.y.toLowerCase().indexOf("deg")==-1))
		   options.y=parseInt(options.y)+"px";
		   
		this.el.style.webkitTransform = "translate" + translateOpen + (options.x)+"," + (options.y)+ translateClose + " scale("+parseFloat(options.scale)+") rotate("+options.rotateX+") rotateY("+options.rotateY+") skew("+options.skewX+","+options.skewY+")";
		this.el.style.webkitBackfaceVisiblity = "hidden";
		this.el.style.webkitTransition = "all " + options["time"];
		this.el.style.webkitTransitionTimingFunction = options["timingFunction"];
		this.el.style.webkitTransformOrigin=options.origin;

		if (options["width"]) {
			this.el.style.width = options["width"];
		}
		if (options["height"]) {
			this.el.style.height = options["height"];
		}
		if (options["callback"]) {

			this.el.callback=options["callback"];
			this.el.moving=true;
		}
	};

	function finishAnimation(event) {
		event.preventDefault();
		var that = event.target;
		if (!event.target.moving)
			return;
		event.target.moving = false;
		if (that.callback&&typeof(that.callback=="function")) {
			that.callback();
			that.callback="";
		}
	}
	return css3Animate;
})();