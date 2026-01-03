import Phaser from 'phaser';

export class SelectColor extends Phaser.Scene {
    constructor() {
        super('SelectColor');
    }

    preload() {
        this.load.image('Fondo', 'imagenes/Fondo.jpg');

        this.load.image('BaseRed', 'imagenes/TanqueRojoCW.png');
        this.load.image('TorretaRed', 'imagenes/CanonRojoCW.png');

        this.load.image('BaseGreen', 'imagenes/TanqueVerdeCW.png');
        this.load.image('TorretaGreen', 'imagenes/CanonVerdeCW.png');

        this.load.image('BaseBlue', 'imagenes/TanqueAzulCW.png');
        this.load.image('TorretaBlue', 'imagenes/CanonAzulCW.png');

        this.load.image('BaseYellow', 'imagenes/TanqueAmarilloCW.png');
        this.load.image('TorretaYellow', 'imagenes/CanonAmarilloCW.png');

        this.load.image('Play', 'imagenes/PLAYCW.png');
        this.load.image('BTNMenu', 'imagenes/MenuCW.png');
        this.load.image('P', 'imagenes/Pcw.png');
        this.load.image('1', 'imagenes/1CW.png');
        this.load.image('2', 'imagenes/2CW.png');

        this.load.image('Bubble', 'imagenes/BurbujaCW.png');
        this.load.image('Elige', 'imagenes/EligeColorCW.png');
        this.load.audio('sfx', 'audio/menusfx.mp3');
    }
    
    create() {
        // Fondo
        this.add.image(400, 300, 'Fondo');
        
        this.add.image(400,50,'Elige').setOrigin(0.5).setScale(0.4);

        // Ahora empezamos SIN color elegido
        this.colorPlayer1 = null;
        this.colorPlayer2 = null;

        // --- Títulos ---
        this.add.image(190, 120, 'P').setOrigin(0.5).setScale(0.25);
        this.add.image(240, 122, '1').setOrigin(0.5).setScale(0.25);  
        this.add.image(590, 120, 'P').setOrigin(0.5).setScale(0.25);
        this.add.image(640, 120, '2').setOrigin(0.5).setScale(0.25);

        this.p1Options = [];
        this.p2Options = [];

        const createTankOption = (x, y, colorKey, onClick) => {
            // Rectángulo de selección (invisible al inicio)
            

            const base = this.add.image(0, 0, `Base${colorKey}`).setScale(1.2).setDepth(10);
            const turret = this.add.image(0, 0, `Torreta${colorKey}`).setScale(1.2).setOrigin(0.2,0.5).setDepth(15);

            const highlight = this.add.image(0, 0, "Bubble").setScale(1.6).setDepth(40);
            highlight.setVisible(false);

            const container = this.add.container(x, y, [base, turret,highlight]);
            container.setSize(base.width * 1.2, base.height * 1.2);
            container.setInteractive({ useHandCursor: true });

            container.setData('colorKey', colorKey);
            container.setData('selected', false);
            container.setData('disabled', false);
            container.setData('highlight', highlight);


            container.on('pointerover', () => {
                //localBtn.setTint(0x00ff88);   // aplica color
                container.setScale(1.3);       // aumenta tamaño un 10%
            })
            container.on('pointerout', () => {
                //localBtn.setTint(0x00ff00);   // vuelve al color original
                container.setScale(1.0);         // vuelve al tamaño original
            });
            // Click para seleccionar
            container.on('pointerup', () => {
                if (container.getData('disabled')) return;
                onClick(colorKey, container);
                
            });

            return container;
        };

        // Coordenadas
        const p1X = 200;
        const p2X = 600;
        const startY = 180;
        const gapY = 100;
        const colors = ['Red', 'Blue', 'Green', 'Yellow'];

        // Player 1
        colors.forEach((color, i) => {
            const opt = createTankOption(p1X, startY + i * gapY, color, (key, option) => {
                this.colorPlayer1 = key;
                this.markSelected(this.p1Options, option);
                this.updateDisabledStates();
            });
            this.p1Options.push(opt);
        });

        // Player 2
        colors.forEach((color, i) => {
            const opt = createTankOption(p2X, startY + i * gapY, color, (key, option) => {
                this.colorPlayer2 = key;
                this.markSelected(this.p2Options, option);
                this.updateDisabledStates();
            });
            this.p2Options.push(opt);
        });

        // Botón Play
        const playBtn = this.add.image(400, 320, "Play")
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
                playBtn.setScale(0.3)
            .on('pointerover', () => {
                //localBtn.setTint(0x00ff88);   // aplica color
                playBtn.setScale(0.33);       // aumenta tamaño un 10%
            })
            .on('pointerout', () => {
                //localBtn.setTint(0x00ff00);   // vuelve al color original
                playBtn.setScale(0.3);         // vuelve al tamaño original
            });
        
        playBtn.on('pointerup', () => {
            if (!this.colorPlayer1 || !this.colorPlayer2 || this.colorPlayer1 === this.colorPlayer2) return;
            this.sound.play('sfx', { volume: 0.5 });
            this.scene.start('GameScene', {
                colorPlayer1: this.colorPlayer1,
                colorPlayer2: this.colorPlayer2
            });
        });

        // Botón volver
        const menuBtn = this.add.image(400, 525, 'BTNMenu')
            .setOrigin(0.5)
            .setScale(0.3)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => menuBtn.setScale(0.35))
            .on('pointerout', () => menuBtn.setScale(0.3))
            .on('pointerdown', () => {
                this.sound.play('sfx', { volume: 0.5 });
                this.scene.start('MenuScene');
            });
    }

    // Marca seleccionado
    markSelected(optionArray, selectedOption) {
        optionArray.forEach(o => {
            o.setData('selected', false);
            o.getData('highlight').setVisible(false);
        });
        selectedOption.setData('selected', true);
        selectedOption.getData('highlight').setVisible(true);
    }

    // Actualiza estados
    updateDisabledStates() {
        this.p1Options.forEach(o => {
            const key = o.getData('colorKey');
            const shouldDisable = (this.colorPlayer2 && key === this.colorPlayer2);
            this.setOptionDisabled(o, shouldDisable);
        });

        this.p2Options.forEach(o => {
            const key = o.getData('colorKey');
            const shouldDisable = (this.colorPlayer1 && key === this.colorPlayer1);
            this.setOptionDisabled(o, shouldDisable);
        });
    }

    setOptionDisabled(option, disabled) {
        option.setData('disabled', disabled);

        if (disabled) {
            option.disableInteractive();
            option.setAlpha(0.3);
            option.setData('selected', false);
            option.getData('highlight').setVisible(false);
        } else {
            option.setInteractive({ useHandCursor: true });
            option.setAlpha(1);
        }
    }
}
