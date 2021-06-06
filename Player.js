class Player {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 1;
        this.col = 255;
    }

    move(dir) {
        let velX = 0;
        let velY = 0;
        switch (dir) {
            case 'l':
                velX = -this.speed;
                break;
            case 'r':
                velX = this.speed;
                break;
            case 'u':
                velY = -this.speed;
                break;
            case 'd':
                velY = this.speed;
                break;
        }
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].isCollidable && this.x + velX == blocks[i].x && this.y + velY == blocks[i].y) {
                velX = 0;
                velY = 0;
            }
        }
        this.x += velX;
        this.y += velY;
    }
}