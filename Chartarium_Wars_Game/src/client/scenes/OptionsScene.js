import Phaser from 'phaser';


export class OptionsScene extends Phaser.Scene {
    constructor() {
        super('OptionsScene');
    }

    preload() {//carga de archivos
        this.load.image('Fondo', 'imagenes/Fondo.jpg');
        this.load.image('BTNMenu', 'imagenes/MenuCW.png');
        this.load.audio('sfx', 'audio/menusfx.mp3');
    }

    create() {
        
        //fondo
        this.add.image(400, 310, 'Fondo');
        
        this.add.text(400, 90, 'Opciones', {
            fontSize: '75px',
            color: '#000000ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        const menuBtn = this.add.image(400,525,'BTNMenu').setOrigin(0.5).setScale(0.4)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => menuBtn.setScale(0.43))
        .on('pointerout', () => menuBtn.setScale(0.4))
        .on('pointerdown', () => {
            this.sound.play('sfx', { volume: 0.5 });
            this.scene.start('MenuScene');
        });
    }
}