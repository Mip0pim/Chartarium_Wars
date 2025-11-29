import Phaser from 'phaser';


export class OnlineScene extends Phaser.Scene {
    constructor() {
        super('OnlineScene');
    }

    preload() {//carga de archivos
        this.load.image('Fondo', 'imagenes/Fondo.jpg');
    }

    create() {

        //fondo
        this.add.image(400, 310, 'Fondo');
        
        const onlineBtn = this.add.image(400, 90, "BTNOnline")
            .setOrigin(0.5);
            onlineBtn.setScale(0.33);

        this.add.text(400, 310, 'La funcionalidad online no está disponible en esta versión', {
            fontSize: '22px',
            color: '#000000ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        const menuBtn = this.add.image(400,525,'BTNMenu').setOrigin(0.5).setScale(0.4)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => menuBtn.setScale(0.43))
        .on('pointerout', () => menuBtn.setScale(0.4))
        .on('pointerdown', () => {
            this.scene.start('MenuScene');
        });

    }
}