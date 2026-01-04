import Phaser from 'phaser';
import { connectionManager } from '../services/ConnectionManager'; 
import { createUserController } from '../../server/controllers/userController';
import { createUserService } from '../../server/services/userService';
//import { userController } from '../../server/controllers/userController.js';
export class OnlineScene extends Phaser.Scene {
    constructor() {
        super('OnlineScene');
     
    }

    preload() {
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
 

        this.load.image('Bubble', 'imagenes/BurbujaCW.png');
        this.load.image('Elige', 'imagenes/EligeColorCW.png');
        this.load.audio('sfx', 'audio/menusfx.mp3');

        this.load.image('Escudo', 'imagenes/EscudoCW.png');
        this.load.image('NoFuegoAmigo', 'imagenes/NoFuegoAmigoCW.png');
    }

    create() {
        const Matter = this.matter;//no se porque pero hay que poner esto
        // Fondo
        this.connected=false;
        const userService = createUserService();
        const userController = createUserController(userService);

        this.add.image(400, 300, 'Fondo');
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
        this.colorPlayer1 = null;
        this.play = this.add.image(400, 400, 'Play')
            .setOrigin(0.5)
            .setScale(0.3).setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                this.play.setScale(0.35);       // aumenta tamaño un 10%
            })
            .on('pointerout', () => {
                this.play.setScale(0.3);         // vuelve al tamaño original
            })
            .on('pointerdown', () => { 
                this.handleLogin();
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

        //-------tanques para selección de avatar-------
        this.p1Options = [];

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

        const colors = ['Red', 'Blue', 'Green', 'Yellow'];
        const p1X = 240;
        const startY = 240;
        const gapY = 100;
        colors.forEach((color, i) => {
            const opt = createTankOption(p1X+ i * gapY, startY , color, (key, option) => {
                this.colorPlayer1 = key;
                this.markSelected(this.p1Options, option);
            });
            this.p1Options.push(opt);
        });
    }

    async handleLogin() {
        const nombre = this.inputName.value.trim();
        console.log("Nombre ingresado:", nombre);
        console.log("Avatar seleccionado:", this.colorPlayer1);

        if (nombre.length === 0 || !this.connected) {
            this.sound.play('sfx', { volume: 0.5 });
            console.log("Por favor, ingresa un nombre válido.");
            return;
        }

        let user = await this.getPlayerByName(nombre);

        // Si devuelve [] → no existe
        if (Array.isArray(user) && user.length === 0) {
            user = null;
        } else if (Array.isArray(user)) {
            user = user[0]; // tomar el usuario real
        }


        if (user) {
            // Usuario existente
            if (this.colorPlayer1 !== null) {
                console.log("Actualizando avatar del usuario existente.");
                user = await this.updatePlayer(user.id, {
                    avatar: this.colorPlayer1
                });
            } else {
                console.log("Usando avatar existente del usuario.");
                this.colorPlayer1 = user.avatar;
            }

        } else {
            // Usuario nuevo
            if (this.colorPlayer1 === null) {
                console.log("Por favor, selecciona un avatar.");
                return;
            }

            console.log("Creando usuario nuevo...");
            user = await this.createPlayer({
                name: nombre,
                avatar: this.colorPlayer1,
                wins: 0
            });

            console.log("Usuario creado:", user);

            // ❗ IMPORTANTE: NO actualizar aquí
        }

        this.sound.play('sfx', { volume: 0.5 });
        this.scene.start('LobbyScene', { 
            playerName: user.name, 
            avatar: user.avatar 
        });
}


    updateConnectionDisplay(data) {
        if (!this.connectionText2 || !this.scene || !this.scene.isActive('OnlineScene')) {
            return;
        }

        try {
            if (data.connected) {
                this.connectionText2.setText(`Servidor: ${data.count} usuario(s) conectado(s)`);
                this.connectionText2.setColor('#5e925eff');
                this.connected = true;
            } else {
                this.connectionText2.setText('Servidor: Desconectado');
                this.connectionText2.setColor('#a16666ff');
                this.connected = false;
            }
        } catch (error) {
            console.error('[OnlineScene] Error updating connection display:', error);
            this.connected = false;
        }
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

    //--------------------api-------------------
    async getPlayerByName(nombre) {
        try {
            const response = await fetch(`http://localhost:3000/api/users?name=${nombre}`);

            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }

            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) { 
                return data.find(u => u.name === nombre) || null; 
            }
            return null;

        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    async createPlayer(data) {
        const response = await fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    }

    async updatePlayer(id, updates) {
        const response = await fetch(`http://localhost:3000/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });

        return await response.json();
    }

    //
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
