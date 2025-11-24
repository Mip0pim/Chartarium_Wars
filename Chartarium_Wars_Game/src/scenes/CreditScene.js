import Phaser from 'phaser';


export class CreditScene extends Phaser.Scene {
    constructor() {
        super('CreditScene');
    }

    preload() {//carga de archivos
        this.load.image('Fondo', 'imagenes/Fondo.jpg');
    }

    create() {

        //fondo
        this.add.image(400, 310, 'Fondo');
        
        this.add.text(400, 100, 'CREDITS', {
            fontSize: '64px',
            color: '#00ffff'
        }).setOrigin(0.5);

        const localBtn = this.add.text(400, 320, 'Back to menu', {
            fontSize: '24px',
            color: '#00ff00',
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => localBtn.setColor('#00ff88'))
        .on('pointerout', () => localBtn.setColor('#00ff00'))
        .on('pointerdown', () => {
            this.scene.start('MenuScene');
        });

    }
}