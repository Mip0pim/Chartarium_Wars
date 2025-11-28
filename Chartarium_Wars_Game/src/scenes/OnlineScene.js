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
        
        const localBtn = this.add.text(400, 520, 'Back to menu', {
            fontSize: '50px',
            color: '#000000ff',
            fontStyle: 'bold'
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => localBtn.setColor('#535353ff'))
        .on('pointerout', () => localBtn.setColor('#000000ff'))
        .on('pointerdown', () => {
            this.scene.start('MenuScene');
        });

    }
}