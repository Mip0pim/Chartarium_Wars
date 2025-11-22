import {Bullet } from './Bullet';
export class Turret {
    constructor(scene, tank, x, y) {
        this.myTank =tank;
        this.scene = scene;
        this.angle=0;
        this.x=x;
        this.y=y;
        this.target=null;
        this.rotateSpeed = Phaser.Math.DegToRad(1);

        this.perfectAngle=0;
        this.leftAngle=75;
        this.rightAngle=105;

        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0xff00ff);
        graphics.fillRect(0, 0, 60, 10);
        graphics.generateTexture(`turret-${tank}`, 60, 10);
        graphics.destroy();
        this.sprite = this.scene.physics.add.sprite(x, y, `turret-${tank}`);
        //this.sprite.setCollideWorldBounds(true);
        this.sprite.body.allowGravity = false;
        this.sprite.setOrigin(0.0, 0.5); // centrado en el tanque
        this.SetPosition = (x,y)=>{this.sprite.x=x;this.sprite.y=y;};
        this.powerUpBullet=null;
    }

    rotate(){
        this.aim();
        //this.angle+=this.rotateSpeed;
        this.angle=this.perfectAngle;
        this.sprite.rotation=this.angle;
    }

    fire(){
        //disparo
        if (this.powerUpBullet===null){
             let bullet = new Bullet(this.scene,this.myTank.GetX(),this.myTank.GetY(),this,this.sprite.rotation);
             this.canShoot=false;
        }
    
    }

    setTarget(tar){
        this.target=tar;
    }

    aim() {
        if (!this.target) return;

        const dx = this.target.GetX() - this.sprite.x;
        const dy = this.target.GetY() - this.sprite.y;

        this.perfectAngle = Math.atan2(dy, dx);

        this.leftAngle  = this.perfectAngle + Phaser.Math.DegToRad(30);
        this.rightAngle = this.perfectAngle - Phaser.Math.DegToRad(30);
    }

   

    

}