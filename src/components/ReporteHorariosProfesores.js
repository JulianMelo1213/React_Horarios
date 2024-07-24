import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Container, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const ReporteHorariosProfesores = () => {
  const [reportes, setReportes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerReporteHorariosProfesores();
  }, []);

  const obtenerReporteHorariosProfesores = async () => {
    try {
      const response = await api.get('/reporte/horarios-profesores');
      setReportes(response.data);
    } catch (error) {
      setError('Error al obtener el reporte de horarios de profesores');
      console.error('Error al obtener el reporte de horarios de profesores', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Reporte de Horarios de Profesores</Typography>
      {error && <Typography variant="body1" color="error">{error}</Typography>}
      <Paper elevation={3}>
        <List>
          {reportes.map((reporte) => (
            <ListItem key={reporte.profesor} divider>
              <ListItemText
                primary={`Profesor: ${reporte.profesor}`}
                secondary={`Cantidad: ${reporte.cantidad}`}
              />
              <ul>
                {reporte.horarios.map((horario, index) => (
                  <li key={index}>
                    <Typography variant="body2" color="textSecondary">
                      {`Clase: ${horario.clase}, Aula: ${horario.aula}, Día: ${horario.dia}, Hora: ${horario.horaInicio} - ${horario.horaFin}`}
                    </Typography>
                  </li>
                ))}
              </ul>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default ReporteHorariosProfesores;
