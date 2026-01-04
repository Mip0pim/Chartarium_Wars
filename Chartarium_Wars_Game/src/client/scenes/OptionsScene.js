import Phaser from 'phaser';


export class OptionsScene extends Phaser.Scene {
    constructor() {
        super('OptionsScene');
    }

    preload() {//carga de archivos
        this.load.image('Fondo', 'imagenes/Fondo.jpg');
        this.load.image('BTNMenu', 'imagenes/MenuCW.png');
        this.load.image('Opciones', 'imagenes/OpcionesCW.png');
        this.load.image('Barra', 'imagenes/BarraMusicaCW.png');
        this.load.image('Mute', 'imagenes/MuteCW.png');
        this.load.image('Deslizador', 'imagenes/DeslizadorMusicaCW.png');
        this.load.audio('sfx', 'audio/menusfx.mp3');
    }

    create() {
        
        //fondo
        this.add.image(400, 300, 'Fondo');
        
        this.add.image(400, 90, 'Opciones').setScale(0.5).setOrigin(0.5);
        
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
    this.sliderBar = this.add.image(x, y, 'Barra').setDisplaySize(200,68).setOrigin(0.5);

    // Obtener volumen global actual (0 a 1)
    const currentVolume = Phaser.Math.Clamp(this.sound.volume ?? 1, 0, 1);

    // Convertir volumen a posición del handle
    const minX = x - 80;
    const maxX = x + 80;
    const handleX = minX + (maxX - minX) * currentVolume;

    // Crear handle en la posición correcta
    this.sliderHandle = this.add.image(handleX, y, 'Deslizador').setScale(0.5).setOrigin(0.5)
        .setInteractive({ draggable: true });

    this.input.setDraggable(this.sliderHandle);

    // Evento de arrastre
    this.input.on('drag', (pointer, gameObject, dragX) => {
        if (gameObject !== this.sliderHandle) return;
        gameObject.x = Phaser.Math.Clamp(dragX, minX, maxX);
        this.sound.mute = false; // Desmutear al mover el slider
        this.sound.volume = (gameObject.x - minX) / (maxX - minX);
    });
    
    // Botón Mute simple
    const muteBtn = this.add.image(x, y + 40, 'Mute').setOrigin(0.5).setScale(0.5)
        .setInteractive({ useHandCursor: true });

    muteBtn.on('pointerdown', () => {
        this.sound.mute = !this.sound.mute;
    });
    }
}