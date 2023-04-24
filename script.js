import { initCellValues, setEssenVariables, perfMeasure } from './modules/pathfinding.js';
import { addSpawnArea, getSpawnArea, populate, removeAgentsFromArea, animateCaller, setSizes } from './modules/agents.js';
import { createGrid, getCellIndex, cellEventHandler, clearCanvas, cellSize, setAddingExit, setAddingSpawn, 
    getAddingExit, getAddingSpawn, endPoint, startPoint, prevExit, getCells, toggleHeat, setShowHeatMap, getShowHeatMap } from './modules/cells.js';


//Initialize DOM elements
const closeMenu = document.querySelector("#close");
const openMenu = document.querySelector("#open");
const startSim = document.querySelector("#start");
const numAgents = document.querySelector("#numAgents");
const menu = document.querySelector(".menu");
const drawingArea = document.querySelector(".drawing");

const toggle = document.querySelector("#toggleDisplay");

const popButton = document.querySelector("#populate");
const clearButton = document.querySelector("#clear");
const addExitButton = document.querySelector("#addExit");
const addSpawnButton = document.querySelector("#addSpawn");

const toggleAgentsSubmenu = document.querySelector("#agentsButton");
const spawnButton = document.querySelector("#spawnButton");
const removeButton = document.querySelector("#removeButton");
let numAgentsInput = document.querySelector("#num-agents");
const toggleGridsSubmenu = document.querySelector("#gridsButton");

//
//
//Menu features - open / close / drag / clear / spawn / exit
//
//

//Initialization of variables for overlay
let isDraggingOverlay = false;
let isMouseDown = false;
let cursorCurrentX = 0;
let cursorCurrentY = 0;
let cursorNewX = 0;
let cursorNewY = 0;

//let popButton = document.querySelector("#populate");
popButton.addEventListener("click", populate);

let menuHidden = true;

//Event listeners for menu open / close / drag / clear / spawn / exit
menu.addEventListener("mousedown", function (event) {
    isMouseDown = true;
    isDraggingOverlay = false;
    cursorCurrentX = event.clientX;
    cursorCurrentY = event.clientY;
});

menu.addEventListener("mouseup", function () {
    isMouseDown = false;
    isDraggingOverlay = false;
});

closeMenu.addEventListener("click", function () {
    isMouseDown = false;
    menuHidden = true;
    if (isDraggingOverlay === false) {
        menuHidden = true;
        openMenu.style.visibility = "visible";
        menu.style.visibility = "hidden";
    }
});

openMenu.addEventListener("mousedown", function (event) {
    isMouseDown = true;
    isDraggingOverlay = false;
    cursorCurrentX = event.clientX;
    cursorCurrentY = event.clientY;
});

toggleGridsSubmenu.addEventListener("click", function () {
    let submenu = document.querySelector("#gridsSubmenu");
    if (submenu.style.display === "none") {
        submenu.style.display = "block";
    } else {
        submenu.style.display = "none";
    }
});

document.addEventListener("mousemove", function (event) {
    cursorNewX = cursorCurrentX - event.clientX;
    cursorNewY = cursorCurrentY - event.clientY;
    if ((cursorCurrentX !== cursorNewX || cursorCurrentY !== cursorNewY) && isMouseDown === true) {
        isDraggingOverlay = true;
        cursorCurrentX = event.clientX;
        cursorCurrentY = event.clientY;
        menu.style.left = (menu.offsetLeft - cursorNewX) + "px";
        menu.style.top = (menu.offsetTop - cursorNewY) + "px";
        openMenu.style.left = (menu.offsetLeft - cursorNewX) + "px";
        openMenu.style.top = (menu.offsetTop - cursorNewY) + "px";
    }
});

openMenu.addEventListener("mouseup", function () {
    isMouseDown = false;
    if (isDraggingOverlay === false) {
        menuHidden = false;
        openMenu.style.visibility = "hidden";
        menu.style.visibility = "visible";
    }
});

// Add event to "Clear"-button
//let clearButton = document.querySelector("#clear");
clearButton.addEventListener("click", clearCanvas);

// Add event to "add exit"-button and "add-spawn"-button
//let addExitButton = document.querySelector("#addExit");
addExitButton.addEventListener("click", () => {
    setAddingExit(true);

});

//let addSpawnButton = document.querySelector("#addSpawn");
addSpawnButton.addEventListener("click", () => {
    setAddingSpawn(true);
});

//Event listeners for agents submenu
toggleAgentsSubmenu.addEventListener("click", function () {
    let submenu = document.querySelector("#agentsSubmenu");
    if (submenu.style.display === "none") {
        submenu.style.display = "block";
    } else {
        submenu.style.display = "none";
    }
});

