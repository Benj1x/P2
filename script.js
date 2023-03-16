<<<<<<< Updated upstream
console.log("Hello actions");
=======
// Initialize canvas and context
// var canvas = document.querySelector(".field")
// var ctx = canvas.getContext("2d");
const svgNS = "http://www.w3.org/2000/svg";
const drawingArea = document.querySelector(".drawing")

// Define canvas parameters
const canvasWidth = 800;
const canvasHeight = 600;
drawingArea.setAttribute('width', canvasWidth);
drawingArea.setAttribute('height', canvasHeight);
clearButton = document.querySelector("#clear")
clearButton.addEventListener("click", clearAllRects)

const cellSize = 25;

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
      agents: [],
      rect: null
    };
    // push cell to cells array
    cells.push(cell);
  }
}


// Inizially draw cells on canvas
cells.forEach(cell => {
  // ctx.fillStyle = cell.color;
  // ctx.fillRect(cell.x, cell.y, cell.width, cell.height);
  // ctx.strokeStyle = 'black';
  // ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
  let rect = document.createElementNS(svgNS, 'rect')
  rect.setAttribute('width', cell.width)
  rect.setAttribute('height', cell.height)
  rect.setAttribute('x', cell.x)
  rect.setAttribute('y', cell.y)
  rect.setAttribute('stroke', 'black')
  rect.setAttribute('fill', 'white')
  rect.addEventListener("mousedown", (event) => {
    isDragging = true
    DrawHandler(event, rect)
  })
  rect.addEventListener("mousemove", (event) => {
    if (isDragging){
      DrawHandler(event, rect)
    }
  })
  rect.addEventListener("mouseup", () => {
    isDragging = false
  })
  cell.rect = rect;
  drawingArea.appendChild(rect)
});

let prevRect = null
let isDragging = false

function DrawHandler(event, rect){
  if (!(prevRect === rect)) {
    if (rect.getAttribute('fill') === 'white')
    {
    rect.setAttribute('fill', 'black')
    }
    else
    {
    rect.setAttribute('fill', 'white')
    }
  }
  prevRect = rect;
}

function clearAllRects(){
  cells.forEach(cell => {
    cell.rect.setAttribute('fill', 'white');
  });
}
// canvas.addEventListener("mousedown", (event) => {
//   isDragging = true
//   prevIndex = getCellIndex(event.offsetX, event.offsetY)
//   cellEventHandler(event, prevIndex)
// })

// canvas.addEventListener("mousemove", (event) => {
//   if (isDragging == true) {
//     nextIndex = getCellIndex(event.offsetX, event.offsetY)
//     if (prevIndex != nextIndex) {
//       cellEventHandler(event, nextIndex)
//       prevIndex = nextIndex
//     }
//   }
// })

// canvas.addEventListener("mouseup", () => {
//   isDragging = false
//   prevIndex = null
// })

// // Add event to "Clear"-button
// clearButton = document.querySelector("#clear")
// clearButton.addEventListener("click", clearCanvas)

// // Add event to "add exit"-button
// let addingExit = false
// let prevExit = null
// addExitButton = document.querySelector("#add-exit")
// console.log(addExitButton)
// addExitButton.addEventListener("click", () => {
//   addingExit = true
// })

// function cellEventHandler(event, index) {
//   toggleCellProperties(index)
//   redraw()
// }



// function getCellIndex(x, y) {
//   // find cell row and column 
//   let row = Math.floor(y / cellSize)
//   let column = Math.floor(x / cellSize)
//   // return index of cell in cells array (row-major order)
//   return row * (canvasWidth / cellSize) + column
// }

// function toggleCellProperties(index) {
//   if (addingExit) {
//     cells[index].color = "green"
//     cells[index].isExit = true
//     cells[index].isWall = false
//     if (prevExit) {
//       prevExit.color = "white"
//       prevExit.isExit = false
//       prevExit = cells[index]
//     } else {
//       prevExit = cells[index]
//     }
//     addingExit = false
//   } else if (cells[index].color == "white") {
//     cells[index].color = "black"
//     cells[index].isWall = true
//   } else if (cells[index].color == "black" || cells[index].color == "green") {
//     cells[index].color = "white"
//     cells[index].isWall = false
//     cells[index].isExit = false

//   }
//   console.log(`cell ${index} has color ${cells[index].color} `)
// }

// function clearCanvas() {
//   cells.forEach(cell => {
//     cell.color = "white"
//     cell.isWall = false
//     cell.isExit = false
//   })
//   redraw()
// }


// function redraw() {
//   cells.forEach(cell => {
//     ctx.fillStyle = cell.color;
//     ctx.fillRect(cell.x, cell.y, cell.width, cell.height);
//     ctx.strokeStyle = 'black';
//     ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
//   });
// }
>>>>>>> Stashed changes
