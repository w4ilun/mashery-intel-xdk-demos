/**
 * AppMobi.toolkit.template - a javascript template library Simple JavaScript
 * Templating from John Resig - http://ejohn.org/ - MIT Licensed
 */

if(!window.aUX)
	aUX={};
if (!aUX.web)
	aUX.web = {};

aUX.web.template = function(str, data) {
	//If there's no data, let's pass an empty object so the user isn't forced to.
	if (!data)
		data = {};
	return tmpl(str,data);
};

(function() {
	var cache = {};
	this.tmpl = function tmpl(str, data) {
		var fn = !/\W/.test(str) ? cache[str] = cache[str]
				|| tmpl(document.getElementById(str).innerHTML) : new Function(
				"obj", "var p=[],print=function(){p.push.apply(p,arguments);};"
						+ "with(obj){p.push('"
						+ str.replace(/[\r\t\n]/g, " ").replace(
								/'(?=[^%]*%>)/g, "\t").split("'").join("\\'")
								.split("\t").join("'").replace(/<%=(.+?)%>/g,
										"',$1,'").split("<%").join("');")
								.split("%>").join("p.push('")
						+ "');}return p.join('');");
		return data ? fn(data) : fn;
	};
})();