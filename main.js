require('dotenv').config()

const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3000
const { Server } = require('socket.io')
const io = new Server(server)
let connections = []

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`)
  connections.push(socket)

  socket.on('mousedown', (coordinate) => {
    socket.broadcast.emit('mousedown', coordinate)
  })

  socket.on('mouseup', () => {
    socket.broadcast.emit('mouseup', )
  })

  socket.on('draw', (coordinate) => {
    socket.broadcast.emit('draw', coordinate)
  })

  socket.on('changestroke', (value) => {
    socket.broadcast.emit('changestroke', value)
  })

  socket.on('changesize', (value) => {
    socket.broadcast.emit('changesize', value)
  })

  socket.on('clear', () => {
    socket.broadcast.emit('clear')
  })
})

app.use('/', express.static("public"))

server.listen(PORT, () => {
  console.log(`success listen to server ${PORT}`)
})