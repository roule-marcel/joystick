var WebSocketServer = require('ws').Server;

var A = null;
var B = null;
var wss = new WebSocketServer({port: 3434});

wss.on('connection', function(ws) {
	console.log("connection");
    ws.onclose = function() { console.log("connection closed"); }
    ws.on('message', function(message) {
        console.log('received: %s', message);

        if(message==="source") {
    		A = ws;
            console.log("Source connected successfully !");
    	}
    	else if(message==="sink") {
    		B = ws;
    		console.log("Sink connected successfully !");
    	}

        if(ws===A) {
            console.log('A->B : %s', message);
            if(B) B.send(message);
        }
        else if(ws===B) {
            console.log('B->A : %s', message);
            if(A) A.send(message);
        }

    });
});

console.log("Marcel camera-server listening on port 3434");
