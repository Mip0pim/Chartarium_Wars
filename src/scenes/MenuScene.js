import Phaser from 'phaser';


export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {//carga de archivos
        this.load.image('Fondo', 'imagenes/Fondo.jpg');
        this.load.image('Logo', 'imagenes/Logo.png');
    }


    create() {
        //fondo
        this.add.image(400, 310, 'Fondo');
        //logo
        this.add.image(400, 200, 'Logo');

        

        const localBtn = this.add.text(400, 420, 'Local 2 Player', {
            fontSize: '24px',
            color: '#00ff00',
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => localBtn.setColor('#00ff88'))
        .on('pointerout', () => localBtn.setColor('#00ff00'))
        .on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        const onlineBtn = this.add.text(400, 490, 'Online Multiplayer (Not available)', {
            fontSize: '24px',
            color: '#ff6666',
        }).setOrigin(0.5);
    }
}