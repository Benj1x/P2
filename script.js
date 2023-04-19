import { initCellValues, setEssenVariables, perfMeasure } from './modules/pathfinding.js';
import { addSpawnArea, getSpawnArea, populate, removeAgentsFromArea, anime } from './modules/agents.js';
import { createGrid, getCellIndex, cellEventHandler, clearCanvas, cellSize, setAddingExit, setAddingSpawn, getAddingExit, getAddingSpawn, endPoint, startPoint, prevExit, getCells } from './modules/cells.js';


//Initialize DOM elements
const openMenu = document.querySelector("#open");
const closeMenu = document.querySelector("#close");
const startSim = document.querySelector("#start");
const numAgents = document.querySelector("#numAgents");
const menu = document.querySelector(".menu");
const drawingArea = document.querySelector(".drawing");

const popButton = document.querySelector("#populate");
const clearButton = document.querySelector("#clear");
const addExitButton = document.querySelector("#addExit");
const addSpawnButton = document.querySelector("#addSpawn");

const toggleAgentsSubmenu = document.querySelector("#agentsButton");
const toggleGridsSubmenu = document.querySelector("#gridsButton");
const removeButton = document.querySelector("#removeButton");
let numAgentsInput = document.querySelector("#num-agents");

const unicorn = document.getElementById("unicorn");

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

//Function for resetting the menu position
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

