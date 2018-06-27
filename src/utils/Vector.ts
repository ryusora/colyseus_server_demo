export class Vector2 {
    x = 0;
    y = 0;

    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    clone () {
        return new Vector2(this.x, this.y);
    }

    normalize () {
        var x = this.x;
        var y = this.y;
        var r = 1 / Math.sqrt(x*x + y*y);
        this.x = x * r;
        this.y = y * r;
        return this;
    }

    equal (v2: Vector2) {
        return this.x == v2.x && this.y == v2.y;
    }

    add (v2: Vector2) {
        this.x = this.x + v2.x;
        this.y = this.y + v2.y;
        return this;
    }

    subtract (v2: Vector2) {
        this.x = this.x - v2.x;
        this.y = this.y - v2.y;
    }

    mul (k: number) {
        this.x = this.x * k;
        this.y = this.y * k;
        return this;
    }

    dot (v2: Vector2) {
        return (this.x * v2.x) + (this.y * v2.y);
    }

    cross (v2: Vector2) {
        return (this.x * v2.y) - (this.y * v2.x);
    }

    static add (v1: Vector2, v2: Vector2) {
        return new Vector2(v1.x + v2.x, v1.y + v2.y);
    }

    static subtract (v1: Vector2, v2: Vector2) {
        return new Vector2(v1.x - v2.x, v1.y - v2.y);
    }

    static angleBetween (v1: Vector2, v2: Vector2) {
        var dot = v1.dot(v2);
        if (dot == 0) {
            return Math.PI/2;
        }

        var cross = v1.cross(v2);
        if (cross == 0) {
            if (dot >= 0)
                return 0;
            else
                return Math.PI;
        }

        return Math.acos(dot/cross);
    }

    static add_c (x1: number, y1: number, x2: number, y2: number) {
        return new Vector2(x1 + x2, y1 + y2);
    }

    static subtract_c (x1: number, y1: number, x2: number, y2: number) {
        return new Vector2(x1 - x2, y1 - y2);
    }
}