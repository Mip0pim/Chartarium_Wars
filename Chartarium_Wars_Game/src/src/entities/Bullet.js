import { Turret } from './Turret';

export class Bullet {
    constructor(scene, x, y, turret, angle, color) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.color = color;
        this.myTurret = turret;
        this.dir = angle;
        this.baseSpeed = 200;
        this.speedMult = 1;
        this.canCollide = true;
        this.bounces = 3;

        if (this.color === "Red") {
            this.sprite = this.scene.physics.add.sprite(x, y, 'BalaRed');
        }
        if(this.color==="Green"){
            this.sprite = this.scene.physics.add.sprite(x, y, 'BalaGreen');
        }
        if(this.color==="Blue"){
            this.sprite = this.scene.physics.add.sprite(x, y, 'BalaBlue');
        }
        if(this.color==="Yellow"){
            this.sprite = this.scene.physics.add.sprite(x, y, 'BalaYellow');
        }
        this.sprite.body.allowGravity = false;
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(1);
        this.sprite.rotation=this.dir;
        this.sprite.setDepth(5);
        this.setDir();
        this.scene.events.on('update', this.update, this);
    }

    setDir() {
        this.sprite.setVelocity(
            Math.cos(this.dir) * this.baseSpeed * this.speedMult,
            Math.sin(this.dir) * this.baseSpeed * this.speedMult
        );
    }

    update() {
    // Solo si la bala tiene cuerpo físico
        if (this.sprite.body) {
            const vx = this.sprite.body.velocity.x;
            const vy = this.sprite.body.velocity.y;

            // atan2 devuelve el ángulo en radianes según la dirección del vector
            this.sprite.rotation = Math.atan2(vy, vx);
            this.destroy();
        }
    }

    destroy() {
        if (this.bounces<1){
        this.scene.events.off('update', this.update, this);
        this.sprite.destroy();
        }
    }
}
