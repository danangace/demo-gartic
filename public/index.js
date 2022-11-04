const canvas = document.getElementById('drawing-board')
const ctx = canvas.getContext('2d')
const drawwer = document.getElementById('drawwer')
const button = document.getElementById('clear-btn')
const socket = io("http://localhost:3000")

// initialize width and height
canvas.width = window.innerWidth - canvas.offsetLeft
canvas.height = window.innerHeight - canvas.offsetTop

// fillStyle = 'red'
// fillRect(x, y, width, height) -> fill rectangle
// strokeStyle = 'red'

// ctx.fillStyle = 'red'
// ctx.fillRect(0,0, canvas.width/2, canvas.height/2)

// draw heart
// ctx.fillStyle = 'red'
// ctx.beginPath();
// ctx.moveTo(75, 40);
// ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
// ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
// ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
// ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
// ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
// ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
// ctx.fill();

let isPainting = false
let lineSize = 5
let posX;
let posY;

drawwer.addEventListener('change', (e) => {
  if (e.target.id === 'input-stroke') {
    socket.emit('changestroke', e.target.value)
    changeStrokeStyle(e.target.value)
  }

  if (e.target.id === 'line-size') {
    socket.emit('changesize', e.target.value)
    changeLineSize(e.target.value)
  }
})

canvas.addEventListener('mousedown', (e) => {
  const coordinate = { x: e.clientX, y: e.clientY }
  startingPoint(coordinate)
  socket.emit('mousedown', coordinate)
})

canvas.addEventListener('mouseup', () => {
  endDraw()
  socket.emit('mouseup')
})

canvas.addEventListener('mousemove', (e) => {
  if (!isPainting) return
  beginDraw(e)
})

function beginDraw (e) {
  const coordinate = { x: e.clientX - canvas.offsetLeft, y:  e.clientY}
  socket.emit('draw', coordinate)
  draw(coordinate)
}

button.addEventListener('click', () => {
  socket.emit('clear')
  clearCanvas()
})

// Function Drawing

function changeStrokeStyle (value) {
  ctx.strokeStyle = value
}

function changeLineSize (value) {
  lineSize = value
}

function startingPoint ({ x, y }) {
  isPainting = true
  posX = x
  posY = y
}

function draw ({x,y}) {
  ctx.lineWidth = lineSize
  ctx.lineCap = 'round'
  ctx.lineTo(x,y)
  ctx.stroke()
}

function endDraw () {
  isPainting = false
  ctx.stroke()
  ctx.beginPath()
}

function clearCanvas () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

// Socket Connection

// socket.emit('ping', { id: 1, name: 'jalu' })
// socket.on('pong', (data) => {
//   console.log('pong')
//   console.log(data)
// })

socket.on('mousedown', (coordinate) => startingPoint(coordinate))

socket.on('mouseup', () => endDraw())

socket.on('draw', (coordinate) => draw(coordinate))

socket.on('changestroke', (value) => changeStrokeStyle(value))

socket.on('changesize', (value) => changeLineSize(value))

socket.on('clear', () => clearCanvas())