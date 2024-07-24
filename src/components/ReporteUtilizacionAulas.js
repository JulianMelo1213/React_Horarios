import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Container, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const ReporteUtilizacionAulas = () => {
  const [reportes, setReportes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerReporteUtilizacionAulas();
  }, []);

  const obtenerReporteUtilizacionAulas = async () => {
    try {
      const response = await api.get('/reporte/utilizacion-aulas');
      setReportes(response.data);
    } catch (error) {
      setError('Error al obtener el reporte de utilización de aulas');
      console.error('Error al obtener el reporte de utilización de aulas', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Reporte de Utilización de Aulas</Typography>
      {error && <Typography variant="body1" color="error">{error}</Typography>}
      <Paper elevation={3}>
        <List>
          {reportes.map((reporte) => (
            <ListItem key={reporte.aula} divider>
              <ListItemText
                primary={`Aula: ${reporte.aula}`}
                secondary={`Cantidad: ${reporte.cantidad}`}
              />
              <ul>
                {reporte.horarios.map((horario, index) => (
                  <li key={index}>
                    <Typography variant="body2" color="textSecondary">
                      {`Clase: ${horario.clase}, Día: ${horario.dia}, Hora: ${horario.horaInicio} - ${horario.horaFin}`}
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

export default ReporteUtilizacionAulas;
