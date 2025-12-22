
import { PowerUp } from './PowerUp.js';
import Phaser from 'phaser';

export class PowerUpGenerator {
    constructor(scene,interval) {
        this.scene = scene;
        this.interval=interval; 
        this.types = ['Heal', 'Speed', 'Shield'];
        this.positionsX = [100,700,700,100,400];
        this.positionsY = [150,500,150,500,300];
        this.maxPowerUps = 0;
        this.startGenerating();
    }

    startGenerating() {
        this.scene.time.addEvent({
            delay: this.interval,
            callback: () => this.generatePowerUp(),
            loop: true
        });
    }
    generatePowerUp() {
        if (this.maxPowerUps<3){
        let index = Phaser.Math.Between(0,this.positionsX.length-1);
        let x = this.positionsX[index];
        let y = this.positionsY[index];
        let type = Phaser.Utils.Array.GetRandom(this.types);
        new PowerUp(this.scene, x, y, type, this);
        this.maxPowerUps+=1;
    }
    }
}
