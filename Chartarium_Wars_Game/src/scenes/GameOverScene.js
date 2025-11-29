import Phaser from 'phaser';


export class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }
    preload(){
        this.load.image('Fondo', 'imagenes/Fondo.jpg');
    }
    init(data){
        this.ganador=data?.ganador;
        this.color=data?.color;
    }

    create() {
        this.add.image(400, 310, 'Fondo');
        
        this.add.text(400, 150, "Ganador: "+this.ganador, {
            fontSize: '70px',
            color: '#600000ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.image(400, 300, `Base${this.color}`).setOrigin(0.5, 0.5).setScale(3);
        this.torre=this.add.image(400, 300, `Torreta${this.color}`).setOrigin(0.15, 0.5).setScale(3);

        this.add.text(400, 450, 'Back to menu', {
            fontSize: '40px',
            color: '#000000ff',
            fontStyle: 'bold'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }

    update(){
        this.torre.rotation+=Math.PI/180;
    }
}