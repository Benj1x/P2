import { drawTxt } from './cells.js'

async function perfMeasure(board, endPoint, startPoint)
{
    const start = performance.now();

    initCellValues(board, endPoint, startPoint);

    const end = performance.now();
    console.log(`Execution time: ${end - start} ms`);
    GetNeighbors(board[0][36], board);
}
//If a wall is checked, check how many neighboring walls there are - if theres is only one, this wall is probably then end, therefore all the neighboring walkable cells should have a low value
//If it has more than one wall as a neighbor, the walkable cells next to, should have a higher value. From this we should also be able to consider if it's the 'middle' of the wall or not.
//The closer to the middle we get, the futher away the values should increase  
async function initCellValues(cells, goal, startpoint)
{
    for (let x = 0; x < cells.length; x++)
    {
        for (let y = 0; y < cells[0].length; y++)
        {
            cells[x][y].h = heuristic(cells[x][y], goal, cells);            
            cells[x][y].f = cells[x][y].g + cells[x][y].h;
            //cells[x][y].f = Math.max((cells[x][y].g - Math.min(0))/Math.max(10)-Math.min(0)*10)
            /* Uncomment if you need to see the value of the cells*/
            //drawTxt(cells[x][y], cells[x][y].f);
        }
    }

    calculateVectors(cells);
}

let pCanvasWidth = 0;
let pCanvasHeight = 0;
let pCellSize = 0;

function SetEssenVariables(Width, Height, Size)
{
    pCanvasHeight = Height;
    pCanvasWidth = Width;
    pCellSize = Size;
}

function GetNeighbors(cell, cells)
{
    let neighbors = [];
    //Get x neighbors
    if (cell.x != 0)
    {
        neighbors[0] = cells[(cell.x/pCellSize)-1][cell.y/pCellSize];    
    } 
    else{
        
    }

    if (cell.x != cells[cells.length-1][cells[0].length-1].x)
    {
        neighbors[1] = cells[(cell.x/pCellSize)+1][cell.y/pCellSize];
    }
    
    if (cell.y != 0){
        neighbors[2] = cells[cell.x/pCellSize][(cell.y/pCellSize)-1];
    }

    if (cell.y != cells[0][cells[0].length-1].y)
    {
        neighbors[3] = cells[cell.x/pCellSize][(cell.y/pCellSize)+1];
    }


    if (neighbors[0]==undefined)
    {
        neighbors.splice(0,0)
    }
    if (neighbors[1]==undefined)
    {
        neighbors.splice(1,1)
    }
    if (neighbors[2]==undefined)
    {
        neighbors.splice(2,2)
    }
    if (neighbors[3]==undefined)
    {
        neighbors.splice(3,3)
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
function heuristic(cell, goal, cells)
{
    if (cell.isWall){
        return cells.length * cells[0].length + 100;
    }

    if (manhatten === true)
    {
        return Math.round(Math.abs(cell.x - goal.x) + Math.abs(cell.y - goal.y))/25;
    }
    else{//Euclidean Distance
        return Math.sqrt(Math.pow(goal.x - cell.x, 2) + Math.pow(goal.y - cell.y, 2));
        
    }
}

function calculateVectors(cells){

    let openList = cells;

    for (let x = 0; x < cells.length; x++)
    {
        for (let y = 0; y < cells[0].length ; y++)
        {
            //Get the vector pointing closer to our finish
            let neighbors = GetNeighbors(cells[x][y], cells);

            let lowest = cells[x][y].f;
            try{
                for (let nX = 1; nX < neighbors.length; nX++)
                { 
                    if (neighbors[nX].f < lowest)
                    {
                        lowest = neighbors[nX].f;
                    }
                }
            } catch {
                for (let nX = 0; nX < neighbors.length; nX++)
                { 
                    if (neighbors[nX].f < lowest)
                    {
                        lowest = neighbors[nX].f;
                    }
                }
            } finally{
                
            }
            

            if (cells[x][y].isWall)
            {
                handleWall(cells[x][y], cells, neighbors);
            }

        }


    }


}

function handleWall(cell, cells, neighbors)
{

    if (isSurrounded(cell, neighbors)){

    }

    for (let x = 0; x < neighbors.length; x++)
    {
        for (let y = 0; y < neighbors[0].length; y++)
        {
            if (neighbors[x][y].isWall){

            }
        }
    }

}

function isSurrounded(cell, neighbors)
{
    // if (neighbors[0][0].isWall && !neighbors[1][1].isWall)
    // {
    // }

    if (neighbors[0][0].isWall && neighbors[1][1].isWall)
    {
        neighbors[0][1].isWall = true;
        neighbors[1][0].isWall = true;

        neighbors[0][1].color = "red";
        neighbors[1][0].color = "red";
    }

    // if (neighbors[0][1].isWall && !neighbors[1][0].isWall)
    // {
    // }

    if (neighbors[0][1].isWall && neighbors[1][0].isWall)
    {
        neighbors[0][0].isWall = "red";
        neighbors[1][1].isWall = "red";
    }

    neighbors.forEach(neig => {
        neig.color = "red";
        neig.rect.setAttribute('fill', neig.color);
        console.log(neig.x + " " + neig.y);
        setTimeout(500);
    });
    
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
export { initCellValues, SetEssenVariables, sendMessage, perfMeasure };