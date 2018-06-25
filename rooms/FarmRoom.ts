import { Room } from "colyseus";

export class FarmRoom extends Room {
    // this room supports only 4 clients connected
    roomID = null;

    onInit (options) {
        console.log("Create room with ID: " + options.roomID);
        this.roomID = options.roomID;
    }

    onJoin (client) {
        console.log(client, "Join Room " + this.roomID);
    }

    onLeave (client) {
    }

    onMessage (client, data) {
        console.log("FarmRoom received message from", client.sessionId, ":", data);
    }

    onDispose () {
        console.log("Dispose FarmRoom");
    }

}
