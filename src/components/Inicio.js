// src/components/Inicio.js
import React from 'react';
import { Typography, Box, Grid, Paper, Button } from '@mui/material';
import './Inicio.css'; // Importamos el archivo de estilos para la animación
import { Link } from 'react-router-dom';

const Inicio = () => {
  return (
    <Box 
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      textAlign="center"
    >
      <img src="/logo512.png" className="logo-animado" alt="Logotipo" /> {/* Asegúrate de tener el archivo logo.png en la carpeta public */}
      <Typography variant="h4" gutterBottom>
        Bienvenido!
      </Typography>
      <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Estadísticas Rápidas
            </Typography>
            <Typography variant="body1">
              Número de Aulas: 10
            </Typography>
            <Typography variant="body1">
              Número de Estudiantes: 200
            </Typography>
            <Typography variant="body1">
              Número de Profesores: 20
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Noticias y Anuncios
            </Typography>
            <Typography variant="body1">
              - El proximo cuatrimestre comienza el 9 de septiembre.
            </Typography>
            <Typography variant="body1">
              - Nueva aula de informática disponible.
            </Typography>
            <Typography variant="body1">
              - Reunión de profesores el 15 de agosto.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Enlaces Rápidos
            </Typography>
            <Button variant="contained" color="primary" component={Link} to="/aulas" style={{ marginBottom: '10px' }}>
              Gestionar Aulas
            </Button>
            <Button variant="contained" color="primary" component={Link} to="/estudiantes" style={{ marginBottom: '10px' }}>
              Gestionar Estudiantes
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Inicio;
