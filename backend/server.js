const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

// In-memory document store: { [docId]: string }
const docs = {}

io.on('connection', (socket) => {
  let currentDocId = null

  socket.on('join-doc', (docId) => {
    currentDocId = docId
    socket.join(docId)

    io.to(docId).emit('user-count', count)
  })

  socket.on('text-change', ({ docId, content }) => {
    docs[docId] = content
    // Broadcast to all other clients in the room (no self-echo)
    socket.to(docId).emit('text-change', { content })
  })

  socket.on('disconnect', () => {
    if (currentDocId) {
      // Defer so the socket is fully removed from the room before counting
      setImmediate(() => {
        const count = io.sockets.adapter.rooms.get(currentDocId)?.size || 0
        io.to(currentDocId).emit('user-count', count)
      })
    }
  })
})

server.listen(3001, '0.0.0.0', () => {
  console.log('Backend running on port 3001')
})
