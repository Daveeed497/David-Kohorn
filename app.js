//Establish game constants
const flagCount = document.querySelector("#flag-indicator");
const width = 16;
const mines = 40;

//Establish game variables
let flagsLeft = 40;
let gameOver = false;

//Create game board
createGameBoard();

//Generates all game tiles into the board
function createGameBoard() {
    //Setup info display
    flagCount.innerHTML = flagsLeft;

    //Create shuffled array of mine and safe tiles 
    const mineArray = Array(mines).fill("mine");
    const safeArray = Array(width * width - mines).fill("safe");
    const gameArray = safeArray.concat(mineArray);
    const shuffledGameArray = gameArray.sort(() => Math.random() - 0.5);

    //Create each cell
    for (let i = 0; i < shuffledGameArray.length; i++){
        let cell = document.createElement("div")

        //Add class and id properties
        cell.classList.add("cell");
        cell.classList.add("covered");
        cell.classList.add(shuffledGameArray[i]);
        cell.setAttribute("id", i);
        
        const gameBoard = document.querySelector("#board")
        gameBoard.appendChild(cell);


        //Add left click listener (reveal tile)
        cell.addEventListener("click", function() {
            revealCell(cell);
        })

        //Add right click listener (flag tile)
        cell.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            placeFlag(cell);
            return false;
        })
    }

    addEdgeTags();
}

//Reveal tile or trigger bomb 
function revealCell(cell) {
    if (!cell.classList.contains("flagged") && !gameOver) {
        if (cell.classList.contains("mine")) {
            triggerMines(cell);
            displayEndResult("loss");
            console.log(gameOver);
        }
        else if (countMines(cell) != 0){
            cell.classList.add("revealed");
            cell.classList.remove("covered");
            displayNumber(countMines(cell), cell);

            if (checkWin()) {
                displayEndResult("win");
            }
        }
        else {
            revealAdjacentCells(cell);
        }

    }
    
}

//Place and remove flag
function placeFlag(cell) {
    if (cell.classList.contains("covered") && !gameOver) {
        //Place flag if possible
        if (!cell.classList.contains("flagged") && flagsLeft > 0) {
            cell.innerHTML = "<img src=\"images/flag.png\">"
            cell.classList.add("flagged");
    
            flagsLeft--;
            flagCount.innerHTML = flagsLeft;
            return;
        }
        //Delete flag
        if (cell.classList.contains("flagged")) {
            cell.innerHTML = "";
            cell.classList.remove("flagged");
    
            flagsLeft++;
            flagCount.innerHTML = flagsLeft;
            return;
        }
    }
}

//Wipes and recreates the game board as well as resets the flag count
function resetGame() {
    let allCells = document.getElementsByClassName("cell");
    let endResultText = document.getElementById("end-result-text");
    while (allCells.length > 0) {
        allCells[0].remove();
    }
    flagsLeft = 40;
    createGameBoard();
    gameOver = false;
    endResultText.innerHTML = "";

}

//Reveals all mines
function triggerMines(cell) {
    //Reveal all mines
    let allMines = document.getElementsByClassName("mine");
    for (let i = 0; i < allMines.length; i++) {
        allMines[i].classList.remove("covered");
        allMines[i].classList.add("revealed");
        allMines[i].innerHTML = "<img src=\"images/bomb.png\">"
    }

    //Re-color clicked mine
    let id = cell.id
    let el = document.getElementById(id);
    el.style.backgroundColor = "red";
}

//Adds class names to cells to indicate if and what edges they touch
function addEdgeTags() {
    let allCells = document.getElementsByClassName("cell");
    

    for (let i = 0; i < allCells.length; i++) {
        let currentCell = allCells[i];
        let id = Math.floor(currentCell.id)

        if(id <= width - 1) {
            currentCell.classList.add("top-edge");
        }
        if(id >= (width * (width - 1))) {
            currentCell.classList.add("bottom-edge");
        }

        if(id % width == 0) {
            currentCell.classList.add("left-edge");
        }

        if((id + 1) % width == 0) {
            currentCell.classList.add("right-edge");
        }
    }

}
//Counts and returns nearby mines to given cell
function countMines(cell) {
    let id = Math.floor(cell.id);
    let mineCount = 0;

    //Check upper left
    if (!cell.classList.contains("top-edge") && !cell.classList.contains("left-edge")) {
        let upperLeftID = id - width - 1;
        let upperLeftCell = document.getElementById(upperLeftID);

        if(upperLeftCell.classList.contains("mine")) {
            mineCount++;
        }
    }

    //Check upper 
    if (!cell.classList.contains("top-edge")) {
        let upperID = id - width;
        let upperCell = document.getElementById(upperID);

        if(upperCell.classList.contains("mine")) {
            mineCount++;
        }
    }

    //Check upper right 
    if (!cell.classList.contains("top-edge") && !cell.classList.contains("right-edge")) {
        let upperRightID = id - width + 1;
        let upperRightCell = document.getElementById(upperRightID);

        if(upperRightCell.classList.contains("mine")) {
            mineCount++;
        }
    }

    //Check left 
    if (!cell.classList.contains("left-edge")) {
        let leftID = id - 1;
        let leftCell = document.getElementById(leftID);

        if(leftCell.classList.contains("mine")) {
            mineCount++;
        }
    }

    //Check right 
    if (!cell.classList.contains("right-edge")) {
        let rightID = id + 1;
        let rightCell = document.getElementById(rightID);

        if(rightCell.classList.contains("mine")) {
            mineCount++;
        }
    }

    //Check lower left
    if (!cell.classList.contains("left-edge") && !cell.classList.contains("bottom-edge")) {
        let lowerLeftID = id + width - 1;
        let lowerLeftCell = document.getElementById(lowerLeftID);

        if(lowerLeftCell.classList.contains("mine")) {
            mineCount++;
        }
    }

    //Check lower 
    if (!cell.classList.contains("bottom-edge")) {
        let lowerID = id + width;
        let lowerCell = document.getElementById(lowerID);

        if(lowerCell.classList.contains("mine")) {
            mineCount++;
        }
    }

    //Check lower right
    if (!cell.classList.contains("right-edge") && !cell.classList.contains("bottom-edge")) {
        let lowerRightID = id + width + 1;
        let lowerRightCell = document.getElementById(lowerRightID);

        if(lowerRightCell.classList.contains("mine")) {
            mineCount++;
        }
    } 

    return mineCount;
}

