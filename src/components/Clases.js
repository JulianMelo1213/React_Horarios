// src/components/Clases.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Container, TextField, Button, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, Typography, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions, DialogContentText, Paper, Box, Autocomplete
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const Clases = () => {
  const [clases, setClases] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [profesorSeleccionado, setProfesorSeleccionado] = useState(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentClase, setCurrentClase] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [claseToDelete, setClaseToDelete] = useState(null);
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    obtenerClases();
    obtenerProfesores();
  }, []);

  const obtenerClases = async () => {
    try {
      const response = await api.get('/clases');
      setClases(response.data);
    } catch (error) {
      setError('Error al obtener las clases');
      console.error('Error al obtener las clases', error);
    }
  };

  const obtenerProfesores = async () => {
    try {
      const response = await api.get('/profesores');
      setProfesores(response.data);
    } catch (error) {
      setError('Error al obtener los profesores');
      console.error('Error al obtener los profesores', error);
    }
  };

  const handleOpen = (clase = null) => {
    if (clase) {
      setNombre(clase.nombre);
      setDescripcion(clase.descripcion);
      setProfesorSeleccionado(profesores.find(p => p.profesorId === clase.profesorId));
      setCurrentClase(clase);
      setEditing(true);
    } else {
      setNombre('');
      setDescripcion('');
      setProfesorSeleccionado(null);
      setCurrentClase(null);
      setEditing(false);
    }
    setFormError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNombre('');
    setDescripcion('');
    setProfesorSeleccionado(null);
    setFormError('');
    setError('');
  };

  const handleSave = async () => {
    if (!nombre || !descripcion || !profesorSeleccionado) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }

    try {
      if (editing && currentClase) {
        const claseActualizada = { claseId: currentClase.claseId, nombre, descripcion, profesorId: profesorSeleccionado.profesorId, fechaRegistro: new Date() };
        await api.put(`/clases/${currentClase.claseId}`, claseActualizada);
      } else {
        const nuevaClase = { nombre, descripcion, profesorId: profesorSeleccionado.profesorId };
        await api.post('/clases', nuevaClase);
      }
      handleClose();
      obtenerClases();
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data === 'Ya existe una clase con ese nombre.') {
        setFormError('Ya existe una clase con ese nombre.');
      } else {
        setFormError(editing ? 'Error al actualizar clase' : 'Error al crear clase');
      }
      console.error(error);
    }
  };

  const handleOpenConfirm = (clase) => {
    setClaseToDelete(clase);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setClaseToDelete(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/clases/${claseToDelete.claseId}`);
      obtenerClases();
      handleCloseConfirm();
    } catch (error) {
      setError('Error al eliminar clase');
      console.error('Error al eliminar clase', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredClases = clases.filter((clase) =>
    clase.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestión de Clases</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Agregar Clase
        </Button>
        <TextField
          label="Buscar Clase"
          value={searchTerm}
          onChange={handleSearchChange}
          variant="outlined"
        />
      </Box>
      <Box mt={3}>
        <Paper elevation={3}>
          <List>
            {filteredClases.map((clase) => {
              const profesor = profesores.find(p => p.profesorId === clase.profesorId);
              return (
                <ListItem key={clase.claseId} divider>
                  <ListItemText
                    primary={clase.nombre}
                    secondary={
                      <>
                        {profesor && <Typography component="span" variant="body2" color="textSecondary" style={{ display: 'block' }}>Profesor: {profesor.nombre} {profesor.apellido}</Typography>}
                        <Typography component="span" variant="body2" color="textSecondary" style={{ display: 'block' }}>Descripción: {clase.descripcion}</Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(clase)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleOpenConfirm(clase)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Editar Clase' : 'Agregar Clase'}</DialogTitle>
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
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Autocomplete
            options={profesores}
            getOptionLabel={(option) => `${option.nombre} ${option.apellido}`}
            value={profesorSeleccionado}
            onChange={(event, newValue) => setProfesorSeleccionado(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Profesor" margin="normal" fullWidth />
            )}
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
            ¿Estás seguro de que deseas eliminar la clase "{claseToDelete?.nombre}"?
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

export default Clases;
