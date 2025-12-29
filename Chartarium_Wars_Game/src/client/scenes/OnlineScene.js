import Phaser from 'phaser';
import { connectionManager } from '../services/ConnectionManager';

export class OnlineScene extends Phaser.Scene {
    constructor() {
        super('OnlineScene');
    }

    preload() {
        this.load.image('Fondo', 'imagenes/Fondo.jpg');
        this.load.audio('sfx', 'audio/menusfx.mp3');
        this.load.image('Play', 'imagenes/PLAYCW.png');
    }

    create() {

        // Fondo
        this.add.image(400, 310, 'Fondo');

        const onlineBtn = this.add.image(400, 90, "BTNOnline")
            .setOrigin(0.5)
            .setScale(0.33);
        /*
        this.add.text(400, 310, 'La funcionalidad online no está disponible en esta versión', {
            fontSize: '22px',
            color: '#000000ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        */
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

        // --------- LOGIN ---------

        this.play = this.add.image(400, 450, 'Play')
            .setOrigin(0.5)
            .setScale(0.3).setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                this.play.setScale(0.35);       // aumenta tamaño un 10%
            })
            .on('pointerout', () => {
                this.play.setScale(0.3);         // vuelve al tamaño original
            })
            .on('pointerdown', () => {
                const nombre = this.inputName.value.trim();
                if (nombre.length > 0) {
                    console.log("Nombre ingresado:", nombre);
                    // iniciar conexión o cambiar de escena
                    //this.scene.start('CreditScene');
                }
                
        });

        // Crear input HTML y guardarlo en this.inputName
        const canvas = this.game.canvas;
        const rect = canvas.getBoundingClientRect();

        this.inputName = document.createElement('input');
        this.inputName.type = 'text';
        this.inputName.placeholder = 'Tu apodo...';

        this.inputName.style.position = 'absolute';
        this.inputName.style.top = (rect.top + 300) + 'px';
        this.inputName.style.left = (rect.left + 270) + 'px';
        this.inputName.style.fontSize = '20px';

        document.body.appendChild(this.inputName);


        // --------- Estado del servidor ---------

        this.connectionText2 = this.add.text(425, 470, 'Servidor: Comprobando...', {
            fontSize: '18px',
            color: '#8d8d3bff'
        }).setOrigin(0.5);

        this.connectionListener = (data) => {
            this.updateConnectionDisplay(data);
        };

        connectionManager.addListener(this.connectionListener);

        // Registrar eventos de apagado de escena
        this.events.on('shutdown', this.onShutdown, this);
        this.events.on('destroy', this.onShutdown, this);
    }

    updateConnectionDisplay(data) {
        if (!this.connectionText2 || !this.scene || !this.scene.isActive('OnlineScene')) {
            return;
        }

        try {
            if (data.connected) {
                this.connectionText2.setText(`Servidor: ${data.count} usuario(s) conectado(s)`);
                this.connectionText2.setColor('#5e925eff');
            } else {
                this.connectionText2.setText('Servidor: Desconectado');
                this.connectionText2.setColor('#a16666ff');
            }
        } catch (error) {
            console.error('[OnlineScene] Error updating connection display:', error);
        }
    }

    onShutdown() {

        // Quitar listener del servidor
        if (this.connectionListener) {
            connectionManager.removeListener(this.connectionListener);
            this.connectionListener = null;
        }

        // Quitar input HTML
        if (this.inputName) {
            document.body.removeChild(this.inputName);
            this.inputName = null;
        }
    }
}
