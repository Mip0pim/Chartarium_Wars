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
        this.canDamage = false;
        setTimeout(() => { this.canDamage = true; }, 200); //Esto es necesario o los tanques se dañarán al instante al disparar // NO TOCAR

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
        this.sprite.setSize(20,15);
        this.sprite.setBounce(0.8);
        this.sprite.rotation=this.dir;
        this.sprite.setDepth(5);
        this.setDir();
        this.scene.events.on('update', this.update, this);
        this.createCollisions();
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
        }
    }

    destroy() {
        this.bounces-=1;
        if (this.bounces<1){
        this.destroyBullet();
        }
    }

    destroyBullet() {        
        this.scene.events.off('update', this.update, this);        
        this.sprite.destroy();    
    }

    createCollisions() {
    this.scene.physics.add.collider(this.scene.left, this.sprite, () => { this.destroy(); });
    this.scene.physics.add.collider(this.scene.right, this.sprite, () => { this.destroy(); });
    this.scene.physics.add.collider(this.scene.top, this.sprite, () => { this.destroy(); });
    this.scene.physics.add.collider(this.scene.bottom, this.sprite, () => { this.destroy(); });
    this.scene.physics.add.collider(this.scene.block1, this.sprite, () => { this.destroy(); });
    this.scene.physics.add.collider(this.scene.block2, this.sprite, () => { this.destroy(); });
    this.scene.physics.add.collider(this.scene.centro1, this.sprite, () => { this.destroy(); });
    this.scene.physics.add.collider(this.scene.centro2, this.sprite, () => { this.destroy(); });
    this.scene.physics.add.collider(this.scene.centro3, this.sprite, () => { this.destroy(); }); 
    this.scene.players.forEach(tank => {
            this.scene.physics.add.collider(this.sprite, tank.sprite, () => {
                if (this.canDamage) {
                    tank.receiveDamage(1);
                    this.destroyBullet();
                }
            });
        });
    }
}