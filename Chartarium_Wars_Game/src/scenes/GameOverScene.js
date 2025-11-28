import Phaser from 'phaser';


export class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create() {
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
        
        this.add.text(400, 250, 'Game Over', {
            fontSize: '70px',
            color: '#600000ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(400, 400, 'Back to menu', {
            fontSize: '40px',
            color: '#ffffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}