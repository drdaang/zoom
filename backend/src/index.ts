import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let senderSocket: WebSocket | null = null;
let receiverSocket: WebSocket | null = null;

wss.on('connection', function connection(ws) {
    console.log('New client connected');

    ws.on('error', console.error);

    ws.on('message', function message(data: any) {
        

        
        const message = JSON.parse(data);
        console.log(message);
        if (message.type == 'sender') {
            console.log("sender set")
            senderSocket = ws;
        }
        else if (message.type == 'receiver') {
            console.log("receiver set")
            receiverSocket = ws;
        }
        else if (message.type == 'createOffer') {
            if (ws !== senderSocket) {
                return;
            }
            console.log("offer received")
            receiverSocket?.send(JSON.stringify({type:'createOffer',sdp:message.sdp}))
        }
        else if (message.type == 'createAnswer')
        {
            if (ws !== receiverSocket) {
                return;
             }
            console.log("answer received")
            senderSocket?.send(JSON.stringify({type:'createAnswer',sdp:message.sdp}))
        }
        else if (message.type == 'iceCandidate') {

            if (ws == senderSocket) {
                receiverSocket?.send(JSON.stringify({type:'iceCandidate',candidate:message.candidate}))
            }
            else if (ws == receiverSocket) {
                senderSocket?.send(JSON.stringify({type:'iceCandidate',candidate:message.candidate}))
            }
        }
        
        
    });

    
});

console.log('WebSocket server is running on ws://localhost:8080');
