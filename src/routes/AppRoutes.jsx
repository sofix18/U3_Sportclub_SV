import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getToken, getUser, isAuthenticated } from '../services/authService'

import Login        from '../pages/Login'
import Register     from '../pages/Register'
import Recover      from '../pages/Recover'
import Perfil       from '../pages/Perfil'
import Unauthorized from '../pages/Unauthorized'

import { AdminLayout, CoachLayout, UserLayout } from '../layouts/Layouts'
import AdminDashboard from '../pages/admin/AdminDashboard'
import UsersPage      from '../pages/admin/UsersPage'
import CoachDashboard from '../pages/coach/CoachDashboard'
import UserDashboard  from '../pages/user/UserDashboard'

import SportsPage from '../pages/sportspage'

// Protege por autenticación
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />
  return children
}

// Protege por rol
function RoleRoute({ children, allowedRoles }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />
  const user = getUser()
  if (!user || !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />
  return children
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/"             element={<Navigate to="/login" />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/register"     element={<Register />} />
        <Route path="/recover"      element={<Recover />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin */}
        <Route path="/admin" element={<RoleRoute allowedRoles={['admin']}><AdminLayout /></RoleRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users"     element={<UsersPage />} />
          <Route path="sports"    element={<SportsPage />} />
          <Route path="perfil"    element={<Perfil />} />
        </Route>

        {/* Coach */}
        <Route path="/coach" element={<RoleRoute allowedRoles={['coach']}><CoachLayout /></RoleRoute>}>
          <Route path="dashboard" element={<CoachDashboard />} />
          <Route path="perfil"    element={<Perfil />} />
        </Route>

        {/* User */}
        <Route path="/user" element={<RoleRoute allowedRoles={['user']}><UserLayout /></RoleRoute>}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="perfil"    element={<Perfil />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}