//Displays number representing adjacent bombs
function displayNumber(numMines, cell) {
    cell.innerHTML = numMines;

    switch (numMines) {
        case 1:
            cell.classList.add("display-1");
            break;
        case 2:
            cell.classList.add("display-2");
            break;
        case 3:
            cell.classList.add("display-3");
            break;
        case 4:
            cell.classList.add("display-4");
            break;
        case 5:
            cell.classList.add("display-5");
            break;
        case 6:
            cell.classList.add("display-6");
            break;
        case 7:
            cell.classList.add("display-7");
            break;
        case 8:
            cell.classList.add("display-8");
            break;
    }
}

//Counts and returns nearby mines to given cell
function revealAdjacentCells(cell) {
    cell.classList.add("revealed");
    cell.classList.remove("covered");

    if (checkWin()) {
        displayEndResult("win");
    }
    
    let id = Math.floor(cell.id);

    if (countMines(cell) != 0) {
        displayNumber(countMines(cell), cell);
        return;
    }
    // && upperCell.classList.contains("safe")
    
    //Check upper left
    if (!cell.classList.contains("top-edge") && !cell.classList.contains("left-edge")) {
        let upperLeftID = id - width - 1;
        let upperLeftCell = document.getElementById(upperLeftID);

        if (upperLeftCell.classList.contains("covered") && upperLeftCell.classList.contains("safe")) {
            revealAdjacentCells(upperLeftCell);
        }
    }

    //Check upper 
    if (!cell.classList.contains("top-edge")) {
        let upperID = id - width;
        let upperCell = document.getElementById(upperID);

        if (upperCell.classList.contains("covered") && upperCell.classList.contains("safe")) {
            revealAdjacentCells(upperCell);
        }
    }

    //Check upper right 
    if (!cell.classList.contains("top-edge") && !cell.classList.contains("right-edge")) {
        let upperRightID = id - width + 1;
        let upperRightCell = document.getElementById(upperRightID);

        if (upperRightCell.classList.contains("covered") && upperRightCell.classList.contains("safe")) {
            revealAdjacentCells(upperRightCell);
        }
    
    }

    //Check left 
    if (!cell.classList.contains("right-edge")) {
        let leftID = id + 1;
        let leftCell = document.getElementById(leftID);

        if (leftCell.classList.contains("covered") && leftCell.classList.contains("safe")) {
            revealAdjacentCells(leftCell);
        }
    }
    
    //Check right 
    if (!cell.classList.contains("left-edge")) {
        let rightID = id - 1;
        let rightCell = document.getElementById(rightID);

        if (rightCell.classList.contains("covered") && rightCell.classList.contains("safe")) {
            revealAdjacentCells(rightCell);
        }
    }

    //Check lower left
    if (!cell.classList.contains("left-edge") && !cell.classList.contains("bottom-edge")) {
        let lowerLeftID = id + width - 1;
        let lowerLeftCell = document.getElementById(lowerLeftID);

        if (lowerLeftCell.classList.contains("covered") && lowerLeftCell.classList.contains("safe")) {
            revealAdjacentCells(lowerLeftCell);
        }
    }
    
    //Check lower 
    if (!cell.classList.contains("bottom-edge")) {
        let lowerID = id + width;
        let lowerCell = document.getElementById(lowerID);

        if (lowerCell.classList.contains("covered") && lowerCell.classList.contains("safe")) {
            revealAdjacentCells(lowerCell);
        }
    }

    //Check lower right
    if (!cell.classList.contains("right-edge") && !cell.classList.contains("bottom-edge")) {
        let lowerRightID = id + width + 1;
        let lowerRightCell = document.getElementById(lowerRightID);

        if (lowerRightCell.classList.contains("covered") && lowerRightCell.classList.contains("safe")) {
            revealAdjacentCells(lowerRightCell);
        }
    }
    
}

//Returns true of there the same amount of covered tiles left as mines
//meaning that all safe tiles are revealed as well
function checkWin() {
    let coveredTiles = document.getElementsByClassName("covered");

    if (coveredTiles.length == mines) {
        return true;
    }

    //Base case
    return false;
}

//Displays messege based on win or loss to info display
function displayEndResult(type) {
    gameOver = true;
    let endResultText = document.getElementById("end-result-text");
    if (type == "win") {
        endResultText.innerHTML = "YOU WIN!";
    }
    else {
        endResultText.innerHTML = "YOU LOSE!";
    }
}
