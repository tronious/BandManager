import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout/AppLayout.jsx'
import { AdminPage } from './pages/AdminPage/AdminPage.jsx'
import { BookingsPage } from './pages/BookingsPage/BookingsPage.jsx'
import { EventsPage } from './pages/EventsPage/EventsPage.jsx'
import { PicsPage } from './pages/PicsPage/PicsPage.jsx'
import { SetlistPage } from './pages/SetlistPage/SetlistPage.jsx'
import { VideosPage } from './pages/VideosPage/VideosPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/events" replace />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/book" element={<BookingsPage />} />
        <Route path="/setlist" element={<SetlistPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/pics" element={<PicsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/events" replace />} />
    </Routes>
  )
}
