// src/components/HorariosDias.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Container, TextField, Button, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, Typography, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions, DialogContentText, Paper, Box, Autocomplete
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const HorariosDias = () => {
  const [horariosDias, setHorariosDias] = useState([]);
  const [dias, setDias] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [clases, setClases] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentHorarioDia, setCurrentHorarioDia] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [horarioDiaToDelete, setHorarioDiaToDelete] = useState(null);
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    obtenerHorariosDias();
    obtenerDias();
    obtenerHorarios();
    obtenerClases();
    obtenerAulas();
  }, []);

  const obtenerHorariosDias = async () => {
    try {
      const response = await api.get('/horarioDia');
      setHorariosDias(response.data);
    } catch (error) {
      setError('Error al obtener los horarios-días');
      console.error('Error al obtener los horarios-días', error);
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

  const handleOpen = (horarioDia = null) => {
    if (horarioDia) {
      setDiaSeleccionado(dias.find(d => d.diaId === horarioDia.diaId));
      setHorarioSeleccionado(horarios.find(h => h.horarioId === horarioDia.horarioId));
      setCurrentHorarioDia(horarioDia);
      setEditing(true);
    } else {
      setDiaSeleccionado(null);
      setHorarioSeleccionado(null);
      setCurrentHorarioDia(null);
      setEditing(false);
    }
    setFormError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDiaSeleccionado(null);
    setHorarioSeleccionado(null);
    setFormError('');
    setError('');
  };

  const handleSave = async () => {
    if (!diaSeleccionado || !horarioSeleccionado) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }

    try {
      if (editing && currentHorarioDia) {
        const horarioDiaActualizado = {
          horarioDiaId: currentHorarioDia.horarioDiaId,
          diaId: diaSeleccionado.diaId,
          horarioId: horarioSeleccionado.horarioId
        };
        await api.put(`/horarioDia/${currentHorarioDia.horarioDiaId}`, horarioDiaActualizado);
      } else {
        const nuevoHorarioDia = {
          diaId: diaSeleccionado.diaId,
          horarioId: horarioSeleccionado.horarioId
        };
        await api.post('/horarioDia', nuevoHorarioDia);
      }
      handleClose();
      obtenerHorariosDias();
    } catch (error) {
      setFormError(editing ? 'Error al actualizar horario-día' : 'Error al crear horario-día');
      console.error(error);
    }
  };

  const handleOpenConfirm = (horarioDia) => {
    setHorarioDiaToDelete(horarioDia);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setHorarioDiaToDelete(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/horarioDia/${horarioDiaToDelete.horarioDiaId}`);
      obtenerHorariosDias();
      handleCloseConfirm();
    } catch (error) {
      setError('Error al eliminar horario-día');
      console.error('Error al eliminar horario-día', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredHorariosDias = horariosDias.filter((horarioDia) =>
    `${horarioDia.nombreDia} ${horarioDia.horaInicio} ${horarioDia.horaFin}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestión de Horarios-Días</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Agregar Horario-Día
        </Button>
        <TextField
          label="Buscar Horario-Día"
          value={searchTerm}
          onChange={handleSearchChange}
          variant="outlined"
        />
      </Box>
      <Box mt={3}>
        <Paper elevation={3}>
          <List>
            {filteredHorariosDias.map((horarioDia) => {
              const horario = horarios.find(h => h.horarioId === horarioDia.horarioId);
              const clase = clases.find(c => c.claseId === horario.claseId);
              const aula = aulas.find(a => a.aulaId === horario.aulaId);
              return (
                <ListItem key={horarioDia.horarioDiaId} divider>
                  <ListItemText
                    primary={`Horario: ${horarioDia.horarioId} (${horarioDia.horaInicio} - ${horarioDia.horaFin})`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textSecondary">Día: {horarioDia.nombreDia}</Typography>
                        <br />
                        {clase && <Typography component="span" variant="body2" color="textSecondary">Clase: {clase.nombre}</Typography>}
                        <br />
                        {aula && <Typography component="span" variant="body2" color="textSecondary">Aula: {aula.nombre}</Typography>}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(horarioDia)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleOpenConfirm(horarioDia)}>
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
        <DialogTitle>{editing ? 'Editar Horario-Día' : 'Agregar Horario-Día'}</DialogTitle>
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
            getOptionLabel={(option) => `${option.claseId} ${option.aulaId} ${option.horaInicio}-${option.horaFin}`}
            value={horarioSeleccionado}
            onChange={(event, newValue) => setHorarioSeleccionado(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Horario" margin="normal" fullWidth />
            )}
          />
          {horarioSeleccionado && (
            <>
              <Typography variant="body2" color="textSecondary">Clase: {clases.find(c => c.claseId === horarioSeleccionado.claseId)?.nombre}</Typography>
              <Typography variant="body2" color="textSecondary">Aula: {aulas.find(a => a.aulaId === horarioSeleccionado.aulaId)?.nombre}</Typography>
            </>
          )}
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
            ¿Estás seguro de que deseas eliminar el horario-día del día "{horarioDiaToDelete?.nombreDia}"?
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

export default HorariosDias;
