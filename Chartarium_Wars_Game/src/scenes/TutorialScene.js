import Phaser from 'phaser';


export class TutorialScene extends Phaser.Scene {
    constructor() {
        super('TutorialScene');
    }

    preload() {//carga de archivos
        this.load.image('Fondo', 'imagenes/Fondo.jpg');
    }

    create() {

        //fondo
        this.add.image(400, 310, 'Fondo');
        
        this.add.text(400, 100, 'Tutorial', {
            fontSize: '55px',
            color: '#000000ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(400, 150, 'Controles:', {
            fontSize: '25px',
            color: '#000000ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(400, 180, 'Player 1: wasd', {
            fontSize: '25px',
            color: '#000000ff',
        }).setOrigin(0.5);

        this.add.text(400, 210, 'Player 2: flechas direccionales', {
            fontSize: '25px',
            color: '#000000ff',
        }).setOrigin(0.5);
        
        this.add.text(400, 260, 'Objetivo:', {
            fontSize: '25px',
            color: '#000000ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(400, 290, 'Quitarle las tres vidas al oponente', {
            fontSize: '25px',
            color: '#000000ff',
        }).setOrigin(0.5);

        this.add.text(400, 340, 'Mecánicas:', {
            fontSize: '25px',
            color: '#000000ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(400, 370, 'Disparas automáticamente y solo cuando estas quieto', {
            fontSize: '25px',
            color: '#000000ff',
        }).setOrigin(0.5);
        
        this.add.text(400, 400, 'Tu cañón siempre apunta al otro jugador', {
            fontSize: '25px',
            color: '#000000ff',
        }).setOrigin(0.5);
        
        this.add.text(400, 430, 'Las balas rebotan 3 veces', {
            fontSize: '25px',
            color: '#000000ff',
        }).setOrigin(0.5);

        this.add.text(400, 460, 'Tus propias balas pueden darte', {
            fontSize: '25px',
            color: '#000000ff',
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