//spawnButton.addEventListener("click", function () {
//    populate();
//});

removeButton.addEventListener("click", function () {
    let agentNumToRemove = document.querySelector("#numAgents").value;
    if (isNaN(agentNumToRemove) || agentNumToRemove <= 0) {
        window.alert("Please enter a valid number of agents to remove");
        return;
    }

    let totalCells = 0;
    let spawnAreas = getSpawnArea();
    spawnAreas.forEach(area => {
        totalCells += area.length;
    });

    let removedAgents = 0;
    spawnAreas.forEach((area, index) => {
        let ratio = area.length / totalCells;
        let agentsToRemovePerArea = Math.floor(ratio * agentNumToRemove);
        if (index === spawnAreas.length - 1) {
            agentsToRemovePerArea = agentNumToRemove - removedAgents;
        }
        removedAgents += removeAgentsFromArea(area, agentsToRemovePerArea, drawingArea);
    });
});

//Event listener for starting simulation
startSim.addEventListener("click", function () {
    if (startPoint === null) {
        alert("Missing a start point!");
        return;
    }

    if (endPoint === null) {
        alert("Missing a exit point!");
        return;
    }

    setEssenVariables(canvasWidth, canvasHeight, cellSize);
    perfMeasure(getCells(), endPoint, startPoint);

    setSizes(canvasWidth, canvasHeight)
    populate();

    //toggleHeat();  
    animateCaller()

    //toggleHeat();
});


toggle.addEventListener("click", function(){
    setShowHeatMap(getShowHeatMap() ? false  : true);

});


//
//
//SVG canvas - initialization and drawing
//
//



