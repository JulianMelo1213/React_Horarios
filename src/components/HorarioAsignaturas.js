// src/components/HorarioAsignaturas.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Container, TextField, Button, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, Typography, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions, DialogContentText, Paper, Box, Autocomplete
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const HorarioAsignaturas = () => {
  const [horariosAsignaturas, setHorariosAsignaturas] = useState([]);
  const [dias, setDias] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [profesorSeleccionado, setProfesorSeleccionado] = useState(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentHorarioAsignatura, setCurrentHorarioAsignatura] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [horarioAsignaturaToDelete, setHorarioAsignaturaToDelete] = useState(null);
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    obtenerHorariosAsignaturas();
    obtenerDias();
    obtenerHorarios();
    obtenerProfesores();
  }, []);

  const obtenerHorariosAsignaturas = async () => {
    try {
      const response = await api.get('/horarioAsignatura');
      setHorariosAsignaturas(response.data);
    } catch (error) {
      setError('Error al obtener las asignaturas de horario');
      console.error('Error al obtener las asignaturas de horario', error);
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

  const obtenerHorarios = async () => {
    try {
      const response = await api.get('/horarios');
      setHorarios(response.data);
    } catch (error) {
      setError('Error al obtener los horarios');
      console.error('Error al obtener los horarios', error);
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

  const handleOpen = (horarioAsignatura = null) => {
    if (horarioAsignatura) {
      setDiaSeleccionado(dias.find(d => d.diaId === horarioAsignatura.diaId));
      setHorarioSeleccionado(horarios.find(h => h.horarioId === horarioAsignatura.horarioId));
      setProfesorSeleccionado(profesores.find(p => p.profesorId === horarioAsignatura.profesorId));
      setCurrentHorarioAsignatura(horarioAsignatura);
      setEditing(true);
    } else {
      setDiaSeleccionado(null);
      setHorarioSeleccionado(null);
      setProfesorSeleccionado(null);
      setCurrentHorarioAsignatura(null);
      setEditing(false);
    }
    setFormError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDiaSeleccionado(null);
    setHorarioSeleccionado(null);
    setProfesorSeleccionado(null);
    setFormError('');
    setError('');
  };

  const handleSave = async () => {
    if (!diaSeleccionado || !horarioSeleccionado || !profesorSeleccionado) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }

    const horarioAsignaturaDto = {
      diaId: diaSeleccionado.diaId,
      horarioId: horarioSeleccionado.horarioId,
      profesorId: profesorSeleccionado.profesorId,
      horaInicio: horarioSeleccionado.horaInicio,
      horaFin: horarioSeleccionado.horaFin,
    };

    try {
      if (editing && currentHorarioAsignatura) {
        horarioAsignaturaDto.horarioAsignaturaId = currentHorarioAsignatura.horarioAsignaturaId;
        await api.put(`/horarioAsignatura/${currentHorarioAsignatura.horarioAsignaturaId}`, horarioAsignaturaDto);
      } else {
        await api.post('/horarioAsignatura', horarioAsignaturaDto);
      }
      handleClose();
      obtenerHorariosAsignaturas();
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.includes('El profesor ya tiene una clase asignada en ese horario.')) {
        setFormError('El profesor ya tiene una clase asignada en ese horario.');
      } else {
        setFormError(editing ? 'Error al actualizar asignatura de horario' : 'Error al crear asignatura de horario');
      }
      console.error(error);
    }
  };

  const handleOpenConfirm = (horarioAsignatura) => {
    setHorarioAsignaturaToDelete(horarioAsignatura);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setHorarioAsignaturaToDelete(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/horarioAsignatura/${horarioAsignaturaToDelete.horarioAsignaturaId}`);
      obtenerHorariosAsignaturas();
      handleCloseConfirm();
    } catch (error) {
      setError('Error al eliminar asignatura de horario');
      console.error('Error al eliminar asignatura de horario', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredHorariosAsignaturas = horariosAsignaturas.filter((horarioAsignatura) =>
    `${horarioAsignatura.nombreDia} ${horarioAsignatura.horaInicio} ${horarioAsignatura.horaFin} ${horarioAsignatura.nombreProfesor} ${horarioAsignatura.apellidoProfesor}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestión de Horario-Asignaturas</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Agregar Asignatura de Horario
        </Button>
        <TextField
          label="Buscar Asignatura de Horario"
          value={searchTerm}
          onChange={handleSearchChange}
          variant="outlined"
        />
      </Box>
      <Box mt={3}>
        <Paper elevation={3}>
          <List>
            {filteredHorariosAsignaturas.map((horarioAsignatura) => {
              return (
                <ListItem key={horarioAsignatura.horarioAsignaturaId} divider>
                  <ListItemText
                    primary={`Horario: ${horarioAsignatura.horarioId} (${horarioAsignatura.horaInicio} - ${horarioAsignatura.horaFin})`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textSecondary">Día: {horarioAsignatura.nombreDia}</Typography>
                        <br />
                        <Typography component="span" variant="body2" color="textSecondary">Profesor: {horarioAsignatura.nombreProfesor} {horarioAsignatura.apellidoProfesor}</Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(horarioAsignatura)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleOpenConfirm(horarioAsignatura)}>
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
        <DialogTitle>{editing ? 'Editar Asignatura de Horario' : 'Agregar Asignatura de Horario'}</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error">{formError}</Alert>}
          <Autocomplete
            options={dias}
            getOptionLabel={(option) => option.nombre}
            value={diaSeleccionado}
            onChange={(event, newValue) => setDiaSeleccionado(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Día" margin="normal" fullWidth />
            )}
          />
          <Autocomplete
            options={horarios}
            getOptionLabel={(option) => `${option.horarioId} ${option.horaInicio}-${option.horaFin}`}
            value={horarioSeleccionado}
            onChange={(event, newValue) => setHorarioSeleccionado(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Horario" margin="normal" fullWidth />
            )}
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
            ¿Estás seguro de que deseas eliminar la asignatura del horario con el profesor "{horarioAsignaturaToDelete?.nombreProfesor} {horarioAsignaturaToDelete?.apellidoProfesor}"?
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

export default HorarioAsignaturas;
