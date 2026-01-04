import Phaser from 'phaser';
import { Tank } from '../entities/Tank';
import { PowerUpGenerator } from '../entities/PowerUpGenerator.js';
import { CommandProcessor } from '../commands/CommandProcessor';
import { MoveTankCommand } from '../commands/MoveTankCommand';
import { connectionManager } from '../services/ConnectionManager';
import { PowerUp } from '../entities/PowerUp.js';

export class OnlineGameScene extends Phaser.Scene {

    constructor() {
        super('OnlineGameScene');
    }
    preload() {//carga de archivos
        this.load.image('Fondo', 'imagenes/Fondo.jpg');
        this.load.image('Vida', 'imagenes/VidaCW.png');
        this.load.image('Bubble', 'imagenes/BurbujaCW.png');
        this.load.image('MedioMapa', 'imagenes/MedioObstaculoCW.png');
        this.load.image('Palo', 'imagenes/PaloObstaculoCW.png');
        this.load.image('BloqueSimple', 'imagenes/TileMuro.png');
        this.load.image('BottomTopWall', 'imagenes/BottomTopCW.png');
        this.load.image('LeftRightWall', 'imagenes/LeftRightCW.png');

        this.load.image('BaseRed', 'imagenes/TanqueRojoCW.png');
        this.load.image('TorretaRed', 'imagenes/CanonRojoCW.png');
        this.load.image('BalaRed', 'imagenes/BalaNRojoCw.png');

        this.load.image('BaseGreen', 'imagenes/TanqueVerdeCW.png');
        this.load.image('TorretaGreen', 'imagenes/CanonVerdeCW.png');
        this.load.image('BalaGreen', 'imagenes/BalaNVerdeCW.png');

        this.load.image('BaseBlue', 'imagenes/TanqueAzulCW.png');
        this.load.image('TorretaBlue', 'imagenes/CanonAzulCW.png');
        this.load.image('BalaBlue', 'imagenes/BalaNAzulCW.png');

        this.load.image('BaseYellow', 'imagenes/TanqueAmarilloCW.png');
        this.load.image('TorretaYellow', 'imagenes/CanonAmarilloCW.png');
        this.load.image('BalaYellow', 'imagenes/BalaNAmarilloCW.png');

        this.load.image('MuroBloque6', 'imagenes/MedioObstaculoCW.png');
        this.load.image('Bloque', 'imagenes/TileMuro.png');
        this.load.image('Palo', 'imagenes/PaloObstaculoCW.png');

        
       
    }
    init(data) {
        this.ws=data.ws;
        this.playerRole = data.playerRole; // 'player1' or 'player2'
        this.roomId = data.roomId;

        this.localTank = null;
        this.remoteTank = null;
        this.processor = new CommandProcessor();//para local

        this.players = new Map();
        //this.powerUpGenerator = null;
        //this.processor = new CommandProcessor();
        this.isGameOver = false;
        // Colores que vienen de SelectColor
        //mirar si colores de ambos jugadores son iguales
        this.colorPlayer1 = data.avatar1;
        this.colorPlayer2 = data.avatar2;
        this.name1 = data.name1;
        this.name2 = data.name2;
        //ajustar el color
        if(this.colorPlayer2 === this.colorPlayer1){
            //mismo color
            const colors = ['Red', 'Blue', 'Green', 'Yellow'];
            let disponibles = colors.filter(e => e !== this.colorPlayer1); 
            let elegido = Phaser.Utils.Array.GetRandom(disponibles);
            if(this.playerRole === 'player1'){
                this.colorPlayer2 = elegido;
            }else{
                this.colorPlayer1 = elegido;
            }
        }
        this.usePowerUps = false;
    }


    create() {

        this.powerUpsGroup = this.physics.add.group();
        //musica
        const musicaMenu = this.sound.get('musica_menu');    
        musicaMenu?.stop();
        let musicaJuego = this.sound.get('musica_game');
        if (!musicaJuego) {
           musicaJuego = this.sound.add('musica_game', { loop: true, volume: 0.4 });
        }
        if (!musicaJuego.isPlaying) {
        musicaJuego.play();
        }

        //fondo
        this.add.image(400, 300, 'Fondo');       
        this.createBounds();


        // Obstáculos
        this.obstacles = this.physics.add.staticGroup(
        // @ts-ignore
        this.top, this.bottom, this.left, this.right,
        this.block1, this.block2,
        this.centro1, this.centro2, this.centro3,
        this.palo1, this.palo2
        );

        this.cursors = this.input.keyboard.createCursorKeys();

        this.setUpPlayers();
        this.createCollisions();

        this.setupWebSocketListeners();//ws


        this.vidasJugadores();
        //this.powerUpGenerator = new PowerUpGenerator(this, 10000); // Genera un power-up cada 10 segundos

        this.connectionListener = (data) => {
            if(!data.connected && this.scene.isActive()){
                this.onConnectionLost();
            }
        };
        
        connectionManager.addListener(this.connectionListener);
        this.events.on('shutdown', this.onShutdown, this);
        this.events.on('destroy', this.onShutdown, this);
        this.poweUpGenerator = new PowerUpGenerator(this, 10000, true);
    }
    
