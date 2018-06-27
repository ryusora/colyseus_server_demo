import { Client, EntityMap, nosync } from 'colyseus';
import { Player } from './game/entity/Player';

export class State {
    players: EntityMap<Player> = {};

    update (dt) {
        var players = this.players;
        for (var playerId in players) {
            if (players.hasOwnProperty(playerId)) {
                var player = players[playerId];
                player.update(dt);
            }
        }
    }
}