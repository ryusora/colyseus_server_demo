import { Room } from "colyseus";
import { TestRoom } from "./testRoom";

export class LobbyRoom extends Room {
    listRooms = {};
    server = null;
    onInit (options) {
        console.log("LobbyRoom created!", options);
        this.server = options.server;
    }

    onJoin (client, options) {
        if(options.contextID) {
            if(!this.listRooms[options.contextID]) {
                this.listRooms[options.contextID] = this.server.register(options.contextID, TestRoom);
                console.log("Register Farm Room for " + options.contextID);
            }
            else {
                console.log("Farm Room available for " + options.contextID);
            }
        }
    }
    onLeave (client) {
        console.log("client is leaving LobbyRoom", client);
    }

    onMessage (client, data) {
        console.log("LobbyRoom received message from", client.sessionId, ":", data);
    }

    onDispose () {
        console.log("Dispose LobbyRoom");
    }

}
