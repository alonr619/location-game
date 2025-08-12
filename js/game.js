// Game logic and state management

class GameState {
  constructor() {
    this.playerPosition = { x: 2, y: 2 }; // Start in center
    this.score = 0;
    this.gameStatus = 'playing'; // 'playing', 'gameOver', 'victory'
    this.grid = this.initializeGrid();
  }

  initializeGrid() {
    const grid = [];
    for (let i = 0; i < GAME_CONFIG.gridSize; i++) {
      grid[i] = [];
      for (let j = 0; j < GAME_CONFIG.gridSize; j++) {
        grid[i][j] = 'E'; // E for Empty - default all cells to empty
      }
    }
    
    // MANUAL LAYOUT SETUP - Customize these positions as needed
    
    // Set traps (T) at specific coordinates
    grid[3][1] = 'T';
    grid[3][2] = 'T';
    grid[3][3] = 'T';
    grid[2][3] = 'T';
    grid[1][1] = 'T';
    grid[0][3] = 'T';
    grid[0][4] = 'T';
    
    // Set flag (F) at specific coordinates
    grid[3][4] = 'F';
    
    return grid;
  }

  updatePlayerPosition(x, y) {
    // Check what's at the new position
    const cellContent = this.grid[y][x];
    
    // Clear old position
    this.grid[this.playerPosition.y][this.playerPosition.x] = 'E'; // Restore to empty
    
    // Set new position
    this.playerPosition = { x, y };
    this.grid[y][x] = 'P'; // P for Player
    
    // Check for game events
    if (cellContent === 'T') {
      // Player hit a trap
      this.gameStatus = 'gameOver';
      return { success: false, event: 'trap' };
    } else if (cellContent === 'F') {
      // Player reached the flag
      this.gameStatus = 'victory';
      return { success: false, event: 'flag' };
    }
    
    // Simple scoring: +10 points for each move
    this.score += 10;
    
    return { success: true, event: 'move' };
  }

  resetGame() {
    this.grid = this.initializeGrid();
    this.playerPosition = { x: 2, y: 2 };
    this.score = 0;
    this.gameStatus = 'playing';
  }

  // toJSON method removed since we're not saving to database anymore

  // fromJSON method removed since we're not loading from database anymore
}

// Render the game grid in HTML
function renderGameGrid(gameState, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  
  for (let y = 0; y < GAME_CONFIG.gridSize; y++) {
    for (let x = 0; x < GAME_CONFIG.gridSize; x++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      
      const isPlayer = gameState.playerPosition.x === x && gameState.playerPosition.y === y;
      const cellContent = gameState.grid[y][x];
      
      if (isPlayer) {
        cell.classList.add('player');
        cell.textContent = '👤';
      } else if (cellContent === 'T') {
        cell.classList.add('trap');
        cell.textContent = '💣';
      } else if (cellContent === 'F') {
        cell.classList.add('flag');
        cell.textContent = '🚩';
      } else {
        cell.classList.add('empty');
        cell.textContent = '';
      }
      
      container.appendChild(cell);
    }
  }
}

// Update game info display
function updateGameInfo(gameState) {
  const scoreElement = document.getElementById('score');
  
  if (scoreElement) scoreElement.textContent = gameState.score;
}

// Show game over screen
function showGameOver(gameState) {
  const gameSection = document.getElementById('gameSection');
  const gameOverScreen = document.createElement('div');
  gameOverScreen.id = 'gameOverScreen';
  gameOverScreen.className = 'game-overlay';
  gameOverScreen.innerHTML = `
    <div class="game-overlay-content">
      <h1 class="game-over-title">💥 GAME OVER!</h1>
      <p class="game-over-message">You hit a trap! Better luck next time.</p>
      <p class="game-over-score">Final Score: <span id="finalScore">${gameState.score}</span></p>
      <button id="restartBtn" class="btn btn-primary btn-large">🔄 Restart Game</button>
    </div>
  `;
  
  gameSection.appendChild(gameOverScreen);
  
  // Add restart button event listener
  document.getElementById('restartBtn').addEventListener('click', () => restartGame(gameState));
}

// Show victory screen
function showVictory(gameState) {
  const gameSection = document.getElementById('gameSection');
  const victoryScreen = document.createElement('div');
  victoryScreen.id = 'victoryScreen';
  victoryScreen.className = 'game-overlay';
  victoryScreen.innerHTML = `
    <div class="game-overlay-content">
      <h1 class="game-over-title">🎉 VICTORY!</h1>
      <p class="game-over-message">You found the flag! Congratulations!</p>
      <p class="game-over-score">Final Score: <span id="finalScore">${gameState.score}</span></p>
      <button id="restartBtn" class="btn btn-primary btn-large">🔄 Play Again</button>
    </div>
  `;
  
  gameSection.appendChild(victoryScreen);
  
  // Add restart button event listener
  document.getElementById('restartBtn').addEventListener('click', () => restartGame(gameState));
}

// Restart the game
// Note: This function is a placeholder. The actual implementation is in game.html
// where it has access to currentUser and other global variables
async function restartGame(gameState) {
  console.log('Restart game called with gameState:', gameState);
  // The actual restart logic is implemented in game.html
}
