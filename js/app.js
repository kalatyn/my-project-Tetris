document.addEventListener('DOMContentLoaded', () => {
    const playField = document.querySelector('.playField');
    const scoreElement = document.getElementById('score');
    const levelElement = document.getElementById('level');
    const linesElement = document.getElementById('lines');
    const highScoreElement = document.getElementById('highScore');

    let playFieldMatrix = Array.from({ length: 20 }, () => Array(10).fill(0));
    let score = 0;
    let lines = 0;
    let level = 1;
    let highScore = localStorage.getItem('highScore') || 0;
    highScoreElement.textContent = highScore;

    for (let i = 0; i < 200; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        playField.appendChild(cell);
    }

    const tetrominoes = [
        { shape: [[1, 1, 1, 1]], color: 'cyan' },
        { shape: [[1, 1], [1, 1]], color: 'yellow' },
        { shape: [[0, 1, 0], [1, 1, 1]], color: 'purple' },
        { shape: [[1, 1, 0], [0, 1, 1]], color: 'red' },
        { shape: [[0, 1, 1], [1, 1, 0]], color: 'green' },
        { shape: [[1, 1, 1], [1, 0, 0]], color: 'orange' },
        { shape: [[1, 1, 1], [0, 0, 1]], color: 'blue' },
    ];

    let tetromino = getRandomTetromino();
    let x = 3;
    let y = 0;
    let dropInterval = 600;

    function drawPlayField() {
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 10);
            const col = index % 10;
            cell.style.backgroundColor = playFieldMatrix[row][col] ? playFieldMatrix[row][col] : 'rgb(216, 249, 238)';
        });
    }

    function drawTetromino() {
        tetromino.shape.forEach((row, rowIndex) => {
            row.forEach((val, colIndex) => {
                if (val) {
                    const index = (y + rowIndex) * 10 + (x + colIndex);
                    const cell = playField.children[index];
                    cell.style.backgroundColor = tetromino.color;
                }
            });
        });
    }

    function getRandomTetromino() {
        const index = Math.floor(Math.random() * tetrominoes.length);
        return tetrominoes[index];
    }

    function checkCollision(newX, newY, shape) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    let newXPos = newX + col;
                    let newYPos = newY + row;
                    if (
                        newXPos < 0 ||
                        newXPos >= 10 ||
                        newYPos >= 20 ||
                        (playFieldMatrix[newYPos] && playFieldMatrix[newYPos][newXPos])
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function mergeTetromino() {
        tetromino.shape.forEach((row, rowIndex) => {
            row.forEach((val, colIndex) => {
                if (val) {
                    playFieldMatrix[y + rowIndex][x + colIndex] = tetromino.color;
                }
            });
        });
    }

    function calculateScore(linesToRemove) {
        const linesCount = linesToRemove.length;
        let points = 0;

        if (linesCount === 1) {
            points = 100;
        } else if (linesCount === 2) {
            points = 300;
        } else if (linesCount === 3) {
            points = 500;
        } else if (linesCount === 4) {
            points = 800;
        }

        return points;
    }

    function removeFullLines() {
        let linesToRemove = [];
        playFieldMatrix.forEach((row, rowIndex) => {
            if (row.every(cell => cell !== 0)) {
                linesToRemove.push(rowIndex);
            }
        });

        linesToRemove.forEach(rowIndex => {
            playFieldMatrix.splice(rowIndex, 1);
            playFieldMatrix.unshift(Array(10).fill(0));
        });

        const points = calculateScore(linesToRemove);
        score += points;
        lines += linesToRemove.length;

        scoreElement.textContent = score;
        linesElement.textContent = lines;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreElement.textContent = highScore;
        }

        if (lines >= level * 10) {
            level++;
            dropInterval = dropInterval * 0.9;
            levelElement.textContent = level;
        }
    }

    function gameLoop() {
        
        drawPlayField();
        drawTetromino();
        y++;
        if (checkCollision(x, y, tetromino.shape)) {
            y--;
            mergeTetromino();
            removeFullLines();
            tetromino = getRandomTetromino();
            x = 3;
            y = 0;
            if (checkCollision(x, y, tetromino.shape)) {
                alert('Game Over');
                
                playFieldMatrix = Array.from({ length: 20 }, () => Array(10).fill(0));
                score = 0;
                lines = 0;
                level = 1;
                dropInterval = 600;
                scoreElement.textContent = score;
                linesElement.textContent = lines;
                levelElement.textContent = level;
            }
        }
        setTimeout(gameLoop, dropInterval);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && !checkCollision(x - 1, y, tetromino.shape)) {
            x--;
        } else if (e.key === 'ArrowRight' && !checkCollision(x + 1, y, tetromino.shape)) {
            x++;
        } else if (e.key === 'ArrowDown' && !checkCollision(x, y + 1, tetromino.shape)) {
            y++;
        } else if (e.key === 'ArrowUp') {
            const rotatedShape = rotate(tetromino.shape);
            if (!checkCollision(x, y, rotatedShape)) {
                tetromino.shape = rotatedShape;
            }
        }
        drawPlayField();
        drawTetromino();
    });

    function rotate(shape) {
        const newShape = shape[0].map((_, colIndex) => shape.map(row => row[colIndex])).reverse();
        return newShape;
    }

    document.querySelector('#start').addEventListener('click', () => {
        const audio = document.querySelector('audio');
        document.querySelector('#mute').innerHTML= '&#128266;';
        audio.play();
        gameLoop();
    });

    document.querySelector('#mute').addEventListener('click', () => {
        
        const audio = document.querySelector('audio');

        if (audio.paused) {
            document.querySelector('#mute').innerHTML= '&#128266;';
            audio.play();


        } else {
            audio.pause();
            document.querySelector('#mute').innerHTML= '&#128263;';

        }
    });
});
