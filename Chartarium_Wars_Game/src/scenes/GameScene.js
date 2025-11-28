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
       
    }
    init(data) {
        this.players = new Map();
        this.inputMappings = [];
        this.ball = null;
        this.isPaused = false;
        this.escWasDown = false;
        this.processor = new CommandProcessor();
        this.isGameOver = false;
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
        this.createCollisions();
        

        this.vidasJugadores();
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
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
        if (vidasRestantes <= 0) {
            this.isGameOver = true; 
            this.scene.start('GameOverScene');
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
        });
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
}