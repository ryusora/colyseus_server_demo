import { Room, EntityMap, Client } from "colyseus";
import { State } from './State';
import { Player } from './game/entity/Player';
import * as MovementHandler from './handler/MovementHandler';
import { __awaiter } from './utils/awaiter';

export class Game extends Room<State> {
    maxClients = 25;

    roomContext: string;

    sessionMap: EntityMap<string> = {};

    onInit (options: any) {
        console.log('Create new Room ' + options.roomContext);
        this.roomContext = options.roomContext;
        this.setState(new State());

        // this.setSimulationInterval(this.update.bind(this));
    }

    bkonJoin (client: Client, options: any) {
        var sessionId = client.sessionId;
        this.state.players[sessionId] = new Player();
        console.log('client join game ', client.sessionId)
    }

    bkonLeave (client: Client) {
        var sessionId = client.sessionId;
        if (this.state.players[sessionId]) {
            delete this.state.players[sessionId];
        }
    }

    bkonMessage (client: Client, data: any) {
        var sessionId = client.sessionId;
        var player = this.state.players[sessionId];

        console.log(data);
        if (data[0] === 'move') {
            MovementHandler.Move(this.state, player, data);
        }
    }

    onJoin (client: Client, options: any) {
        var playerId = options.playerId;
        var sessionId = client.sessionId;
        var player = this.state.players[playerId];

        if ( player ) {
            // Player already in room
            console.log('Same player joined room: ' + playerId);
        } else {
            // New player join room
            // Notify others
            console.log('New player joined room: ' + playerId);
            player = new Player();
            this.state.players[playerId] = player;
        }

        this.sessionMap[client.sessionId] = options.playerId;
        player.refCount++;
    }

    onLeave (client: Client) {
        var sessionId = client.sessionId;
        var playerId = this.sessionMap[sessionId];
        var player = this.state.players[playerId];

        console.log('Player leave room: ' + playerId);
        this.allowReconnection(client, 15)
            .then((client) => {
                console.log('Player reconnect room: ' + playerId);
            })
            .catch(() => {
                if (this.sessionMap.hasOwnProperty(sessionId)) {
                    delete this.sessionMap[sessionId];
                }

                player.refCount--;
                if (player.refCount === 0) {
                    // Notify player has left
                    console.log('Player has been dismissed: ' + playerId);
                    delete this.state.players[playerId];
                }
            });
    }

    onMessage (client: Client, data: any) {
        var playerId = this.sessionMap[client.sessionId];
        var player = this.state.players[playerId];

        console.log(data);
        if (data[0] === 'move') {
            MovementHandler.Move(this.state, player, data);
        }
    }

    onDispose () {
        return new Promise((resolve, reject) => {
            return console.log('Close Room ' + this.roomContext);
        })
    }

    update (dt) {
        this.state.update(dt);
    }

    getAvailableData () {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                clients: this.clients.length,
                maxClients: this.maxClients,
                metadata: this.metadata,
                roomId: this.roomId,
                roomContext: this.roomContext
            };
        });
    }

    getRoomContext () {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                roomId: this.roomId,
                roomContext: this.roomContext
            }
        });
    }
}