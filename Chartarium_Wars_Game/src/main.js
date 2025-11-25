import Phaser from 'phaser';
import { MenuScene } from './scenes/MenuScene.js';
import { SelectColor } from './scenes/SelectColor.js';
import { GameScene } from './scenes/GameScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { CreditScene } from './scenes/CreditScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [MenuScene, SelectColor, GameScene, PauseScene,CreditScene],
    backgroundColor: '#1a1a2e',
}

const game = new Phaser.Game(config);