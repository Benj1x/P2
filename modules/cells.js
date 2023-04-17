export { CreateGrid, getCellIndex, cellEventHandler, clearCanvas, cellSize, setAddingExit, setAddingSpawn, getAddingExit, getAddingSpawn, endPoint, startPoint, prevExit, svgNS}

//Custom cell size
const cellSize = 25;
//Initialize 2d array for cells
let cells = [[]];
//Initialization of variables needed for adding spawn / exit cells
let prevExit = null;
let addingExit = false;
let addingSpawn = false;
let endPoint = null
let startPoint = null



const svgNS = "http://www.w3.org/2000/svg";
//Function caller for correctly handling actions on cells
function cellEventHandler(index, remove) {
    toggleCellProperties(index, remove);
    drawCell(cells[index.x][index.y]);
}

/** 
 * @param {int} MouseX The mouse X position on the screen
 * @param {int} MouseY The mouse Y position on the screen
 * @returns {Cords} x and y coordinate of our cell (relative to our grid)
*/
function getCellIndex(MouseX, MouseY) {
    // find cell row and column 
    let x = Math.floor(MouseX / cellSize);
    let y = Math.floor(MouseY / cellSize);
    // return index of cell in cells array (row-major order)
    const Cords = { x, y };
    return Cords;
}

/** 
 * @param {Cords} index The position of the cell to update
*/
<<<<<<< Updated upstream
function toggleCellProperties(index) {
    let currentCell = cells[index.x][index.y];
=======
function toggleCellProperties(index, remove) {
    if (remove) {
        cells[index.x][index.y].color = "white";
        cells[index.x][index.y].isWall = false;
        cells[index.x][index.y].isExit = false;
        cells[index.x][index.y].mark = false;
        cells[index.x][index.y].isSpawnPoint = false;
        cells[index.x][index.y].value = 0;
        return
    }
>>>>>>> Stashed changes
    if (addingExit) {
        currentCell.color = "green";
        currentCell.isExit = true;
        currentCell.isSpawnPoint = false;
        currentCell.isWall = false;

        if (prevExit) {
            prevExit.color = "white";
            prevExit.isExit = false;
            prevExit = currentCell;
        } else {
            prevExit = currentCell;
        }
        addingExit = false;
    } else if (addingSpawn) {
        currentCell.color = "blue";
        startPoint = currentCell;
        currentCell.isExit = false;
        currentCell.isSpawnPoint = true;
        currentCell.isWall = false;
    } else if (currentCell.color == "white") {
        currentCell.color = "black";
        currentCell.isWall = true;
    } else if (currentCell.color == "black" || currentCell.color == "green" || currentCell.color == "blue") {
        currentCell.color = "white";
        currentCell.isWall = false;
        currentCell.isExit = false;
        currentCell.isSpawnPoint = false;
    }
}

/**
 * resets the grid to the default
*/
function clearCanvas() {
    cells.forEach(column => {
        column.forEach(cell => {
            cell.color = "white";
            cell.isWall = false;
            cell.isExit = false;
            cell.isSpawnPoint = false;
            cell.rect.setAttribute('fill', 'white');
        });
    });
}

/**
 * Updates a cell
 * @param {cell} cell the cell to update
*/
function drawCell(cell) {
    cell.rect.setAttribute('fill', cell.color);
}


/**
 * Initializes our grid-cells with their default properties and calls DrawAllCells
*/
function CreateGrid(canvasWidth, canvasHeight, drawingArea) {
    for (let x = 0; x < canvasWidth / cellSize; x++) {
        cells[x] = [];
        for (let y = 0; y < canvasHeight / cellSize; y++) {
            const cell = {
                x: x * cellSize,
                y: y * cellSize,
                width: cellSize,
                height: cellSize,
                color: "white",
                isWall: false,
                isExit: false,
                isSpawnPoint: false,
                //Values for AStar
                f: 0,
                g: 0,
                h: 0,
<<<<<<< Updated upstream
                vh: 0
=======
                vh: 0,
                //Vector field values
                mark: false,
                value: 0,
                dVector: {x: 0, y: 0}
>>>>>>> Stashed changes
            };
            //Push cell to cells array
            cells[x][y] = cell;
        }
    }
    DrawAllCells(drawingArea);
}

/**
 * Draws our cells on screen using SVG
 */
function DrawAllCells(drawingArea) {
    for (let x = 0; x < cells.length; x++) {
        for (let y = 0; y < cells[0].length; y++) {
            let currentCell = cells[x][y]; 
            currentCell.rect = document.createElementNS(svgNS, 'rect');
            currentCell.rect.setAttribute('width', currentCell.width);
            currentCell.rect.setAttribute('height', currentCell.height);
            currentCell.rect.setAttribute('x', currentCell.x);
            currentCell.rect.setAttribute('y', currentCell.y);
            currentCell.rect.setAttribute('stroke', 'black');
            currentCell.rect.setAttribute('fill', 'white');
            drawingArea.appendChild(currentCell.rect);
        }
    }
}

function setAddingExit(isAdding) { addingExit = isAdding };
function setAddingSpawn(isAdding) { addingSpawn = isAdding };

function getAddingExit() { return addingExit; };
function getAddingSpawn() { return addingSpawn; };
