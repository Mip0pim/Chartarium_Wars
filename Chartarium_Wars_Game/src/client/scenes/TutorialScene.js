import Phaser from 'phaser';


export class TutorialScene extends Phaser.Scene {
    constructor() {
        super('TutorialScene');
    }

    preload() {//carga de archivos
        this.load.image('Fondo', 'imagenes/Fondo.jpg');
        this.load.image('Tutorial', 'imagenes/TutorialCW.png');
        this.load.image('TutorialInfo', 'imagenes/InfoTutorialCW.png');
        this.load.image('TeclasTutorial', 'imagenes/TeclasTutorialCW.png');
        this.load.audio('sfx', 'audio/menusfx.mp3');
    }

    create() {

        //fondo
        this.add.image(400, 310, 'Fondo');
        
        this.add.image(400,80,'Tutorial').setOrigin(0.5).setScale(0.45);

        this.add.image(600, 300, 'TutorialInfo').setOrigin(0.5).setScale(0.4);
        this.add.image(200, 300, 'TeclasTutorial').setOrigin(0.5).setScale(0.4);
        const menuBtn = this.add.image(400, 525, 'BTNMenu')
            .setOrigin(0.5)
            .setScale(0.3)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => menuBtn.setScale(0.35))
            .on('pointerout', () => menuBtn.setScale(0.3))
            .on('pointerdown', () => {
                this.sound.play('sfx', { volume: 0.5 });
                this.scene.start('MenuScene');
            });

    }
}
