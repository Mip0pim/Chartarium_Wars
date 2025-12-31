/**
 * Game Room service - manages active game rooms and game state
 */
export function createGameRoomService() {
  const rooms = new Map(); // roomId -> room data
  let nextRoomId = 1;

  /**
   * Create a new game room with two players
   * @param {WebSocket} player1Ws - Player 1's WebSocket
   * @param {WebSocket} player2Ws - Player 2's WebSocket
   * @returns {string} Room ID
   */
  function createRoom(player1Ws, player2Ws) {
    const roomId = `room_${nextRoomId++}`;

    const room = {
      id: roomId,
      player1: {
        ws: player1Ws,
        lives: 5
      },
      player2: {
        ws: player2Ws,
        lives: 5
      },
      active: true,
    };

    rooms.set(roomId, room);

    // Store room ID on WebSocket for quick lookup
    player1Ws.roomId = roomId;
    player2Ws.roomId = roomId;

    //generador de power ups
    createPowerUpGenerator(roomId);
    return roomId;
  }
function createPowerUpGenerator(roomId){
    // Lógica para crear y gestionar generadores de power-ups en la sala
    const room = rooms.get(roomId);
    if (!room) return;
    room.maxPowerUps = 0;
    room.powerUpInterval = setInterval(() => {
        const powerUp = generarPowerUp();

        // Enviar a los jugadores de la sala
        if (room.maxPowerUps >= 3) return;
        room.player1.ws.send(JSON.stringify({ type: "spawnPowerUp", data: powerUp }));
        room.player2.ws.send(JSON.stringify({ type: "spawnPowerUp", data: powerUp }));
        room.maxPowerUps += 1;

    }, 10000); // cada 10 segundos
}

function generarPowerUp(){
    const tipos = ['Heal', 'Speed', 'Shield', 'NoShoot'];
    const posicionesX = [100,700,700,100,400];
    const posicionesY = [150,500,150,500,300];

    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    const indicePos = Math.floor(Math.random() * posicionesX.length);
    const x = posicionesX[indicePos];
    const y = posicionesY[indicePos];

    return { tipo, x, y };
}

function handleCollectPowerUp(ws){
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // Decrementar el contador de power-ups en la sala
    room.maxPowerUps -= 1;
    console.log('Power-up collected in room:', roomId);

}
  /**
   * Handle tank movement from a player
   * @param {WebSocket} ws - Player's WebSocket
   * @param {string} action - Movement action {x, y, angle, firing}
   */
  function handleTankMove(ws, action, lives) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // Relay to the other player
    const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;

    if (opponent.readyState === 1) { // WebSocket.OPEN
      opponent.send(JSON.stringify({
        type: 'tankUpdate',
        action,
        lives
      }));
    }
  }

  function handleGameOver(ws, winner) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // Notify both players about game over
    const gameOverMsg = {
      type: 'gameOver',
      winner
    };

    room.player1.ws.send(JSON.stringify(gameOverMsg));
    room.player2.ws.send(JSON.stringify(gameOverMsg));

    // Clean up room
    room.active = false;
    clearInterval(room.powerUpInterval);
    rooms.delete(roomId);
  }

  function handleTankColor(ws, color, role) {
    const roomId = ws.roomId;
    if (!roomId) return;    

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // Relay to the other player
    const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;

    if (opponent.readyState === 1) { // WebSocket.OPEN
      opponent.send(JSON.stringify({
        type: 'tankColor',
        color,
        role
      }));
    }
  }
  /**
   * Handle goal event from a player
   * @param {WebSocket} ws - Player's WebSocket
   * @param {string} side - Which side scored ('left' or 'right')
   */
  function handleGoal(ws, side) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // Prevent duplicate goal detection (both clients send goal event)
    // Only process goal if ball is active
    if (!room.ballActive) {
      return; // Ball not in play, ignore goal
    }
    room.ballActive = false; // Mark ball as inactive until relaunched

    // Update scores
    // When ball hits LEFT goal (x=0), player2 scores (player1 missed)
    // When ball hits RIGHT goal (x=800), player1 scores (player2 missed)
    if (side === 'left') {
      room.player2.score++;
    } else if (side === 'right') {
      room.player1.score++;
    }

    // Broadcast score update to both players
    const scoreUpdate = {
      type: 'scoreUpdate',
      player1Score: room.player1.score,
      player2Score: room.player2.score
    };

    room.player1.ws.send(JSON.stringify(scoreUpdate));
    room.player2.ws.send(JSON.stringify(scoreUpdate));

    // Check win condition (first to 2)
    if (room.player1.score >= 2 || room.player2.score >= 2) {
      const winner = room.player1.score >= 2 ? 'player1' : 'player2';

      const gameOverMsg = {
        type: 'gameOver',
        winner,
        player1Score: room.player1.score,
        player2Score: room.player2.score
      };

      room.player1.ws.send(JSON.stringify(gameOverMsg));
      room.player2.ws.send(JSON.stringify(gameOverMsg));

      // Mark room as inactive
      room.active = false;
    } else {
      // Relaunch ball after 1 second delay
      setTimeout(() => {
        if (room.active) {
          // Generate new ball direction
          const angle = (Math.random() * 60 - 30) * (Math.PI / 180); // -30 to 30 degrees
          const speed = 300;
          const ballData = {
            x: 400,
            y: 300,
            vx: speed * Math.cos(angle),
            vy: speed * Math.sin(angle)
          };

          // Send ball relaunch to both players
          const relaunchMsg = {
            type: 'ballRelaunch',
            ball: ballData
          };

          room.player1.ws.send(JSON.stringify(relaunchMsg));
          room.player2.ws.send(JSON.stringify(relaunchMsg));

          // Mark ball as active again
          room.ballActive = true;
        }
      }, 1000);
    }
  }

  /**
   * Handle player disconnection
   * @param {WebSocket} ws - Disconnected player's WebSocket
   */
  function handleDisconnect(ws) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    // Only notify the other player if the game is still active
    // If the game already ended (room.active = false), don't send disconnect message
    if (room.active) {
      const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;

      if (opponent.readyState === 1) { // WebSocket.OPEN
        opponent.send(JSON.stringify({
          type: 'playerDisconnected'
        }));
      }
    }

    // Clean up room
    room.active = false;
    clearInterval(room.powerUpInterval);
    rooms.delete(roomId);
  }

  

  /**
   * Get number of active rooms
   * @returns {number} Number of active rooms
   */
  function getActiveRoomCount() {
    return Array.from(rooms.values()).filter(room => room.active).length;
  }

  return {
    createRoom,
    handleTankMove,
    handleTankColor,
    handleGoal,
    handleCollectPowerUp,
    handleDisconnect,
    getActiveRoomCount,
    handleGameOver
  };
}
