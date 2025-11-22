import { Turret } from './Turret';
export class Bullet {
    constructor(scene,x,y,turret,angle){
        this.scene = scene;
        this.x=x;
        this.y=y;
        this.myTurret=turret;
        this.dir=angle;
        this.baseSpeed=200;
        this.speedMult=1;
        this.canCollide=true;
        this.bounces=3;

        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x000022);
        graphics.fillCircle(8, 8, 8);
        graphics.generateTexture('bullet', 16, 16);
        graphics.destroy();

        this.sprite = this.scene.physics.add.sprite(x, y, 'bullet');
        this.sprite.body.allowGravity = false;
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(1);
        this.setDir();
    }

    setDir(){        
        this.sprite.setVelocity(
        Math.cos(this.dir) * this.baseSpeed * this.speedMult,
        Math.sin(this.dir) * this.baseSpeed * this.speedMult
    );
}




}