    onConnectionLost(){//api
        
        //this.scene.launch('ConnectionLostScene', { previousScene: 'OnlineGameScene' });
        //this.scene.pause();
        //this.scene.bringToTop('ConnectionLostScene');
    }


     setupWebSocketListeners() {
        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleServerMessage(data);
            } catch (error) {
                console.error('Error parsing server message:', error);
            }
        };

        this.ws.onclose = () => {
            console.log('WebSocket connection closed');
            if (!this.gameEnded) {
                this.handleDisconnection();
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            if (!this.gameEnded) {
                this.handleDisconnection();
            }
        };
    }

    handleServerMessage(data) {
        switch (data.type) {
            case 'tankUpdate':
                // Update opponent's tank position
                let moveCommand2 = new MoveTankCommand(this.remoteTank, data.action);
                this.processor.process(moveCommand2);
                this.remoteTank.sprite.x = data.x;
                this.remoteTank.sprite.y = data.y;
                this.remoteTank.turret.x = data.x;
                this.remoteTank.turret.y = data.y;
                this.actualizarVidas(this.playerRole === 'player1' ? 'player2' : 'player1', data.lives);
                break;

            case 'spawnPowerUp':
                const powerUp = data.data;
                new PowerUp(this, powerUp.x, powerUp.y, powerUp.tipo, this.poweUpGenerator);
                break;
            case 'collectPowerUp':
                console.log('Power-up collected');
                break;

            case 'tankColor':
                if(data.role !== this.playerRole){
                    this.remoteTank.destroy();//destruye el tanque remoto actual
                    if(data.color !== this.remoteTank.color){
                        this.remoteTank = new Tank(this, data.role, data.role==='player1' ? 90: 710, 300, data.color);
                    }else{
                        //mismo color
                        const colors = ['Red', 'Blue', 'Green', 'Yellow'];
                        let disponibles = colors.filter(e => e !== data.color); 
                        let elegido = Phaser.Utils.Array.GetRandom(disponibles);
                        this.remoteTank = new Tank(this, data.role, data.role==='player1' ? 90: 710, 300, elegido);
                    }
                    this.players.set(data.role, this.remoteTank);
                    this.remoteTank.SetTarget(this.localTank);
                    this.createCollisions();
                }
                break;

            case 'gameOver':
                this.endGame(data.winner);
                break;

            case 'playerDisconnected':
                this.handleDisconnection();
                break;

            default:
                console.log('Unknown message type:', data.type);
        }
    }

    handleDisconnection() {
        this.gameEnded = true;
        this.localTank.sprite.setVelocity(0, 0);
        this.remoteTank.sprite.setVelocity(0, 0);
        this.physics.pause();

        this.add.image(400, 130, "ConexionPerdida").setScale(0.4).setOrigin(0.5);

        this.createMenuButton();
    }

    createMenuButton() {
        const menuBtn = this.add.image(400, 400, "BTNMenu").setOrigin(0.5).setScale(0.4)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => menuBtn.setScale(0.43))
        .on('pointerout', () => menuBtn.setScale(0.4))
        .on('pointerdown', () => {
             this.sound.play('sfx', { volume: 0.5 });
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.close();
            }
            this.scene.start('MenuScene');
        });
    }


    vidasJugadores() {
        this.vidaPlayer1 = [];
        this.vidaPlayer2 = [];
        this.add.image(10, 20, `Base${this.players.get('player1').color}`).setOrigin(0, 0);
        this.add.image(740, 20, `Base${this.players.get('player2').color}`).setOrigin(0, 0);
        this.add.image(35, 40, `Torreta${this.players.get('player1').color}`).setOrigin(0.15, 0.5);
        this.add.image(765, 40, `Torreta${this.players.get('player2').color}`).setOrigin(0.15, 0.5).setRotation(Math.PI);
        for (let i = 0; i < 5; i++) {
            const vida1 = this.add.image(90 + i * 30, 35, 'Vida').setScale(0.05);
            this.vidaPlayer1.push(vida1);
            const vida2 = this.add.image(710 - i * 30, 35, 'Vida').setScale(0.05);
            this.vidaPlayer2.push(vida2);
        }
    }
 
    actualizarVidas(playerId, vidasRestantes) {
        const vidaArray = playerId === 'player1' ? this.vidaPlayer1 : this.vidaPlayer2;
        if (vidaArray.length > vidasRestantes) {
            const vidaSprite = vidaArray.pop();
            vidaSprite.destroy();
        }
        if (vidaArray.length < vidasRestantes) {
            if (playerId === 'player1') {
                const nuevaVida = this.add.image(90 + vidaArray.length * 30, 35, 'Vida').setScale(0.05);
                vidaArray.push(nuevaVida);
            } 
            if (playerId === 'player2') {
                const nuevaVida = this.add.image(710 - vidaArray.length * 30, 35, 'Vida').setScale(0.05);
                vidaArray.push(nuevaVida);
            }
        }
        if (vidasRestantes <= 0) {
            //enviar que ha muerto
            this.sendMessage({
                type: 'gameOver',
                winner: playerId
            });
            this.endGame(playerId);
        }
    }

    setUpPlayers() {

        if (this.playerRole === 'player1') {
            this.localTank = new Tank(this, 'player1', 90, 300, this.colorPlayer1);
            this.remoteTank = new Tank(this, 'player2', 710, 300, this.colorPlayer2);
            this.players.set('player1', this.localTank);
            this.players.set('player2', this.remoteTank);
        } else {
            this.localTank = new Tank(this, 'player2', 710, 300, this.colorPlayer2);
            this.remoteTank = new Tank(this, 'player1', 90, 300, this.colorPlayer1);
            this.players.set('player2', this.localTank);
            this.players.set('player1', this.remoteTank);
        }

        this.localTank.SetTarget(this.remoteTank);
        this.remoteTank.SetTarget(this.localTank);

    }


    endGame(winnerId) {
        this.players.forEach(tank => {
            tank.sprite.setVelocityY(0);
            tank.sprite.setVelocityX(0);
            tank.turret.sprite.setVelocityY(0);
            tank.turret.sprite.setVelocityX(0);
            tank.turret.shoot(true);
        });
        this.physics.pause();

        this.isGameOver = true; 
            this.scene.start('GameOverScene',{
                ganador: winnerId==='player1' ? 'player2' : 'player1',
                color: this.players.get(winnerId==='player1' ? 'player2' : 'player1').color
            });
    }



    createBounds() {

        //Muros arriba y abajo
        this.top = this.physics.add.sprite(400, 83, 'BottomTopWall');
        this.top.setImmovable(true);
        this.top.body.setSize(765,45);

        this.bottom = this.physics.add.sprite(400, 577, 'BottomTopWall');
        this.bottom.setImmovable(true);
        this.bottom.body.setSize(765,45);

        //Muros izquierda y derecha
        this.left = this.physics.add.sprite(40, 330, 'LeftRightWall');
        this.left.setImmovable(true);
        this.left.body.setSize(45,450);
        

        this.right = this.physics.add.sprite(760, 330, 'LeftRightWall');
        this.right.setImmovable(true);
        this.right.body.setSize(45,450);

        //bloques de 6
        this.block1=this.physics.add.sprite(400,198,"MuroBloque6");
        this.block1.setImmovable(true);

        this.block2=this.physics.add.sprite(400,462,"MuroBloque6");
        this.block2.setImmovable(true);

        this.centro1=this.physics.add.sprite(400,462-110,"Bloque");
        this.centro1.setImmovable(true);
        this.centro2=this.physics.add.sprite(400-45,462-155,"Bloque");
        this.centro2.setImmovable(true);
        this.centro3=this.physics.add.sprite(400+45,462-155,"Bloque");
        this.centro3.setImmovable(true);

        this.palo1=this.physics.add.sprite(648,439,"Palo");
        this.palo1.setImmovable(true);
        this.palo2=this.physics.add.sprite(152,218,"Palo");
        this.palo2.setImmovable(true);
    }

    createCollisions(){
        this.players.forEach(tank => {
            this.physics.add.collider(this.left, tank.sprite);
            this.physics.add.collider(this.right, tank.sprite);
            this.physics.add.collider(this.top, tank.sprite);
            this.physics.add.collider(this.bottom, tank.sprite);
            this.physics.add.collider(this.block1, tank.sprite);
            this.physics.add.collider(this.block2, tank.sprite);
            this.physics.add.collider(this.centro1, tank.sprite);
            this.physics.add.collider(this.centro2, tank.sprite);
            this.physics.add.collider(this.centro3, tank.sprite);
            this.physics.add.collider(this.palo1, tank.sprite);
            this.physics.add.collider(this.palo2, tank.sprite);
        });
    }

    sendMessage(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    update() {
        if (this.isGameOver) return;
        
        if(this.usePowerUps){
            this.sendMessage({
              type: 'collectPowerUp'
            });

            this.usePowerUps = false;
        }


        // Handle local tank input - both players use arrow keys
        let direction = null;
        if (this.cursors.up.isDown) {
            direction = 'up';
        } else if (this.cursors.down.isDown) {
            direction = 'down';
        } else if (this.cursors.left.isDown) {
            direction = 'left';
        } else if (this.cursors.right.isDown) {
            direction = 'right';
        }  else {
            direction = 'stop';
        }

        let moveCommand = new MoveTankCommand(this.localTank, direction);
        this.processor.process(moveCommand);
        
        // Send tank position to server
        this.sendMessage({
            type: 'tankMove',
            action: direction,
            x: this.localTank.GetX(),
            y: this.localTank.GetY(),
            lives: this.localTank.vidas
        });

    }

    onShutdown() {

        // Quitar listener del servidor
        if (this.connectionListener) {
            connectionManager.removeListener(this.connectionListener);
            this.connectionListener = null;
        }
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.close();
        }

    }
}