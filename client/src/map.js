function compute_map() {
	var d = "";
	if(trajectory.length >= 1) {
		d += "M" + trajectory[0][0] + " " + trajectory[0][1];
	}
	if(trajectory.length >= 2){
		d+="L";
		for(var i=1; i<trajectory.length; i++) {
			d += " " + trajectory[i][0] + " " + trajectory[i][1];
		}
	}

	$("#path").setAttribute("d", d);
}
