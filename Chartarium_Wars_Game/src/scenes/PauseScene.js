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

        const menuBtn = this.add.text(400, 400, 'Return to Main Menu', {
            fontSize: '32px',
            color: '#a30303ff',
            fontStyle: 'bold'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => menuBtn.setColor('#790000ff'))
        .on('pointerout', () => menuBtn.setColor('#a30303ff'))
        .on('pointerdown', () => {
            this.scene.stop(data.originalScene);
            this.scene.start('MenuScene');
        });
    }
}
