import Phaser from 'phaser';

export class PauseScene extends Phaser.Scene {

    constructor() {
        super('PauseScene');
    }
   
preload() {
        this.load.image('Fondo', 'imagenes/Fondo.jpg');
        this.load.image('BTNPause', 'imagenes/PausaCW.png');
        this.load.image('BTNMenu', 'imagenes/MenuCW.png');
        this.load.image('BTNContinue', 'imagenes/ContinuarCW.png');
        this.load.audio('sfx', 'audio/menusfx.mp3');
    }

    create(data) {
        //fondo
        this.add.image(400, 300, 'Fondo');

        this.add.image(400,200,'BTNPause').setOrigin(0.5).setScale(0.6);
        
        const resumeBtn = this.add.image(400,310,'BTNContinue').setOrigin(0.5).setScale(0.25)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => resumeBtn.setScale(0.28))
        .on('pointerout', () => resumeBtn.setScale(0.25))
        .on('pointerdown', () => {
            this.sound.play('sfx', { volume: 0.5 });
            this.scene.stop();
            this.scene.resume(data.originalScene);
            this.scene.get(data.originalScene).resume();
        });

        const menuBtn = this.add.image(400,400,'BTNMenu').setOrigin(0.5).setScale(0.4)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => menuBtn.setScale(0.43))
        .on('pointerout', () => menuBtn.setScale(0.4))
        .on('pointerdown', () => {
            this.sound.play('sfx', { volume: 0.5 });
            this.scene.stop('GameScene');
            this.scene.stop();
            this.scene.start('MenuScene');
        });
    }
}
