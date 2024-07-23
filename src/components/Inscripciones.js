// src/components/Inscripciones.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Container, TextField, Button, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, Typography, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions, DialogContentText, Paper, Box, Autocomplete
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const Inscripciones = () => {
  const [inscripciones, setInscripciones] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [clases, setClases] = useState([]);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [claseSeleccionada, setClaseSeleccionada] = useState(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentInscripcion, setCurrentInscripcion] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [inscripcionToDelete, setInscripcionToDelete] = useState(null);
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    obtenerInscripciones();
    obtenerEstudiantes();
    obtenerClases();
  }, []);

  const obtenerInscripciones = async () => {
    try {
      const response = await api.get('/inscripciones');
      setInscripciones(response.data);
    } catch (error) {
      setError('Error al obtener las inscripciones');
      console.error('Error al obtener las inscripciones', error);
    }
  };

  const obtenerEstudiantes = async () => {
    try {
      const response = await api.get('/estudiantes');
      setEstudiantes(response.data);
    } catch (error) {
      setError('Error al obtener los estudiantes');
      console.error('Error al obtener los estudiantes', error);
    }
  };

  const obtenerClases = async () => {
    try {
      const response = await api.get('/clases');
      setClases(response.data);
    } catch (error) {
      setError('Error al obtener las clases');
      console.error('Error al obtener las clases', error);
    }
  };

  const handleOpen = (inscripcion = null) => {
    if (inscripcion) {
      setEstudianteSeleccionado(estudiantes.find(e => e.estudianteId === inscripcion.estudianteId));
      setClaseSeleccionada(clases.find(c => c.claseId === inscripcion.claseId));
      setCurrentInscripcion(inscripcion);
      setEditing(true);
    } else {
      setEstudianteSeleccionado(null);
      setClaseSeleccionada(null);
      setCurrentInscripcion(null);
      setEditing(false);
    }
    setFormError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEstudianteSeleccionado(null);
    setClaseSeleccionada(null);
    setFormError('');
    setError('');
  };

  const handleSave = async () => {
    if (!estudianteSeleccionado || !claseSeleccionada) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }

    try {
      if (editing && currentInscripcion) {
        const inscripcionActualizada = { inscripcionId: currentInscripcion.inscripcionId, estudianteId: estudianteSeleccionado.estudianteId, claseId: claseSeleccionada.claseId, fechaRegistro: new Date() };
        await api.put(`/inscripciones/${currentInscripcion.inscripcionId}`, inscripcionActualizada);
      } else {
        const nuevaInscripcion = { estudianteId: estudianteSeleccionado.estudianteId, claseId: claseSeleccionada.claseId };
        await api.post('/inscripciones', nuevaInscripcion);
      }
      handleClose();
      obtenerInscripciones();
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data === 'El estudiante ya está inscrito en esta clase.') {
        setFormError('El estudiante ya está inscrito en esta clase.');
      } else {
        setFormError(editing ? 'Error al actualizar inscripción' : 'Error al crear inscripción');
      }
      console.error(error);
    }
  };

  const handleOpenConfirm = (inscripcion) => {
    setInscripcionToDelete(inscripcion);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setInscripcionToDelete(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/inscripciones/${inscripcionToDelete.inscripcionId}`);
      obtenerInscripciones();
      handleCloseConfirm();
    } catch (error) {
      setError('Error al eliminar inscripción');
      console.error('Error al eliminar inscripción', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredInscripciones = inscripciones.filter((inscripcion) =>
    `${inscripcion.nombreEstudiante} ${inscripcion.nombreClase}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestión de Inscripciones</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Agregar Inscripción
        </Button>
        <TextField
          label="Buscar Inscripción"
          value={searchTerm}
          onChange={handleSearchChange}
          variant="outlined"
        />
      </Box>
      <Box mt={3}>
        <Paper elevation={3}>
          <List>
            {filteredInscripciones.map((inscripcion) => (
              <ListItem key={inscripcion.inscripcionId} divider>
                <ListItemText primary={`Estudiante: ${inscripcion.nombreEstudiante}`} secondary={`Clase: ${inscripcion.nombreClase}`} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(inscripcion)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleOpenConfirm(inscripcion)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Editar Inscripción' : 'Agregar Inscripción'}</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error">{formError}</Alert>}
          <Autocomplete
            options={estudiantes}
            getOptionLabel={(option) => `${option.nombre} ${option.apellido} (${option.email})`}
            value={estudianteSeleccionado}
            onChange={(event, newValue) => setEstudianteSeleccionado(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Estudiante" margin="normal" fullWidth />
            )}
          />
          <Autocomplete
            options={clases}
            getOptionLabel={(option) => option.nombre}
            value={claseSeleccionada}
            onChange={(event, newValue) => setClaseSeleccionada(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Clase" margin="normal" fullWidth />
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
            ¿Estás seguro de que deseas eliminar la inscripción del estudiante "{inscripcionToDelete?.nombreEstudiante}" en la clase "{inscripcionToDelete?.nombreClase}"?
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

export default Inscripciones;
