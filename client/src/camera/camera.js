function dbg(s) {
	document.getElementById("dbg").innerHTML += "<br>" + s;
}



navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;



function init_camera(role) {
	remoteVideo = document.getElementById('remoteVideo');

	serverConnection = new WebSocket('ws://'+ window.location.hostname +':3434');
	serverConnection.onopen = function() { if(role) serverConnection.send(role); };
	serverConnection.onmessage = gotMessageFromServer;

	var constraints = { video: true, audio: true };
}



///////


function start(isCaller) {
	peerConnection = new RTCPeerConnection(peerConnectionConfig);
	peerConnection.onicecandidate = gotIceCandidate;
	peerConnection.onaddstream = gotRemoteStream;

	if(isCaller) {
		peerConnection.createOffer(gotDescription, createOfferError);
	}
}

function gotDescription(description) {
	console.log('got description');
	peerConnection.setLocalDescription(description, function () {
		serverConnection.send(JSON.stringify({'sdp': description}));
	}, function() {console.log('set description error')});
}

function gotIceCandidate(event) {
	if(event.candidate != null) {
		serverConnection.send(JSON.stringify({'ice': event.candidate}));
	}
}

function gotRemoteStream(event) {
	dbg("got remote stream");
	console.log("got remote stream : " + event.stream);
	dbg("window.URL.createObjectURL = "+ window.URL.createObjectURL);
	dbg("window.URL.createObjectURL = "+ typeof window.URL.createObjectURL);
	dbg("remoteVideo = "+ remoteVideo);
	remoteVideo.src = window.URL.createObjectURL(event.stream);
	dbg("remoteVideo.src = " + remoteVideo.src);
}

function createOfferError(error) {
	dbg(error);
	console.log(error);
}

function createAnswerError(error) {
	dbg(error);
	console.log(error);
}

function gotMessageFromServer(message) {
	if(!peerConnection) start(false);

	var signal = JSON.parse(message.data);
	if(signal.sdp) {
		dbg("j'ai eu une offer");
		peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp), function() {
			dbg("j'ai créé une answer");
			peerConnection.createAnswer(gotDescription, createAnswerError);
		});
	} else if(signal.ice) {
		peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice));
	}
}
