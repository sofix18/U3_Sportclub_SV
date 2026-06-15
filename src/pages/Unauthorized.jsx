import { Link } from 'react-router-dom'

export default function Unauthorized() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc', fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{
        background: 'white', borderRadius: '16px', padding: '48px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚫</div>
        <h2 style={{ color: '#dc2626', marginBottom: '8px' }}>Acceso no autorizado</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>No tienes permisos para acceder a esta sección.</p>
        <Link to="/login" style={{
          background: '#7c3aed', color: 'white', padding: '12px 24px',
          borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold'
        }}>Volver al login</Link>
      </div>
    </div>
  )
}
