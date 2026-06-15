import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Modal, Container } from 'react-bootstrap';
import { sportService } from '../services/sportService';
import Swal from 'sweetalert2';

export default function SportsPage() {
  const [sports, setSports] = useState([]);
  
  // Estados para los Modales
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Estado del Formulario
  const [formData, setFormData] = useState({
    name: '',
    objective: '',
    duration: '',
    status: true
  });

  const fetchSports = async () => {
    try {
      const res = await sportService.getAll();
      if (res.ok) setSports(res.data);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los deportes.', 'error');
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const res = await sportService.updateStatus(id, newStatus);
      if (res.ok) {
        setSports(sports.map(s => s.id === id ? { ...s, status: newStatus } : s));
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo cambiar el estado.', 'error');
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Está seguro de eliminar este deporte?',
      text: "La información se eliminará permanentemente",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await sportService.delete(id);
          if (res.ok) {
            Swal.fire('Eliminado', res.message, 'success');
            fetchSports();
          }
        } catch (error) {
          Swal.fire('Error', 'No se pudo eliminar.', 'error');
        }
      }
    });
  };

  // Manejadores de los Modales
  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData({ name: '', objective: '', duration: '', status: true });
    setShowModal(true);
  };

  const handleOpenEdit = (sport) => {
    setIsEditing(true);
    setSelectedId(sport.id);
    setFormData({
      name: sport.name,
      objective: sport.objective,
      duration: sport.duration,
      status: sport.status
    });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Guardar datos (Crear o Editar) con Validaciones obligatorias
  const handleSave = async (e) => {
    e.preventDefault();

    // Validaciones requeridas por la pauta
    if (!formData.name.trim() || !formData.objective.trim() || !formData.duration) {
      Swal.fire('Advertencia', 'Todos los campos (Nombre, Objetivo y Duración) son obligatorios.', 'warning');
      return;
    }

    try {
      if (isEditing) {
        const res = await sportService.update(selectedId, formData);
        if (res.ok) {
          Swal.fire('Éxito', 'Deporte actualizado correctamente.', 'success');
          fetchSports();
          handleCloseModal();
        }
      } else {
        const res = await sportService.create(formData);
        if (res.ok) {
          Swal.fire('Éxito', 'Deporte creado correctamente.', 'success');
          fetchSports();
          handleCloseModal();
        }
      }
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al guardar la información.', 'error');
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Deportes</h2>
        <div>
          <Button variant="secondary" className="me-2" onClick={fetchSports}>
            Refrescar
          </Button>
          <Button variant="primary" onClick={handleOpenCreate}>
            + Crear Deporte
          </Button>
        </div>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Objetivo</th>
            <th>Duración (min)</th>
            <th>Fecha de Creación</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sports.map((sport) => (
            <tr key={sport.id}>
              <td>{sport.name}</td>
              <td>{sport.objective}</td>
              <td>{sport.duration}</td>
              <td>{formatDate(sport.created_at)}</td>
              <td>
                <Form.Check 
                  type="switch"
                  id={`switch-${sport.id}`}
                  label={sport.status ? "Activo" : "Inactivo"}
                  checked={sport.status}
                  onChange={() => handleStatusChange(sport.id, sport.status)}
                />
              </td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleOpenEdit(sport)}>
                  Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(sport.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* MODAL DE REACT-BOOTSTRAP ÚNICO PARA CREAR Y EDITAR */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Deporte' : 'Crear Deporte'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Deporte</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="Ej: CrossFit"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Objetivo</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                name="objective" 
                value={formData.objective} 
                onChange={handleInputChange} 
                placeholder="Descripción del objetivo..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Duración (en minutos)</Form.Label>
              <Form.Control 
                type="number" 
                name="duration" 
                value={formData.duration} 
                onChange={handleInputChange} 
                placeholder="Ej: 60"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {isEditing ? 'Guardar Cambios' : 'Crear'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};