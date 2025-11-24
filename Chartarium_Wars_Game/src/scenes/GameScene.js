import Phaser from 'phaser';
import { Tank } from '../entities/Tank';
import { CommandProcessor } from '../commands/CommandProcessor';
import { MoveTankCommand } from '../commands/MoveTankCommand';
import { PauseGameCommand } from '../commands/PuaseGameCommand';

export class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
    }
    preload() {//carga de archivos
        this.load.image('Fondo', 'imagenes/Fondo.jpg');
        this.load.image('Vida', 'imagenes/VidaCW.png');

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

       
    }
    init(data) {
        this.players = new Map();
        this.inputMappings = [];
        this.ball = null;
        this.isPaused = false;
        this.escWasDown = false;
        this.processor = new CommandProcessor();

        // Colores que vienen de SelectColor
        this.colorPlayer1 = data?.colorPlayer1;
        this.colorPlayer2 = data?.colorPlayer2;
    }


    create() {

        //fondo
        this.add.image(400, 310, 'Fondo');       

        this.createBounds();
        //this.createBall();
        //this.launchBall();

        //this.physics.add.overlap(this.ball, this.leftGoal, this.scoreRightGoal, null, this);
        //this.physics.add.overlap(this.ball, this.rightGoal, this.scoreLeftGoal, null, this);

        this.setUpPlayers();
        this.players.forEach(tank => {
            //this.physics.add.collider(this.ball, tank.sprite);
        });

        this.vidasJugadores();
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }
    vidasJugadores() {
        const vidaPlayer1 = [];
        const vidaPlayer2 = [];
        this.add.image(10,30,`Base${this.players.get('player1').color}`).setOrigin(0,0);
        this.add.image(740,30,`Base${this.players.get('player2').color}`).setOrigin(0,0);
        this.add.image(10,30,`Torreta${this.players.get('player1').color}`).setOrigin(0.15, 0.5);
        this.add.image(740,30,`Torreta${this.players.get('player2').color}`).setOrigin(0.15, 0.5);
        for (let i = 0; i < 3; i++) {
            const vida1 = this.add.image(80 + i * 30, 50, 'Vida').setScale(0.05);
            vidaPlayer1.push(vida1);
            const vida2 = this.add.image(720 - i * 30, 50, 'Vida').setScale(0.05);
            vidaPlayer2.push(vida2);
        }
    }
 
    setUpPlayers() {
        const tank1 = new Tank(this, 'player1', 50, 300,this.colorPlayer1);
        const tank2 = new Tank(this, 'player2', 750, 300,this.colorPlayer2); 

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
    actualizarVidas(playerId, vidasRestantes) {
       
    }  
    scoreLeftGoal() {
        const player1 = this.players.get('player1');
        player1.score -= 1;
        this.scoreLeft.setText(player1.score.toString());

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
        this.rightScore.setText(player2.score.toString());

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
        this.leftGoal = this.physics.add.sprite(0, 300, null);
        this.leftGoal.setDisplaySize(10, 600);
        this.leftGoal.body.setSize(10, 600);
        this.leftGoal.setImmovable(true);
        this.leftGoal.setVisible(false);

        this.rightGoal = this.physics.add.sprite(800, 300, null);
        this.rightGoal.setDisplaySize(10, 600);
        this.rightGoal.body.setSize(10, 600);
        this.rightGoal.setImmovable(true);
        this.rightGoal.setVisible(false);
    }

    setPauseState(isPaused) {
        this.isPaused = isPaused;
        if (isPaused) {
            this.scene.launch('PauseScene', { originalScene: 'GameScene' });
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
}