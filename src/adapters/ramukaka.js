
const Robot   = require('hubot').Robot
const Adapter = require('hubot').Adapter
const User = require('hubot').User
const TextMessage = require('hubot').TextMessage
const EnterMessage = require('hubot').EnterMessage

const path = require('path')
const WebSocket = require('websocket').server
const http = require('http')

class RamukakaAdapter extends Adapter {

    constructor(robot) {
        super(robot)
    }

    send(envelope, strings) {
        console.log ((new Date()) + ' From Send method')
        console.log ((new Date()) + ' Envelope: ', envelope)
        envelope.room.sendUTF(strings)
    } 

    emote(envelope, strings) {
        console.log ((new Date()) + ' From Emote method')
        console.log ((new Date()) + ' Envelope: ', envelope)
        //envelope.room.emit('message', strings)
        envelope.room.sendUTF(strings)
    }

    reply(envelope, strings) {
        console.log ((new Date()) + ' From Reply method')
        console.log ((new Date()) + ' Envelope: ', envelope)
        //envelope.room.emit('message', strings)
        envelope.room.sendUTF(strings)
    }

    run() {
        var publicDir = path.resolve(this.root, 'public')
        var webSocketServer = this.middleware()
        console.log('Server is listening')

        this.emit('connected')
    }

    get root() {
        return path.resolve(__dirname, '../../')
    }

    middleware() {
        var scope = this
        var wsServer = new WebSocket({
            httpServer: scope.robot.server,
            autoAcceptConnections: false
        })

        wsServer.on('request', function(request) {
            var parentScope = scope;
            var robot = parentScope.robot;
            var logger = robot.logger;

            if (! __allowedOrigins(request.origin)) {
                request.reject();
                console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
                return;
            }

            var conn = request.accept('echo-protocol', request.origin)
            logger.info('Connection Accepted.')

            var user = new User("user-id-" + Date.now(), {'room': conn})
            let entryMessage = robot.receive(new EnterMessage(user))
            conn.sendUTF('Hello there...')
            
            conn.on('message', function(message) {
                logger.info('Received Message on Socket: ', message);
                logger.info('Sending Message to Robot: ' + message.utf8Data)

                parentScope.receive(new TextMessage(user, message.utf8Data, "msg-id-" + Date.now()))
            })

            conn.on('close', function(reasonCode, desc) {
                console.log((new Date()) + ' Peer ' + conn.remoteAddress + ' disconnected.')
            })

            function __allowedOrigins(origin) {
                console.log((new Date()) + ' Checking Origin of the request => ', origin)
                // TODO
                return true
            }
        })

        return wsServer;
    }

}

module.exports = RamukakaAdapter