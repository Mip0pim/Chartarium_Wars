import Phaser from 'phaser';


export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {//carga de archivos
        this.load.image('Fondo', 'imagenes/Fondo.jpg');
        this.load.image('Logo', 'imagenes/Logo.png');

        this.load.image('BTNPlayer', 'imagenes/PLAYERCW.png');
        this.load.image('BTNCredit', 'imagenes/CreditosCW.png');   
    }


    create() {
        //fondo
        this.add.image(400, 310, 'Fondo');
        //logo
        const logo=this.add.image(400, 180, 'Logo').setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                //localBtn.setTint(0x00ff88);   // aplica color
                logo.setScale(1.1);       // aumenta tamaño un 10%
            })
            .on('pointerout', () => {
                //localBtn.setTint(0x00ff00);   // vuelve al color original
                logo.setScale(1);         // vuelve al tamaño original
        });

        
        const localBtn = this.add.image(400, 400, "BTNPlayer")
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                //localBtn.setTint(0x00ff88);   // aplica color
                localBtn.setScale(1.1);       // aumenta tamaño un 10%
            })
            .on('pointerout', () => {
                //localBtn.setTint(0x00ff00);   // vuelve al color original
                localBtn.setScale(1);         // vuelve al tamaño original
            })
            .on('pointerdown', () => {
                this.scene.start('SelectColor');
        });

        

        const onlineBtn = this.add.text(400, 470, 'Online Multiplayer', {
            fontSize: '24px',
            color: '#ff6666',
        }).setOrigin(0.5);


        const creditBtn = this.add.image(400, 520, "BTNCredit")
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                //localBtn.setTint(0x00ff88);   // aplica color
                creditBtn.setScale(1.1);       // aumenta tamaño un 10%
            })
            .on('pointerout', () => {
                //localBtn.setTint(0x00ff00);   // vuelve al color original
                creditBtn.setScale(1);         // vuelve al tamaño original
            })
            .on('pointerdown', () => {
                this.scene.start('CreditScene');
        });
    }
}