import React from 'react';
import { Typography, Box, Grid, Paper, Button, Card, CardContent } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import authService from "../services/authServices"; // Asegúrate de que esta ruta sea correcta
import './Inicio.css'; // Importamos el archivo de estilos para la animación
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Aulas', value: 3 },
  { name: 'Estudiantes', value: 3 },
  { name: 'Profesores', value: 3 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const Inicio = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <Box 
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      textAlign="center"
      p={2}
    >
      <img src="/logo512.png" className="logo-animado" alt="Logotipo" /> {/* Asegúrate de tener el archivo logo.png en la carpeta public */}
      <Typography variant="h4" gutterBottom>
        ¡Bienvenido!
      </Typography>
      <Button 
        variant="outlined" 
        style={{ 
            position: 'absolute', 
            top: '14px', 
            right: '20px', 
            backgroundColor: 'white', // Fondo blanco
            color: 'black', // Texto blanco
            borderColor: 'secondary.main' // Color del borde del botón
            }} 
            onClick={handleLogout}
        >
            Logout
        </Button>
      <Grid container spacing={3} justifyContent="center" style={{ marginTop: '20px' }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Estadísticas Rápidas
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Noticias y Anuncios
              </Typography>
              <Typography variant="body2" component="p">
                - El próximo cuatrimestre comienza el 9 de septiembre.
              </Typography>
              <Typography variant="body2" component="p">
                - Nueva aula de informática disponible.
              </Typography>
              <Typography variant="body2" component="p">
                - Reunión de profesores el 15 de agosto.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Enlaces Rápidos
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" color="primary" component={Link} to="/aulas">
                  Gestionar Aulas
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" color="primary" component={Link} to="/estudiantes">
                  Gestionar Estudiantes
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" color="primary" component={Link} to="/profesores">
                  Gestionar Profesores
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" color="primary" component={Link} to="/inscripciones">
                  Gestionar Inscripciones
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" color="primary" component={Link} to="/clases">
                  Gestionar Clases
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" color="primary" component={Link} to="/horarios">
                  Gestionar Horarios
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" color="primary" component={Link} to="/horarioDia">
                  Gestionar Horario-Dias
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" color="primary" component={Link} to="/horarioAsignatura">
                  Gestionar Horario-Asignatura
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" color="primary" component={Link} to="/dias">
                  Gestionar Dias
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Inicio;
