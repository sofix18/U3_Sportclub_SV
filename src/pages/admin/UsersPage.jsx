import { useEffect, useState } from 'react'
import { Badge, Button, Card, Spinner, Table } from 'react-bootstrap'
import Swal from 'sweetalert2'
import UserFormModal from '../../components/users/UserFormModal'
import { createUser, deleteUser, getUsers, updateUser } from '../../services/authService'

export default function UsersPage() {
  const [users, setUsers]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const loadUsers = async () => {
    try {
      setLoading(true)
      setUsers(await getUsers())
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUsers() }, [])

  const openCreateModal = () => { setSelectedUser(null); setShowModal(true) }
  const openEditModal   = (user) => { setSelectedUser(user); setShowModal(true) }
  const closeModal      = () => { setShowModal(false); setSelectedUser(null) }

  const handleSave = async (formData) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, formData)
        Swal.fire('¡Actualizado!', 'Usuario actualizado correctamente.', 'success')
      } else {
        await createUser(formData)
        Swal.fire('¡Creado!', 'Usuario creado correctamente.', 'success')
      }
      closeModal()
      loadUsers()
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
    }
  }

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: `Se eliminará a ${user.full_name}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
    })
    if (result.isConfirmed) {
      try {
        await deleteUser(user.id)
        Swal.fire('¡Eliminado!', 'Usuario eliminado correctamente.', 'success')
        loadUsers()
      } catch (error) {
        Swal.fire('Error', error.message, 'error')
      }
    }
  }

  return (
    <div style={{ padding: '28px' }}>
      <Card className="shadow-sm" style={{ borderRadius: '14px', overflow: 'hidden' }}>
        <Card.Header style={{ background: '#7c3aed', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
          <h4 className="mb-0">👥 Gestión de Usuarios</h4>
          <Button onClick={openCreateModal} style={{ background: 'white', color: '#7c3aed', border: 'none', fontWeight: 'bold' }}>
            + Nuevo Usuario
          </Button>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center p-4">
              <Spinner animation="border" style={{ color: '#7c3aed' }} />
              <p className="mt-2" style={{ color: '#7c3aed' }}>Cargando usuarios...</p>
            </div>
          ) : (
            <Table responsive striped bordered hover>
              <thead style={{ background: '#7c3aed', color: 'white' }}>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td><strong>{user.full_name}</strong></td>
                    <td>{user.email}</td>
                    <td>
                      <Badge bg={user.role === 'admin' ? 'primary' : user.role === 'coach' ? 'danger' : 'info'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => openEditModal(user)}>Editar</Button>
                      <Button variant="danger"  size="sm" onClick={() => handleDelete(user)}>Borrar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <UserFormModal show={showModal} handleClose={closeModal} handleSave={handleSave} selectedUser={selectedUser} />
    </div>
  )
}
