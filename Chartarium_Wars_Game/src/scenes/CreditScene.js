import Phaser from 'phaser';


export class CreditScene extends Phaser.Scene {
    constructor() {
        super('CreditScene');
    }

    preload() {//carga de archivos
        this.load.image('Fondo', 'imagenes/Fondo.jpg');
        this.load.image('BTNCredit', 'imagenes/CreditosCW.png');
        this.load.image('Autores','imagenes/AutoresCW.png');
    }

    create() {

        //fondo
        this.add.image(400, 310, 'Fondo');
        
        const creditBtn = this.add.image(400, 90, "BTNCredit")
            .setOrigin(0.5);
                creditBtn.setScale(1.5);
        
        this.add.text(400, 180, 'Creado por:', {
            fontSize: '40px',
            color: '#000000ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.image(400,300,'Autores').setScale(0.3);

        this.add.text(400, 445, 'Música de Tiny Tanks', {
            fontSize: '36px',
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
