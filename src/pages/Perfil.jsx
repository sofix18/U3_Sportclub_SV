import { useState, useEffect, useRef } from 'react'
import { getMe, updateMe, updatePassword } from '../services/authService'
import { getAvatarGlobal, setAvatarGlobal } from '../services/avatarStore'

export default function Perfil() {
  const [user, setUser]         = useState(null)
  const [form, setForm]         = useState({ full_name: '', email: '', birth_date: '' })
  const [pass, setPass]         = useState({ current_password: '', new_password: '', confirm_password: '' })
  const [toast, setToast]       = useState(null)
  const [loading, setLoading]   = useState(true)
  const [avatar, setAvatar]     = useState(getAvatarGlobal())
  const [showMenu, setShowMenu] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)

  const fileInput = useRef()
  const videoRef  = useRef()
  const streamRef = useRef()

  const roleColors = { admin: '#7c3aed', coach: '#dc2626', user: '#2563eb' }
  const role  = user?.role || 'user'
  const color = roleColors[role] || '#2563eb'

  useEffect(() => {
    getMe().then(u => {
      setUser(u)
      setForm({ full_name: u.full_name || '', email: u.email || '', birth_date: u.birth_date || '' })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  function notify(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  function savePhoto(base64) {
    setAvatarGlobal(base64)
    setAvatar(base64)
    setShowMenu(false)
    notify('Foto actualizada.')
  }

  function removePhoto() {
    setAvatarGlobal(null)
    setAvatar(null)
    setShowMenu(false)
    notify('Foto eliminada.')
  }

  function handleImageChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const img = new Image()
  const url = URL.createObjectURL(file)
  img.onload = () => {
    const canvas = document.createElement('canvas')
    const max = 300
    const ratio = Math.min(max / img.width, max / img.height)
    canvas.width  = img.width  * ratio
    canvas.height = img.height * ratio
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
    savePhoto(canvas.toDataURL('image/jpeg', 0.7))
    URL.revokeObjectURL(url)
  }
  img.src = url
}

  async function openCamera() {
    setShowMenu(false)
    setCameraOpen(true)
    setTimeout(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
      } catch {
        notify('No se pudo acceder a la cámara.', 'error')
        setCameraOpen(false)
      }
    }, 100)
  }

  function closeCamera() {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    setCameraOpen(false)
  }

  function snapPhoto() {
    const canvas = document.createElement('canvas')
    canvas.width  = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    savePhoto(canvas.toDataURL('image/png'))
    closeCamera()
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.full_name || form.full_name.length < 3) { notify('Nombre mínimo 3 caracteres.', 'error'); return }
    try {
      const updated = await updateMe(form)
      setUser(updated)
      notify('Perfil actualizado correctamente.')
    } catch (err) { notify(err.message, 'error') }
  }

  async function handlePassword(e) {
    e.preventDefault()
    if (!pass.current_password) { notify('Ingresa tu contraseña actual.', 'error'); return }
    if (pass.new_password.length < 8) { notify('Nueva contraseña mínimo 8 caracteres.', 'error'); return }
    if (pass.new_password !== pass.confirm_password) { notify('Las contraseñas no coinciden.', 'error'); return }
    try {
      await updatePassword(pass.current_password, pass.new_password, pass.confirm_password)
      notify('Contraseña actualizada correctamente.')
      setPass({ current_password: '', new_password: '', confirm_password: '' })
    } catch (err) { notify(err.message, 'error') }
  }

  if (loading) return <div style={{ padding: '24px', color: '#6b7280' }}>Cargando perfil...</div>

  const inputStyle = {
    width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb',
    background: 'white', fontSize: '0.95rem', boxSizing: 'border-box', color: '#1f2937', outline: 'none'
  }

  const initials = form.full_name?.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() || '?'

  return (
    <div style={{ padding: '24px', fontFamily: "'Segoe UI', sans-serif", maxWidth: '600px', margin: '0 auto' }} onClick={() => setShowMenu(false)}>
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
          background: toast.type === 'success' ? color : '#dc2626',
          color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 9999,
          fontWeight: 600, boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div>
      )}

      <h2 style={{ color, marginBottom: '24px' }}>👤 Mi Perfil</h2>

      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
        <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
          <div onClick={() => setShowMenu(!showMenu)} style={{
            width: '90px', height: '90px', borderRadius: '50%',
            background: avatar ? 'transparent' : color,
            border: `3px solid ${color}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', fontSize: '1.8rem', fontWeight: 'bold', color: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            {avatar ? <img src={avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
          </div>
          <div onClick={() => setShowMenu(!showMenu)} style={{
            position: 'absolute', bottom: 0, right: 0,
            background: color, borderRadius: '50%', width: '26px', height: '26px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '13px', border: '2px solid white'
          }}>📷</div>

          {showMenu && (
            <div style={{
              position: 'absolute', top: '100px', left: 0, zIndex: 100,
              background: 'white', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              padding: '8px', minWidth: '180px', border: '1px solid #e5e7eb'
            }}>
              <button onClick={() => fileInput.current.click()} style={menuBtn}>🖼️ Elegir de galería</button>
              <button onClick={openCamera} style={menuBtn}>📸 Tomar foto</button>
              {avatar && (
                <button onClick={removePhoto} style={{ ...menuBtn, color: '#dc2626' }}>🗑️ Eliminar foto</button>
              )}
            </div>
          )}
        </div>
        <div>
          <p style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1f2937', margin: 0 }}>{form.full_name}</p>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '4px 0 4px' }}>{form.email}</p>
          <span style={{ background: color, color: 'white', fontSize: '11px', padding: '2px 10px', borderRadius: '20px', fontWeight: '600' }}>{role}</span>
        </div>
      </div>

      <input ref={fileInput} type="file" accept="image/*" onChange={handleImageChange} onClick={e => e.target.value = null} style={{ display: 'none' }} />

      {/* Modal cámara */}
      {cameraOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.85)', zIndex: 3000,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px'
        }}>
          <video ref={videoRef} autoPlay style={{ borderRadius: '12px', maxWidth: '90%', maxHeight: '60vh', border: '3px solid white' }} />
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={snapPhoto} style={{ background: color, color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>📸 Capturar</button>
            <button onClick={closeCamera} style={{ background: '#4b5563', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>✕ Cerrar</button>
          </div>
        </div>
      )}

      {/* Información personal */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', borderTop: `4px solid ${color}` }}>
        <h3 style={{ color: '#1f2937', marginBottom: '20px' }}>Información Personal</h3>
        <form onSubmit={handleSave}>
          {[
            { key: 'full_name',  label: 'Nombre Completo',    type: 'text' },
            { key: 'email',      label: 'Correo Electrónico', type: 'email' },
            { key: 'birth_date', label: 'Fecha de Nacimiento',type: 'date' },
          ].map(({ key, label, type }) => (
            <div key={key} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#374151', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500' }}>{label}</label>
              <input type={type} value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} style={inputStyle} />
            </div>
          ))}
          <button type="submit" style={{ background: color, color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }}>
            Guardar cambios
          </button>
        </form>
      </div>

      {/* Cambiar contraseña */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', borderTop: `4px solid ${color}` }}>
        <h3 style={{ color: '#1f2937', marginBottom: '20px' }}>Cambiar Contraseña</h3>
        <form onSubmit={handlePassword}>
          {[
            { field: 'current_password', label: 'Contraseña Actual' },
            { field: 'new_password',     label: 'Nueva Contraseña' },
            { field: 'confirm_password', label: 'Confirmar Nueva Contraseña' },
          ].map(({ field, label }) => (
            <div key={field} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#374151', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500' }}>{label}</label>
              <input type="password" value={pass[field]} onChange={e => setPass({...pass, [field]: e.target.value})} placeholder="••••••••" style={inputStyle} />
            </div>
          ))}
          <button type="submit" style={{ background: '#4b5563', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }}>
            Cambiar contraseña
          </button>
        </form>
      </div>
    </div>
  )
}

const menuBtn = {
  display: 'block', width: '100%', padding: '10px 14px', background: 'transparent',
  border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
  textAlign: 'left', color: '#374151', fontWeight: '500'
}
