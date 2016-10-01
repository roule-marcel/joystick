var WebSocketServer = require('ws').Server;

var A = null;
var B = null;
var wss = new WebSocketServer({port: 3434});

wss.broadcast = function(data) {
    for(var i in this.clients) {
        this.clients[i].send(data);
    }
};

wss.on('connection', function(ws) {
	console.log("connection");
    ws.onclose = function() { console.log("connection closed"); }
    ws.on('message', function(message) {
        console.log('received: %s', message);

        if(A===null && message==="source") {
    		A = ws;
    		A.on('message', function(message) {
    	        console.log('A->B : %s', message);
    	        if(B) B.send(message);
    	    });
            console.log("Source connected successfully !");
    	}
    	else if(B===null && message==="sink") {
    		B = ws;
    		B.on('message', function(message) {
    	        console.log('B->A : %s', message);
    	        if(A) A.send(message);
    	    });
            console.log("Sink connected successfully !");
    	} else {
            wss.broadcast(message);
        }

    });
});

console.log("Marcel camera-server listening on port 3434");
