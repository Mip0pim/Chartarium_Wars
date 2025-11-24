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

        if (this.color === "red") {
            this.sprite = this.scene.physics.add.sprite(x, y, 'BalaRoja');
        }
        if(this.color==="green"){
            this.sprite = this.scene.physics.add.sprite(x, y, 'BalaVerde');
        }
        if(this.color==="blue"){
            this.sprite = this.scene.physics.add.sprite(x, y, 'BalaAzul');
        }
        if(this.color==="yellow"){
            this.sprite = this.scene.physics.add.sprite(x, y, 'BalaAmarilla');
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
