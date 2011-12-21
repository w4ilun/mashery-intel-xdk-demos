/*
 * aUX.web.appMobiPasswordbox
 * @copyright 2011 - AppMobi
 */
if(!window.aUX)
	aUX={};
if (!aUX.web)
	aUX.web = {};
aUX.web.appMobiPassword = function() {
	this.oldPasswords = {};
};

aUX.web.appMobiPassword.prototype = {
	oldPasswords: [],
    showPasswordPlainText: false,
    getOldPasswords: function(elID) {
        var container = elID && document.getElementById(elID) ? document
				.getElementById(elID) : document;
        if (!container) {
            alert("Could not find container element for appMobiPassword "
					+ elID);
            return;
        }
        var sels = container.getElementsByTagName("input");

        var that = this;
        for (var i = 0; i < sels.length; i++) {
            if (sels[i].type != "password")
                continue;

            this.oldPasswords[sels[i].id] = sels[i];
            var fakeInput = document.createElement("input");
            var selWidth = parseInt(sels[i].style.width) > 0 ? parseInt(sels[i].style.width)
					: 100;
            var selHeight = parseInt(sels[i].style.height) > 0 ? parseInt(sels[i].style.height)
					: 20;
            fakeInput.type = "text";
            if (sels[i].className != "") {
                fakeInput.style.width = selWidth + "px";
                fakeInput.style.height = selHeight + "px";
                fakeInput.style.backgroundColor = "white";
            }
            fakeInput.style.position = "relative";
            fakeInput.style.left = "0px";
            fakeInput.style.top = "0px";
            fakeInput.style.zIndex = "1";
            fakeInput.value = sels[i].value;
            fakeInput.showPasswordPlainText = that.showPasswordPlainText;
            fakeInput.className = sels[i].className;
            fakeInput.id = sels[i].id + "_appMobiPassword";
            fakeInput.placeHolder = sels[i].placeHolder;
            fakeInput.oldPW = sels[i];
            fakeInput.onkeyup = function() {
                var realPW = this.oldPW;
                if (realPW.value.length != this.value.length) {
                    var theText = this.value.substring(this.selectionStart - 1,
							this.selectionStart);
                    var oldCaret = this.selectionStart;
                    that.updatePassword(realPW, theText, this.selectionStart,
							this.value.length);
                    if (realPW.value.length > 0 && !this.showPasswordPlainText) {
                        var oldTxt = this.value;
                        this.value = "";
                        this.value = oldTxt.replace(theText, "*");
                        if (oldCaret != this.value.length)
                            this.setSelectionRange(oldCaret, oldCaret);
                    } else if (realPW.value.length == 0)
                        this.value = "";
                }
            };
            sels[i].parentNode.appendChild(fakeInput);
            sels[i].style.display = "none";
            sels[i].parentNode.appendChild(fakeInput);
        }
    },

    updatePassword: function(elem, val, caretPos, totalLength) {
        if (totalLength == 0) {
            elem.value = "";
        }
        if (totalLength > elem.value.length && val.length > 0) {
            var str = elem.value;
            elem.value = str.substring(0, caretPos - 1) + val
					+ str.substring(caretPos - 1, str.length);
        } else {
            var str = elem.value;
            elem.value = str.substring(0, caretPos)
					+ str.substring(caretPos + 1, str.length);
        }
    },
    changePasswordVisiblity: function(what, id) {
        what = parseInt(what);
        if (this.oldPasswords[id]) {
            var theEl = document.getElementById(id + "_appMobiPassword");
            if (what == 1) { //show
                this.showPasswordPlainText = true;
                theEl.showPasswordPlainText = showPasswordPlainText = true;
                theEl.value = this.oldPasswords[id].value;
            }
            else {
                this.showPasswordPlainText = false;
                theEl.showPasswordPlainText = showPasswordPlainText = false;
                var pwStr = "";
                for (var i = 0; i < theEl.value.length; i++) {
                    pwStr += "*";
                }
                theEl.value = pwStr;
            }
        }
    }
};
