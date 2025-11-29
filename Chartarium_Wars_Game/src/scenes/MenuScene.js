import Phaser from 'phaser';


export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {//carga de archivos
        this.load.image('Fondo', 'imagenes/Fondo.jpg');
        this.load.image('Logo', 'imagenes/Logo.png');

        this.load.image('BTNPlayer', 'imagenes/LocalBtnCW.png');
        this.load.image('BTNCredit', 'imagenes/CreditosCW.png');
        this.load.image('BTNOnline', 'imagenes/OnlineBtnCW.png');   
    }


    create() {
        //fondo
        this.add.image(400, 310, 'Fondo');
        //logo
        const logo=this.add.image(400, 180, 'Logo')
        .setOrigin(0.5);
        logo.setScale(1.1);
        
        const localBtn = this.add.image(280, 380, "BTNPlayer")
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
                localBtn.setScale(1.2)
            .on('pointerover', () => {
                //localBtn.setTint(0x00ff88);   // aplica color
                localBtn.setScale(1.3);       // aumenta tamaño un 10%
            })
            .on('pointerout', () => {
                //localBtn.setTint(0x00ff00);   // vuelve al color original
                localBtn.setScale(1.2);         // vuelve al tamaño original
            })
            .on('pointerdown', () => {
                this.scene.start('SelectColor');
        });

        const onlineBtn = this.add.image(520, 380, "BTNOnline")
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
                onlineBtn.setScale(0.19)
            .on('pointerover', () => {
                //localBtn.setTint(0x00ff88);   // aplica color
                onlineBtn.setScale(0.20);       // aumenta tamaño un 10%
            })
            .on('pointerout', () => {
                //localBtn.setTint(0x00ff00);   // vuelve al color original
                onlineBtn.setScale(0.19);         // vuelve al tamaño original
            })
            .on('pointerdown', () => {
                this.scene.start('OnlineScene');
        });

        const tutorialBtn = this.add.text(280, 520, 'Tutorial', {
            fontSize: '32px',
            color: '#000000ff',
            fontStyle: 'bold'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                //localBtn.setTint(0x00ff88);   // aplica color
                tutorialBtn.setScale(1.1);       // aumenta tamaño un 10%
            })
            .on('pointerout', () => {
                //localBtn.setTint(0x00ff00);   // vuelve al color original
                tutorialBtn.setScale(1);         // vuelve al tamaño original
            })
            .on('pointerdown', () => {
                this.scene.start('TutorialScene');
        });

        const creditBtn = this.add.image(520, 520, "BTNCredit")
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