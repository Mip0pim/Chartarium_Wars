import Phaser from 'phaser';


export class OptionsScene extends Phaser.Scene {
    constructor() {
        super('OptionsScene');
    }

    preload() {//carga de archivos
        this.load.image('Fondo', 'imagenes/Fondo.jpg');
        this.load.image('BTNMenu', 'imagenes/MenuCW.png');
        this.load.audio('sfx', 'audio/menusfx.mp3');
    }

    create() {
        
        //fondo
        this.add.image(400, 310, 'Fondo');
        
        this.add.text(400, 90, 'Opciones', {
            fontSize: '75px',
            color: '#000000ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        const menuBtn = this.add.image(400,525,'BTNMenu').setOrigin(0.5).setScale(0.4)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => menuBtn.setScale(0.43))
        .on('pointerout', () => menuBtn.setScale(0.4))
        .on('pointerdown', () => {
            this.sound.play('sfx', { volume: 0.5 });
            this.scene.start('MenuScene');
        });

    const x = 400;
    const y = 300;

    // Barra del slider
    this.sliderBar = this.add.rectangle(x, y, 200, 10, 0x888888);

    // Obtener volumen global actual (0 a 1)
    const currentVolume = Phaser.Math.Clamp(this.sound.volume ?? 1, 0, 1);

    // Convertir volumen a posición del handle
    const minX = x - 100;
    const maxX = x + 100;
    const handleX = minX + (maxX - minX) * currentVolume;

    // Crear handle en la posición correcta
    this.sliderHandle = this.add.circle(handleX, y, 12, 0xffffff)
        .setInteractive({ draggable: true });

    this.input.setDraggable(this.sliderHandle);

    // Evento de arrastre
    this.input.on('drag', (pointer, gameObject, dragX) => {
        if (gameObject !== this.sliderHandle) return;
        gameObject.x = Phaser.Math.Clamp(dragX, minX, maxX);
        this.sound.volume = (gameObject.x - minX) / (maxX - minX);
    });
    
    // Botón Mute simple
    const muteBtn = this.add.text(x, y + 40, 'Mute', {
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#333333',
        padding: { left: 20, right: 20, top: 10, bottom: 10 }
    }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

    muteBtn.on('pointerdown', () => {
        this.sound.mute = !this.sound.mute;
    });
    }
}