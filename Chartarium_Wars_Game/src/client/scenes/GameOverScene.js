import Phaser from 'phaser';


export class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }
    preload(){
        this.load.image('Fondo', 'imagenes/Fondo.jpg');
        this.load.image('BTNMenu', 'imagenes/MenuCW.png');
        this.load.image('BTNGanador', 'imagenes/GanadorCW.png');
        this.load.image('P', 'imagenes/Pcw.png');
        this.load.image('1', 'imagenes/1CW.png');
        this.load.image('2', 'imagenes/2CW.png');
        this.load.audio('sfx', 'audio/menusfx.mp3');
    }
    init(data){
        this.ganador=data?.ganador;
        this.color=data?.color;
    }

    create() {
        this.add.image(400, 300, 'Fondo');

        this.add.image(400, 100, 'BTNGanador').setOrigin(0.5).setScale(0.6);

        this.add.image(355, 200, 'P').setOrigin(0.5).setScale(0.5);

        const ganador = this.ganador;
        let ganadorKey = null;
        if (ganador.includes('1')) ganadorKey = '1';
        else if (ganador.includes('2')) ganadorKey = '2';
        this.add.image(445, 200, ganadorKey).setOrigin(0.5).setScale(0.5);
        
        this.add.image(400, 375, `Base${this.color}`).setOrigin(0.5, 0.5).setScale(3);
        if(this.color==='Amarillo' || this.color==='Verde'){
            this.torre=this.add.image(400, 375, `Torreta${this.color}`).setOrigin(0.2, 0.5).setScale(3);
        }else{
            this.torre=this.add.image(400, 375, `Torreta${this.color}`).setOrigin(0.15, 0.5).setScale(3);
        }
        

        const menuBtn = this.add.image(400,540,'BTNMenu').setOrigin(0.5).setScale(0.4)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => menuBtn.setScale(0.43))
        .on('pointerout', () => menuBtn.setScale(0.4))
        .on('pointerdown', () => {
            this.sound.play('sfx', { volume: 0.5 });
            this.scene.start('MenuScene');
        });
    }

    update(){
        this.torre.rotation+=Math.PI/180;
    }
}