const gameContainer = document.getElementById('game-container');
const startButton = document.getElementById('start-button');
const timerDisplay = document.getElementById('timer');
const messageDisplay = document.getElementById('message');
const messageContainer = document.getElementById('message-container');
let tiles = [];
let timer;
let timeLeft = 60; // 1 minute
let gameStarted = false;
const gridSize = 3;

function createTiles() {
    // Start with a solved puzzle
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, ""];

    // Perform a *small* number of random swaps to make it slightly challenging
    for (let i = 0; i < 10; i++) { // Adjust the number of swaps to control difficulty
        const index1 = Math.floor(Math.random() * numbers.length);
        const index2 = Math.floor(Math.random() * numbers.length);
        [numbers[index1], numbers[index2]] = [numbers[index2], numbers[index1]];
    }

    tiles = [];
    gameContainer.innerHTML = '';

    for (let i = 0; i < numbers.length; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.textContent = numbers[i];
        tile.addEventListener('click', tileClick);
        gameContainer.appendChild(tile);
        tiles.push(tile);
    }
    gameContainer.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function isSolvable(numbers) {
    let inversions = 0;
    for (let i = 0; i < numbers.length; i++) {
        for (let j = i + 1; j < numbers.length; j++) {
            if (numbers[i] && numbers[j] && numbers[i] > numbers[j]) {
                inversions++;
            }
        }
    }
    return inversions % 2 == 0; // Even inversions = solvable
}


function tileClick(event) {
    if (!gameStarted) return;

    const clickedTile = event.target;
    const emptyTile = tiles.find(tile => tile.textContent === "");

    if (isAdjacent(clickedTile, emptyTile)) {
        swapTiles(clickedTile, emptyTile);
        if (checkWin()) {
            endGame(true);
        }
    }
}

function isAdjacent(tile1, tile2) {
    const index1 = tiles.indexOf(tile1);
    const index2 = tiles.indexOf(tile2);
    const rowDiff = Math.abs(Math.floor(index1 / gridSize) - Math.floor(index2 / gridSize));
    const colDiff = Math.abs(index1 % gridSize - index2 % gridSize);

    return (rowDiff + colDiff == 1);
}

function swapTiles(tile1, tile2) {
    const tempText = tile1.textContent;
    tile1.textContent = tile2.textContent;
    tile2.textContent = tempText;
}

function checkWin() {
    const correctOrder = [1, 2, 3, 4, 5, 6, 7, 8, ""];

    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].textContent != correctOrder[i]) {
            return false;
        }
    }
    return true;
}

function startTimer() {
    clearInterval(timer);

    timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

function endGame(win) {
    clearInterval(timer);
    gameStarted = false;
    messageContainer.style.display = 'flex';

    if (win) {
        messageDisplay.textContent = "Congratulations! You successfully completed the game!";
        messageDisplay.classList.remove('error');
    } else {
        messageDisplay.textContent = "You lost! Try again.";
        messageDisplay.classList.add('error');
    }
    startButton.textContent = "Start Game";
}

    startButton.addEventListener('click', () => {
        if (!gameStarted) {
            createTiles();
            startTimer();
            messageDisplay.textContent = "";
            messageContainer.style.display = 'none';
            startButton.textContent = "Restart";
            timeLeft = 60;
            timerDisplay.textContent = "1:00";
            gameStarted = true;
        } 
        else {
            gameContainer.innerHTML = '';
            createTiles();
            timeLeft = 60;
            timerDisplay.textContent = "1:00";
            messageDisplay.textContent = "";
            messageContainer.style.display = 'none';
            gameStarted = true;
            startTimer();
        }
        const popup = document.getElementById('popup');
        const popupMessage = document.getElementById('popup-message');
        const closeButton = document.querySelector('.close-button');


        function endGame(win) {
        clearInterval(timer);
        gameStarted = false;
        popup.classList.add('show'); // Show the popup

        if (win) {
            popupMessage.textContent = "Congratulations! You successfully completed the game!";
            popupMessage.classList.remove('lose');
            popupMessage.classList.add('win');
        }    
        else {
            popupMessage.textContent = "You lost! Try again.";
            popupMessage.classList.remove('win');
            popupMessage.classList.add('lose');
        }
        startButton.textContent = "Start Game";
        }

        closeButton.addEventListener('click', () => {
        popup.classList.remove('show'); // Hide the popup
    });
});