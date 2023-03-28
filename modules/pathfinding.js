export { sendMessage };
import { drawTxt } from './cells.js'

/** 
* @param {cell} start the start point of our search
* @param {cell} goal the end point of our search
* @param {function} h is our heuristic function. h(n) is an estimate of the cost to reach our goal from the node n
*/
function AStar(start, goal) {
    // try
    // {

        //
    let openSet = [];
    openSet.push(start);

    let cameFrom = [];

    let Readcells = []

    let defaults = [1];

    let cScore = defaults.map(x => x * Infinity);

    //for the node n, fScore[n] = cScoren] + h(n). fScore[n] represents our best guess as to how cheap our path would be from start to finish, if it goes through n
    let fScore = defaults.map(x => x * Infinity);

    //do heurestics
    //fScore[start] = h(start);

    while (openSet.length > 0) {
        let winner = 0;

        // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue
        //This get's the openSet with the lowest value

        let current = openSet[0];

        for (let i = 1; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
                cameFrom.push(winner);
                current == i;
            }
            if (winner === goal) {
                return DoPath(cameFrom, winner);
            }
            tempset.push(GetNeighbors(openSet[i]), cells);
            Readcells.push[openSet[i]];

            for (let y = 0; y < Readcells.length; y++) {
                for (let z = 0; z < tempset.length; z++) {
                    if (Readcells[y].x === tempset[z].x) {
                        if (Readcells[y].y === tempset[z].y) {
                            removeItem(tempset, z);
                        }
                    }

                }
            }


            openSet.push(tempset);
        }

        removeItem(openSet, current);

    }

    // Open set is empty but goal was never reached
    return false
    // } catch{e}
    // {
    //     let s = "AStar failed :( \n The error is: " + e + " \nI recieved the start point: " + start + " and end point: " + goal;
    //     console.log(s);
    //     //sendMessage(s);
    // }
}

function initCellValues(cells, goal, startpoint){

    console.log("running...");
    console.log(cells[0].length);
    for (let x = 0; x < cells.length; x++)
    {
        for (let y = 0; y < cells[0].length; y++)
        {
            console.log("pre heurestic");
            cells[x][y].h = heuristic(cells[x][y], goal);
            console.log("post heurestic");
            let neighbors = GetNeighbors(cells[x][y], cells);
            console.log("post neighbors");
            for (let i = 0; i < neighbors; i++)
            {
                let tempG = heurestic(cells[x+1][y-1], cells[x][y]); 
                cells[x+1][y-1].g = tempG;
                console.log("post temp g");
            }

            cells[x][y].vh = visualDistance(cells[x][y], goal);
            console.log("post vD");
            cells[x][y].f = cells[x][y].g + cells[x][y].h;
            drawTxt(cells[x][y], cells[x][y].f);
        }
    }
    console.log("pre AStar");
    //AStar(startpoint, goal);
    console.log("fin");
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

function removeItem(arr, value) {
    let index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

function GetNeighbors(cell, cells)
{
    let neighbors = [];
    //Get x neighbors
    if (cell.x != 0)
    {
        //neighbors[0] = cells[(cell.x/pCellSize)-1][cell.y/pCellSize];
        //console.log("Current cell: " + cell.x + " " + cell.y);
        //console.log(neighbors[0].x + " " + neighbors[0].y);
    } else{
        console.log("Current cell: " + cell.x + " " + cell.y);
        console.log("false");
    }

    if (cell.x != cells[cells.length-1][cells[0].length-1].x)
    {
        console.log(cell.y/pCellSize);
        console.log(pCellSize);
        neighbors[1] = cells[(cell.x/pCellSize)+1][cell.y/pCellSize];
        console.log(neighbors[1].x + " " + neighbors[1].y);
    }
        //Get y neighbors
    if (cell.y != 0){
        //console.log(cells[cell.x][cell.y-1])
        //neighbors[2] = cells[cell.x/pCellSize][(cell.y/pCellSize)-1];
        //console.log(neighbors[2].x + " " + neighbors[2].y);
    }

    if (cell.y != cells[0][cells[0].length-1].y)
    {
        //console.log(cells[cell.x][cell.y+1])
        neighbors[3] = cells[cell.x/pCellSize][(cell.y/pCellSize)+1];
        console.log(neighbors[3].x + " " + neighbors[3].y);

    }

    //Visualisation of our astar scan
    //cell.color = "purple"; 
    //cell.rect.setAttribute('fill', cell.color);
    // neighbors.forEach(neig => {
    //     neig.color = "black";
    //     cell.rect.setAttribute('fill', cell.color);
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
function heuristic(cell, goal)
{
    if (manhatten === true)
    {
        let x = Math.abs(cell.x - goal.x) + Math.abs(cell.y - goal.y);
        console.log("Heu: "+x);
        return Math.abs(cell.x - goal.x) + Math.abs(cell.y - goal.y);
    }
    else{//Euclidean Distance
        return Math.sqrt(Math.pow(goal.x - start.x, 2) + Math.pow(goal.y - start.y, 2));
        
    }
}
/**Uses the manhatten distance formula to decide on a visual distance
 * @param {cell} NCell the neighbor cell
 * @param {cell} goal the place to reach
*/
function visualDistance(NCell, goal)
{
    return Math.abs(start.x - goal.x) + Math.abs(start.y - goal.y);
}


/*
function reconstruct_path(cameFrom, current)
    total_path := {current}
    while current in cameFrom.Keys:
        current := cameFrom[current]
        total_path.prepend(current)
    return total_path

// A* finds a path from start to goal.
// h is the heuristic function. h(n) estimates the cost to reach goal from node n.
function A_Star(start, goal, h)
    // The set of discovered nodes that may need to be (re-)expanded.
    // Initially, only the start node is known.
    // This is usually implemented as a min-heap or priority queue rather than a hash-set.
    openSet := {start}

    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from the start
    // to n currently known.
    cameFrom := an empty map

    // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
    gScore := map with default value of Infinity
    gScore[start] := 0

    // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
    // how cheap a path could be from start to finish if it goes through n.
    fScore := map with default value of Infinity
    fScore[start] := h(start)

    while openSet is not empty
        // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue
        current := the node in openSet having the lowest fScore[] value
        if current = goal
            return reconstruct_path(cameFrom, current)

        openSet.Remove(current)
        for each neighbor of current
            // d(current,neighbor) is the weight of the edge from current to neighbor
            // tentative_gScore is the distance from start to the neighbor through current
            tentative_gScore := gScore[current] + d(current, neighbor)
            if tentative_gScore < gScore[neighbor]
                // This path to neighbor is better than any previous one. Record it!
                cameFrom[neighbor] := current
                gScore[neighbor] := tentative_gScore
                fScore[neighbor] := tentative_gScore + h(neighbor)
                if neighbor not in openSet
                    openSet.add(neighbor)

    // Open set is empty but goal was never reached
    return failure
*/
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
export { initCellValues, SetEssenVariables };