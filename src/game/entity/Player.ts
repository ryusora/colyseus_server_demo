import { nosync } from 'colyseus'
import { Vector2 } from '../../utils/Vector'

export class Player {
    @nosync
    refCount = 0;

    x = 0;

    y = 0;

    speed = 100;

    @nosync
    target = {
        x: 0,
        y: 0
    }

    update (dt: number ) {
        var heading = Vector2.subtract_c(this.target.x, this.target.y, this.x, this.y).normalize();
        var velocity = heading.clone().mul(this.speed);
        var distant = velocity.clone().mul(dt);
        this.x += distant.x;
        this.y += distant.y;
    }
}