export { populate, removeAgentsFromArea, anime, getSpawnArea, addSpawnArea, setSizes }
import { cellSize, svgNS, getCells, getCellIndex, getCell, endPoint, getNeighborCells, getAgentsInCell } from './cells.js'
import { getCanvasHeight, getCanvasWidth } from './pathfinding.js'

const drawingArea = document.querySelector(".drawing");
let spawnAreas = [];

//Initializing array of agents
let agents = [];
let MaxSpeed = 2;

let canvasWidth = 0;
let canvasHeight = 0;
function setSizes(Width, Height){
    canvasWidth = Width
    canvasHeight = Height;
}

//Agents class with relevant svg attributes
class Agent {
    constructor(x, y, fattiness) {
        this.x = x;
        this.y = y;
        this.fattiness = fattiness;
        this.body = document.createElementNS(svgNS, 'circle');
        this.body.setAttribute('r', this.fattiness);
        let xyTransform = drawingArea.createSVGTransform();
        xyTransform.setTranslate(this.x, this.y);
        this.body.transform.baseVal.appendItem(xyTransform);
        drawingArea.appendChild(this.body);
        this.SpeedModifier = Math.random() * MaxSpeed + 0.7;
        //Used to make sure we identify the correct agent in notifyCell
        this.myNumber = agents.length + 1;
        //The cell this agent is currently in
        this.myCell = null;

        //We should probably delete all 'rect' from this document once done with collisions
        // this.rect = document.createElementNS(svgNS, 'rect');
        // this.rect.setAttribute('width', Math.floor(fattiness * Math.sqrt(2)));
        // this.rect.setAttribute('height', Math.floor(fattiness * Math.sqrt(2)));
         this.squareX = Math.ceil(x-(fattiness * Math.sqrt(2) / 2));
         this.squareY = Math.ceil(x-(fattiness * Math.sqrt(2) / 2));
        // this.rect.setAttribute('stroke', "pink");

        this.square = { 
            x, 
            y, 
            width: fattiness,
            height: fattiness,
            top: 0, 
            right: 0,
            bottom: 0,
            left: 0 
        }

       // drawingArea.appendChild(this.rect);
    }
    setCoordinates(x, y) {
        this.x = x;
        this.y = y;
        this.squareX = Math.ceil(x-(this.fattiness * Math.sqrt(2) / 2));
        this.squareY = Math.ceil(x-(this.fattiness * Math.sqrt(2) / 2));

        let xyTransform = drawingArea.createSVGTransform();
        xyTransform.setTranslate(this.x, this.y);
        this.body.transform.baseVal[0] = xyTransform;

        this.square.left = x/(canvasWidth / cellSize);
        this.square.top = y/(canvasHeight / cellSize);
        this.square.right = this.square.left + this.fattiness;
        this.square.bottom = this.square.top + this.fattiness;

    }
    updateAgentCell(){
        let cellX = Math.floor(this.x / cellSize);
        let cellY = Math.floor(this.y / cellSize);
        this.notifyCell(cellX, cellY);
    }
    notifyCell(cellX, cellY){
        let currentCell = getCell(cellX, cellY);
        if (this.myCell == null){
            this.myCell = currentCell;
            return;
        }
        if (this.myCell == currentCell)
        {
            return;
        }
        
        let me = this.myCell.agents.find(agent => agent.myNumber == this.myNumber);
        
        let index = this.myCell.agents.indexOf(me);
        this.myCell.agents.splice(index, 1);
        
        this.myCell = currentCell;
        this.myCell.agents.push(this);
        getAgentsToTestAgainst(this);
    }
    getAgentCell(){ 
        return this.myCell; 
    }
    destroy(){
        let myHTML = document.elementFromPoint(this.x, this.y);
        myHTML.remove(); //sometimes crashes
        
        //remove from agent array
        let me = agents.find(agent => agent.myNumber === this.myNumber);
        let index = agents.indexOf(me);
        //agents[index] == null;
        let removed = agents.splice(index, 1);

        //remove from cell (avoid collision check)
        me = this.myCell.agents.find(agent => agent.myNumber == this.myNumber);
        index = this.myCell.agents.indexOf(me);
        removed = this.myCell.agents.splice(index, 1);
        //this.myCell.agents[index] == null;
        me = null;
        removed = null;
        
    }
}

//Calculation of agent distribution for individual cell population
function populate() {
    if (spawnAreas.length == 0) {
        window.alert("Please add spawn areas");
        return;
    }
    let totalCells = 0;
    let agentNum = null;
    agentNum = document.querySelector("#numAgents").value;
    // Count the total number of spawn area cells
    spawnAreas.forEach(area => {
        totalCells += area.length;
    });

    let agentsSpawned = 0;
    spawnAreas.forEach((area, index) => {
        let ratio = area.length / totalCells;
        let agentsPerArea = Math.floor(ratio * agentNum);
        if (index === spawnAreas.length - 1) {
            agentsPerArea = agentNum - agentsSpawned;
        }
        agentsSpawned += agentsPerArea;
        populateCells(area, agentsPerArea);
    });
}