//Event listener for mouse moving over the window
window.addEventListener("mousemove", function (event) {
    //Checking if the primary mouse button is NOT pressed and updating the isMouseDown variable accordingly.
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
    uniAnimate();

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

openMenu.addEventListener("mouseup", function () {
    isMouseDown = false;
    if (isDraggingOverlay === false) {
        menuHidden = false;
        openMenu.style.visibility = "hidden";
        menu.style.visibility = "visible";
    } 
    uniAnimate();
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

//Event listerns for grids submenu
toggleGridsSubmenu.addEventListener("click", function () {
    let submenu = document.querySelector("#gridsSubmenu");
    if (submenu.style.display === "none") {
        submenu.style.display = "block";
    } else {
        submenu.style.display = "none";
    }
});

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
    
    anime();
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
    if (event.buttons !== 1) {
        isDragging = false;
    }

    if (getAddingSpawn() && isDragging) {
        let nextIndex = getCellIndex(event.offsetX, event.offsetY);
        if (prevIndex.x != nextIndex.x || prevIndex.y != nextIndex.y) {
            switch (true) {
                case (nextIndex.x >= startingCell.x && nextIndex.y <= startingCell.y): // first quadrant 
                    if (nextIndex.x == startingCell.x || nextIndex.y == startingCell.y) {
                        let x = prevIndex.x
                        for (let y = prevIndex.y; y <= startingCell.y; ++y) {
                            let index = { x, y };
                            cellEventHandler(index, "remove");
                        }
                        let y = prevIndex.y;
                        for (let x = prevIndex.x; x >= startingCell.x; --x) {
                            let index = { x, y };
                            cellEventHandler(index, "remove");
                        }
                    }
                    if (nextIndex.x < prevIndex.x) {
                        let x = prevIndex.x;
                        for (let y = prevIndex.y; y <= startingCell.y; ++y) {
                            let index = { x, y };
                            cellEventHandler(index, "remove");
                        }
                    }
                    if (nextIndex.y > prevIndex.y) {
                        let y = prevIndex.y;
                        for (let x = prevIndex.x; x >= startingCell.x; --x) {
                            let index = { x, y };
                            cellEventHandler(index, "remove");
                        }
                    } else {
                        for (let x = nextIndex.x; x >= startingCell.x; --x) {
                            for (let y = nextIndex.y; y <= startingCell.y; ++y) {
                                let index = { x, y };
                                cellEventHandler(index);
                            }
                        }
                    }
                    break;
                case (nextIndex.x <= startingCell.x && nextIndex.y <= startingCell.y): // second quadrant
                    if (nextIndex.y == startingCell.y) {
                        let y = prevIndex.y;
                        for (let x = prevIndex.x; x <= startingCell.x; ++x) {
                            let index = { x, y };
                            cellEventHandler(index, "remove");
                        }
                    }
                    if (nextIndex.x > prevIndex.x) {
                        let x = prevIndex.x;
                        for (let y = prevIndex.y; y <= startingCell.y; ++y) {
                            let index = { x, y };
                            cellEventHandler(index, "remove");
                        }
                    }
                    if (nextIndex.y > prevIndex.y) {
                        let y = prevIndex.y;
                        for (let x = prevIndex.x; x <= startingCell.x; ++x) {
                            let index = { x, y };
                            cellEventHandler(index, "remove");
                        }
                    } else {
                        for (let x = nextIndex.x; x <= startingCell.x; ++x) {
                            for (let y = nextIndex.y; y <= startingCell.y; ++y) {
                                let index = { x, y };
                                cellEventHandler(index);
                            }
                        }
                    }
                    break;
                case (nextIndex.x <= startingCell.x && nextIndex.y >= startingCell.y): // 3th quadrant
                    if (nextIndex.x == startingCell.x) {
                        let x = prevIndex.x
                        for (let y = prevIndex.y; y >= startingCell.y; --y) {
                            let index = { x, y };
                            cellEventHandler(index, "remove");
                        }
                    }
                    if (nextIndex.x > prevIndex.x) {
                        let x = prevIndex.x;
                        for (let y = prevIndex.y; y >= startingCell.y; --y) {
                            let index = { x, y };
                            cellEventHandler(index, "remove");
                        }
                    }
                    if (nextIndex.y < prevIndex.y) {
                        let y = prevIndex.y;
                        for (let x = prevIndex.x; x <= startingCell.x; ++x) {
                            let index = { x, y };
                            cellEventHandler(index, "remove");
                        }
                    } else {
                        for (let x = nextIndex.x; x <= startingCell.x; ++x) {
                            for (let y = nextIndex.y; y >= startingCell.y; --y) {
                                let index = { x, y };
                                cellEventHandler(index);
                            }
                        }
                    }
                    break;
                case (nextIndex.x >= startingCell.x && nextIndex.y >= startingCell.y): // 4th quadrant
                    if (nextIndex.x < prevIndex.x) {
                        let x = prevIndex.x;
                        for (let y = prevIndex.y; y >= startingCell.y; --y) {
                            let index = { x, y };
                            cellEventHandler(index, "remove");
                        }
                    }
                    if (nextIndex.y < prevIndex.y) {
                        let y = prevIndex.y;
                        for (let x = prevIndex.x; x >= startingCell.x; --x) {
                            let index = { x, y };
                            cellEventHandler(index, "remove");
                        }
                    } else {
                        for (let x = nextIndex.x; x >= startingCell.x; --x) {
                            for (let y = nextIndex.y; y >= startingCell.y; --y) {
                                let index = { x, y };
                                cellEventHandler(index);
                            }
                        }
                    }
                    break;
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
            case (finalCell.x < startingCell.x && finalCell.y < startingCell.y): // 2th quadrant
                for (let x = finalCell.x; x <= startingCell.x; ++x) {
                    for (let y = finalCell.y; y <= startingCell.y; ++y) {
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
                for (let x = finalCell.x; x >= startingCell.x; --x) {
                    for (let y = finalCell.y; y >= startingCell.y; --y) {
                        let index = { x, y };
                        spawnGroup.push(index);
                    }
                }
                break;
        }
        addSpawnArea(spawnGroup);
    }
});

function createPicture() {
    const Pictures = ["Unicorn1.png", "Unicorn2.jpeg", "Unicorn3.png", "stars2.png"];

    const unicornElement = document.createElement("div");
    unicornElement.style.position = "absolute";
    const randomIndex = Math.floor(Math.random() * Pictures.length);
    unicornElement.innerHTML = `
        <img src="resources/${Pictures[randomIndex]}" alt="Rainbow Unicorn" width="150px" height="150px">
    `;
    
    unicornElement.classList.add("unicorn");
    unicornElement.style.top = `${Math.floor(Math.random() * -200)}px`;
    unicornElement.style.left = `${Math.floor(Math.random() * window.innerWidth)}px`;
    unicornElement.style.visibility = "visible";
    return unicornElement;
}

function uniAnimate() {
    const numberOfUnicorns = Math.floor(Math.random() * 50) + 25;

    for (let i = 0; i < numberOfUnicorns; i++) {
        const unicorn = createPicture();
        document.body.appendChild(unicorn);

        unicorn.style.transform = `translate(${-10000}px, ${-10000}px)`;

        const animationDelay = Math.floor(Math.random() * 1000);
        unicorn.style.setProperty("--animation-delay", `${animationDelay}ms`);

        unicorn.classList.add("animate");

        unicorn.style.opacity = "1";

        unicorn.style.visibility = "visible";

        setTimeout(function () {
            unicorn.style.visibility = "hidden";
            unicorn.classList.remove("animate");
            document.body.removeChild(unicorn);
        }, 10000);
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

