import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Paper } from '@mui/material';
import './Inicio.css'; // Importamos el archivo de estilos para la animación
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import api from '../services/api'; // Asegúrate de que esta ruta sea correcta

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0', '#50C878', '#E97451'];

const Inicio = () => {
  const [data, setData] = useState([]);
  const [news, setNews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aulasResponse, estudiantesResponse, profesoresResponse] = await Promise.all([
          api.get('/aulas'), // Reemplaza con tu endpoint
          api.get('/estudiantes'), // Reemplaza con tu endpoint
          api.get('/profesores') // Reemplaza con tu endpoint
        ]);

        setData([
          { name: 'Aulas', value: aulasResponse.data.length },
          { name: 'Estudiantes', value: estudiantesResponse.data.length },
          { name: 'Profesores', value: profesoresResponse.data.length },
        ]);

        // Aquí puedes obtener noticias desde una API o definir algunas noticias estáticas
        setNews([
          { id: 1, title: 'Inicio de clases', date: '01/09/2024', description: 'El próximo ciclo escolar comienza el 1 de septiembre de 2024.' },
          { id: 2, title: 'Exámenes finales', date: '15/12/2024', description: 'Los exámenes finales se llevarán a cabo del 15 al 20 de diciembre.' },
          { id: 3, title: 'Festival de ciencia', date: '10/10/2024', description: 'El festival anual de ciencia será el 10 de octubre. ¡Todos están invitados!' },
          { id: 4, title: 'Reunión de padres', date: '20/11/2024', description: 'Reunión de padres para discutir el progreso de los estudiantes.' },
          { id: 5, title: 'Vacaciones de invierno', date: '22/12/2024', description: 'Las vacaciones de invierno serán del 22 de diciembre al 5 de enero.' },
          { id: 6, title: 'Día de la educación', date: '25/09/2024', description: 'Celebramos el día de la educación con actividades especiales.' },
          { id: 7, title: 'Concurso de talentos', date: '05/11/2024', description: 'Participa en el concurso de talentos el 5 de noviembre.' }
        ]);
      } catch (error) {
        console.error("Error fetching data", error);
        setError('Error fetching data'); // Guardar el error en el estado
      }
    };

    fetchData();
  }, []);

  return (
    <Box 
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      textAlign="center"
      p={2}
    >
      <Box mt={4} width="80%">
        <Carousel showArrows={true} showThumbs={false} autoPlay interval={3000} infiniteLoop>
          <div>
            <img src="/noticia.jpg" alt="Imagen 1" style={{ maxHeight: '400px', objectFit: 'contain' }} />
            <p className="legend">Noticia importante.</p>
          </div>
          <div>
            <img src="/omar2.jpg" alt="Imagen 2" style={{ maxHeight: '400px', objectFit: 'contain' }} />
            <p className="legend">El momento en el que nuestro estudiante estelar Omar Guillermo ganó las olimpiadas tecnológicas.</p>
          </div>
          <div>
            <img src="/anime.png" alt="Imagen 3" style={{ maxHeight: '400px', objectFit: 'contain' }} />
            <p className="legend">Noticias del anime.</p>
          </div>
        </Carousel>
      </Box>
      {error && (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      )}
      <Grid container spacing={3} justifyContent="center" style={{ marginTop: '40px' }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '40px' }}>
            <Typography variant="h6" gutterBottom>
              Estadísticas Rápidas
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
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
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '40px' }}>
            <Typography variant="h6" gutterBottom>
              Noticias Escolares
            </Typography>
            <Carousel showArrows={true} showThumbs={false} autoPlay interval={5000} infiniteLoop>
              {news.map(noticia => (
                <div key={noticia.id}>
                  <Typography variant="h6">{noticia.title}</Typography>
                  <Typography variant="subtitle2">{noticia.date}</Typography>
                  <Typography variant="body1">{noticia.description}</Typography>
                </div>
              ))}
            </Carousel>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Inicio;
