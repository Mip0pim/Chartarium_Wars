import Phaser from 'phaser';
import { Tank } from '../entities/Tank';
import { PowerUpGenerator } from '../entities/PowerUpGenerator.js';
import { CommandProcessor } from '../commands/CommandProcessor';
import { MoveTankCommand } from '../commands/MoveTankCommand';
import { PauseGameCommand } from '../commands/PuaseGameCommand';
import { connectionManager } from '../services/ConnectionManager';

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


        this.players = new Map();
        this.inputMappings = [];
        this.ball = null;
        this.powerUpGenerator = null;
        this.isPaused = false;
        this.escWasDown = false;
        this.processor = new CommandProcessor();
        this.isGameOver = false;
        // Colores que vienen de SelectColor
        //mirar si colores de ambos jugadores son iguales
        this.colorPlayer1 = data?.avatar;
        this.colorPlayer2 = "Blue"; // Por defecto el segundo jugador es azul
    }


    create() {

        this.powerUpsGroup = this.physics.add.group();
        
        //fondo
        this.add.image(400, 300, 'Fondo');       
        this.createBounds();
        //this.createBall();
        //this.launchBall();

        // Obstáculos
        this.obstacles = this.physics.add.staticGroup(
        // @ts-ignore
        this.top, this.bottom, this.left, this.right,
        this.block1, this.block2,
        this.centro1, this.centro2, this.centro3,
        this.palo1, this.palo2
        );
    

        //this.physics.add.overlap(this.ball, this.leftGoal, this.scoreRightGoal, null, this);
        //this.physics.add.overlap(this.ball, this.rightGoal, this.scoreLeftGoal, null, this);

        this.setUpPlayers();
        this.createCollisions();
        

        this.vidasJugadores();
        this.powerUpGenerator = new PowerUpGenerator(this, 10000); // Genera un power-up cada 10 segundos
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.connectionListener = (data) => {
            if(!data.connected && this.scene.isActive()){
                this.onConnectionLost();
            }
        };
        
        connectionManager.addListener(this.connectionListener);
        this.events.on('shutdown', this.onShutdown, this);
        this.events.on('destroy', this.onShutdown, this);

    }
    
    onConnectionLost(){//api
        
        this.scene.launch('ConnectionLostScene', { previousScene: 'OnlineGameScene' });
        this.scene.pause();
        this.scene.bringToTop('ConnectionLostScene');
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
                this.remoteTank.sprite.y = data.y;
                break;

            case 'scoreUpdate':
                // Update scores from server
                this.localScore = this.playerRole === 'player1' ? data.player1Score : data.player2Score;
                this.remoteScore = this.playerRole === 'player1' ? data.player2Score : data.player1Score;

                //this.scoreLeft.setText(data.player1Score.toString());
                //this.scoreRight.setText(data.player2Score.toString());

                // Stop ball, server will relaunch it
                this.ball.setVelocity(0, 0);
                this.ball.setPosition(400, 300);
                break;

            case 'ballRelaunch':
                // Server is relaunching the ball with new velocity
                this.ball.setPosition(data.ball.x, data.ball.y);
                this.ball.setVelocity(data.ball.vx, data.ball.vy);
                break;

            case 'gameOver':
                //this.endGame(data.winner, data.player1Score, data.player2Score);
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
        this.ball.setVelocity(0, 0);
        this.localTank.sprite.setVelocity(0, 0);
        this.remoteTank.sprite.setVelocity(0, 0);
        this.physics.pause();

        this.add.text(400, 250, 'Opponent Disconnected', {
            fontSize: '48px',
            color: '#ff0000'
        }).setOrigin(0.5);

        this.createMenuButton();
    }
    createMenuButton() {
        const menuBtn = this.add.text(400, 400, 'Return to Main Menu', {
            fontSize: '32px',
            color: '#ffffff',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => menuBtn.setColor('#cccccc'))
        .on('pointerout', () => menuBtn.setColor('#ffffff'))
        .on('pointerdown', () => {
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
            this.isGameOver = true; 
            this.scene.start('GameOverScene',{
                ganador: playerId==='player1' ? 'player2' : 'player1',
                color: this.players.get(playerId==='player1' ? 'player2' : 'player1').color
            });
        }
    }

    setUpPlayers() {
        const tank1 = new Tank(this, 'player1', 90, 300,this.colorPlayer1);
        const tank2 = new Tank(this, 'player2', 710, 300,this.colorPlayer2); 

        tank1.SetTarget(tank2);
        tank2.SetTarget(tank1);
        
        this.players.set('player1', tank1);
        this.players.set('player2', tank2);

        const InputConfig = [
            {
                playerId: 'player1',
                upKey : 'W',
                downKey : 'S',
                rightKey : 'D',
                leftKey : 'A'
            },
            {
                playerId: 'player2',
                upKey : 'UP',
                downKey : 'DOWN',
                rightKey : 'RIGHT',
                leftKey : 'LEFT'
            }
        ]
        this.inputMappings = InputConfig.map(config => {
            return {
                playerId : config.playerId,
                upKeyObj : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.upKey]),
                downKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.downKey]),
                rightKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.rightKey]),
                leftKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.leftKey])
            }
        });
    }

    scoreLeftGoal() {
        const player1 = this.players.get('player1');
        player1.score -= 1;
        //this.scoreLeft.setText(player1.score.toString());

        if (player1.score >= 2) {
            this.endGame('player1');
        } else {
            this.resetBall();
        }
    }

    scoreRightGoal() {
        const player2 = this.players.get('player2');
        player2.score += 1;
        this.add.image(700 + 30 * (player2.score - 1), 100, 'Vida').setScale(0.5);
        //this.rightScore.setText(player2.score.toString());

        if (player2.score >= 2) {
            this.endGame('player2');
        } else {
            this.resetBall();
        }
    }

    endGame(winnerId) {
        this.ball.setVelocity(0, 0);
        this.players.forEach(tank => {
            tank.sprite.setVelocity(0, 0);
        });
        this.physics.pause();

        const winnerText = winnerId === 'player1' ? 'Player 1 Wins!' : 'Player 2 Wins!';
        this.add.text(400, 250, winnerText, {
            fontSize: '64px',
            color: '#00ff00'
        }).setOrigin(0.5);

        const menuBtn = this.add.text(400, 350, 'Return to Main Menu', {
            fontSize: '32px',
            color: '#ffffff',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => menuBtn.setColor('#cccccc'))
        .on('pointerout', () => menuBtn.setColor('#ffffff'))
        .on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }

    resetBall() {
        this.ball.setVelocity(0, 0);
        this.ball.setPosition(400, 300);
    
        this.time.delayedCall(1000, () => {
            this.launchBall();
        });
    }

    launchBall() {
        const angle = Phaser.Math.Between(-30, 30);
        const speed = 300;
        const direction = Math.random() < 0.5 ? 1 : -1;

        this.ball.setVelocity(
            Math.cos(Phaser.Math.DegToRad(angle)) * speed * direction,
            Math.sin(Phaser.Math.DegToRad(angle)) * speed
        )
    }

    createBall() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(8, 8, 8);
        graphics.generateTexture('ball', 16, 16);
        graphics.destroy();

        this.ball = this.physics.add.sprite(400, 300, 'ball');
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1);
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

    setPauseState(isPaused) {
        this.isPaused = isPaused;
        if (isPaused) {
            this.scene.launch('PauseScene', { originalScene: 'OnlineGameScene' });
            this.scene.pause();
        } 
    }

    resume() {
        this.isPaused = false;
    }

    togglePause() {
        const newPauseState = !this.isPaused;
        this.processor.process(
            new PauseGameCommand(this, newPauseState)
        );
    }

    update() {
        if (this.isGameOver) return;
        
        if (this.escKey.isDown && !this.escWasDown) {
            this.togglePause();
        }

        this.inputMappings.forEach(mapping => {
            const tank = this.players.get(mapping.playerId);
            let direction = null;
            if (mapping.upKeyObj.isDown) {
                direction = 'up';
            } else if (mapping.downKeyObj.isDown) {
                direction = 'down';
            } else if (mapping.leftKeyObj.isDown) {
                direction = 'left';
            } else if (mapping.rightKeyObj.isDown) {
                direction = 'right';
            } else {
                direction = 'stop';
            }
            let moveCommand = new MoveTankCommand(tank, direction);
            this.processor.process(moveCommand);
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