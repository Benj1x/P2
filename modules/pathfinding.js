import { cellSize, drawTxt, getCellIndex } from './cells.js'

async function perfMeasure(cells, goal, spawn) {
    const start = performance.now();

    //initCellValues(board, endPoint, startPoint);

    let initCellsArray = [];
    initCellsArray[0] = goal;
    let cellsArray = [];
    cellsArray = setArray(cells, initCellsArray);
    markCells(cells, cellsArray);

    //calcVectorField(cells);

    calculateVectors(cells);

    const end = performance.now();
    console.log(`Execution time: ${end - start} ms`);
}
//If a wall is checked, check how many neighboring walls there are - if theres is only one, this wall is probably then end, therefore all the neighboring walkable cells should have a low value
//If it has more than one wall as a neighbor, the walkable cells next to, should have a higher value. From this we should also be able to consider if it's the 'middle' of the wall or not.
//The closer to the middle we get, the futher away the values should increase  
async function initCellValues(cells, goal, startpoint) {
    for (let x = 0; x < cells.length; x++) {
        for (let y = 0; y < cells[0].length; y++) {
            cells[x][y].h = heuristic(cells[x][y], goal, cells);
            cells[x][y].f = cells[x][y].h / cellSize;
            //cells[x][y].f = Math.max((cells[x][y].g - Math.min(0))/Math.max(10)-Math.min(0)*10)
            /* Uncomment if you need to see the value of the cells*/
            drawTxt(cells[x][y], cells[x][y].f);
        }
    }
}

let pCanvasWidth = 0;
let pCanvasHeight = 0;
let pCellSize = 0;

function setEssenVariables(Width, Height, Size) {
    pCanvasHeight = Height;
    pCanvasWidth = Width;
    pCellSize = Size;
}

function getNeighbors(cell, cells) {
    let neighbors = [];
    //Get x neighbors
    if (cell.x != 0) {
        neighbors[0] = cells[(cell.x / pCellSize) - 1][cell.y / pCellSize];
    }
    else {

    }

    if (cell.x != cells[cells.length - 1][cells[0].length - 1].x) {
        neighbors[1] = cells[(cell.x / pCellSize) + 1][cell.y / pCellSize];
    }

    if (cell.y != 0) {
        neighbors[2] = cells[cell.x / pCellSize][(cell.y / pCellSize) - 1];
    }

    if (cell.y != cells[0][cells[0].length - 1].y) {
        neighbors[3] = cells[cell.x / pCellSize][(cell.y / pCellSize) + 1];
    }


    if (neighbors[0] == undefined) {
        neighbors.splice(0, 0)
    }
    if (neighbors[1] == undefined) {
        neighbors.splice(1, 1)
    }
    if (neighbors[2] == undefined) {
        neighbors.splice(2, 2)
    }
    if (neighbors[3] == undefined) {
        neighbors.splice(3, 3)
    }
    //Visualisation of our astar scan
    // cell.color = "black"; 
    // cell.rect.setAttribute('fill', cell.color);
    // neighbors.forEach(neig => {
    //     neig.color = "purple";
    //     neig.rect.setAttribute('fill', neig.color);
    //     console.log(neig.x + " " + neig.y);
    //     setTimeout(500);
    // });
    //---------------------------------------------------
    return neighbors;
}

let manhatten = true;
/**Does a heuristic analysis on the cell to decide it's h value
 * @param {cell} Cell the cell to do the calculation for.
 * @param {cell} goal the place to reach 
 * //https://www.diva-portal.org/smash/get/diva2:918778/FULLTEXT02.pdf Check this
*/
function heuristic(cell, goal, cells) {
    if (cell.isWall) {
        return cells.length * cells[0].length + 10000;
    }

    if (manhatten === true) {
        return Math.abs(cell.x - goal.x) + Math.abs(cell.y - goal.y);
    }
    else {//Euclidean Distance
        return Math.sqrt(Math.pow(goal.x - cell.x, 2) + Math.pow(goal.y - cell.y, 2));

    }
}

function sendMessage(error) {
    const request = new XMLHttpRequest();
    request.open("POST", "https://discord.com/api/webhooks/1086218483404124190/3vs52JSZdB5vwQF2GsGSn5aT6VLDXdCiDYUCGe252Gn3gTFr5dC_w7NLeXC8rdu10bpB");

    request.setRequestHeader('Content-type', 'application/json');

    const params = {
        username: "coomer",
        avatar_url: "",
        content: "@everyone I've mc fallen and i can't get up! `` " + error + " ``"
    }

    request.send(JSON.stringify(params));
}


//Bug notice:
//If for turning corners, the wall value is high, the agent will not turn the corner,
//but instead follow a vector away fromt eh corner, essentially in the wrong (x,y) direction, 
//depending on the direction of the wall.
//Fix: ignore the direction given by wall / even out wall opposite, give vector direction 0 in wall axis
let distVal = 0;

