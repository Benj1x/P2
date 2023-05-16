export {
    createGrid, getCellIndex, cellEventHandler, clearCanvas, cellSize, setAddingExit, setAddingSpawn, getAddingExit,
    getAddingSpawn, endPoint, setExits, startPoint, prevExit, svgNS, getCells, drawTxt, getCell, getNeighborCells, getAgentsInCell, calcCellDensity, getCellDensity, toggleHeat,
    setShowHeatMap, getShowHeatMap, loadCells, DrawAllCells, setBlockMouse, getBlockMouse, setCellSize, resetHeatmap, resetGrid, resetEndpoint, resetVectors
}
import { animateCaller } from "./agents.js";
import { sizeChange } from "../script.js";

//Custom cell size
let cellSize = 25;
let showHeatMap = true;
//Initialize 2d array for cells
let cells = [[]];
//Initialization of variables needed for adding spawn / exit cells
let prevExit = null;
let addingExit = false;
let addingSpawn = false;
let endPoint = [];
let shouldIgnoreMouse = false;
let startPoint = null

const drawingArea = document.querySelector(".drawing");
const svgNS = "http://www.w3.org/2000/svg";

//Function caller for correctly handling actions on cells
function cellEventHandler(index, remove) {
    if (getBlockMouse()) {
        return;
    }

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
function toggleCellProperties(index, remove) {

    if (remove) {
        cells[index.x][index.y].color = "white";
        cells[index.x][index.y].isWall = false;
        cells[index.x][index.y].isExit = false;
        cells[index.x][index.y].mark = false;
        cells[index.x][index.y].isSpawnPoint = false;
        cells[index.x][index.y].value = 0;
        return;
    }

    if (addingExit) {
        cells[index.x][index.y].color = "green";
        cells[index.x][index.y].isExit = true;
        cells[index.x][index.y].isSpawnPoint = false;
        cells[index.x][index.y].isWall = false;

        endPoint.push(cells[index.x][index.y]);

        // if (prevExit) {
        //     prevExit.color = "white";
        //     prevExit.isExit = false;
        //     prevExit = cells[index.x][index.y];
        // } else {
        //     prevExit = cells[index.x][index.y];
        // }
        addingExit = false;
    } else if (addingSpawn) {
        cells[index.x][index.y].color = "blue";
        startPoint = cells[index.x][index.y];
        cells[index.x][index.y].isExit = false;
        cells[index.x][index.y].isSpawnPoint = true;
        cells[index.x][index.y].isWall = false;
    } else if (cells[index.x][index.y].color == "white") {
        cells[index.x][index.y].color = "black";
        cells[index.x][index.y].isWall = true;
        cells[index.x][index.y].isExit = false;
        cells[index.x][index.y].mark = true;
        cells[index.x][index.y].value = cells.length * cells[0].length / 3;
    } else if (cells[index.x][index.y].color == "black" || cells[index.x][index.y].color == "green" || cells[index.x][index.y].color == "blue") {
        cells[index.x][index.y].color = "white";
        cells[index.x][index.y].isWall = false;
        cells[index.x][index.y].isExit = false;
        cells[index.x][index.y].mark = false;
        cells[index.x][index.y].isSpawnPoint = false;
        cells[index.x][index.y].value = 0;
    }
}

function resetEndpoint(){
    endPoint = [];
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

function resetVectors() {
    cells.forEach(column => {
        column.forEach(cell => {
            if (cell.isWall === false) {
                cell.mark = false;
                cell.value = 0;
                cell.dVector.x = 0;
                cell.dVector.y = 0;
            }
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

function drawTxt(cell, value) {
    let numbering = document.createElementNS(svgNS, "text")
    numbering.setAttribute('x', cell.x)
    numbering.setAttribute('y', cell.y + 17)
    numbering.classList.add('svgText');
    if (cell.isWall) {
        numbering.setAttribute('fill', "white");
    }
    numbering.textContent = Math.round(value);
    drawingArea.appendChild(numbering)
}

/**
 * Initializes our grid-cells with their default properties and calls DrawAllCells
*/
function createGrid(canvasWidth, canvasHeight) {
    cells = [[]];
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
                //Vector field values
                mark: false,
                value: 0,
                vectorX: 0,
                vectorY: 0,
                dVector: { x: 0, y: 0 },
                //Collision stuff
                agents: [],
                highestDensity: 0,
            };
            //Push cell to cells array
            cells[x][y] = cell;
        }
    }
    DrawAllCells(drawingArea);
}

function resetGrid(){
    for (let x = 0; x < cells.length; x++) {
        for (let y = 0; y < cells[0].length; y++) {
                
                cells[x][y].color = "white";
                cells[x][y].isWall = false;
                cells[x][y].isExit = false;
                cells[x][y].isSpawnPoint = false;
                //Vector field values
                cells[x][y].mark = false;
                cells[x][y].value = 0;
                cells[x][y].vectorX = 0;
                cells[x][y].vectorY = 0;
                cells[x][y].dVector = { x: 0, y: 0 };
                //Collision stuff
                cells[x][y].agents = [],
                cells[x][y].highestDensity = 0;
            };
        }
}

function resetVectorsComplete()
{
    for (let x = 0; x < cells.length; x++) {
        for (let y = 0; y < cells[0].length; y++) {
                cells[x][y].mark = false;
                cells[x][y].value = 0;
                cells[x][y].vectorX = 0;
                cells[x][y].vectorY = 0;
                cells[x][y].dVector = { x: 0, y: 0 };
                //Collision stuff
                cells[x][y].agents = [],
                cells[x][y].highestDensity = 0;
            };
        }
}

/**
 * Draws our cells on screen using SVG
 */
function DrawAllCells() {
    for (let x = 0; x < cells.length; x++) {
        for (let y = 0; y < cells[0].length; y++) {
            cells[x][y].rect = document.createElementNS(svgNS, 'rect');
            cells[x][y].rect.setAttribute('width', cells[x][y].width);
            cells[x][y].rect.setAttribute('height', cells[x][y].height);
            cells[x][y].rect.setAttribute('x', cells[x][y].x);
            cells[x][y].rect.setAttribute('y', cells[x][y].y);
            if (cells[x][y].isWall == true) {
                cells[x][y].rect.setAttribute('fill', 'black');
            }
            else if (cells[x][y].isSpawnPoint == true) {
                cells[x][y].rect.setAttribute('fill', 'blue');
            }
            else if (cells[x][y].isExit == true) {
                cells[x][y].rect.setAttribute('fill', 'green');
            }
            else {
                cells[x][y].rect.setAttribute('fill', 'white');
            }
            cells[x][y].rect.setAttribute('stroke', 'black');
            drawingArea.appendChild(cells[x][y].rect);
        }
    }
}

function loadCells(newCells, newCellSize) {
    let canvasWidth = window.innerWidth - window.innerWidth % cellSize;
    let canvasHeight = window.innerHeight - window.innerHeight % cellSize;
    cellSize = newCellSize;
    createGrid(canvasWidth, canvasHeight);
    for (let x = 0; x < cells.length; x++) {
        for (let y = 0; y < cells[0].length; y++) {
            if (x < newCells.length && y < newCells[0].length) {
                cells[x][y] = newCells[x][y];
            }
        }
    }
    DrawAllCells();
}

function getCells() { return cells; }

/** 
 * @param {int} x The X position of the cell to find
 * @param {int} y The Y position of the cell to find
 * @returns {cell} the cell we found
*/
function getCell(x, y) { return cells[x][y]; }

function setAddingExit(isAdding) { addingExit = isAdding; addingSpawn = false; };
function setAddingSpawn(isAdding) { addingSpawn = isAdding; addingExit = false; };

function getNeighborCells(x, y) {
    let cell = getCell(x, y);
    let neighbors = [];
    //Get x neighbors
    if (cell.x !== 0) {
        neighbors.push(cells[(cell.x / cellSize) - 1][cell.y / cellSize]);
    }

    if (cell.y !== 0) {
        neighbors.push(cells[cell.x / cellSize][(cell.y / cellSize) - 1]);
    }

    if (cell.x !== (cells.length-1) * cellSize) {
        neighbors.push(cells[(cell.x / cellSize) + 1][cell.y / cellSize]);
    }

    if (cell.y !== (cells[0].length - 1) * cellSize) {
        neighbors.push(cells[cell.x / cellSize][(cell.y / cellSize) + 1]);
    }

    //Visualisation of the neighbors
    // neighbors.forEach(neig => {
    //          neig.color = "purple";
    //          neig.rect.setAttribute('fill', neig.color);
    //          console.log(neig.x + " " + neig.y);
    //      });
    // console.log(neighbors.length);
    return neighbors;
}

function calcCellDensity(cell) {
    let curentDensity = cell.agents.length;
    if (cell.highestDensity < curentDensity) {
        cell.highestDensity = curentDensity;
    }
}

function getCellDensity(cell) {
    return cell.highestDensity;
}

function toggleHeat(cellsToUpdate) {
    cellsToUpdate.forEach(cell => {
        let density = getCellDensity(cell);
        if (density != 0 && cell.isWall == false && cell.isExit == false && cell.isSpawnPoint == false) {
            cell.rect = document.createElementNS(svgNS, 'rect');
            cell.rect.setAttribute('width', cell.width);
            cell.rect.setAttribute('height', cell.height);
            cell.rect.setAttribute('x', cell.x);
            cell.rect.setAttribute('y', cell.y);
            cell.rect.setAttribute('stroke', 'black');

            //cell.rect.classList.toggle("cellClass");

            const scaler = 36; //255 / 7 = 36.4, we round down, and now we have a scaler for our cells (any value over 7 is bad);

            let r = 255;
            let g = 255 - ((scaler) * density);
            let b = 255 - ((scaler) * density);

            if (7 < density){
                g = 0;
                b = 0;
            }
            let col = "rgb(" + r + "," + g + "," + b + ")";

            cell.rect.setAttribute('fill', col);

            cell.rect.setAttribute('class', "heatCells");
            let cellID = cell.x.toString() + ", " + cell.y.toString();
            let element = document.getElementById(cellID);
            cell.rect.setAttribute("id", cellID);
            
            if (element != null){
                //console.log(element);
                element.replaceWith(cell.rect)
            } else {
                drawingArea.appendChild(cell.rect);
            }
        }
    });

}

function getAddingExit() { return addingExit; };
function getAddingSpawn() { return addingSpawn; };

function getAgentsInCell(cell) { return cell.agents; };


function setShowHeatMap(shouldDisplay) {
    showHeatMap = shouldDisplay;
    if (!showHeatMap) {
        let heatedCells = [];
        heatedCells = document.getElementsByClassName("heatCells");

        while (heatedCells.length != 0) {
            heatedCells[0].remove();
        }
    }

    if (showHeatMap) {
        for (let x = 0; x < cells.length; x++) {
            for (let y = 0; y < cells[0].length; y++) {
                let density = getCellDensity(cells[x][y]);
                if (density != 0 && cells[x][y].isWall == false && cells[x][y].isExit == false && cells[x][y].isSpawnPoint == false) {
                    cells[x][y].rect = document.createElementNS(svgNS, 'rect');
                    cells[x][y].rect.setAttribute('width', cells[x][y].width);
                    cells[x][y].rect.setAttribute('height', cells[x][y].height);
                    cells[x][y].rect.setAttribute('x', cells[x][y].x);
                    cells[x][y].rect.setAttribute('y', cells[x][y].y);
                    cells[x][y].rect.setAttribute('stroke', 'black');
                    cells[x][y].rect.setAttribute('class', "heatCells");
                    cells[x][y].rect.id = "text";
                    const scaler = 36; //255 / 7 = 36.4, we round down, and now we have a scaler for our cells (any value over 7 is bad);

                    let r = 255;
                    let g = 255 - ((scaler) * density);
                    let b = 255 - ((scaler) * density);

                    if (7 < density){
                        g = 0;
                        b = 0;
                    }

                    let col = "rgb(" + r + "," + g + "," + b + ")";

                    cells[x][y].rect.setAttribute('fill', col);

                    drawingArea.appendChild(cells[x][y].rect);
                }
            }
        }

    }
}

function resetHeatmap(){
    for (let x = 0; x < cells.length; x++) {
        for (let y = 0; y < cells[0].length; y++) {
            cells[x][y].highestDensity = 0;
        }
    }
    let show = getShowHeatMap();
    setShowHeatMap(false);
    setShowHeatMap(show);
}

function getShowHeatMap() { return showHeatMap; }
function setCellSize(value) {cellSize = value}
function setExits(exits) {endPoint = exits}

function getBlockMouse() { return shouldIgnoreMouse; }
function setBlockMouse(blockMouse) { shouldIgnoreMouse = blockMouse; }