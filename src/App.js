import React from 'react';
import { Route, Routes } from 'react-router-dom';
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
import Navbar from './components/Navbar';
import ReporteUtilizacionAulas from './components/ReporteUtilizacionAulas';
import ReporteHorariosProfesores from './components/ReporteHorariosProfesores';
import ReporteHorariosEstudiantes from './components/ReporteHorariosEstudiantes';

const App = () => {
  return (
    <div>
      <CssBaseline />
      <Navbar />
      <Container style={{ marginTop: '20px' }}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/aulas" element={<Aulas />} />
          <Route path="/estudiantes" element={<Estudiantes />} />
          <Route path="/profesores" element={<Profesores />} />
          <Route path="/inscripciones" element={<Inscripciones />} />
          <Route path="/clases" element={<Clases />} />
          <Route path="/horarios" element={<Horarios />} />
          <Route path="/dias" element={<Dias />} />
          <Route path="/horarioDia" element={<HorarioDia />} />
          <Route path="/horarioAsignatura" element={<HorarioAsignaturas />} />
          <Route path="/reporte/utilizacion-aulas" element={<ReporteUtilizacionAulas />} />
          <Route path="/reporte/horarios-profesores" element={<ReporteHorariosProfesores />} />
          <Route path="/reporte/horarios-estudiantes" element={<ReporteHorariosEstudiantes />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
