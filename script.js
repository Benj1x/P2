//Redrawing agents -> Track if an agent has updated -> Draw
//Check which method works best for drawing all agents, if chosen -> Rabussys or Maximussys
// Initialize canvas and context
let canvas = document.getElementById("layer1");
let canvasLayer2 = document.getElementById("layer2");
let ctx = canvas.getContext("2d");
let ctxLayer2 = canvasLayer2.getContext("2d");
let closeMenu = document.getElementById("close");
let openMenu = document.getElementById("open");
let menu = document.querySelector(".menu");
let startButton = document.getElementById("start");
//const svgNS = "http://www.w3.org/2000/svg";
//let svgElement = document.createElementNS(svgNS, "svg");

//Open and close menu
let menuHidden = true;

closeMenu.addEventListener("click", function () {
    menuHidden = true;
    openMenu.style.visibility = "visible";
    menu.style.visibility = "hidden";
})

openMenu.addEventListener("click", function () {
    menuHidden = false;
    openMenu.style.visibility = "hidden";
    menu.style.visibility = "visible";
})

//Draggable overlay
let isDraggingOverlay = false;
let cursorCurrentX = 0;
let cursorCurrentY = 0;
let cursorNewX = 0;
let cursorNewY = 0;

menu.addEventListener("mousedown", function (event) {
    isDraggingOverlay = true;
    cursorCurrentX = event.clientX;
    cursorCurrentY = event.clientY;
})

document.addEventListener("mousemove", function (event) {
    if (isDraggingOverlay === true) {
        cursorNewX = cursorCurrentX - event.clientX;
        cursorNewY = cursorCurrentY - event.clientY;
        cursorCurrentX = event.clientX;
        cursorCurrentY = event.clientY;
        menu.style.left = (menu.offsetLeft - cursorNewX) + "px";
        menu.style.top = (menu.offsetTop - cursorNewY) + "px";
        openMenu.style.left = (menu.offsetLeft - cursorNewX) + "px";
        openMenu.style.top = (menu.offsetTop - cursorNewY) + "px";
    }
})

menu.addEventListener("mouseup", function () {
    isDraggingOverlay = false;
})
const cellSize = 25;

// Define canvas parameters
const canvasWidth = window.innerWidth - window.innerWidth % cellSize;
const canvasHeight = window.innerHeight - window.innerHeight % cellSize;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

canvasLayer2.width = canvasWidth;
canvasLayer2.height = canvasHeight;

// Initizialize array for cells
const cells = [];

// Create cells and cell properties.
for (let y = 0; y < canvasHeight / cellSize; y++) {
    for (let x = 0; x < canvasWidth / cellSize; x++) {
        const cell = {
            x: x * cellSize,
            y: y * cellSize,
            width: cellSize,
            height: cellSize,
            color: "white",
            isWall: false,
            isExit: false,
            isSpawnPoint: false
        };
        // push cell to cells array
        cells.push(cell);
    }
}

// Inizially draw cells on canvays
cells.forEach(cell => {
    ctx.fillStyle = cell.color;
    ctx.fillRect(cell.x, cell.y, cell.width, cell.height);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
});

let prevIndex = null
let isDragging = false

canvas.addEventListener("mousedown", (event) => {
    isDragging = true   
    menu.style.visibility = "hidden";
    prevIndex = getCellIndex(event.offsetX, event.offsetY)
    console.log(cells[prevIndex]);
    cellEventHandler(event, prevIndex)
})

canvas.addEventListener("mousemove", (event) => {
    if (isDragging == true) {
        nextIndex = getCellIndex(event.offsetX, event.offsetY)
        if (prevIndex != nextIndex) {
            cellEventHandler(event, nextIndex)
            prevIndex = nextIndex
        }
    }
})

canvas.addEventListener("mouseup", () => {
    isDragging = false
    prevIndex = null
    if (menuHidden === false) {
        menu.style.visibility = "visible";
    }
})

// Add event to "Clear"-button
clearButton = document.querySelector("#clear")
clearButton.addEventListener("click", clearCanvas)

// Add event to "add exit"-button and "add-spawn"-button
let addingExit = false
let addingSpawn = false;
let prevExit = null
addExitButton = document.querySelector("#add-exit")
addExitButton.addEventListener("click", () => {
    addingExit = true
})
addSpawnButton = document.querySelector("#add-spawn");
addSpawnButton.addEventListener("click", () => {
    addingSpawn = true;
})


function cellEventHandler(event, index) {
    toggleCellProperties(index)
    drawCell(cells[index])
}



