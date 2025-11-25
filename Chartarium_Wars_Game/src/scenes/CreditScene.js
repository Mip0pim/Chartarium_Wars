import Phaser from 'phaser';


export class CreditScene extends Phaser.Scene {
    constructor() {
        super('CreditScene');
    }

    preload() {//carga de archivos
        this.load.image('Fondo', 'imagenes/Fondo.jpg');
        this.load.image('BTNCredit', 'imagenes/CreditosCW.png');
    }

    create() {

        //fondo
        this.add.image(400, 310, 'Fondo');
        
        const creditBtn = this.add.image(400, 90, "BTNCredit")
            .setOrigin(0.5);
                creditBtn.setScale(1.5);
        
        this.add.text(400, 200, 'Creado por:', {
            fontSize: '40px',
            color: '#000000ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(400, 260, 'Carlos Martínez García', {
            fontSize: '35px',
            color: '#000000ff'
        }).setOrigin(0.5);

        this.add.text(400, 320, 'Pablo Romero Labrado', {
            fontSize: '35px',
            color: '#000000ff'
        }).setOrigin(0.5);

        this.add.text(400, 380, 'Iván Palacios Martín', {
            fontSize: '35px',
            color: '#000000ff'
        }).setOrigin(0.5);

        this.add.text(400, 440, 'Alex Yu Weng', {
            fontSize: '35px',
            color: '#000000ff'
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
