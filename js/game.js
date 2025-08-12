// Game logic and state management

class GameState {
  constructor() {
    this.grid = this.initializeGrid();
    this.playerPosition = { x: 2, y: 2 }; // Start in center
    this.score = 0;
    this.level = 1;
    this.lastUpdate = new Date().toISOString();
  }

  initializeGrid() {
    const grid = [];
    for (let i = 0; i < GAME_CONFIG.gridSize; i++) {
      grid[i] = [];
      for (let j = 0; j < GAME_CONFIG.gridSize; j++) {
        grid[i][j] = null; // Empty cell
      }
    }
    return grid;
  }

  updatePlayerPosition(x, y) {
    // Clear old position
    this.grid[this.playerPosition.y][this.playerPosition.x] = null;
    
    // Set new position
    this.playerPosition = { x, y };
    this.grid[y][x] = 'P'; // P for Player
    
    this.lastUpdate = new Date().toISOString();
    
    // Simple scoring: +10 points for each move
    this.score += 10;
    
    return true;
  }

  toJSON() {
    return {
      grid: this.grid,
      playerPosition: this.playerPosition,
      score: this.score,
      level: this.level,
      lastUpdate: this.lastUpdate
    };
  }

  fromJSON(data) {
    if (data) {
      this.grid = data.grid || this.initializeGrid();
      this.playerPosition = data.playerPosition || { x: 2, y: 2 };
      this.score = data.score || 0;
      this.level = data.level || 1;
      this.lastUpdate = data.lastUpdate || new Date().toISOString();
      
      // Ensure player is marked on grid
      if (this.playerPosition) {
        this.grid[this.playerPosition.y][this.playerPosition.x] = 'P';
      }
    }
  }
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
      
      if (isPlayer) {
        cell.classList.add('player');
        cell.textContent = '👤';
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
  const levelElement = document.getElementById('level');
  const lastUpdateElement = document.getElementById('lastUpdate');
  
  if (scoreElement) scoreElement.textContent = gameState.score;
  if (levelElement) levelElement.textContent = gameState.level;
  if (lastUpdateElement) {
    const date = new Date(gameState.lastUpdate);
    lastUpdateElement.textContent = date.toLocaleTimeString();
  }
}
