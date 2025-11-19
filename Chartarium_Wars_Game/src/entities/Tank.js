export class Tank {
    constructor(scene, id, x, y) {
        this.id = id;
        this.scene = scene;
        this.lives = 5;
        this.dirX = 0;
        this.dirY = 0;
        this.baseSpeed = 200;
        this.speedMultiplier = 1;

        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x0000ff);
        graphics.fillRect(0, 0, 40, 60);
        graphics.generateTexture(`tank-${id}`, 40, 60);
        graphics.destroy();
        this.sprite = this.scene.physics.add.sprite(x, y, `tank-${id}`);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.allowGravity = false;
    }
}