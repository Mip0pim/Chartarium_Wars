import Phaser from 'phaser';
import { MenuScene } from './scenes/MenuScene.js';
import { SelectColor } from './scenes/SelectColor.js';
import { GameScene } from './scenes/GameScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { CreditScene } from './scenes/CreditScene.js';
import { OnlineScene } from './scenes/OnlineScene.js';
import { TutorialScene } from './scenes/TutorialScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { OptionsScene } from './scenes/OptionsScene.js';
import { ConnectionLostScene } from './scenes/ConectionLost.js';
import { OnlineGameScene } from './scenes/OnlineGameScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MenuScene, SelectColor, GameScene, PauseScene, CreditScene, OnlineScene, TutorialScene, GameOverScene, OptionsScene, ConnectionLostScene, OnlineGameScene],
    backgroundColor: '#1a1a2e',
}

const game = new Phaser.Game(config);
