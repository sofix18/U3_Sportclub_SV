import { useEffect, useState } from 'react'
import { getUser } from '../../services/authService'

const C = { primary: '#2563eb', light: '#dbeafe', dark: '#1e3a8a', accent: '#60a5fa' }

const RESERVAS = [
  { id: 1, actividad: 'Spinning',  hora: 'Hoy - 18:00 hrs',    coach: 'Cristian', activa: true  },
  { id: 2, actividad: 'Yoga',      hora: 'Mié - 09:00 hrs',    coach: 'Ana García', activa: true  },
  { id: 3, actividad: 'CrossFit',  hora: 'Vie - 18:00 hrs',    coach: 'Pedro Silva', activa: true  },
]

export default function UserDashboard() {
  const [user, setUser]         = useState(null)
  const [loginMsg, setLoginMsg] = useState('')
  const [reservas, setReservas] = useState(RESERVAS)

  useEffect(() => {
    setUser(getUser())
    const msg = sessionStorage.getItem('loginSuccess')
    if (msg) { setLoginMsg(msg); sessionStorage.removeItem('loginSuccess') }
    setTimeout(() => setLoginMsg(''), 4000)
  }, [])

  function cancelarReserva(id) {
    setReservas(prev => prev.filter(r => r.id !== id))
  }

  const proximaClase = reservas[0]

  return (
    <div style={{ padding: '28px', fontFamily: "'Segoe UI', sans-serif" }}>
      {loginMsg && (
        <div style={{
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
          background: C.primary, color: 'white', padding: '12px 24px', borderRadius: '8px',
          zIndex: 9999, fontWeight: 600, boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}>✅ {loginMsg}</div>
      )}

      {/* Bienvenida */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: '#1e1b4b', fontSize: '1.6rem', fontWeight: '800', margin: 0 }}>
          ¡Hola, {user?.full_name || 'Usuario'}!
        </h1>
        {proximaClase && (
          <p style={{ color: '#6b7280', marginTop: '6px' }}>
            Tu próxima clase de <strong>{proximaClase.actividad}</strong> es {proximaClase.hora}.
          </p>
        )}
      </div>

      {/* Tarjetas membresía / pago / clases */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'MEMBRESÍA',       value: 'Plan Mensual', icon: '🏆', color: '#f59e0b' },
          { label: 'ESTADO DE PAGO',  value: 'Al Día',       icon: '💳', color: '#16a34a' },
          { label: 'CLASES ESTE MES', value: `${reservas.length * 4} / 20`, icon: '🔥', color: '#dc2626' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'white', borderRadius: '14px', padding: '20px',
            boxShadow: '0 4px 15px rgba(37,99,235,0.08)',
            display: 'flex', alignItems: 'center', gap: '16px',
            borderTop: `4px solid ${s.color}`
          }}>
            <span style={{ fontSize: '2rem' }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '700', letterSpacing: '0.5px' }}>{s.label}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: s.color }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Mis próximas reservas */}
      <div style={{ background: 'white', borderRadius: '14px', padding: '24px', marginBottom: '28px', boxShadow: '0 4px 12px rgba(37,99,235,0.08)' }}>
        <h2 style={{ color: '#1f2937', marginBottom: '16px', fontSize: '1.1rem' }}>📅 Mis Próximas Reservas</h2>
        {reservas.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>No tienes reservas activas.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: C.primary, color: 'white' }}>
                {['Actividad', 'Día y Hora', 'Entrenador', 'Gestión'].map(h => (
                  <th key={h} style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reservas.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #dbeafe', background: i % 2 === 0 ? 'white' : '#f8faff' }}>
                  <td style={{ padding: '12px', fontWeight: '600', color: '#1f2937' }}>{r.actividad}</td>
                  <td style={{ padding: '12px', color: '#6b7280' }}>{r.hora}</td>
                  <td style={{ padding: '12px', color: '#6b7280' }}>{r.coach}</td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => cancelarReserva(r.id)} style={{
                      padding: '5px 14px', borderRadius: '20px', cursor: 'pointer',
                      border: '2px solid #dc2626', background: 'white',
                      color: '#dc2626', fontWeight: '600', fontSize: '0.85rem'
                    }}>Cancelar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Clases disponibles */}
      <h2 style={{ color: C.primary, marginBottom: '16px', fontSize: '1.1rem' }}>🏃 Clases Disponibles</h2>
      <div style={{ display: 'grid', gap: '14px' }}>
        {[
          { id: 10, nombre: 'Spinning Matutino', coach: 'Carlos López',  horario: 'Lun/Mié/Vie 07:00', cupos: 3  },
          { id: 11, nombre: 'Yoga Relajante',    coach: 'Ana García',    horario: 'Mar/Jue 09:00',      cupos: 8  },
          { id: 12, nombre: 'Pilates Core',      coach: 'María Torres',  horario: 'Mié/Vie 11:00',      cupos: 5  },
          { id: 13, nombre: 'CrossFit Básico',   coach: 'Pedro Silva',   horario: 'Lun/Mié 18:00',      cupos: 2  },
        ].map(c => (
          <div key={c.id} style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            boxShadow: '0 4px 12px rgba(37,99,235,0.08)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderLeft: `4px solid ${C.primary}`
          }}>
            <div>
              <h3 style={{ color: '#1f2937', margin: 0, fontSize: '1rem' }}>{c.nombre}</h3>
              <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: '4px 0 0' }}>👤 {c.coach} · 🕐 {c.horario}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: c.cupos <= 3 ? '#dc2626' : '#16a34a', fontWeight: '600' }}>
                {c.cupos} cupos
              </span>
              <button style={{
                background: C.primary, color: 'white', border: 'none',
                padding: '8px 18px', borderRadius: '8px', cursor: 'pointer',
                fontSize: '13px', fontWeight: '600'
              }}>Reservar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
