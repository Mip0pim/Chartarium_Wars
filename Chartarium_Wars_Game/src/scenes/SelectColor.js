import Phaser from 'phaser';

export class SelectColor extends Phaser.Scene {
    constructor() {
        super('SelectColor');
    }

    create() {
        this.add.text(400, 60, 'Select the color of the tanks', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Ahora empezamos SIN color elegido
        this.colorPlayer1 = null;
        this.colorPlayer2 = null;

        // --- Títulos ---
        this.add.text(200, 120, 'Player 1', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(600, 120, 'Player 2', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.p1Options = [];
        this.p2Options = [];

        const createColorOption = (x, y, label, colorKey, onClick) => {
            const option = this.add.text(x, y, label, {
                fontSize: '20px',
                color: '#ffffff',
                backgroundColor: '#000000'
            })
                .setOrigin(0.5)
                .setPadding(10)
                .setInteractive({ useHandCursor: true });

            option.setData('colorKey', colorKey);
            option.setData('selected', false);
            option.setData('disabled', false);

            option.on('pointerover', () => {
                if (option.getData('disabled')) return;
                option.setStyle({ backgroundColor: '#333333' });
            });

            option.on('pointerout', () => {
                if (option.getData('disabled')) return;
                if (option.getData('selected')) {
                    option.setStyle({ backgroundColor: '#666666' });
                } else {
                    option.setStyle({ backgroundColor: '#000000' });
                }
            });

            option.on('pointerup', () => {
                if (option.getData('disabled')) return;
                onClick(colorKey, option);
            });

            return option;
        };

        // --- Opciones Jugador 1 ---
        const p1Colors = [
            { label: 'Red',     colorKey: 'Red',    y: 170 },
            { label: 'Blue',     colorKey: 'Blue',   y: 220 },
            { label: 'Green',    colorKey: 'Green',  y: 270 },
            { label: 'Yellow', colorKey: 'Yellow', y: 320 }
        ];

        p1Colors.forEach(c => {
            const opt = createColorOption(200, c.y, c.label, c.colorKey, (key, option) => {
                this.colorPlayer1 = key;
                this.markSelected(this.p1Options, option);
                this.updateDisabledStates(); // desactiva ese color para J2
            });
            this.p1Options.push(opt);
        });

        // --- Opciones Jugador 2 ---
        const p2Colors = [
            { label: 'Red',     colorKey: 'Red',    y: 170 },
            { label: 'Blue',     colorKey: 'Blue',   y: 220 },
            { label: 'Green',    colorKey: 'Green',  y: 270 },
            { label: 'Yellow', colorKey: 'Yellow', y: 320 }
        ];

        p2Colors.forEach(c => {
            const opt = createColorOption(600, c.y, c.label, c.colorKey, (key, option) => {
                this.colorPlayer2 = key;
                this.markSelected(this.p2Options, option);
                this.updateDisabledStates(); // desactiva ese color para J1
            });
            this.p2Options.push(opt);
        });

        // Botón Jugar
        const playBtn = this.add.text(400, 420, 'Play', {
            fontSize: '28px',
            color: '#ffffff',
            backgroundColor: '#000000'
        })
            .setOrigin(0.5)
            .setPadding(10, 5)
            .setInteractive({ useHandCursor: true });

        playBtn.on('pointerover', () => {
            playBtn.setStyle({ backgroundColor: '#444444' });
        });

        playBtn.on('pointerout', () => {
            playBtn.setStyle({ backgroundColor: '#000000' });
        });

        playBtn.on('pointerup', () => {
            // Solo dejamos pasar si ambos han elegido y son distintos
            if (!this.colorPlayer1 || !this.colorPlayer2) {
                // no hacemos nada si falta color
                return;
            }
            if (this.colorPlayer1 === this.colorPlayer2) {
                // tampoco debería pasar porque ya bloqueamos repetidos
                return;
            }

            this.scene.start('GameScene', {
                colorPlayer1: this.colorPlayer1,
                colorPlayer2: this.colorPlayer2
            });
        });
    
        // Botón Volver al menú
        const backBtn = this.add.text(400, 480, 'Return to menu', {
            fontSize: '22px',
            color: '#ffffff',
            backgroundColor: '#000000'
        })
        .setOrigin(0.5)
        .setPadding(10, 5)
        .setInteractive({ useHandCursor: true });

        backBtn.on('pointerover', () => {
            backBtn.setStyle({ backgroundColor: '#444444' });
        });

        backBtn.on('pointerout', () => {
            backBtn.setStyle({ backgroundColor: '#000000' });
        });

        backBtn.on('pointerup', () => {
            this.scene.start('MenuScene');  // 👈 vuelve al menú principal
        });
    }

    // marca una opción como seleccionada y desmarca las demás
    markSelected(optionArray, selectedOption) {
        optionArray.forEach(o => {
            o.setData('selected', false);
            if (!o.getData('disabled')) {
                o.setStyle({ backgroundColor: '#000000' });
            }
        });

        selectedOption.setData('selected', true);
        if (!selectedOption.getData('disabled')) {
            selectedOption.setStyle({ backgroundColor: '#666666' });
        }
    }

    // actualiza qué colores están bloqueados en cada lado
    updateDisabledStates() {
        // desactivar en J1 el color que tenga J2 (solo si J2 ya ha elegido)
        this.p1Options.forEach(o => {
            const key = o.getData('colorKey');
            const shouldDisable = (this.colorPlayer2 && key === this.colorPlayer2);
            this.setOptionDisabled(o, shouldDisable);
        });

        // desactivar en J2 el color que tenga J1 (solo si J1 ya ha elegido)
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
            option.setStyle({ backgroundColor: '#000000' });
            option.setData('selected', false);
        } else {
            option.setInteractive({ useHandCursor: true });
            option.setAlpha(1);
            if (!option.getData('selected')) {
                option.setStyle({ backgroundColor: '#000000' });
            }
        }
    }
}
