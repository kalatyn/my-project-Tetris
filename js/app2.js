document.addEventListener('DOMContentLoaded', () => {
    const playField         = document.querySelector('.playField');
    const musikElement      = document.querySelector('audio');
    const scoreElement      = document.querySelector(".score");
    const levelElement      = document.querySelector('.level');
    const linesElement      = document.querySelector('.lines');
    const highScoreElement  = document.querySelector('.highScore');
    const startBtn          = document.querySelector('#start');
    const muteBtn           = document.querySelector('mute');

    let playFieldMatrix = Array.from({length: 20}, () => Array(10).fill(0))
    let score = 0;
    let level = 1;
    let lines = 0;
    let highScore = localStorage.getItem('highScore') || 0;
    
    for (let i = 0; i < 200; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        playField.appendChild(cell);
    }









});

