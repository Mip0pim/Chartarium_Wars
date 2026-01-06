import { Bullet } from './Bullet';
import Phaser from 'phaser';
export class Turret {
    constructor(scene, tank, x, y, color) {
        this.myTank = tank;
        this.scene = scene;
        this.x = x;
        this.y = y;
        if(x>400){
            this.angle = Math.PI;
        }else{
            this.angle = 0;
        }
        this.color = color;
        this.target = null;
        this.rotateSpeed = Phaser.Math.DegToRad(1);
        this.canShoot = false;
        
        if (x > 400) {
            this.perfectAngle = Math.PI;
        }else{
            this.perfectAngle = 0;
        }
        this.leftAngle = 75;
        this.rightAngle = 105;

        if (this.color === "Red") {
            this.sprite = this.scene.physics.add.sprite(x, y, 'TorretaRed');
            this.sprite.setOrigin(0.15, 0.5);
        }
        if (this.color === "Green") {
            this.sprite = this.scene.physics.add.sprite(x, y, 'TorretaGreen');
            this.sprite.setOrigin(0.20, 0.5);
        }
        if (this.color === "Blue") {
            this.sprite = this.scene.physics.add.sprite(x, y, 'TorretaBlue');
            this.sprite.setOrigin(0.15, 0.5);
        }
        if (this.color === "Yellow") {
            this.sprite = this.scene.physics.add.sprite(x, y, 'TorretaYellow');
            this.sprite.setOrigin(0.2, 0.5);
        }
        this.sprite.body.allowGravity = false;
        
        this.SetPosition = (x, y) => { this.sprite.x = x; this.sprite.y = y; };
        this.sprite.setDepth(10);
        this.powerUpBullet = null;

        this.sprite.rotation = this.angle;
        this.fireEvent = null;
    }

    rotate() {
        this.aim();
        this.angle = this.perfectAngle;
        this.sprite.rotation = this.angle;
    }

    fire() {
        if (!this.myTank.canShoot) return; // Power-up no puede disparar
        
        if (this.powerUpBullet === null) {
            if (this.canShoot) {
                new Bullet(
                    this.scene,
                    this.myTank.GetX(),
                    this.myTank.GetY(),
                    this,
                    this.sprite.rotation,
                    this.color
                );
                this.scene.sound.play('sfx_game', { volume: 0.3 });
            }
        }
    }

    shoot(a) {
        this.canShoot = a;
        this.startAutoFire();
    }

    setTarget(tar) {
        this.target = tar;
    }

    aim() {
        if (!this.target) return;

        const dx = this.target.GetX() - this.sprite.x;
        const dy = this.target.GetY() - this.sprite.y;

        this.perfectAngle = Math.atan2(dy, dx);
        this.leftAngle = this.perfectAngle + Phaser.Math.DegToRad(30);
        this.rightAngle = this.perfectAngle - Phaser.Math.DegToRad(30);
    }

    // 🔹 iniciar disparo automático (solo una vez)
    startAutoFire() {
        if (!this.fireEvent) {
            this.fireEvent = this.scene.time.addEvent({
                delay: 1000,          // cada segundo
                callback: () => this.fire(),
                loop: true
            });
        }
    }

    destroy() {        
        if (this.fireEvent) {            
            this.fireEvent.remove(false);        
        }        
    this.sprite.destroy();         
    this.target = null;        
    this.myTank = null;    
    }

    setalpha(al){
        this.sprite.setAlpha(al);
    }
}