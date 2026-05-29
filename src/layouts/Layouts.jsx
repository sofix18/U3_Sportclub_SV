import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { clearSession, getUser } from '../services/authService'
import { getAvatarGlobal, subscribeAvatar } from '../services/avatarStore'
import logo from '../assets/logo.png'

function Layout({ menuItems, role }) {
  const navigate = useNavigate()
  const user = getUser()
  const [avatar, setAvatar] = useState(getAvatarGlobal())

  useEffect(() => {
    const unsub = subscribeAvatar(val => setAvatar(val))
    return unsub
  }, [])

  function handleLogout() {
    clearSession()
    navigate('/login')
  }

  const colors = {
    admin: { primary: '#7c3aed' },
    coach: { primary: '#dc2626' },
    user:  { primary: '#2563eb' },
  }
  const c = colors[role]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
      <aside style={{ width: '240px', background: c.primary, color: 'white', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          <img src={logo} alt="SportClub" style={{ width: '140px' }} />
          <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{role}</p>
        </div>
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {menuItems.map(item => (
            item.onClick
              ? (
                <button key={item.label} onClick={item.onClick} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 20px', color: 'white', background: 'transparent',
                  border: 'none', borderLeft: '3px solid transparent',
                  fontSize: '0.95rem', cursor: 'pointer', width: '100%', textAlign: 'left'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderLeftColor = 'white' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderLeftColor = 'transparent' }}
                >
                  <span>{item.icon}</span> {item.label}
                </button>
              )
              : (
                <Link key={item.to} to={item.to} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 20px', color: 'white', textDecoration: 'none',
                  fontSize: '0.95rem', borderLeft: '3px solid transparent'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderLeftColor = 'white' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderLeftColor = 'transparent' }}
                >
                  <span>{item.icon}</span> {item.label}
                </Link>
              )
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <p style={{ fontSize: '13px', opacity: 0.8, marginBottom: '8px' }}>{user?.full_name}</p>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '10px', background: 'rgba(255,255,255,0.15)',
            color: 'white', border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600'
          }}>Cerrar Sesión</button>
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
        <header style={{
          background: c.primary, padding: '16px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>
            SportClub <span style={{ opacity: 0.85, textTransform: 'capitalize' }}>{role}</span>
          </h2>
          <Link to={`/${role}/perfil`} style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {avatar
              ? <img src={avatar} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }} />
              : <span style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>👤</span>
            }
            Mi Perfil
          </Link>
          <button onClick={handleLogout} style={{
            background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600'
          }}>Cerrar Sesión</button>
        </header>
        <main style={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function AdminLayout() {
  return <Layout role="admin" menuItems={[
    { to: '/admin/dashboard', icon: '🏠', label: 'Gestión Usuarios' },
    { icon: '📊', label: 'Reportes', onClick: () => alert('Módulo de Reportes — próximamente') },
    { icon: '🏢', label: 'Sedes',    onClick: () => alert('Módulo de Sedes — próximamente') },
    { icon: '⚙️', label: 'Ajustes', onClick: () => alert('Módulo de Ajustes — próximamente') },
    { to: '/admin/perfil', icon: '👤', label: 'Mi Perfil' },
  ]} />
}

export function UserLayout() {
  return <Layout role="user" menuItems={[
    { to: '/user/dashboard', icon: '🏠', label: 'Mi Resumen' },
    { icon: '📅', label: 'Reservar Clase',   onClick: () => alert('Módulo Reservar Clase — próximamente') },
    { icon: '📊', label: 'Mis Avances',      onClick: () => alert('Módulo Mis Avances — próximamente') },
    { icon: '💳', label: 'Pagos y Membresía',onClick: () => alert('Módulo Pagos — próximamente') },
    { to: '/user/perfil', icon: '👤', label: 'Mi Perfil' },
  ]} />
}

export function CoachLayout() {
  return <Layout role="coach" menuItems={[
    { to: '/coach/dashboard', icon: '🏠', label: 'Panel Principal' },
    { icon: '👥', label: 'Mis Alumnos',       onClick: () => alert('Módulo Mis Alumnos — próximamente') },
    { icon: '🗓️', label: 'Horarios de Clases', onClick: () => alert('Módulo Horarios — próximamente') },
    { icon: '📊', label: 'Reportes de Avance', onClick: () => alert('Módulo Reportes — próximamente') },
    { icon: '⚙️', label: 'Configuración',      onClick: () => alert('Módulo Configuración — próximamente') },
    { to: '/coach/perfil', icon: '👤', label: 'Mi Perfil' },
  ]} />
}
