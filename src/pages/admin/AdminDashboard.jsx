import { useState, useEffect } from 'react'
import { getUsers, createUser, updateUser, deleteUser } from '../../services/authService'

const C = { primary: '#7c3aed', light: '#ede9fe', dark: '#4c1d95', accent: '#a78bfa' }

export default function AdminDashboard() {
  const [users, setUsers]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [toast, setToast]         = useState(null)
  const [modalNew, setModalNew]   = useState(false)
  const [modalEdit, setModalEdit] = useState(null)
  const [modalDel, setModalDel]   = useState(null)
  const [form, setForm]           = useState({ full_name: '', email: '', password: '', role: 'user' })
  const [saving, setSaving]       = useState(false)

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    setLoading(true)
    try { setUsers(await getUsers()) } catch (e) { notify(e.message, 'error') }
    finally { setLoading(false) }
  }

  function notify(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleCreate(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await createUser(form)
      setModalNew(false)
      setForm({ full_name: '', email: '', password: '', role: 'user' })
      notify('Usuario creado correctamente.')
      loadUsers()
    } catch (err) { notify(err.message, 'error') }
    finally { setSaving(false) }
  }

  async function handleEdit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await updateUser(modalEdit.id, { full_name: modalEdit.full_name, email: modalEdit.email, role: modalEdit.role })
      setModalEdit(null)
      notify('Usuario actualizado.')
      loadUsers()
    } catch (err) { notify(err.message, 'error') }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    try {
      await deleteUser(modalDel)
      setModalDel(null)
      notify('Usuario eliminado.')
      loadUsers()
    } catch (err) { notify(err.message, 'error') }
  }

  const totalAdmins  = users.filter(u => u.role === 'admin').length
  const totalCoaches = users.filter(u => u.role === 'coach').length
  const totalUsers   = users.filter(u => u.role === 'user').length

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: `1.5px solid ${C.accent}`,
    background: C.light, color: '#1e1b4b', fontSize: '14px',
    boxSizing: 'border-box', marginBottom: '12px',
    outline: 'none'
  }

  return (
    <div style={{ padding: '28px', fontFamily: "'Segoe UI', sans-serif" }}>
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
          background: toast.type === 'success' ? '#7c3aed' : '#dc2626',
          color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 9999,
          fontWeight: 600, boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      {/* Bienvenida */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: '#1e1b4b', margin: 0, fontSize: '1.6rem', fontWeight: '700' }}>¡Hola, Administrador!</h1>
        <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '0.95rem' }}>Bienvenido de nuevo al panel de control central.</p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Usuarios', value: totalUsers,   icon: '👤', color: '#2563eb', bg: '#dbeafe' },
          { label: 'Total Coaches',  value: totalCoaches, icon: '🏋️', color: '#dc2626', bg: '#fee2e2' },
          { label: 'Administradores',value: totalAdmins,  icon: '🛡️', color: '#7c3aed', bg: '#ede9fe' },
          { label: 'Total Miembros', value: users.length, icon: '👥', color: '#059669', bg: '#d1fae5' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'white', borderRadius: '14px', padding: '20px',
            boxShadow: '0 4px 15px rgba(124,58,237,0.08)',
            borderTop: `4px solid ${s.color}`
          }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: s.color }}>{loading ? '…' : s.value}</div>
            <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '4px', fontWeight: '500' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <h2 style={{ color: C.primary, marginBottom: '14px', fontSize: '1.1rem' }}>👥 Gestión de Usuarios</h2>

      <button onClick={() => setModalNew(true)} style={{
        background: C.primary, color: 'white', border: 'none', padding: '10px 20px',
        borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px',
        fontSize: '0.95rem'
      }}>+ Nuevo Usuario</button>

      {loading ? (
        <p style={{ color: C.primary }}>Cargando usuarios...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(124,58,237,0.1)' }}>
            <thead>
              <tr style={{ background: C.primary, color: 'white' }}>
                {['ID','Nombre','Correo','Rol','Acción'].map(h => (
                  <th key={h} style={{ padding: '14px', textAlign: 'left', fontWeight: '600' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} style={{  borderBottom: `1px solid ${C.light}` }}>
                  <td style={{ padding: '12px' }}>{u.id}</td>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{u.full_name}</td>
                  <td style={{ padding: '12px', color: '#6b7280' }}>{u.email}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      background: u.role === 'admin' ? C.primary : u.role === 'coach' ? '#dc2626' : '#2563eb',
                      color: 'white', padding: '4px 12px', display: 'inline-block', minWidth: '60px', textAlign: 'center', borderRadius: '20px', fontSize: '12px', fontWeight: '600'
                    }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => setModalEdit({ ...u })} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '6px', fontSize: '13px' }}>Editar</button>
                    <button onClick={() => setModalDel(u.id)} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Nuevo */}
      {modalNew && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ color: C.primary, marginBottom: '20px', fontSize: '1.2rem' }}>Nuevo Usuario</h3>
            <form onSubmit={handleCreate}>
              <label style={labelStyle}>Nombre completo</label>
              <input placeholder="Ej: Tu nombre" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} style={inputStyle} required />
              <label style={labelStyle}>Correo electrónico</label>
              <input placeholder="correo@ejemplo.com" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inputStyle} required />
              <label style={labelStyle}>Contraseña (mín. 8 caracteres)</label>
              <input placeholder="••••••••" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={inputStyle} required />
              <label style={labelStyle}>Rol</label>
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} style={inputStyle}>
                <option value="user">Usuario</option>
                <option value="coach">Coach</option>
                <option value="admin">Administrador</option>
              </select>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button type="submit" disabled={saving} style={{ flex: 1, background: C.primary, color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{saving ? 'Guardando...' : 'Guardar'}</button>
                <button type="button" onClick={() => setModalNew(false)} style={{ flex: 1, background: '#e5e7eb', color: '#374151', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {modalEdit && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ color: C.primary, marginBottom: '20px', fontSize: '1.2rem' }}>Editar Usuario</h3>
            <form onSubmit={handleEdit}>
              <label style={labelStyle}>Nombre completo</label>
              <input placeholder="Ej: Tu nombre" value={modalEdit.full_name} onChange={e => setModalEdit({...modalEdit, full_name: e.target.value})} style={inputStyle} required />
              <label style={labelStyle}>Correo electrónico</label>
              <input type="email" value={modalEdit.email} onChange={e => setModalEdit({...modalEdit, email: e.target.value})} style={inputStyle} required />
              <label style={labelStyle}>Rol</label>
              <select value={modalEdit.role} onChange={e => setModalEdit({...modalEdit, role: e.target.value})} style={inputStyle}>
                <option value="user">Usuario</option>
                <option value="coach">Coach</option>
                <option value="admin">Administrador</option>
              </select>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button type="submit" disabled={saving} style={{ flex: 1, background: C.primary, color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{saving ? 'Guardando...' : 'Guardar'}</button>
                <button type="button" onClick={() => setModalEdit(null)} style={{ flex: 1, background: '#e5e7eb', color: '#374151', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {modalDel && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, textAlign: 'center', maxWidth: '320px' }}>
            <div style={{ fontSize: '50px', marginBottom: '10px' }}>⚠️</div>
            <h3 style={{ color: '#dc2626', marginBottom: '10px' }}>¿Eliminar usuario?</h3>
            <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '14px' }}>Esta acción no se puede deshacer.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleDelete} style={{ flex: 1, background: '#dc2626', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Sí, borrar</button>
              <button onClick={() => setModalDel(null)} style={{ flex: 1, background: '#e5e7eb', color: '#374151', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
}
const modalStyle = {
  background: 'white', padding: '30px', borderRadius: '16px',
  width: '100%', maxWidth: '420px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
}
const labelStyle = {
  display: 'block', fontSize: '13px', fontWeight: '600',
  color: '#4c1d95', marginBottom: '4px'
}
