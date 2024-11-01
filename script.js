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

const usedLetters = {}; // Track letters that have been guessed

// Arrow function to initialize the game
const initializeGame = () => {
    gameStatus.answer = gameStatus.words[Math.floor(Math.random() * gameStatus.words.length)];
    gameStatus.attempts = 0;
    createBoard();
    document.getElementById('restart-btn').style.display = 'none';
    console.log("Answer:", gameStatus.answer); // Display answer in console for debugging
};

// Function to create game board
const createBoard = () => {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';  // Clear the board

    for (let i = 0; i < gameStatus.maxAttempts; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('td');
            cell.id = `cell-${i}-${j}`;
            cell.classList.add('letter-box');
            row.appendChild(cell);
        }
        gameBoard.appendChild(row);
    }

    renderUsedLetterBoard(); // Initialize the letter board
};

// Function to handle user input
const submitGuess = async () => {
    const input = document.getElementById('guess-input');
    const guess = input.value.toLowerCase();

    if (guess.length !== 5) {
        alert('Invalid guess! Please enter a 5-letter word.');
        return;
    }

    // Use an API to check if the word is valid
    const response = await fetch(`https://api.datamuse.com/words?sp=${guess}&max=1`);
    const data = await response.json();
    if (data.length === 0) {
        alert('Invalid guess! Please enter a valid word.');
        return;
    }

    guess.split('').forEach((letter, index) => {
        const cell = document.getElementById(`cell-${gameStatus.attempts}-${index}`);
        cell.textContent = letter;

        if (letter === gameStatus.answer[index]) {
            cell.classList.add('correct');
        } else if (gameStatus.answer.includes(letter)) {
            cell.classList.add('wrong-place');
        } else {
            cell.classList.add('wrong');
        }
    });

    updateUsedLetterBoard(guess); // Update the used letter board
    gameStatus.attempts++;

    if (guess === gameStatus.answer) {
        alert('Congratulations! You guessed the word.');
        document.getElementById('restart-btn').style.display = 'block';
    } else if (gameStatus.attempts === gameStatus.maxAttempts) {
        alert(`Game over! The word was ${gameStatus.answer}.`);
        document.getElementById('restart-btn').style.display = 'block';
    }

    input.value = '';
};

// Update the used letter board
const updateUsedLetterBoard = (guess) => {
    guess.split('').forEach((letter, index) => {
        if (!usedLetters[letter]) {
            usedLetters[letter] = { correct: false, wrongPlace: false };
        }

        if (letter === gameStatus.answer[index]) {
            usedLetters[letter].correct = true;
        } else if (gameStatus.answer.includes(letter)) {
            usedLetters[letter].wrongPlace = true;
        } else {
            usedLetters[letter].wrong = true;
        }
    });

    renderUsedLetterBoard();
};

// Render the used letter board
const renderUsedLetterBoard = () => {
    const board = document.getElementById('used-letter-board');
    board.innerHTML = '';

    Object.keys(usedLetters).forEach((letter) => {
        const letterDiv = document.createElement('div');
        letterDiv.classList.add('letter');
        letterDiv.textContent = letter;

        if (usedLetters[letter].correct) {
            letterDiv.classList.add('correct');
        } else if (usedLetters[letter].wrongPlace) {
            letterDiv.classList.add('wrong-place');
        } else {
            letterDiv.classList.add('wrong');
        }

        board.appendChild(letterDiv);
    });
};

// Restart the game
const restartGame = () => initializeGame();

// Event listeners
document.getElementById('submit-btn').addEventListener('click', submitGuess);
document.getElementById('restart-btn').addEventListener('click', restartGame);

// Initialize the game board on page load
window.onload = initializeGame;
