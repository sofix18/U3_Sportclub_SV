import { useEffect, useState } from 'react'
import { getUser } from '../../services/authService'

const C = { primary: '#dc2626', light: '#fee2e2', dark: '#7f1d1d', accent: '#f87171' }

const CLASES = [
  { id: 1, nombre: 'Spinning Matutino', horario: 'Lun/Mié/Vie 07:00', alumnos: 12, sala: 'A1', cupos: 20 },
  { id: 2, nombre: 'Yoga Avanzado',     horario: 'Mar/Jue 09:00',      alumnos: 8,  sala: 'B2', cupos: 15 },
  { id: 3, nombre: 'CrossFit Extremo',  horario: 'Lun/Mié/Vie 18:00', alumnos: 15, sala: 'C3', cupos: 20 },
]

const ALUMNOS_HOY = [
  { nombre: 'Leon Alvarez',   edad: 31, asistencia: true  },
  { nombre: 'Lukas Espinosa', edad: 29, asistencia: true  },
  { nombre: 'Kiara Espinosa', edad: 33, asistencia: false },
  { nombre: 'Matias Rojas',   edad: 25, asistencia: true  },
  { nombre: 'Javiera Ruiz',   edad: 27, asistencia: false },
]

export default function CoachDashboard() {
  const [user, setUser]           = useState(null)
  const [loginMsg, setLoginMsg]   = useState('')
  const [asistencia, setAsistencia] = useState(
    Object.fromEntries(ALUMNOS_HOY.map((a, i) => [i, a.asistencia]))
  )
  const [claseActiva, setClaseActiva] = useState(0)

  useEffect(() => {
    setUser(getUser())
    const msg = sessionStorage.getItem('loginSuccess')
    if (msg) { setLoginMsg(msg); sessionStorage.removeItem('loginSuccess') }
    setTimeout(() => setLoginMsg(''), 4000)
  }, [])

  const totalAlumnos   = CLASES.reduce((s, c) => s + c.alumnos, 0)
  const presentes      = Object.values(asistencia).filter(Boolean).length
  const proximaClase   = CLASES[claseActiva]

  const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  const hoy = new Date()
  const fechaHoy = `${dias[hoy.getDay()]} ${hoy.getDate()} de ${meses[hoy.getMonth()]}`

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
          Panel del Entrenador
        </h1>
        <p style={{ color: '#6b7280', marginTop: '4px' }}>
          Hoy es <strong>{fechaHoy}</strong>. Bienvenido, {user?.full_name?.split(' ')[0] || 'Coach'}.
        </p>
      </div>

      {/* Clases de hoy */}
      <div style={{ background: 'white', borderRadius: '14px', padding: '20px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(220,38,38,0.08)' }}>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '12px' }}>🗓️ Clases programadas para hoy:</p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['08:00 - Spinning', '10:00 - Yoga', '18:00 - CrossFit'].map((c, i) => (
            <button key={i} onClick={() => setClaseActiva(i)} style={{
              padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
              background: claseActiva === i ? C.primary : 'white',
              color: claseActiva === i ? 'white' : C.primary,
              border: `2px solid ${C.primary}`, transition: '0.2s'
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Tarjetas stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Mis Clases',      value: CLASES.length,  icon: '📋', color: '#dc2626' },
          { label: 'Total Alumnos',   value: totalAlumnos,   icon: '👥', color: '#7c3aed' },
          { label: 'Clases Hoy',      value: 3,              icon: '📅', color: '#2563eb' },
          { label: 'Presentes Hoy',   value: `${presentes}/${ALUMNOS_HOY.length}`, icon: '✅', color: '#059669' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'white', borderRadius: '14px', padding: '20px',
            boxShadow: '0 4px 15px rgba(220,38,38,0.08)', borderTop: `4px solid ${s.color}`
          }}>
            <div style={{ fontSize: '26px', marginBottom: '6px' }}>{s.icon}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: s.color }}>{s.value}</div>
            <div style={{ color: '#6b7280', fontSize: '0.82rem', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Lista de alumnos + asistencia */}
      <div style={{ background: 'white', borderRadius: '14px', padding: '24px', marginBottom: '28px', boxShadow: '0 4px 12px rgba(220,38,38,0.08)' }}>
        <h2 style={{ color: '#1f2937', marginBottom: '4px', fontSize: '1.1rem' }}>
          Lista de Alumnos — {['08:00','10:00','18:00'][claseActiva]} hrs
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '16px' }}>Marca la asistencia de cada alumno</p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: C.primary, color: 'white' }}>
              {['Alumno','Edad','Asistencia'].map(h => (
                <th key={h} style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALUMNOS_HOY.map((a, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #fee2e2' }}>
                <td style={{ padding: '12px', fontWeight: '600', color: '#1f2937' }}>{a.nombre}</td>
                <td style={{ padding: '12px', color: '#6b7280' }}>{a.edad} años</td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => setAsistencia(prev => ({ ...prev, [i]: !prev[i] }))} style={{
                    padding: '5px 16px', borderRadius: '20px', border: `2px solid ${asistencia[i] ? '#16a34a' : '#dc2626'}`,
                    background: asistencia[i] ? '#dcfce7' : '#fee2e2',
                    color: asistencia[i] ? '#16a34a' : '#dc2626',
                    fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem'
                  }}>
                    {asistencia[i] ? 'Presente' : 'Ausente'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mis clases */}
      <h2 style={{ color: C.primary, marginBottom: '16px', fontSize: '1.1rem' }}>📋 Mis Clases</h2>
      <div style={{ display: 'grid', gap: '14px' }}>
        {CLASES.map(c => (
          <div key={c.id} style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            boxShadow: '0 4px 12px rgba(220,38,38,0.08)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderLeft: `4px solid ${C.primary}`
          }}>
            <div>
              <h3 style={{ color: '#1f2937', margin: 0, fontSize: '1rem' }}>{c.nombre}</h3>
              <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: '4px 0 0' }}>🕐 {c.horario} · 📍 Sala {c.sala}</p>
            </div>
            <div style={{ textAlign: 'center', minWidth: '80px' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: C.primary }}>{c.alumnos}/{c.cupos}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>alumnos</div>
              <div style={{
                marginTop: '4px', height: '6px', borderRadius: '3px', background: '#fee2e2',
                overflow: 'hidden'
              }}>
                <div style={{ width: `${(c.alumnos/c.cupos)*100}%`, height: '100%', background: C.primary, borderRadius: '3px' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
