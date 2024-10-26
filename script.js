// Define the array of at least 30 five-letter words
const words = [
    "apple", "grape", "pearl", "pride", "drive", "stone", "smart", "bread", "flame", 
    "globe", "crown", "proud", "swift", "trace", "shine", "blaze", "dream", "light",
    "charm", "roast", "sneak", "climb", "grasp", "frame", "flock", "bloom", "craze", 
    "flint", "burst", "slice"
];

// Randomly select a word from the array as the answer
let answer = words[Math.floor(Math.random() * words.length)];
let attempts = 0;
const maxAttempts = 6;

// Generate the game board
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

// Handle the guess submission
function submitGuess() {
    const input = document.getElementById('guess-input');
    const guess = input.value.toLowerCase();
    
    if (guess.length !== 5 || !words.includes(guess)) {
        alert('Invalid guess! Please enter a 5-letter word from the dictionary.');
        return;
    }

    // Evaluate the guess
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

    input.value = ''; // Clear input
}

// Restart the game
function restartGame() {
    attempts = 0;
    answer = words[Math.floor(Math.random() * words.length)];
    createBoard();
    document.getElementById('restart-btn').style.display = 'none';
}

// Event listeners
document.getElementById('submit-btn').addEventListener('click', submitGuess);
document.getElementById('restart-btn').addEventListener('click', restartGame);

// Initialize the game board on page load
window.onload = createBoard;
