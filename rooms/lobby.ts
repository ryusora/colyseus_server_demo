import { Room } from "colyseus";
import { TestRoom } from "./testRoom";

export class LobbyRoom extends Room {
    listRooms = {};
    onJoinCallback = null;
    onInit (options) {
        console.log("LobbyRoom created!");
    }

    registerEventJoin(callback){
        console.log("LobbyRoom Register Join callback");
        this.onJoinCallback = callback;
    }

    onJoin (client, options) {
        if(!this.listRooms[options.contextID]) {
            console.log("LobbyRoom OnJoin");
            if(this.onJoinCallback)
                this.onJoinCallback(client, options);
            else
                console.log("LobbyRoom OnJoincallback fail to call");
        }
        else {
            console.log("Room created already");
            this.send(client, {roomReady: true});
        }
    }
    onContextRoomCreated(room, client, options) {
        console.log("Room Created");
        this.listRooms[options.contextID] = room;
        this.send(client, {roomReady: true});
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
