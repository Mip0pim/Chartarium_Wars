
import { PowerUp } from './PowerUp.js';
import Phaser from 'phaser';

export class PowerUpGenerator {
    constructor(scene,interval, online) {
        this.scene = scene;
        this.interval=interval;
        this.online = online; 
        this.types = ['Heal', 'Speed', 'Shield', 'NoShoot'];
        this.positionsX = [100,700,700,100,400];
        this.positionsY = [150,500,150,500,300];
        this.maxPowerUps = 0;
        if (!this.online)
            this.startGenerating();
    }

    startGenerating() {
        this.scene.time.addEvent({
            delay: this.interval,
            callback: () => this.generatePowerUp(),
            loop: true
        });
    }
    
    isSpawnValid(x, y) {
        // Zona invisible del tamaño aproximado del power-up
        const zone = this.scene.add.zone(x, y, 40, 40);
        this.scene.physics.add.existing(zone);
        zone.body.allowGravity = false;

        // Si toca cualquier muro/obstáculo => no vale
        const hitWall = this.scene.physics.overlap(zone, this.scene.obstacles);

        const hitPowerUp = this.scene.powerUpsGroup
            ? this.scene.physics.overlap(zone, this.scene.powerUpsGroup)
            : false;

        zone.destroy();
        return !hitWall && !hitPowerUp;
    }

    generatePowerUp() {
    if (this.maxPowerUps >= 3) return;

    // Probar puntos en orden aleatorio sin repetir
    const indices = Phaser.Utils.Array.Shuffle(
        [...Array(this.positionsX.length).keys()]
    );

    for (const i of indices) {
        const x = this.positionsX[i];
        const y = this.positionsY[i];

        if (this.isSpawnValid(x, y)) {
            const type = Phaser.Utils.Array.GetRandom(this.types);
            new PowerUp(this.scene, x, y, type, this);
            this.maxPowerUps += 1;
            return;
        }
    }
}


}
