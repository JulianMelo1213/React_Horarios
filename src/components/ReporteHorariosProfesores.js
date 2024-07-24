import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Container, Typography, List, ListItem, Paper, Box } from '@mui/material';
import '../styles/ReporteHorariosProfesores.css';

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
    <Container className="reporte-container">
      <Typography variant="h4" gutterBottom>Reporte de Horarios de Profesores</Typography>
      {error && <Typography variant="body1" color="error">{error}</Typography>}
      <Paper elevation={3} className="reporte-paper">
        <List className="reporte-list">
          {reportes.map((reporte) => (
            <ListItem key={reporte.profesor} divider className="reporte-list-item">
              <Box className="reporte-list-item-header">
                <Typography variant="h6">{`Profesor: ${reporte.profesor}`}</Typography>
              </Box>
              <Box className="reporte-list-item-content">
                <Typography variant="body1">{`Cantidad: ${reporte.cantidad}`}</Typography>
                <ul className="horario-list">
                  {reporte.horarios.map((horario, index) => (
                    <li key={index} className="horario-item">
                      <Typography variant="body2" color="textSecondary">
                        {`Clase: ${horario.clase}, Aula: ${horario.aula}, Día: ${horario.dia}, Hora: ${horario.horaInicio} - ${horario.horaFin}`}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default ReporteHorariosProfesores;
