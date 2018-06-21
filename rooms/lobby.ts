import { Room } from "colyseus";
import { TestRoom } from "./testRoom";

export class LobbyRoom extends Room {
    listRooms = {};
    gameServer = null;
    onInit (options) {
        console.log("LobbyRoom created!");
    }

    onJoin (client, options) {
        if(!this.gameServer) {
            console.log("server is not created yet!");
            return;
        }
        if(options.contextID) {
            let contextID = options.contextID;
            if(!this.listRooms[contextID]) {
                console.log("Register Farm for " + contextID);

                let timeout = setTimeout(function() {
                    timeout = null;
                    console.log("Register Farm timeout call");
                    this.send(client, {roomReady:true});
                }.bind(this), 1000);

                this.listRooms[contextID] = this.gameServer.register(contextID, TestRoom).on("create", function(room) {
                    if(timeout)
                        clearTimeout(timeout);
                    timeout = null;
                    console.log("room create", room.id, " with context id " + contextID);
                    this.send(client, {roomReady:true});
                    return room;
                }.bind(this));
            }
            else {
                console.log("Farm Room available for " + contextID);
                this.send(client, {roomReady:true});
            }
        }
    }
    onLeave (client) {
        console.log("client is leaving LobbyRoom");
    }

    onMessage (client, data) {
        console.log("LobbyRoom received message from", client.sessionId, ":", data);
    }

    onDispose () {
        console.log("Dispose LobbyRoom");
    }

}
