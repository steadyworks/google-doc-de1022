import { Routes, Route, Navigate } from 'react-router-dom'
import DocEditor from './DocEditor'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/doc/default" replace />} />
      <Route path="/doc/:id" element={<DocEditor />} />
    </Routes>
  )
}
