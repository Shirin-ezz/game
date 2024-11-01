// JavaScript game logic for Wordle

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

const initializeGame = () => {
    gameStatus.answer = gameStatus.words[Math.floor(Math.random() * gameStatus.words.length)];
    gameStatus.attempts = 0;
    createBoard();
    document.getElementById('restart-btn').style.display = 'none';
    console.log("Answer:", gameStatus.answer);
};

const createBoard = () => {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

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

    renderUsedLetterBoard();
};

const usedLetters = {};

const submitGuess = async () => {
    const input = document.getElementById('guess-input');
    const guess = input.value.toLowerCase();

    if (guess.length !== 5) {
        alert('Invalid guess! Please enter a 5-letter word.');
        return;
    }

    // Verify if the guess is a valid word using an API
    const response = await fetch(`https://api.datamuse.com/words?sp=${guess}&max=1`);
    const data = await response.json();
    if (data.length === 0) {
        alert('Invalid guess! Please enter a valid word.');
        return;
    }

    guess.split('').forEach((letter, index) => {
        const cell = document.getElementById(`cell-${gameStatus.attempts}-${index}`);
        cell.textContent = letter;

        // Clear existing classes
        cell.classList.remove('correct', 'wrong-place', 'wrong');

        // Apply the correct class
        if (letter === gameStatus.answer[index]) {
            cell.classList.add('correct');  // Adds green color
        } else if (gameStatus.answer.includes(letter)) {
            cell.classList.add('wrong-place');  // Adds yellow color
        } else {
            cell.classList.add('wrong');  // Adds gray color
        }
    });

    updateUsedLetterBoard(guess);
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

const restartGame = () => initializeGame();

document.getElementById('submit-btn').addEventListener('click', submitGuess);
document.getElementById('restart-btn').addEventListener('click', restartGame);

window.onload = initializeGame;
