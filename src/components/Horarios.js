// src/components/Horarios.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Container, TextField, Button, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, Typography, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions, DialogContentText, Paper, Box, Autocomplete
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const Horarios = () => {
  const [horarios, setHorarios] = useState([]);
  const [clases, setClases] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [dias, setDias] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState(null);
  const [aulaSeleccionada, setAulaSeleccionada] = useState(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentHorario, setCurrentHorario] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [horarioToDelete, setHorarioToDelete] = useState(null);
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    obtenerHorarios();
    obtenerClases();
    obtenerAulas();
    obtenerDias();
  }, []);

  const obtenerHorarios = async () => {
    try {
      const response = await api.get('/horarios');
      setHorarios(response.data);
    } catch (error) {
      setError('Error al obtener los horarios');
      console.error('Error al obtener los horarios', error);
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

  const obtenerAulas = async () => {
    try {
      const response = await api.get('/aulas');
      setAulas(response.data);
    } catch (error) {
      setError('Error al obtener las aulas');
      console.error('Error al obtener las aulas', error);
    }
  };

  const obtenerDias = async () => {
    try {
      const response = await api.get('/dia');
      setDias(response.data);
    } catch (error) {
      setError('Error al obtener los días');
      console.error('Error al obtener los días', error);
    }
  };

  const handleOpen = (horario = null) => {
    if (horario) {
      setClaseSeleccionada(clases.find(c => c.claseId === horario.claseId));
      setAulaSeleccionada(aulas.find(a => a.aulaId === horario.aulaId));
      setDiaSeleccionado(dias.find(d => d.diaId === horario.diaId));
      setHoraInicio(horario.horaInicio);
      setHoraFin(horario.horaFin);
      setCurrentHorario(horario);
      setEditing(true);
    } else {
      setClaseSeleccionada(null);
      setAulaSeleccionada(null);
      setDiaSeleccionado(null);
      setHoraInicio('');
      setHoraFin('');
      setCurrentHorario(null);
      setEditing(false);
    }
    setFormError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setClaseSeleccionada(null);
    setAulaSeleccionada(null);
    setDiaSeleccionado(null);
    setHoraInicio('');
    setHoraFin('');
    setFormError('');
    setError('');
  };

  const handleSave = async () => {
    if (!claseSeleccionada || !aulaSeleccionada || !diaSeleccionado || !horaInicio || !horaFin) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }

    try {
      if (editing && currentHorario) {
        const horarioActualizado = {
          horarioId: currentHorario.horarioId,
          claseId: claseSeleccionada.claseId,
          aulaId: aulaSeleccionada.aulaId,
          diaId: diaSeleccionado.diaId,
          horaInicio,
          horaFin,
          fechaRegistro: new Date()
        };
        await api.put(`/horarios/${currentHorario.horarioId}`, horarioActualizado);
      } else {
        const nuevoHorario = {
          claseId: claseSeleccionada.claseId,
          aulaId: aulaSeleccionada.aulaId,
          diaId: diaSeleccionado.diaId,
          horaInicio,
          horaFin
        };
        await api.post('/horarios', nuevoHorario);
      }
      handleClose();
      obtenerHorarios();
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.includes('Ya existe un horario')) {
        setFormError('Ya existe un horario con la misma clase, aula, día y horas de inicio y fin.');
      } else {
        setFormError(editing ? 'Error al actualizar horario' : 'Error al crear horario');
      }
      console.error(error);
    }
  };

  const handleOpenConfirm = (horario) => {
    setHorarioToDelete(horario);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setHorarioToDelete(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/horarios/${horarioToDelete.horarioId}`);
      obtenerHorarios();
      handleCloseConfirm();
    } catch (error) {
      setError('Error al eliminar horario');
      console.error('Error al eliminar horario', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredHorarios = horarios.filter((horario) =>
    `${horario.nombreClase} ${horario.nombreAula} ${horario.nombreDia}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestión de Horarios</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Agregar Horario
        </Button>
        <TextField
          label="Buscar Horario"
          value={searchTerm}
          onChange={handleSearchChange}
          variant="outlined"
        />
      </Box>
      <Box mt={3}>
        <Paper elevation={3}>
          <List>
            {filteredHorarios.map((horario) => (
              <ListItem key={horario.horarioId} divider>
                <ListItemText
                  primary={`Clase: ${horario.nombreClase}`}
                  secondary={`Aula: ${horario.nombreAula}, Día: ${horario.nombreDia}, Hora: ${horario.horaInicio} - ${horario.horaFin}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(horario)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleOpenConfirm(horario)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Editar Horario' : 'Agregar Horario'}</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error">{formError}</Alert>}
          <Autocomplete
            options={clases}
            getOptionLabel={(option) => option.nombre}
            value={claseSeleccionada}
            onChange={(event, newValue) => setClaseSeleccionada(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Clase" margin="normal" fullWidth />
            )}
          />
          <Autocomplete
            options={aulas}
            getOptionLabel={(option) => option.nombre}
            value={aulaSeleccionada}
            onChange={(event, newValue) => setAulaSeleccionada(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Aula" margin="normal" fullWidth />
            )}
          />
          <Autocomplete
            options={dias}
            getOptionLabel={(option) => option.nombre}
            value={diaSeleccionado}
            onChange={(event, newValue) => setDiaSeleccionado(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Día" margin="normal" fullWidth />
            )}
          />
          <TextField
            label="Hora Inicio"
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Hora Fin"
            type="time"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
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
            ¿Estás seguro de que deseas eliminar el horario de la clase "{horarioToDelete?.nombreClase}" en el aula "{horarioToDelete?.nombreAula}" el día "{horarioToDelete?.nombreDia}"?
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

export default Horarios;
