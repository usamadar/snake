const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const pauseButton = document.getElementById('pauseButton');
const restartButton = document.getElementById('restartButton');
const touchButtons = {
    up: document.getElementById('touchUp'),
    down: document.getElementById('touchDown'),
    left: document.getElementById('touchLeft'),
    right: document.getElementById('touchRight')
};

const gridSize = 20;
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let gameInterval;
let isPaused = false;

function getRandomFoodPosition() {
    return {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };
}

function drawSnake() {
    snake.forEach((segment, index) => {
        const gradient = ctx.createLinearGradient(
            segment.x, segment.y, 
            segment.x + gridSize, segment.y + gridSize
        );
        gradient.addColorStop(0, '#4CAF50');
        gradient.addColorStop(1, '#45a049');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        
        // Add eyes to the head
        if (index === 0) {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(segment.x + 5, segment.y + 5, 2, 0, Math.PI * 2);
            ctx.arc(segment.x + 15, segment.y + 5, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

function drawFood() {
    const gradient = ctx.createRadialGradient(
        food.x + gridSize/2, food.y + gridSize/2, 2,
        food.x + gridSize/2, food.y + gridSize/2, gridSize/2
    );
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(1, '#ee5253');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(food.x + gridSize/2, food.y + gridSize/2, gridSize/2, 0, Math.PI * 2);
    ctx.fill();
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        food = getRandomFoodPosition();
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function gameLoop() {
    if (isPaused) return;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    for(let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
    
    moveSnake();
    if (checkCollision()) {
        clearInterval(gameInterval);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width/2, canvas.height/2);
        return;
    }
    drawSnake();
    drawFood();
}

function startGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 };
    food = getRandomFoodPosition();
    score = 0;
    scoreElement.textContent = score;
    gameInterval = setInterval(gameLoop, 100);
}

function resizeCanvas() {
    const container = document.querySelector('.container');
    const maxWidth = Math.min(window.innerWidth - 30, 400);
    canvas.style.width = maxWidth + 'px';
    canvas.style.height = maxWidth + 'px';
}

document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -gridSize };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: gridSize };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -gridSize, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: gridSize, y: 0 };
            break;
    }
});

Object.entries(touchButtons).forEach(([direction, button]) => {
    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        switch(direction) {
            case 'up':
                if (direction.y === 0) direction = { x: 0, y: -gridSize };
                break;
            case 'down':
                if (direction.y === 0) direction = { x: 0, y: gridSize };
                break;
            case 'left':
                if (direction.x === 0) direction = { x: -gridSize, y: 0 };
                break;
            case 'right':
                if (direction.x === 0) direction = { x: gridSize, y: 0 };
                break;
        }
    });
});

pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
});

restartButton.addEventListener('click', () => {
    clearInterval(gameInterval);
    startGame();
});

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

startGame();
