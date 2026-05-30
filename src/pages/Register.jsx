import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/authService'
import logo from '../assets/logo.png'

export default function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function validate() {
    const e = {}
    if (!form.full_name || form.full_name.length < 3) e.full_name = 'Mínimo 3 caracteres.'
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo inválido.'
    if (!form.password || form.password.length < 8) e.password = 'Mínimo 8 caracteres.'
    if (form.password !== form.confirm) e.confirm = 'Las contraseñas no coinciden.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    const clientErrors = validate()
    if (Object.keys(clientErrors).length > 0) { setErrors(clientErrors); return }
    setErrors({})
    setLoading(true)
    try {
      await registerUser(form.full_name, form.email, form.password)
      sessionStorage.setItem('registerSuccess', '¡Cuenta creada! Ahora inicia sesión.')
      navigate('/login')
    } catch (err) {
      setServerError(err.message || 'Error al registrar.')
    } finally {
      setLoading(false)
    }
  }

  const set = field => e => setForm({ ...form, [field]: e.target.value })

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <Link to="/login" style={styles.back}>← Volver al login</Link>
        <img src={logo} alt="SportClub" style={styles.logo} />
        <h2 style={styles.title}>Registrarse</h2>

        {serverError && <div style={styles.errorBox}>{serverError}</div>}

        <form onSubmit={handleSubmit}>
          {[
            { field: 'full_name', label: 'Nombre Completo', type: 'text', placeholder: 'Tu nombre' },
            { field: 'email',     label: 'Correo',          type: 'email', placeholder: 'correo@ejemplo.com' },
            { field: 'password',  label: 'Contraseña',      type: 'password', placeholder: '••••••••' },
            { field: 'confirm',   label: 'Confirmar Contraseña', type: 'password', placeholder: '••••••••' },
          ].map(({ field, label, type, placeholder }) => (
            <div key={field} style={styles.group}>
              <label style={styles.label}>{label}</label>
              <input
                type={type}
                value={form[field]}
                onChange={set(field)}
                placeholder={placeholder}
                style={{ ...styles.input, ...(errors[field] ? styles.inputError : {}) }}
              />
              {errors[field] && <span style={styles.fieldErr}>{errors[field]}</span>}
            </div>
          ))}
          <div style={{ marginBottom: '16px' }}>
  <label style={styles.label}>Nivel físico</label>
  <div style={{ display: 'flex', gap: '8px' }}>
    {['principiante', 'medio', 'avanzado'].map(n => (
      <button key={n} type="button"
        onClick={() => setForm({...form, nivel: n})}
        style={{
          flex: 1, padding: '10px', borderRadius: '12px', cursor: 'pointer',
          border: '1px solid rgba(255,255,255,0.3)',
          background: form.nivel === n ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)',
          color: 'white', fontWeight: form.nivel === n ? 'bold' : 'normal',
          fontSize: '0.85rem', textTransform: 'capitalize'
        }}
      >{n}</button>
    ))}
  </div>
</div>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>
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
  title: { color: 'white', textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.4rem', fontWeight: 'bold' },
  group: { marginBottom: '1rem' },
  label: { display: 'block', color: 'white', marginBottom: '6px', fontSize: '0.9rem' },
  input: {
    width: '100%', padding: '12px', borderRadius: '12px', outline: 'none',
    border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.15)',
    color: 'white', fontSize: '0.95rem', boxSizing: 'border-box'
  },
  inputError: { borderColor: '#ff6b7a' },
  fieldErr: { color: '#ff6b7a', fontSize: '12px', display: 'block', marginTop: '4px' },
  btn: {
    width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
    background: 'white', color: '#302b63', fontWeight: 'bold', fontSize: '1rem',
    cursor: 'pointer', marginTop: '10px'
  },
  errorBox: {
    background: 'rgba(220,53,69,0.15)', border: '1px solid #dc3545',
    borderRadius: '8px', padding: '10px', color: '#ff6b7a', marginBottom: '15px', fontSize: '0.9rem'
  }
}
