// src/components/Profesores.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Container, TextField, Button, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, Typography, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions, DialogContentText, Paper, Box
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const Profesores = () => {
  const [profesores, setProfesores] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentProfesor, setCurrentProfesor] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [profesorToDelete, setProfesorToDelete] = useState(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    obtenerProfesores();
  }, []);

  const obtenerProfesores = async () => {
    try {
      const response = await api.get('/profesores');
      setProfesores(response.data);
    } catch (error) {
      setError('Error al obtener los profesores');
      console.error('Error al obtener los profesores', error);
    }
  };

  const handleOpen = (profesor = null) => {
    if (profesor) {
      setNombre(profesor.nombre);
      setApellido(profesor.apellido);
      setEmail(profesor.email);
      setCurrentProfesor(profesor);
      setEditing(true);
    } else {
      setNombre('');
      setApellido('');
      setEmail('');
      setCurrentProfesor(null);
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
    setFormError('');
    setError('');
  };

  const handleSave = async () => {
    if (!nombre || !apellido || !email) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('El email no tiene un formato válido.');
      return;
    }

    try {
      if (editing && currentProfesor) {
        const profesorActualizado = { profesorId: currentProfesor.profesorId, nombre, apellido, email, fechaRegistro: new Date() };
        await api.put(`/profesores/${currentProfesor.profesorId}`, profesorActualizado);
      } else {
        const nuevoProfesor = { nombre, apellido, email };
        await api.post('/profesores', nuevoProfesor);
      }
      handleClose();
      obtenerProfesores();
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.includes('email')) {
        setFormError('Ya existe un profesor con ese email.');
      } else {
        setFormError(editing ? 'Error al actualizar profesor' : 'Error al crear profesor');
      }
      console.error(error);
    }
  };

  const handleOpenConfirm = (profesor) => {
    setProfesorToDelete(profesor);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setProfesorToDelete(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/profesores/${profesorToDelete.profesorId}`);
      obtenerProfesores();
      handleCloseConfirm();
    } catch (error) {
      setError('Error al eliminar profesor');
      console.error('Error al eliminar profesor', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestión de Profesores</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Agregar Profesor
      </Button>
      <Box mt={3}>
        <Paper elevation={3}>
          <List>
            {profesores.map((profesor) => (
              <ListItem key={profesor.profesorId} divider>
                <ListItemText primary={`${profesor.nombre} ${profesor.apellido}`} secondary={`Email: ${profesor.email}`} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(profesor)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleOpenConfirm(profesor)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Editar Profesor' : 'Agregar Profesor'}</DialogTitle>
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
            ¿Estás seguro de que deseas eliminar al profesor "{profesorToDelete?.nombre} {profesorToDelete?.apellido}"?
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

export default Profesores;