function getAgentsToTestAgainst(agent){
    
    let selectionRectangle = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
    selectionRectangle.right = agent.square.right;
    selectionRectangle.bottom = agent.square.bottom;
    selectionRectangle.top = agent.square.top;
    selectionRectangle.left = agent.square.left;

    testCollision(getAgents(), selectionRectangle, agent);
    

}

function testCollision(inputAgents, agentRectangle, testingAgent) {
    let collidingAgents = [];
    inputAgents.forEach(function(agent) {
      let box = agent.square;
  
      if (
        agentRectangle.left <= box.left &&
        agentRectangle.top <= box.top &&
        agentRectangle.right >= box.right &&
        agentRectangle.bottom >= box.bottom
      ) {
        if (agent.myNumber != testingAgent.myNumber)
        {
            agent.body.setAttribute('fill', 'green');
            collidingAgents.push(agent);
        }
        //agent.body.setAttribute('fill', 'green');
        //collidingAgents.push(agent);
      } else {agent.body.setAttribute('fill', 'black');;}
    });

    console.log("Found: " + collidingAgents.length);
    
    if (collidingAgents.length != 0){
        
    }
    

    return collidingAgents;
  }

//Drawing calculated amount of agents in each spawn area
function populateCells(area, agentsPerArea) {
    let firstCell = area[area.length - 1];
    let lastCell = area[0];
    //let areaSize = { x: lastCell.x - firstCell.x, y: lastCell.y - firstCell.y };
    for (let i = 0; i < agentsPerArea; ++i) {
        let fattiness = ((cellSize / 6) + Math.floor(Math.random() * 3));
        let x = getRandomArbitrary(firstCell.x * cellSize + fattiness, lastCell.x * cellSize + cellSize - fattiness);
        let y = getRandomArbitrary(firstCell.y * cellSize + fattiness, lastCell.y * cellSize + cellSize - fattiness);
        let agent = new Agent(x, y, fattiness);
        agents.push(agent);
    }
}

//Getting position within spawn area
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getAgents(){
    return agents;
}

//
//
//Move agents - Animate / collision
//
//

//Animate function, sets random position
function anime(start) {
    let i = 0, len = agents.length;
    let cells = getCells();
    while (i < len) {
        /*Maybe see if we can remove the null check?*/
        if (agents[i] != null) {
            let x = Math.floor(agents[i].x / cellSize);
            let y = Math.floor(agents[i].y / cellSize);
            let newX = agents[i].x + ((cells[x][y].dVector.x) * agents[i].SpeedModifier) / 3;
            let newY = agents[i].y + ((cells[x][y].dVector.y) * agents[i].SpeedModifier) / 3;

            agents[i].setCoordinates(newX, newY);
            agents[i].updateAgentCell();

            if (getCell(x, y) == endPoint) {
                agents[i].destroy();
            }

            
        }
        i++;
    }
    let end = performance.now();
    console.log(`Execution time: ${end - start} ms`);
    requestAnimationFrame(animateCaller);
    
}

async function animateCaller() {
    
    if (agents.length == 0){
        return;
    }
    const start = performance.now();
    anime(start);
}

function CheckInnerBoxColl(agent){
    agent
}

//Finding bounding circumference of given cells, used for border interference detection in collision
function getCellPath(cell) {
    let closedPath = [];
    for (let i = 0; i < 4; i++) {
        if (i === 0) {
            let x = cell.rect.getAttribute("x");
            let y = cell.rect.getAttribute("y");
            closedPath.push({ x, y });
        }
        else if (i === 1) {
            let x = cell.rect.getAttribute("x") + cellSize;
            let y = cell.rect.getAttribute("y");
            closedPath.push({ x, y });
        }
        else if (i === 2) {
            let x = cell.rect.getAttribute("x") + cellSize;
            let y = cell.rect.getAttribute("y") + cellSize;
            closedPath.push({ x, y });
        }
        else if (i === 3) {
            let x = cell.rect.getAttribute("x");
            let y = cell.rect.getAttribute("y") + cellSize;
            closedPath.push({ x, y });
        }
    }
    return closedPath;
}

//Got from https://www.inkfood.com/collision-detection-with-svg/
//poly is an array of points in cartesian space representing a closed path
//pt is the point to be checked
//if it is within the closed path, collision is detected 
function isPointInPoly(poly, pt) {
    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
            && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
            && (c = !c);
    return c;
}

function removeAgentsFromArea(area, agentsToRemovePerArea, drawingArea) {
    let removedAgents = 0;
    let agentsInArea = agents.filter(agent => {
        return area.some(cell => {
            return cell.x === Math.floor(agent.x / cellSize) && cell.y === Math.floor(agent.y / cellSize);
        });
    });

    let totalAgentsInArea = agentsInArea.length;
    let agentsToRemove = Math.min(agentsToRemovePerArea, totalAgentsInArea);
    let agentsToKeep = [];

    for (let i = 0; i < agents.length; i++) {
        if (agentsToRemove > 0 && agentsInArea.includes(agents[i])) {
            drawingArea.removeChild(agents[i].body);
            removedAgents++;
            agentsToRemove--;
        } else {
            agentsToKeep.push(agents[i]);
        }
    }

    agents = agentsToKeep;
    return removedAgents;
}

function addSpawnArea(spawnGroup) { spawnAreas.push(spawnGroup); }
function getSpawnArea() { return spawnAreas; }
