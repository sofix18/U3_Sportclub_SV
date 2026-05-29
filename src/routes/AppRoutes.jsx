import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getToken, getUser } from '../services/authService'

import Login    from '../pages/Login'
import Register from '../pages/Register'
import Recover  from '../pages/Recover'
import Perfil   from '../pages/Perfil'

import { AdminLayout, CoachLayout, UserLayout } from '../layouts/Layouts'
import AdminDashboard from '../pages/admin/AdminDashboard'
import CoachDashboard from '../pages/coach/CoachDashboard'
import UserDashboard  from '../pages/user/UserDashboard'

// Protección de ruta
function PrivateRoute({ children, allowedRole }) {
  const token = getToken()
  const user  = getUser()
  if (!token || !user) return <Navigate to="/login" />
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/login" />
  return children
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/"         element={<Navigate to="/login" />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recover"  element={<Recover />} />

        {/* Admin */}
        <Route path="/admin" element={<PrivateRoute allowedRole="admin"><AdminLayout /></PrivateRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="perfil"    element={<Perfil />} />
        </Route>

        {/* Coach */}
        <Route path="/coach" element={<PrivateRoute allowedRole="coach"><CoachLayout /></PrivateRoute>}>
          <Route path="dashboard" element={<CoachDashboard />} />
          <Route path="perfil"    element={<Perfil />} />
        </Route>

        {/* User */}
        <Route path="/user" element={<PrivateRoute allowedRole="user"><UserLayout /></PrivateRoute>}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="perfil"    element={<Perfil />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}
