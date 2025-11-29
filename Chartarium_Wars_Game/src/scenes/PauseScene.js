import Phaser from 'phaser';

export class PauseScene extends Phaser.Scene {

    constructor() {
        super('PauseScene');
    }

    create(data) {
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);

        this.add.text(400, 200, 'Game Paused', {
            fontSize: '65px',
            color: '#bdbdbdff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        const resumeBtn = this.add.text(400, 320, 'Resume', {
            fontSize: '32px',
            color: '#036c03ff',
            fontStyle: 'bold'
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointover', () => resumeBtn.setColor('#002405ff'))
        .on('pointerout', () => resumeBtn.setColor('#036c03ff'))
        .on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume(data.originalScene);
            this.scene.get(data.originalScene).resume();
        });

        const menuBtn = this.add.image(400,400,'BTNMenu').setOrigin(0.5).setScale(0.4)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => menuBtn.setScale(0.43))
        .on('pointerout', () => menuBtn.setScale(0.4))
        .on('pointerdown', () => {
            this.scene.stop('GameScene');
            this.scene.stop();
            this.scene.start('MenuScene');
        });
    }
}
