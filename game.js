const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 10;
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;
let pause = false;
let drawGrid = true;

let lastAnimationFrameTime = 0;
let fps = 3;

document.getElementById('fpsLabel').innerHTML = fps; 

function generateGrid() {
    let grid = new Array(rows);
    for (let i = 0; i < grid.length; i++) {
        grid[i] = new Array(cols);
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j] = Math.floor(Math.random() * 2);
        }
    }
    return grid;
}

let grid = generateGrid();

function drawCells() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j]) {
                ctx.fillStyle = 'black';
                ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            } else {
                ctx.clearRect(j * cellSize, i * cellSize, cellSize, cellSize);
            }
        }
    }
}

function drawGridLines() {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }
    for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
    }
}

function draw() {
    drawCells();
    if (drawGrid) {
        drawGridLines();
    }
}

function drawOneCell(color) {
    if (color) {
        ctx.fillStyle = 'black';
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
    } else {
        ctx.clearRect(j * cellSize, i * cellSize, cellSize, cellSize);
    }
}

function getNeighbors(grid, x, y) {
    let neighbors = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (!(i === 0 && j === 0)) {
                const newX = (x + i + rows) % rows;
                const newY = (y + j + cols) % cols;
                neighbors += grid[newX][newY];
            }
        }
    }
    return neighbors;
}

function nextGeneration() {
    let newGrid = new Array(rows);
    for (let i = 0; i < newGrid.length; i++) {
        newGrid[i] = new Array(cols);
        for (let j = 0; j < newGrid[i].length; j++) {
            const neighbors = getNeighbors(grid, i, j);
            if (grid[i][j] && (neighbors === 2 || neighbors === 3)) {
                newGrid[i][j] = 1;
            } else if (!grid[i][j] && neighbors === 3) {
                newGrid[i][j] = 1;
            } else {
                newGrid[i][j] = 0;
            }
        }
    }
    grid = newGrid;
}

function clearGrid() {
    let emptyGrid = new Array(rows);
    for (let i = 0; i < emptyGrid.length; i++) {
        emptyGrid[i] = new Array(cols).fill(0);
    }
    grid = emptyGrid;
    draw();
}

function gameLoop(time) {

    const timeSinceLastFrame = time - lastAnimationFrameTime;

    const interval = 1000 / fps;

    if (timeSinceLastFrame > interval) {

        lastAnimationFrameTime = time - (timeSinceLastFrame % interval);

        if (!pause) {
            draw();
            nextGeneration();
        }
    }

    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', (e) => {
    if (pause) {
        const x = Math.floor(e.offsetY / cellSize);
        const y = Math.floor(e.offsetX / cellSize);
        grid[x][y] = grid[x][y] ? 0 : 1;
        draw();
    }
});

document.getElementById('startButton').addEventListener('click', () => {
    grid = generateGrid();
    draw();
    pause = false;
    requestAnimationFrame(gameLoop);
});

document.getElementById('pauseButton').addEventListener('click', () => {
    pause = !pause;
    if (!pause) {
        requestAnimationFrame(gameLoop);
    }
    else{
        draw();
    }

    document.getElementById('pauseLabel').innerHTML = pause? "Оn pause" : "Unpaused";   
});

document.getElementById('clearButton').addEventListener('click', () => {
    pause = true;
    clearGrid();
});

document.getElementById('minusFpsButton').addEventListener('click', () => {
    if(fps > 1){
        fps--;
    }

    document.getElementById('fpsLabel').innerHTML = fps;
});

document.getElementById('plusFpsButton').addEventListener('click', () => {
    if(fps < 60){
        fps++;
    }

    document.getElementById('fpsLabel').innerHTML = fps;     
});

gameLoop();
            