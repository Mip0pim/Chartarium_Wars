
import { PowerUp } from './PowerUp.js';
import Phaser from 'phaser';

export class PowerUpGenerator {
    constructor(scene,interval) {
        this.scene = scene;
        this.interval=interval; 
        this.types = ['Heal', 'Speed', 'Shield'];
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
        let x = Phaser.Math.Between(50, this.scene.scale.width - 50);
        let y = Phaser.Math.Between(50, this.scene.scale.height - 50);
        let type = Phaser.Utils.Array.GetRandom(this.types);
        new PowerUp(this.scene, x, y, type, this);
        this.maxPowerUps+=1;
    }
    }
}
