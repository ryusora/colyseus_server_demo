import { State } from '../State'
import { Player } from '../game/entity/Player'

export function Move (state: State, player: Player, data: Array<any>) {
    if (player) {
        player.x = data[1];
        player.y = data[2];
        console.log(player);
    }
}