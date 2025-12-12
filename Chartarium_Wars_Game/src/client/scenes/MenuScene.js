import Phaser from 'phaser';
import { connectionManager } from '../services/ConnectionManager';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {//carga de archivos
        this.load.image('Fondo', 'imagenes/Fondo.jpg');
        this.load.image('Logo', 'imagenes/Logo.png');

        this.load.image('BTNPlayer', 'imagenes/LocalBtnCW.png');
        this.load.image('BTNCredit', 'imagenes/CreditosCW.png');
        this.load.image('BTNOnline', 'imagenes/OnlineBtnCW.png');   
        this.load.image('BTNMenu', 'imagenes/MenuCW.png'); 
        this.load.image('BTNTutorial', 'imagenes/TutorialCW.png');
        this.load.audio('musica', 'audio/musica.mp3');
        this.load.audio('sfx', 'audio/menusfx.mp3');   
    }


    create() {
        //musica
        let musica = this.sound.get('musica');
        if (!musica) {        
            musica = this.sound.add('musica', { loop: true, volume: 0.4});            
            musica.play();        
        }
        //fondo
        this.add.image(400, 300, 'Fondo');
        //logo
        const logo=this.add.image(400, 180, 'Logo')
        .setOrigin(0.5);
        logo.setScale(1.1);
        
        const localBtn = this.add.image(280, 410, "BTNPlayer")
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
                localBtn.setScale(0.19)
            .on('pointerover', () => {
                //localBtn.setTint(0x00ff88);   // aplica color
                localBtn.setScale(0.20);       // aumenta tamaño un 10%
            })
            .on('pointerout', () => {
                //localBtn.setTint(0x00ff00);   // vuelve al color original
                localBtn.setScale(0.19);         // vuelve al tamaño original
            })
            .on('pointerdown', () => {
                this.sound.play('sfx', { volume: 0.5 });
                this.scene.start('SelectColor');
        });

        const onlineBtn = this.add.image(520, 410, "BTNOnline")
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
                onlineBtn.setScale(0.19)
            .on('pointerover', () => {
                //localBtn.setTint(0x00ff88);   // aplica color
                onlineBtn.setScale(0.20);       // aumenta tamaño un 10%
            })
            .on('pointerout', () => {
                //localBtn.setTint(0x00ff00);   // vuelve al color original
                onlineBtn.setScale(0.19);         // vuelve al tamaño original
            })
            .on('pointerdown', () => {
                this.sound.play('sfx', { volume: 0.5 });
                this.scene.start('OnlineScene');
        });

        const tutorialBtn = this.add.image(280,507,'BTNTutorial').setOrigin(0.5).setScale(0.3)
        .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                //localBtn.setTint(0x00ff88);   // aplica color
                tutorialBtn.setScale(0.33);       // aumenta tamaño un 10%
            })
            .on('pointerout', () => {
                //localBtn.setTint(0x00ff00);   // vuelve al color original
                tutorialBtn.setScale(0.3);         // vuelve al tamaño original
            })
            .on('pointerdown', () => {
                this.sound.play('sfx', { volume: 0.5 });
                this.scene.start('TutorialScene');
        });

        const creditBtn = this.add.image(520, 500, "BTNCredit")
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                //localBtn.setTint(0x00ff88);   // aplica color
                creditBtn.setScale(1.1);       // aumenta tamaño un 10%
            })
            .on('pointerout', () => {
                //localBtn.setTint(0x00ff00);   // vuelve al color original
                creditBtn.setScale(1);         // vuelve al tamaño original
            })
            .on('pointerdown', () => {
                this.sound.play('sfx', { volume: 0.5 });
                this.scene.start('CreditScene');
        });
        // Indicador de conexión al servidor
        this.connectionText = this.add.text(525, 510, 'Servidor: Comprobando...', {
            fontSize: '18px',
            color: '#ffff00'
        }).setOrigin(0.5);
        // Listener para cambios de conexión
        this.connectionListener = (data) => {
            this.updateConnectionDisplay(data);
        };
        connectionManager.addListener(this.connectionListener);
        
    }
    updateConnectionDisplay(data) {
        // Solo actualizar si el texto existe (la escena está creada)
        if (!this.connectionText || !this.scene || !this.scene.isActive('MenuScene')) {
            return;
        }

        try {
            if (data.connected) {
                this.connectionText.setText(`Servidor: ${data.count} usuario(s) conectado(s)`);
                this.connectionText.setColor('#00ff00');
            } else {
                this.connectionText.setText('Servidor: Desconectado');
                this.connectionText.setColor('#ff0000');
            }
        } catch (error) {
            console.error('[MenuScene] Error updating connection display:', error);
        }
    }
    shutdown() {
        // Remover el listener
        if (this.connectionListener) {
            connectionManager.removeListener(this.connectionListener);
        }
    }
}