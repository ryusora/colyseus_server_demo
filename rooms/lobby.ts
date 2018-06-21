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
                this.gameServer.register(contextID, TestRoom).on("create", function(room) {
                    console.log("room create", room.id, " with context id " + contextID);
                    this.listRooms[contextID] = room;
                    this.send(client, {roomReady:true});
                }.bind(this));
            }
            else {
                setTimeout(function(){
                    console.log("Farm Room available for " + contextID);
                    this.send(client, {roomReady:true});
                }.bind(this), 1000); 
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
