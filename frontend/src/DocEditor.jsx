import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'

const BACKEND_URL = 'http://localhost:3001'

export default function DocEditor() {
  const { id: docId } = useParams()
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('disconnected')
  const [userCount, setUserCount] = useState(0)
  const socketRef = useRef(null)

  useEffect(() => {
    const socket = io(BACKEND_URL)
    socketRef.current = socket

    socket.on('connect', () => {
      setStatus('connected')
      socket.emit('join-doc', docId)
    })

    socket.on('disconnect', () => {
      setStatus('disconnected')
    })

    socket.on('init', ({ content }) => {
      setContent(content)
    })

    socket.on('text-change', ({ content }) => {
      setContent(content)
    })

    socket.on('user-count', (count) => {
      setUserCount(count)
    })

    return () => {
      socket.disconnect()
    }
  }, [docId])

  const handleChange = (e) => {
    const value = e.target.value
    setContent(value)
    socketRef.current?.emit('text-change', { docId, content: value })
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-4 py-2 border-b bg-white sticky top-0 shadow-sm">
        <span data-testid="doc-id" className="font-semibold text-gray-700">
          {docId}
        </span>
        <div className="flex items-center gap-3">
          <span data-testid="connection-counter" className="text-sm text-gray-600">
            {userCount} connected
          </span>
          <span
            data-testid="connection-status"
            className={`text-xs px-2 py-1 rounded-full ${
              status === 'connected'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {status}
          </span>
        </div>
      </header>
      <textarea
        data-testid="doc-editor"
        className="flex-1 w-full p-4 text-base font-mono resize-none outline-none"
        value={content}
        onChange={handleChange}
        placeholder="Start typing..."
      />
    </div>
  )
}
