import Phaser from 'phaser';

export class PauseScene extends Phaser.Scene {

    constructor() {
        super('PauseScene');
    }
   
preload() {
        this.load.image('Fondo', 'imagenes/Fondo.jpg');
        this.load.image('BTNPause', 'imagenes/PausaCW.png');
        this.load.image('BTNMenu', 'imagenes/MenuCW.png');
        this.load.image('BTNContinue', 'imagenes/ContinuarCW.png');
        this.load.image('Barra', 'imagenes/BarraMusicaCW.png');
        this.load.image('Deslizador', 'imagenes/DeslizadorMusicaCW.png');
        this.load.audio('sfx', 'audio/menusfx.mp3');
        this.scene.bringToTop('PauseScene');
    }

    create(data) {
        //fondo
        this.add.image(400, 300, 'Fondo');

        this.add.image(400,100,'BTNPause').setOrigin(0.5).setScale(0.7);
        
        const resumeBtn = this.add.image(400,270,'BTNContinue').setOrigin(0.5).setScale(0.2)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => resumeBtn.setScale(0.24))
        .on('pointerout', () => resumeBtn.setScale(0.2))
        .on('pointerdown', () => {
            this.sound.play('sfx', { volume: 0.5 });
            this.scene.stop();
            this.scene.resume(data.originalScene);
            this.scene.get(data.originalScene).resume();
        });
    
        const menuBtn = this.add.image(400, 525, 'BTNMenu')
            .setOrigin(0.5)
            .setScale(0.3)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => menuBtn.setScale(0.35))
            .on('pointerout', () => menuBtn.setScale(0.3))
            .on('pointerdown', () => {
                this.sound.play('sfx', { volume: 0.5 });
                this.scene.stop('GameScene');
                this.scene.stop();
                this.scene.start('MenuScene');
            });

        //Slider de volumen
            const x = 400;
            const y = 370;
        
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
        
        // Botón Mute
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
