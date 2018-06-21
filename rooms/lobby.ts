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
            let contextID = options.contextID;
            if(!this.listRooms[contextID]) {
                this.listRooms[contextID] = this.server.register(contextID, TestRoom);
                this.listRooms[contextID].on("create", function(room) {
                    console.log("room create", room, " with context id " + contextID);
                    this.send(client, {roomReady:true});
                }.bind(this));
            }
            else {
                console.log("Farm Room available for " + contextID);
                this.send(client, {roomReady:true});
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
