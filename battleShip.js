let array = [];
let onesInserted = 0; // Counter for the number of 1s inserted
let gridSize = 5; // Size of the grid (5x5)
let points = 0;
let notification = document.querySelector(".notification");
notification.style.display = "none";
// Function to generate a new grid with exactly six 1s
function generateGrid() {
    array = [];
    onesInserted = 0;

    // Create a 1D array of size 25 (5x5 grid)
    let gridArray = new Array(gridSize * gridSize).fill(0);

    // Randomly choose 6 positions to insert 1s
    while (onesInserted < 6) {
        let randomIndex = Math.floor(Math.random() * (gridSize * gridSize));
        if (gridArray[randomIndex] === 0) {
            gridArray[randomIndex] = 1;
            onesInserted++;
        }
    }

    // Convert 1D array back into 5x5 2D array
    let index = 0;
    for (var i = 0; i < gridSize; i++) {
        let row = [];
        for (var j = 0; j < gridSize; j++) {
            row.push(gridArray[index]);
            index++;
        }
        array.push(row);
    }
}

// Function to render the battle grid
function renderBattleGrid() {
    let battleBox = document.querySelector('.battleBox');
    battleBox.innerHTML = ""; // Clear the previous grid

    for (var i = 0; i < gridSize; i++) {
        let div = document.createElement('div');
        div.classList.add('row');
        battleBox.appendChild(div);
        for (var j = 0; j < gridSize; j++) {
            let box = document.createElement('div');
            box.classList.add('box');
            box.setAttribute('data-value', array[i][j]); // Store the value
            div.appendChild(box);
        }
    }

    // Attach event listeners to each box
    let shipBox = document.querySelectorAll('.box');
    shipBox.forEach((box) => {
        box.addEventListener('click', () => {
            // Prevent interaction if the game is over
            if (gameEnded) return;

            // Check if the box is already selected
            if (box.classList.contains('found') || box.classList.contains('notfound')) {
                return;
            }

            // Check if the user has any tries left
            if (tries == 0) {
                showNotification(`<p class="message">You Lost! No more tries left.</p>`);
                showPopup(true); // Show popup with the solution
                return;
            }

            // Handle user guess
            if (box.getAttribute('data-value') == 1) {
                found++;
                points += 10;
                box.classList.add('found');
                box.textContent = '🚢';
                if (found == ships) { // Check if all ships are found
                    showNotification(`<p class="message">You Won! You found all the ships.</p>`);
                    gameEnded = true;
                    showRestartButton();
                    return;
                }
                showNotification(`<p class="message">You Found a Ship! <strong> ${ships - found} </strong> more ships to find.`)
            } else {
                tries--;
                if (points > 0) {
                    points -= 5;
                }
                box.classList.add('notfound');

                if (tries == 0) {
                    showPopup(true); // Show popup with the solution
                    return;
                }
                showNotification(`<p class="message">Not Found.  <strong>${tries} </strong>tries left to find <strong> ${ships - found} </strong> ships.</p>`)
            }
            updatePoints();
        });
    });
}

// Function to display the solution popup
function showPopup(gameEnded) {

    // Create popup container
    let popup = document.createElement('div');
    popup.classList.add('popup');
    document.body.appendChild(popup);

    // Create popup content
    let popupContent = document.createElement('div');
    popupContent.classList.add('popup-content');
    popup.appendChild(popupContent);

    // Add header
    let header = document.createElement('div');
    if (gameEnded) {
        showRestartButton(); // Show restart button
        header.innerHTML = '<h2>You Lost!</h2> <p> Here is the solution:</p>';
    }
    else {
        header.innerHTML = '<h2>Solution!</h2>';
    }
    popupContent.appendChild(header);

    // Display solution grid
    let solutionGrid = document.createElement('div');
    solutionGrid.classList.add('solution-grid');
    for (let i = 0; i < gridSize; i++) {
        let row = document.createElement('div');
        row.classList.add('solution-row');
        for (let j = 0; j < gridSize; j++) {
            let cell = document.createElement('div');
            cell.classList.add('solution-cell');
            cell.textContent = array[i][j] === 1 ? '🚢' : '';
            row.appendChild(cell);
        }
        solutionGrid.appendChild(row);
    }
    popupContent.appendChild(solutionGrid);

    // Add close button
    let closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.classList.add('close-btn');
    popupContent.appendChild(closeButton);

    closeButton.addEventListener('click', () => {
        popup.remove(); // Remove the popup
    });
}

// Variables to track game state
let tries, ships, found, gameEnded;

// Function to initialize a new game
function initializeGame() {
    generateGrid();
    tries = 10; // Set number of tries to 10
    ships = 6;  // Set number of ships to 6
    found = 0;
    points = 0;
    gameEnded = false;
    notification.innerHTML = "";
    renderBattleGrid();
    hideRestartButton();
    updatePoints();
}
function updatePoints() {
    // Update the button's disabled state based on current points
    let solutionButton = document.getElementById('solutionButton');
    if (points > 10) {
        solutionButton.disabled = false;  // Enable the button if points are > 10
    } else {
        solutionButton.disabled = true;  // Disable the button if points are <= 0
    }

    return points;
}

function showNotification(message){
    notification.style.display = "block";
    notification.innerHTML = message;
}
let solutionButton = document.getElementById('solutionButton');
solutionButton.addEventListener('click', () => {
    showPopup(false);
});

// Add Restart button and functionality
let restartButtonContainer = document.createElement('div');
let restartButton = document.createElement('button');
let container = document.querySelector('.container');
restartButton.textContent = "Restart Game";
restartButton.classList.add('restart-btn');
container.appendChild(restartButtonContainer);
restartButtonContainer.appendChild(restartButton);
restartButton.addEventListener('click', initializeGame);

function showRestartButton() {
    restartButtonContainer.style.display = "block";
}

function hideRestartButton() {
    restartButtonContainer.style.display = "none";
}

// Start the first game
initializeGame();
