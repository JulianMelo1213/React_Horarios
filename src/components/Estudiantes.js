// src/components/Estudiantes.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Container, TextField, Button, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, Typography, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions, DialogContentText
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const Estudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentEstudiante, setCurrentEstudiante] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [estudianteToDelete, setEstudianteToDelete] = useState(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    obtenerEstudiantes();
  }, []);

  const obtenerEstudiantes = async () => {
    try {
      const response = await api.get('/estudiantes');
      setEstudiantes(response.data);
    } catch (error) {
      setError('Error al obtener los estudiantes');
      console.error('Error al obtener los estudiantes', error);
    }
  };

  const handleOpen = (estudiante = null) => {
    if (estudiante) {
      setNombre(estudiante.nombre);
      setApellido(estudiante.apellido);
      setEmail(estudiante.email);
      setFechaNacimiento(estudiante.fechaNacimiento);
      setCurrentEstudiante(estudiante);
      setEditing(true);
    } else {
      setNombre('');
      setApellido('');
      setEmail('');
      setFechaNacimiento('');
      setCurrentEstudiante(null);
      setEditing(false);
    }
    setFormError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNombre('');
    setApellido('');
    setEmail('');
    setFechaNacimiento('');
    setFormError('');
    setError('');
  };

  const handleSave = async () => {
    if (!nombre || !apellido || !email || !fechaNacimiento) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('El email no tiene un formato válido.');
      return;
    }

    try {
      if (editing && currentEstudiante) {
        const estudianteActualizado = { estudianteId: currentEstudiante.estudianteId, nombre, apellido, email, fechaNacimiento };
        await api.put(`/estudiantes/${currentEstudiante.estudianteId}`, estudianteActualizado);
      } else {
        const nuevoEstudiante = { nombre, apellido, email, fechaNacimiento };
        await api.post('/estudiantes', nuevoEstudiante);
      }
      handleClose();
      obtenerEstudiantes();
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.includes('email')) {
        setFormError('Ya existe un estudiante con ese email.');
      } else {
        setFormError(editing ? 'Error al actualizar estudiante' : 'Error al crear estudiante');
      }
      console.error(error);
    }
  };

  const handleOpenConfirm = (estudiante) => {
    setEstudianteToDelete(estudiante);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setEstudianteToDelete(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/estudiantes/${estudianteToDelete.estudianteId}`);
      obtenerEstudiantes();
      handleCloseConfirm();
    } catch (error) {
      setError('Error al eliminar estudiante');
      console.error('Error al eliminar estudiante', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestión de Estudiantes</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Agregar Estudiante
      </Button>
      <List>
        {estudiantes.map((estudiante) => (
          <ListItem key={estudiante.estudianteId}>
            <ListItemText primary={`${estudiante.nombre} ${estudiante.apellido}`} secondary={`Email: ${estudiante.email}`} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(estudiante)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleOpenConfirm(estudiante)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Editar Estudiante' : 'Agregar Estudiante'}</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fecha de Nacimiento"
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar al estudiante "{estudianteToDelete?.nombre} {estudianteToDelete?.apellido}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="primary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Estudiantes;
