// src/App.js
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import Inicio from './components/Inicio';
import Aulas from './components/Aulas';
import Estudiantes from './components/Estudiantes';
import Profesores from './components/Profesores';
import Inscripciones from './components/Inscripciones';
import Clases from './components/Clases';
import Horarios from './components/Horarios';
import Dias from './components/Dias';
import HorarioDia from './components/HorarioDia';
import HorarioAsignaturas from './components/HorarioAsignaturas';
import ReporteUtilizacionAulas from './components/ReporteUtilizacionAulas';
import ReporteHorariosProfesores from './components/ReporteHorariosProfesores';
import ReporteHorariosEstudiantes from './components/ReporteHorariosEstudiantes';
import CalendarioHorarios from './components/CalendarioHorarios';
import Navbar from './components/Navbar';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  const isAuthenticated = !!sessionStorage.getItem('user');

  return (
    <div>
      <CssBaseline />
      <Navbar />
      <Container style={{ marginTop: '20px' }}>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="/" element={<PrivateRoute component={Inicio} />} />
          <Route path="/aulas" element={<PrivateRoute component={Aulas} />} />
          <Route path="/estudiantes" element={<PrivateRoute component={Estudiantes} />} />
          <Route path="/profesores" element={<PrivateRoute component={Profesores} />} />
          <Route path="/inscripciones" element={<PrivateRoute component={Inscripciones} />} />
          <Route path="/clases" element={<PrivateRoute component={Clases} />} />
          <Route path="/horarios" element={<PrivateRoute component={Horarios} />} />
          <Route path="/dias" element={<PrivateRoute component={Dias} />} />
          <Route path="/horarioDia" element={<PrivateRoute component={HorarioDia} />} />
          <Route path="/horarioAsignatura" element={<PrivateRoute component={HorarioAsignaturas} />} />
          <Route path="/reporteUtilizacionAulas" element={<PrivateRoute component={ReporteUtilizacionAulas} />} />
          <Route path="/reporteHorariosProfesores" element={<PrivateRoute component={ReporteHorariosProfesores} />} />
          <Route path="/reporteHorariosEstudiantes" element={<PrivateRoute component={ReporteHorariosEstudiantes} />} />
          <Route path="/calendarioHorarios" element={<PrivateRoute component={CalendarioHorarios} />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;

