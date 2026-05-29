import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Recover() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setSent(true)
  }

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <Link to="/login" style={styles.back}>← Volver al login</Link>
        <img src={logo} alt="SportClub" style={styles.logo} />
        <h2 style={styles.title}>Recuperar Contraseña</h2>

        {sent ? (
          <div style={styles.successBox}>
            ✅ Si el correo existe, recibirás las instrucciones pronto.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={styles.desc}>Ingresa tu correo y te enviaremos instrucciones para restablecer tu contraseña.</p>
            <div style={styles.group}>
              <label style={styles.label}>Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.btn}>Enviar instrucciones</button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/login" style={styles.link}>Volver al inicio de sesión</Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  bg: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    padding: '20px', fontFamily: "'Segoe UI', sans-serif"
  },
  card: {
    background: 'rgba(138,43,226,0.12)', backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: '30px',
    padding: '2.5rem', width: '100%', maxWidth: '420px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
  },
  back: { color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem', display: 'block', marginBottom: '1rem' },
  logo: { width: '180px', display: 'block', margin: '0 auto 1.2rem' },
  title: { color: 'white', textAlign: 'center', marginBottom: '1rem', fontSize: '1.4rem', fontWeight: 'bold' },
  desc: { color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center' },
  group: { marginBottom: '1.2rem' },
  label: { display: 'block', color: 'white', marginBottom: '8px', fontSize: '0.9rem' },
  input: {
    width: '100%', padding: '12px', borderRadius: '12px', outline: 'none',
    border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.15)',
    color: 'white', fontSize: '0.95rem', boxSizing: 'border-box'
  },
  btn: {
    width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
    background: 'white', color: '#302b63', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer'
  },
  link: { color: '#bc4be3', textDecoration: 'none', fontSize: '0.9rem' },
  successBox: {
    background: 'rgba(0,230,118,0.15)', border: '1px solid #00e676',
    borderRadius: '8px', padding: '15px', color: '#00e676', fontSize: '0.95rem', textAlign: 'center'
  }
}
