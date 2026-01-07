/**
 * Lobby Scene - Waiting for multiplayer matchmaking
 */
export default class LobbyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LobbyScene' });
    this.ws = null;
  }
    init(data){
        this.playerName = data.playerName;
        this.avatar = data.avatar;
    }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    this.add.image(400, 300, 'Fondo');
    // Title
    const onlineBtn = this.add.image(400, 90, "BTNOnline")
            .setOrigin(0.5)
            .setScale(0.33);

    // Status text
    this.statusText = this.add.text(width / 2, height / 2 - 50, 'Connecting to server...', {
      fontSize: '24px',
      color: '#939342ff'
    }).setOrigin(0.5);

    // Player count text
    this.playerCountText = this.add.text(width / 2, height / 2 + 20, '', {
      fontSize: '20px',
      color: '#4b954bff'
    }).setOrigin(0.5);

    const base = this.add.image(400, 350, `Base${this.avatar}`).setScale(1.3).setDepth(10);
    const turret = this.add.image(400, 350, `Torreta${this.avatar}`).setScale(1.3).setOrigin(0.2,0.5).setDepth(15);
    const nameTank = this.add.text(400, 400, this.playerName, {
      fontSize: '32px',
      color: '#2b2b27ff',
      backgroundColor: '#bbb7b7ff',
    }).setOrigin(0.5);


    // Cancel button
    const cancelButton = this.add.image(width / 2, height - 100, 'BTNCancel').setOrigin(0.5).setScale(0.35).setInteractive();

    cancelButton.on('pointerover', () => {
      cancelButton.setScale(0.38);
    });

    cancelButton.on('pointerout', () => {
      cancelButton.setScale(0.35);
    });

    cancelButton.on('pointerdown', () => {
      this.leaveQueue();
      this.scene.start('OnlineScene');
    });

    // Connect to WebSocket server
    this.connectToServer();
  }

  connectToServer() {
    try {
      // Connect to WebSocket server (same host as web server)
      const wsUrl = `ws://${window.location.hostname}:3000`;


      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('Connected to WebSocket server');
        this.statusText.setText('Waiting for opponent...');

        // Join matchmaking queue
        this.ws.send(JSON.stringify({ type: 'joinQueue' , color: this.avatar, name: this.playerName  }) );
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleServerMessage(data);
        } catch (error) {
          console.error('Error parsing server message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.statusText.setText('Connection error!');
        this.statusText.setColor('#ff0000');
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        if (this.scene.isActive('LobbyScene')) {
          this.statusText.setText('Connection lost!');
          this.statusText.setColor('#8a4848ff');
        }
      };
    } catch (error) {
      console.error('Error connecting to server:', error);
      this.statusText.setText('Failed to connect!');
      this.statusText.setColor('#a94848ff');
    }
  }

  handleServerMessage(data) {
    switch (data.type) {
      case 'queueStatus':
        this.playerCountText.setText(`Players in queue: ${data.position}/2`);
        break;

      case 'gameStart':
        console.log('Game starting!', data);
        // Store game data and transition to multiplayer game scene
        this.scene.start('OnlineGameScene', {
          ws: this.ws,
          playerRole: data.role,
          roomId: data.roomId,
          avatar1: data.colorp1, 
          avatar2: data.colorp2,
          name1: data.namep1,
          name2: data.namep2
        });
        break;

      default:
        console.log('Unknown message type:', data.type);
    }
  }

  leaveQueue() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'leaveQueue' }));
      this.ws.close();
    }
  }

  shutdown() {
    this.leaveQueue();
  }
}
