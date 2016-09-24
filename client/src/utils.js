
function DBG(a) { console.log(a); }

function $(sel) { return document.querySelector(sel); }

function addClass(e, cls) {
	if(hasClass(e,cls)) return;
	e.className += " " + cls;
}

function removeClass(e, cls) {
	e.className = (" "+e.className+" ").replace(" "+cls+" ", " ").trim();
}

function hasClass(e, cls) {
	return (" "+e.className+" ").indexOf(" "+cls+" ")!==-1;
}

function toggleClass(e, cls) {
	if(hasClass(e,cls)) removeClass(e,cls); else addClass(e,cls);
}

function mimicClass(eTo, clsTo, eFrom, clsFrom) {
	if(!hasClass(eFrom, clsFrom)) removeClass(eTo, clsTo); else addClass(eTo, clsTo);
}

function mimicClassInv(eTo, clsTo, eFrom, clsFrom) {
	if(hasClass(eFrom, clsFrom)) removeClass(eTo, clsTo); else addClass(eTo, clsTo);
}