//Define canvas parameters and setting svg attributes
const canvasWidth = window.innerWidth - window.innerWidth % cellSize;
const canvasHeight = window.innerHeight - window.innerHeight % cellSize;
drawingArea.setAttribute('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`);
drawingArea.setAttribute('width', canvasWidth);
drawingArea.setAttribute('height', canvasHeight);


createGrid(canvasWidth, canvasHeight);


//
//
//Drawing on canvas - draw / drag 
//
//

//Initialization of variables for checking cell indexes
let prevIndex = null;
let nextIndex = null;
let isDragging = false;

drawingArea.addEventListener("mousedown", (event) => {
    if (getAddingSpawn()) {
        return;
    }
    isDragging = true;
    menu.style.visibility = "hidden";
    prevIndex = getCellIndex(event.clientX, event.clientY);
    cellEventHandler(prevIndex);
});

drawingArea.addEventListener("mousemove", (event) => {
    if (event.buttons !== 1) {
        isDragging = false;
    }
    
    if (getAddingSpawn()) {
        return;
    }
    if (isDragging == true) {
        nextIndex = getCellIndex(event.clientX, event.clientY);
        if (prevIndex.x !== nextIndex.x || prevIndex.y !== nextIndex.y) {
            cellEventHandler(nextIndex);
            prevIndex = nextIndex;
        }
    }
});

drawingArea.addEventListener("mouseup", () => {
    if (getAddingSpawn()) {
        return;
    }
    isDragging = false;
    setAddingSpawn(false);
    prevIndex = null;
    if (menuHidden === false) {
        menu.style.visibility = "visible";
    }
});

//Initialization of variables needed for adding custom rectangular spawn area
let startingCell;

drawingArea.addEventListener("mousedown", (event) => {
    if (getAddingSpawn()) {
        isDragging = true;
        startingCell = getCellIndex(event.offsetX, event.offsetY);
        prevIndex = getCellIndex(event.offsetX, event.offsetY);
        cellEventHandler(prevIndex);
    }
});

drawingArea.addEventListener("mousemove", (event) => {
    if (getAddingSpawn() && isDragging) {
        let nextIndex = getCellIndex(event.offsetX, event.offsetY);
        if (prevIndex.x != nextIndex.x || prevIndex.y != nextIndex.y) {
            for (let x = nextIndex.x; x >= startingCell.x; --x) {
                for (let y = nextIndex.y; y >= startingCell.y; --y) {
                    let index = { x, y };
                    cellEventHandler(index);
                }
            }
            prevIndex = nextIndex;
        }
    }
});

drawingArea.addEventListener("mouseup", (event) => {
    if (getAddingSpawn()) {
        isDragging = false;
        setAddingSpawn(false);
        let spawnGroup = [];
        let finalCell = getCellIndex(event.offsetX, event.offsetY);

        switch (true) {
            case (finalCell.x > startingCell.x && finalCell.y < startingCell.y): // 1st quadrant
                for (let x = finalCell.x; x >= startingCell.x; --x) {
                    for (let y = finalCell.y; y <= startingCell.y; ++y) {
                        let index = { x, y };
                        spawnGroup.push(index);
                    }
                }
                break;
            case (finalCell.x > startingCell.x && finalCell.y > startingCell.y): // 2th quadrant
                for (let x = finalCell.x; x >= startingCell.x; --x) {
                    for (let y = finalCell.y; y >= startingCell.y; --y) {
                        let index = { x, y };
                        spawnGroup.push(index);
                    }
                }
                break;
            case (finalCell.x < startingCell.x && finalCell.y > startingCell.y): // 3th quadrant
                for (let x = finalCell.x; x <= startingCell.x; ++x) {
                    for (let y = finalCell.y; y >= startingCell.y; --y) {
                        let index = { x, y };
                        spawnGroup.push(index);
                    }
                }
                break;
            case (finalCell.x < startingCell.x && finalCell.y < startingCell.y): // 4th quadrant
                for (let x = finalCell.x; x <= startingCell.x; ++x) {
                    for (let y = finalCell.y; y <= startingCell.y; ++y) {
                        let index = { x, y };
                        spawnGroup.push(index);
                    }
                }
                break;
            case (finalCell.x == startingCell.x && finalCell.y == startingCell.y): // single cells
                let x = finalCell.x;
                let y = finalCell.y;
                let index = { x, y };
                spawnGroup.push(index);
                break;
            case (finalCell.x > startingCell.x && finalCell.y == startingCell.y): // When doing a horisontal line where x gets smaller
                for (let x = startingCell.x; x <= finalCell.x; ++x) {
                    let y = finalCell.y;
                    let index = { x, y };
                    spawnGroup.push(index);
                }
                break;
            case (finalCell.x < startingCell.x && finalCell.y == startingCell.y): // When doing a horisontal line where x gets larger
                for (let x = finalCell.x; x <= startingCell.x; ++x) {
                    let y = finalCell.y;
                    let index = { x, y };
                    spawnGroup.push(index);
                }
                break;
            case (finalCell.x == startingCell.x && finalCell.y < startingCell.y): // When doing a vertical line where y gets smaller
                for (let y = finalCell.y; y <= startingCell.y; ++y) {
                    let x = finalCell.x;
                    let index = { x, y };
                    spawnGroup.push(index);
                }

                break;
            case (finalCell.x == startingCell.x && startingCell.y < finalCell.y): // When doing a vertical line where y gets larger
                for (let y = startingCell.y; y <= finalCell.y; ++y) {
                    let x = finalCell.x;
                    let index = { x, y };
                    spawnGroup.push(index);
                }

                break;
        }

        addSpawnArea(spawnGroup);
    }
});

window.addEventListener("mousemove", function (event) {
    //Checks if the primary mouse button is NOT pressed and updates the isMouseDown variable accordingly.
    //event.buttons {1 == primary, 2 == secondary, 4 == auxiliary(middle)}
    if (event.buttons !== 1) {
        isMouseDown = false;
    }

    cursorNewX = cursorCurrentX - event.clientX;
    cursorNewY = cursorCurrentY - event.clientY;
    if ((cursorCurrentX !== cursorNewX || cursorCurrentY !== cursorNewY) && isMouseDown === true) {
        isDraggingOverlay = true;
        cursorCurrentX = event.clientX;
        cursorCurrentY = event.clientY;
        menu.style.left = (menu.offsetLeft - cursorNewX) + "px";
        menu.style.top = (menu.offsetTop - cursorNewY) + "px";
        openMenu.style.left = (menu.offsetLeft - cursorNewX) + "px";
        openMenu.style.top = (menu.offsetTop - cursorNewY) + "px";

        // Call the resetMenuPosition function
        resetMenuPosition();
    } else {
        isDraggingOverlay = false;
    }
});

function resetMenuPosition(){
    const menuRect = menu.getBoundingClientRect();
    const openMenuRect = openMenu.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    if (menuRect.top < 0) {
        menu.style.top = "0px";
        openMenu.style.top = "0px";
    }

    if (menuRect.left < 0) {
        menu.style.left = "0px";
        openMenu.style.left = "0px";
    }

    if (menuRect.bottom > windowHeight) {
        menu.style.top = (windowHeight - menuRect.height) + "px";
        openMenu.style.top = (windowHeight - menuRect.height) + "px";
    }

    if (menuRect.right > windowWidth) {
        menu.style.left = (windowWidth - menuRect.width) + "px";
        openMenu.style.left = (windowWidth - menuRect.width) + "px";
    }
}

//
//
//Agents - Initializatoin / populating
//
//

//
//
//Pathfinding
//
//

