// src/App.js
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import Login from './components/Login';
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
import PrivateRoute from './components/PrivateRoute';
import authService from "./services/authServices";

const App = () => {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <div>
      <CssBaseline />
      <Navbar />
      <Container style={{ marginTop: '80px' }}> {/* Ajusta el margen superior aquí */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={isAuthenticated ? <Inicio /> : <Navigate to="/login" />} />
          <Route path="/aulas" element={isAuthenticated ? <PrivateRoute element={Aulas} /> : <Navigate to="/login" />} />
          <Route path="/estudiantes" element={isAuthenticated ? <PrivateRoute element={Estudiantes} /> : <Navigate to="/login" />} />
          <Route path="/profesores" element={isAuthenticated ? <PrivateRoute element={Profesores} /> : <Navigate to="/login" />} />
          <Route path="/inscripciones" element={isAuthenticated ? <PrivateRoute element={Inscripciones} /> : <Navigate to="/login" />} />
          <Route path="/clases" element={isAuthenticated ? <PrivateRoute element={Clases} /> : <Navigate to="/login" />} />
          <Route path="/horarios" element={isAuthenticated ? <PrivateRoute element={Horarios} /> : <Navigate to="/login" />} />
          <Route path="/dias" element={isAuthenticated ? <PrivateRoute element={Dias} /> : <Navigate to="/login" />} />
          <Route path="/horarioDia" element={isAuthenticated ? <PrivateRoute element={HorarioDia} /> : <Navigate to="/login" />} />
          <Route path="/horarioAsignatura" element={isAuthenticated ? <PrivateRoute element={HorarioAsignaturas} /> : <Navigate to="/login" />} />
          <Route path="/reporteUtilizacionAulas" element={isAuthenticated ? <PrivateRoute element={ReporteUtilizacionAulas} /> : <Navigate to="/login" />} />
          <Route path="/reporteHorariosProfesores" element={isAuthenticated ? <PrivateRoute element={ReporteHorariosProfesores} /> : <Navigate to="/login" />} />
          <Route path="/reporteHorariosEstudiantes" element={isAuthenticated ? <PrivateRoute element={ReporteHorariosEstudiantes} /> : <Navigate to="/login" />} />
          <Route path="/calendarioHorarios" element={isAuthenticated ? <PrivateRoute element={CalendarioHorarios} /> : <Navigate to="/login" />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
