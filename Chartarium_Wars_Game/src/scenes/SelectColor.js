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
    }
    
    create() {
        // Fondo
        this.add.image(400, 310, 'Fondo');
        
        this.add.text(400, 60, 'Select the color of the tanks', {
            fontSize: '32px',
            color: '#000000ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Ahora empezamos SIN color elegido
        this.colorPlayer1 = null;
        this.colorPlayer2 = null;

        // --- Títulos ---
        this.add.text(200, 120, 'Player 1', {   
            fontSize: '28px', 
            color: '#000000ff', 
            fontStyle: 'bold' 
        }).setOrigin(0.5);
        
        this.add.text(600, 120, 'Player 2', { 
            fontSize: '28px', 
            color: '#000000ff', 
            fontStyle: 'bold' 
        }).setOrigin(0.5);

        this.p1Options = [];
        this.p2Options = [];

        const createTankOption = (x, y, colorKey, onClick) => {
            // Rectángulo de selección (invisible al inicio)
            const highlight = this.add.rectangle(0, 0, 90, 90, 0xffff00, 0.3);
            highlight.setVisible(false);

            const base = this.add.image(0, 0, `Base${colorKey}`).setScale(1.2);
            const turret = this.add.image(0, 0, `Torreta${colorKey}`).setScale(1.2);

            const container = this.add.container(x, y, [highlight, base, turret]);
            container.setSize(base.width * 1.2, base.height * 1.2);
            container.setInteractive({ useHandCursor: true });

            container.setData('colorKey', colorKey);
            container.setData('selected', false);
            container.setData('disabled', false);
            container.setData('highlight', highlight);

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
        const playBtn = this.add.text(400, 515, 'Play', {
            fontSize: '35px',
            color: '#000000ff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        playBtn.on('pointerover', () => {
            playBtn.setStyle({ color: '#444444' });
        });

        playBtn.on('pointerout', () => {
            playBtn.setStyle({ color: '#000000' });
        });
        
        playBtn.on('pointerup', () => {
            if (!this.colorPlayer1 || !this.colorPlayer2 || this.colorPlayer1 === this.colorPlayer2) return;
            this.scene.start('GameScene', {
                colorPlayer1: this.colorPlayer1,
                colorPlayer2: this.colorPlayer2
            });
        });

        // Botón volver
        const backBtn = this.add.text(400, 570, 'Return to menu', {
            fontSize: '35px',
            color: '#000000ff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        backBtn.on('pointerover', () => {
            backBtn.setStyle({ color: '#444444' });
        });

        backBtn.on('pointerout', () => {
            backBtn.setStyle({ color: '#000000' });
        });

       
        backBtn.on('pointerup', () => this.scene.start('MenuScene'));
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