function getCellIndex(x, y) {
    // find cell row and column 
    let row = Math.floor(y / cellSize)
    let column = Math.floor(x / cellSize)
    // return index of cell in cells array (row-major order)
    return row * (canvasWidth / cellSize) + column
}

function toggleCellProperties(index) {
    if (addingExit) {
        cells[index].color = "green"
        cells[index].isExit = true
        cells[index].isSpawnPoint = false;
        cells[index].isWall = false
        if (prevExit) {
            prevExit.color = "white"
            prevExit.isExit = false
            prevExit = cells[index]
        } else {
            prevExit = cells[index]
        }
        addingExit = false
    } else if (addingSpawn) {
        cells[index].color = "blue"
        cells[index].isExit = false;
        cells[index].isSpawnPoint = true
        cells[index].isWall = false
        addingSpawn = false
    } else if (cells[index].color == "white") {
        cells[index].color = "black"
        cells[index].isWall = true
    } else if (cells[index].color == "black" || cells[index].color == "green" || cells[index].color == "blue") {
        cells[index].color = "white"
        cells[index].isWall = false
        cells[index].isExit = false
        cells[index].isSpawnPoint = false;

    }
    console.log(`cell ${index} has color ${cells[index].color} `)
}

function clearCanvas() {
    cells.forEach(cell => {
        cell.color = "white"
        cell.isWall = false
        cell.isExit = false
        cell.isSpawnPoint = false;
    })
    redraw()
}

function drawCell(cell) {
        ctx.fillStyle = cell.color;
        ctx.fillRect(cell.x, cell.y, cell.width, cell.height);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
}


function redraw() {
    cells.forEach(cell => {
        ctx.fillStyle = cell.color;
        ctx.fillRect(cell.x, cell.y, cell.width, cell.height);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
    });
}

let agents = [];


function populate() {
    for (let i = 1; i <= 30; i++) {
        const agent = {
            x: (Math.floor(Math.random() * canvasWidth)),
            y: (Math.floor(Math.random() * canvasHeight)),
            fattiness: (Math.floor(Math.random() * 3) + 5),
            //body: document.createElementNS(svgNS, 'circle'),
        }
        /*// agent.body.setAttribute('cx', agent.x);
        // agent.body.setAttribute('cy', agent.y);
        agent.body.setAttribute('r', agent.fattiness);
        let transformDick = svgElement.createSVGTransform();
        transformDick.setTranslate(agent.x, agent.y);
        agent.body.transform.baseVal.appendItem(transformDick);
        canvas.appendChild(agent.body);*/
        agents.push(agent);
    }

    agents.forEach(agent => {
        ctxLayer2.beginPath();
        ctxLayer2.arc(agent.x, agent.y, agent.fattiness, 0, 2 * Math.PI);
        ctxLayer2.fillStyle = "blue"
        ctxLayer2.fill();
    })
}

//populate();

//Need to delete old agent positions without clearing whole canvas
function anime() {
    ctxLayer2.clearRect(0, 0, canvasLayer2.width, canvasLayer2.height);
    agents.forEach(agent => {
        /*ctxLayer2.beginPath();
        ctxLayer2.arc((agent.x), (agent.y), (agent.fattiness * 2), 0, 2 * Math.PI);
        ctxLayer2.fillStyle = "rgba(0, 0, 0, 0)";
        ctxLayer2.fill();*/

        /*let arithmetic = Math.random();
        if (arithmetic <= 0.25) {
            agent.x = (Math.random() + agent.x);
            agent.y = (Math.random() + agent.y);

        }
        else if (arithmetic > 0.25 && arithmetic <= 0.5) {
            agent.x = (Math.random() + agent.x);
            agent.y = (Math.random() - agent.y);

        }
        else if (arithmetic > 0.5 && arithmetic <= 0.75) {
            agent.x = (Math.random() - agent.x);
            agent.y = (Math.random() + agent.y);
        }
        else {
            agent.x = (Math.random() - agent.x);
            agent.y = (Math.random() - agent.y);
        }*/

        agent.x = (Math.random() + agent.x);
        agent.y = (Math.random() + agent.y);
        ctxLayer2.beginPath();
        ctxLayer2.arc((agent.x), (agent.y), agent.fattiness, 0, 2 * Math.PI);
        ctxLayer2.fillStyle = "blue"
        ctxLayer2.fill();
    })
    requestAnimationFrame(anime);
}

startButton.addEventListener("click", function startSimulation() {
    canvasLayer2.style.zIndex = "10";
    populate();
    anime();
});
//anime();