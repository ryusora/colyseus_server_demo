import { Room } from "colyseus";

export class TestRoom extends Room {
    // this room supports only 4 clients connected
    maxClients = 4;

    onInit (options) {
        console.log("TestRoom created!", options);
    }

    onJoin (client) {
        this.broadcast(`${ client.sessionId } joined.`);
    }

    onLeave (client) {
        this.broadcast(`${ client.sessionId } left.`);
    }

    onMessage (client, data) {
        console.log("TestRoom received message from", client.sessionId, ":", data);
        this.broadcast(data);
    }

    onDispose () {
        console.log("Dispose BasicRoom");
    }

}
