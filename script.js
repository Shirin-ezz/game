const words = ["apple", "grape", "pearl", "pride", "drive", "tried", "stone", "smart", "bread", "flame"];
let answer = words[Math.floor(Math.random() * words.length)];
let attempts = 0;
const maxAttempts = 6;

function createBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    for (let i = 0; i < maxAttempts; i++) {
        for (let j = 0; j < 5; j++) {
            const box = document.createElement('div');
            box.classList.add('letter-box');
            box.id = `box-${i}-${j}`;
            gameBoard.appendChild(box);
        }
    }
}

function submitGuess() {
    const input = document.getElementById('guess-input');
    const guess = input.value.toLowerCase();
    if (guess.length !== 5 || !words.includes(guess)) {
        alert('Invalid guess! Please enter a 5-letter word.');
        return;
    }

    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box-${attempts}-${i}`);
        box.textContent = guess[i];
        if (guess[i] === answer[i]) {
            box.classList.add('correct');
        } else if (answer.includes(guess[i])) {
            box.classList.add('wrong-place');
        } else {
            box.classList.add('wrong');
        }
    }

    attempts++;
    if (guess === answer) {
        alert('Congratulations! You guessed the word.');
        document.getElementById('restart-btn').style.display = 'block';
    } else if (attempts === maxAttempts) {
        alert(`Game over! The word was ${answer}.`);
        document.getElementById('restart-btn').style.display = 'block';
    }

    input.value = ''; 
}

function restartGame() {
    attempts = 0;
    answer = words[Math.floor(Math.random() * words.length)];
    createBoard();
    document.getElementById('restart-btn').style.display = 'none';
}

document.getElementById('submit-btn').addEventListener('click', submitGuess);
document.getElementById('restart-btn').addEventListener('click', restartGame);

window.onload = createBoard;