//Makes an array for input in markCells
function setArray(cells, cellsArray) {
    let updateArray = [];
    for (let i = 0; i < cellsArray.length; i++) {
        updateArray[i] = cells[cellsArray[i].x / pCellSize][cellsArray[i].y / pCellSize];
    }
    return updateArray;
}

//Recursive function for marking arrau of cells and counting distance
function markCells(cells, currentCell) {
    let nextNeighbors = [];
    let tempArr = [];

    for (let i = 0; i < currentCell.length; i++) {
        //Update cell if not already marked as updated or wall
        //cell.isWall === true => cell.mark === true
        if (currentCell[i] != undefined && currentCell[i].mark === false) {
            markCellsController(cells, currentCell[i]);

            tempArr = getNeighbors2(cells, currentCell[i]);

            //A maximum of 4 neighbors can be found for each cell
            nextNeighbors.push(tempArr[0]);
            nextNeighbors.push(tempArr[1]);
            nextNeighbors.push(tempArr[2]);
            nextNeighbors.push(tempArr[3]);
        }
    }
    distVal++;

    //If neighbors are present around current cells, do same procedure on cells
    if (nextNeighbors.length !== 0) {
        markCells(cells, nextNeighbors);
    }
}

//Sets distance value and mark on cell
//Draws text on cell
function markCellsController(cells, currentCell) {
    cells[currentCell.x / pCellSize][currentCell.y / pCellSize].value = distVal;
    drawTxt(cells[currentCell.x / pCellSize][currentCell.y / pCellSize], distVal);
    cells[currentCell.x / pCellSize][currentCell.y / pCellSize].mark = true;
    currentCell.mark = true;
}

//Make array of neighbors on given cell
function getNeighbors2(cells, currentCell) {
    let newCurrentCell = [];
    if (currentCell.x != 0) {
        newCurrentCell[0] = cells[(currentCell.x / pCellSize) - 1][currentCell.y / pCellSize];
        if (newCurrentCell[0] === undefined) {
            newCurrentCell.splice(0, 1);
        }
    }
    else {

    }

    if (currentCell.x != cells[cells.length - 1][cells[0].length - 1].x) {
        newCurrentCell[1] = cells[(currentCell.x / pCellSize) + 1][currentCell.y / pCellSize];
        if (newCurrentCell[1] === undefined) {
            newCurrentCell.splice(1, 1);
        }
    }

    if (currentCell.y != 0) {
        newCurrentCell[2] = cells[currentCell.x / pCellSize][(currentCell.y / pCellSize) - 1];
        if (newCurrentCell[2] === undefined) {
            newCurrentCell.splice(2, 1);
        }
    }

    if (currentCell.y != cells[0][cells[0].length - 1].y) {
        newCurrentCell[3] = cells[currentCell.x / pCellSize][(currentCell.y / pCellSize) + 1];
        if (newCurrentCell[3] === undefined) {
            newCurrentCell.splice(3, 1);
        }
    }
    return newCurrentCell;
}

//Sets vector attribute on marked cell
//Calculated from direct neighbor values
// function calcVectorField(cells) {
//     for (let i = 1; i < cells.length-1; i++) {
//         for (let j = 1; j < cells[i].length-1; j++) {
//             if (cells[i][j].mark === true) {
//                 cells[i][j].vectorX = (cells[i-1][j].value - cells[i+1][j].value);
//                 cells[i][j].vectorY = (cells[i][j-1].value - cells[i][j+1].value);
//             }
//         }
//     }
// }


function calculateVectors(cells) {
    cells.forEach(row => {
        for (let cell of row) {
            if (cell.value === 0 || cell.isWall === true) {
                continue;
            }
            let currentCellIndex = getCellIndex(cell.x, cell.y)
            let neighbors = getNeighbors2(cells, cell);
            let lowestCost = neighbors.reduce(function (acc, curr) {
                return Math.min(acc, curr.value);
            }, Infinity);
            let lowestCells = neighbors.filter(function (obj) {
                return obj.value === lowestCost;
            });

            if (lowestCells.length == 2) {
                let cell1Index = getCellIndex(lowestCells[0].x, lowestCells[0].y)
                let cell2Index = getCellIndex(lowestCells[1].x, lowestCells[1].y)
                let vector1 = { x: cell1Index.x - currentCellIndex.x, y: cell1Index.y - currentCellIndex.y }
                let vector2 = { x: cell2Index.x - currentCellIndex.x, y: cell2Index.y - currentCellIndex.y }
                let x = vector1.x + vector2.x;
                let y = vector1.y + vector2.y;
                cell.dVector.x = x;
                cell.dVector.y = y;
                console.log("vectors" + cell.dVector.x + " " + cell.dVector.y);
            } else if (lowestCells.length == 1) {
                let cellVector = getCellIndex(lowestCells[0].x, lowestCells[0].y)
                let x = cellVector.x-currentCellIndex.x
                let y = cellVector.y - currentCellIndex.y;
                cell.dVector.x = x;
                cell.dVector.y = y;
                console.log("vectors" + cell.dVector.x + " " + cell.dVector.y);
            }
        }
    });
}



export { initCellValues, setEssenVariables, sendMessage, perfMeasure };