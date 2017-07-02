
var WebSocket = require('websocket').server
var http = require('http')

var server = http.createServer(function (req, res) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
})

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
})

var wsServer = new WebSocket({
    httpServer: server,
    autoAcceptConnections: false
})

function allowedOrigins(origin) {
    // TODO 
    console.log((new Date()) + 'request received from Origin : ', origin);
    return true;
}

wsServer.on('request', function(request) {
    if (! allowedOrigins(request.origin)) {
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    var conn = request.accept('echo-protocol', request.origin)
    console.log((new Date()) + ' Connection Accepted.')
    conn.sendUTF('Hello World!!!')
    
    conn.on('message', function(message) {
        console.log('Received Message on Socket: ', message);
        if (message.type === 'utf8') {
            message.utf8Data = 'Ramukaka: ' + message.utf8Data 
            conn.sendUTF(message.utf8Data)
        }else if (message.type === 'binary') {
            conn.sendBytes(message.binaryData)
        }
    })

    conn.on('close', function(reasonCode, desc) {
        console.log((new Date()) + ' Peer ' + conn.remoteAddress + ' disconnected.');
    })

})
