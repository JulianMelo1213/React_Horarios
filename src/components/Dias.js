// src/components/Dias.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Container, TextField, List, ListItem, ListItemText,
  Typography, Alert, Paper, Box
} from '@mui/material';

const Dias = () => {
  const [dias, setDias] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    obtenerDias();
  }, []);

  const obtenerDias = async () => {
    try {
      const response = await api.get('/dia');
      setDias(response.data);
    } catch (error) {
      setError('Error al obtener los días');
      console.error('Error al obtener los días', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDias = dias.filter((dia) =>
    dia.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestión de Días</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <TextField
          label="Buscar Día"
          value={searchTerm}
          onChange={handleSearchChange}
          variant="outlined"
        />
      </Box>
      <Box mt={3}>
        <Paper elevation={3}>
          <List>
            {filteredDias.map((dia) => (
              <ListItem key={dia.diaId} divider>
                <ListItemText primary={dia.nombre} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dias;
