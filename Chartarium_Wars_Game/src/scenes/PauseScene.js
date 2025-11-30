import Phaser from 'phaser';

export class PauseScene extends Phaser.Scene {

    constructor() {
        super('PauseScene');
    }
   
preload() {
        this.load.image('Fondo', 'imagenes/Fondo.jpg');
        this.load.image('BTNPause', 'imagenes/PausaCW.png');
        this.load.image('BTNMenu', 'imagenes/MenuCW.png');
    }

    create(data) {
        //fondo
        this.add.image(400, 310, 'Fondo');

        this.add.image(400,200,'BTNPause').setOrigin(0.5).setScale(1)
        
        const resumeBtn = this.add.text(400, 320, 'Resume', {
            fontSize: '32px',
            color: '#036c03ff',
            fontStyle: 'bold'
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointover', () => resumeBtn.setColor('#002405ff'))
        .on('pointerout', () => resumeBtn.setColor('#036c03ff'))
        .on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume(data.originalScene);
            this.scene.get(data.originalScene).resume();
        });

        const menuBtn = this.add.image(400,400,'BTNMenu').setOrigin(0.5).setScale(0.4)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => menuBtn.setScale(0.43))
        .on('pointerout', () => menuBtn.setScale(0.4))
        .on('pointerdown', () => {
            this.scene.stop('GameScene');
            this.scene.stop();
            this.scene.start('MenuScene');
        });
    }
}
