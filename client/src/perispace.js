function polar(theta, rho) {
	theta = (theta-90)/57.2958;
	return [rho*Math.cos(theta), rho*Math.sin(theta)];
}

function vec_rotate_90(v) {
	return [-v[1],v[0]];
}

function vec_add(A,B) {
	return [A[0]+B[0],A[1]+B[1]];
}

function vec_sub(A,B) {
	return [A[0]-B[0],A[1]-B[1]];
}

function vec_normalize(v, length) {
	if(!length) length = 1;
	var l = Math.sqrt(v[0]*v[0]+v[1]*v[1])/length;
	return [v[0]/l, v[1]/l];
}

function vec_mul(v, x) {
	return [v[0]*x, v[1]*x];
}

function circle_bezier(A,B) {
	var Anormal = vec_mul(vec_rotate_90(A), 0.45);
	var Bnormal = vec_mul(vec_rotate_90(B), 0.45);
	return [vec_add(A,Anormal), vec_sub(B,Bnormal), B];
}

function compute_obstacles_path() {
	var ANGLES = [0,45,180-45,180+45,-45];
	var RADIUS = 70;
	var _bezier = [];
	var origin = null;
	var last = null;
	obstacles.forEach(function(o,i) {
		var elt = $("#obstacle_"+i);
		var pt = polar(ANGLES[i], o*RADIUS+60);
		elt.setAttribute("cx", pt[0]);
		elt.setAttribute("cy", pt[1]);
		if(!origin) origin = pt;
		else {
			_bezier.push(circle_bezier(last, pt));
		}
		last = pt;
	});
	_bezier.push(circle_bezier(last, origin));

	$("#obstacles").setAttribute("d", "M " + origin + " C " + _bezier.map(function(b) { return b.join(" "); }).join(",") + " z");
}
