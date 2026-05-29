import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../services/authService'
import logo from '../assets/logo.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Mostrar mensaje de registro exitoso
  useState(() => {
    const msg = sessionStorage.getItem('registerSuccess')
    if (msg) { setSuccess(msg); sessionStorage.removeItem('registerSuccess') }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Por favor completa todos los campos.'); return }

    setLoading(true)
    try {
      const user = await loginUser(email, password)
      sessionStorage.setItem('loginSuccess', `¡Bienvenido, ${user.full_name}!`)
      const routes = { admin: '/admin/dashboard', coach: '/coach/dashboard', user: '/user/dashboard' }
      navigate(routes[user.role] || '/user/dashboard')
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <img src={logo} alt="SportClub" style={styles.logo} />
        <h2 style={styles.title}>Iniciar Sesión</h2>

        {success && <div style={styles.successBox}>{success}</div>}
        {error   && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
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
          <div style={styles.group}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
            />
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div style={styles.footer}>
          <Link to="/recover" style={styles.link}>¿Olvidaste tu contraseña?</Link>
          <span style={styles.sep}>|</span>
          <Link to="/register" style={styles.link}>Registrarse</Link>
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
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)', textAlign: 'center'
  },
  logo: { width: '200px', marginBottom: '1.5rem', mixBlendMode: 'luminosity' },
  title: { color: 'white', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' },
  group: { marginBottom: '1.2rem', textAlign: 'left' },
  label: { display: 'block', color: 'white', marginBottom: '8px', fontSize: '0.9rem' },
  input: {
    width: '100%', padding: '12px', borderRadius: '12px', outline: 'none',
    border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.15)',
    color: 'white', fontSize: '0.95rem', boxSizing: 'border-box'
  },
  btn: {
    width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
    background: 'white', color: '#302b63', fontWeight: 'bold', fontSize: '1rem',
    cursor: 'pointer', marginTop: '10px', transition: '0.3s'
  },
  footer: { marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '10px', fontSize: '0.85rem' },
  link: { color: '#bc4be3', textDecoration: 'none' },
  sep: { color: 'rgba(255,255,255,0.3)' },
  successBox: {
    background: 'rgba(0,230,118,0.15)', border: '1px solid #00e676',
    borderRadius: '8px', padding: '10px', color: '#00e676', marginBottom: '15px', fontSize: '0.9rem'
  },
  errorBox: {
    background: 'rgba(220,53,69,0.15)', border: '1px solid #dc3545',
    borderRadius: '8px', padding: '10px', color: '#ff6b7a', marginBottom: '15px', fontSize: '0.9rem'
  }
}
