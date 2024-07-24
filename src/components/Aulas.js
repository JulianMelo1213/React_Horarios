// src/components/Aulas.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Container, TextField, Button, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, Typography, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions, DialogContentText, Paper, Box
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { normalizeString } from '../utils/normalize';

const Aulas = () => {
  const [aulas, setAulas] = useState([]);
  const [nombre, setNombre] = useState('Aula ');
  const [capacidad, setCapacidad] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentAula, setCurrentAula] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [aulaToDelete, setAulaToDelete] = useState(null);
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    obtenerAulas();
  }, []);

  const obtenerAulas = async () => {
    try {
      const response = await api.get('/aulas');
      setAulas(response.data);
    } catch (error) {
      setError('Error al obtener las aulas');
      console.error('Error al obtener las aulas', error);
    }
  };

  const handleOpen = (aula = null) => {
    if (aula) {
      setNombre(aula.nombre);
      setCapacidad(aula.capacidad);
      setCurrentAula(aula);
      setEditing(true);
    } else {
      setNombre('Aula ');
      setCapacidad('');
      setCurrentAula(null);
      setEditing(false);
    }
    setFormError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNombre('Aula ');
    setCapacidad('');
    setFormError('');
    setError('');
  };

  const handleSave = async () => {
    if (!nombre || nombre.trim() === 'Aula') {
      setFormError('El nombre es obligatorio.');
      return;
    }

    if (capacidad <= 0 || capacidad > 30) {
      setFormError('La capacidad debe estar entre 1 y 30.');
      return;
    }

    const normalizedNombre = normalizeString(nombre);

    const aulaExistente = aulas.find(aula => normalizeString(aula.nombre) === normalizedNombre && aula.aulaId !== currentAula?.aulaId);
    if (aulaExistente) {
      setFormError('Esta aula ya existe.');
      return;
    }

    try {
      if (editing && currentAula) {
        const aulaActualizada = { aulaId: currentAula.aulaId, nombre, capacidad: parseInt(capacidad, 10), fechaRegistro: new Date() };
        await api.put(`/aulas/${currentAula.aulaId}`, aulaActualizada);
      } else {
        const nuevaAula = { nombre, capacidad: parseInt(capacidad, 10) };
        await api.post('/aulas', nuevaAula);
      }
      handleClose();
      obtenerAulas();
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.includes('nombre')) {
        setFormError('Esta aula ya existe.');
      } else {
        setFormError(editing ? 'Error al actualizar aula' : 'Error al crear aula');
      }
      console.error(error);
    }
  };

  const handleOpenConfirm = (aula) => {
    setAulaToDelete(aula);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setAulaToDelete(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/aulas/${aulaToDelete.aulaId}`);
      obtenerAulas();
      handleCloseConfirm();
    } catch (error) {
      setError('Error al eliminar aula');
      console.error('Error al eliminar aula', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAulas = aulas.filter((aula) =>
    aula.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestión de Aulas</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Agregar Aula
        </Button>
        <TextField
          label="Buscar Aula"
          value={searchTerm}
          onChange={handleSearchChange}
          variant="outlined"
        />
      </Box>
      <Box mt={3}>
        <Paper elevation={3}>
          <List>
            {filteredAulas.map((aula) => (
              <ListItem key={aula.aulaId} divider>
                <ListItemText primary={aula.nombre} secondary={`Capacidad: ${aula.capacidad}`} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(aula)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleOpenConfirm(aula)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Editar Aula' : 'Agregar Aula'}</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField
            label="Nombre del aula"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Capacidad"
            type="number"
            value={capacidad}
            onChange={(e) => setCapacidad(e.target.value)}
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
            ¿Estás seguro de que deseas eliminar el aula "{aulaToDelete?.nombre}" con capacidad de {aulaToDelete?.capacidad}?
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

export default Aulas;
