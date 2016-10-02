function dbg(s) {
	if(document && document.getElementById("dbg"))
		document.getElementById("dbg").innerHTML += "<br>" + s;
	else console.log(s);
}


var localVideo;
var remoteVideo;
var peerConnection;
var peerConnectionConfig = {'iceServers': [{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]};



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

	if(role === "source") {
		if(navigator.getUserMedia) {
	  		navigator.getUserMedia(constraints, getUserMediaSuccess, getUserMediaError);
  		} else {
	  		alert('Your browser does not support getUserMedia API');
  		}
	}
}



///////


function start(isCaller) {
	peerConnection = new RTCPeerConnection(peerConnectionConfig);
	peerConnection.onicecandidate = gotIceCandidate;
	peerConnection.onaddstream = gotRemoteStream;

	if(isCaller) {
		peerConnection.addStream(localStream);
		peerConnection.createOffer(gotDescription, createOfferError);
	}
}


function getUserMediaSuccess(stream) {
    localStream = stream;
	localVideo = document.getElementById('localVideo');
    if(localVideo) localVideo.src = window.URL.createObjectURL(stream);
}

function getUserMediaError(error) {
    console.log(error);
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
	remoteVideo.src = window.URL.createObjectURL(event.stream);
	console.log("got remote stream : " + remoteVideo.src);
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

	if(message === "sink" || message === "source") return;

	var signal = JSON.parse(message.data);
	if(signal.sdp) {
		peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp), function() {
			peerConnection.createAnswer(gotDescription, createAnswerError);
		});
	} else if(signal.ice) {
		peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice));
	}
}
