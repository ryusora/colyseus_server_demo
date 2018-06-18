import { Room, EntityMap, nosync } from "colyseus";

export class State {
    players: EntityMap<Player> = {};

    @nosync

    createPlayer (id: string) {
        this.players[ id ] = new Player();
    }

    removePlayer (id: string) {
        delete this.players[ id ];
    }

    movePlayer (id: string, movement: any) {
        this.players.set(movement);
    }
}

export class Player {
    position = {x:0, y:0};

    set(pos) {
        this.position = pos;
    }
}

export class TestRoom extends Room {
    // this room supports only 4 clients connected
    maxClients = 4;

    onInit (options) {
    }

    onJoin (client) {
        this.state.createPlayer(client.sessionId);
    }

    onLeave (client) {
        this.state.removePlayer(client.sessionId);
    }

    onMessage (client, data) {
        console.log("TestRoom received message from", client.sessionId, ":", data);
        this.state.movePlayer(client.sessionId, data);
    }

    onDispose () {
        console.log("Dispose BasicRoom");
    }

}
