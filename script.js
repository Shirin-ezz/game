// Game status object to store game-related data
const gameStatus = {
    words: [
        "apple", "grape", "pearl", "pride", "drive", "stone", "smart", "bread", "flame", 
        "globe", "crown", "proud", "swift", "trace", "shine", "blaze", "dream", "light",
        "charm", "roast", "sneak", "climb", "grasp", "frame", "flock", "bloom", "craze", 
        "flint", "burst", "slice"
    ],
    answer: "",
    attempts: 0,
    maxAttempts: 6,
};

// Initialize the game by setting a random word as the answer
function initializeGame() {
    gameStatus.answer = gameStatus.words[Math.floor(Math.random() * gameStatus.words.length)];
    gameStatus.attempts = 0;
    createBoard();
    document.getElementById('restart-btn').style.display = 'none';
}

// Generate the game board
function createBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';  // Clear the board before creating a new one
    for (let i = 0; i < gameStatus.maxAttempts; i++) {
        for (let j = 0; j < 5; j++) {
            const box = document.createElement('div');
            box.classList.add('letter-box');
            box.id = `box-${i}-${j}`;
            gameBoard.appendChild(box);
        }
    }
}

// API function to check if a word is valid using Datamuse API
async function isValidWord(guess) {
    const response = await fetch(`https://api.datamuse.com/words?sp=${guess}&max=1`);
    const data = await response.json();
    return data.length > 0;  // Returns true if the API returns a result, meaning it's a valid word
}

// Handle the guess submission using .forEach
async function submitGuess() {
    const input = document.getElementById('guess-input');
    const guess = input.value.toLowerCase();

    // Check if the word is exactly 5 letters
    if (guess.length !== 5) {
        alert('Invalid guess! Please enter a 5-letter word.');
        return;
    }

    // Use the API to check if the word is valid
    const valid = await isValidWord(guess);
    if (!valid) {
        alert('Invalid guess! Please enter a valid word.');
        return;
    }

    // Evaluate the guess against the correct word
    guess.split('').forEach((letter, index) => {
        const box = document.getElementById(`box-${gameStatus.attempts}-${index}`);
        box.textContent = letter;

        if (letter === gameStatus.answer[index]) {
            box.classList.add('correct');
        } else if (gameStatus.answer.includes(letter)) {
            box.classList.add('wrong-place');
        } else {
            box.classList.add('wrong');
        }
    });

    gameStatus.attempts++;

    // Check if the player has guessed the word or used all attempts
    if (guess === gameStatus.answer) {
        alert('Congratulations! You guessed the word.');
        document.getElementById('restart-btn').style.display = 'block';  // Show restart button
    } else if (gameStatus.attempts === gameStatus.maxAttempts) {
        alert(`Game over! The word was ${gameStatus.answer}.`);
        document.getElementById('restart-btn').style.display = 'block';  // Show restart button
    }

    input.value = '';  // Clear input for the next guess
}

// Restart the game
function restartGame() {
    initializeGame();
}

// Event listeners
document.getElementById('submit-btn').addEventListener('click', submitGuess);
document.getElementById('restart-btn').addEventListener('click', restartGame);

// Initialize the game board on page load
window.onload = initializeGame;
