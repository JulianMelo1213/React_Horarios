// src/App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import Inicio from './components/Inicio';
import Aulas from './components/Aulas';
import Estudiantes from './components/Estudiantes';
import Profesores from './components/Profesores';
import Navbar from './components/Navbar';

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
        </Routes>
      </Container>
    </div>
  );
};

export default App;
