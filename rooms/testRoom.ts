import { Room, EntityMap, nosync } from "colyseus";

export class State {
    players: EntityMap<Player> = {};

    createPlayer (id: string) {
        this.players[ id ] = new Player();
    }

    removePlayer (id: string) {
        console.log("remove player " + id);
        delete this.players[ id ];
    }

    setPlayerName(id: string, name: string) {
        this.player[id].name = name;
    }

    movePlayer (id: string, movement: any) {
        this.players[ id ]["position"] = JSON.stringify(movement);
        console.log("change position of player " + id + " to position ", this.players[ id ].position);
    }
}

export class Player {
    position = JSON.stringify({x:0, y:0});
    name = "Anonymous";
}

export class TestRoom extends Room<State> {
    // this room supports only 4 clients connected
    maxClients = 4;

    onInit (options) {
        console.log("TestRoom created!", options);
        this.setState(new State());
    }

    onJoin (client) {
        this.state.createPlayer(client.sessionId);
    }

    onLeave (client) {
        this.state.removePlayer(client.sessionId);
    }

    onMessage (client, data) {
        console.log("TestRoom received message from", client.sessionId, ":", data);
        if(data.name) {
            this.state.setPlayerName(client.sessionId, data.name);
        }else
            this.state.movePlayer(client.sessionId, data);
    }

    onDispose () {
        console.log("Dispose TestRoom");
    }

}
