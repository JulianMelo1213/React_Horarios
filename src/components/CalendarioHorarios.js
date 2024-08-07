import React, { useState, useEffect } from 'react';
import { Container, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import 'moment/locale/es'; // Para el idioma español
import api from '../services/api';

const CalendarioHorarios = () => {
  const [eventsByAula, setEventsByAula] = useState({});
  const [selectedAula, setSelectedAula] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerHorarios();
  }, []);

  const obtenerHorarios = async () => {
    try {
      const responseHorarios = await api.get('/horarios');
      const responseAsignaturas = await api.get('/horarioAsignatura');
      
      const asignaturasMap = responseAsignaturas.data.reduce((acc, asignatura) => {
        acc[asignatura.horarioId] = `${asignatura.nombreProfesor} ${asignatura.apellidoProfesor}`;
        return acc;
      }, {});

      const eventsByAula = responseHorarios.data.reduce((acc, horario) => {
        const aula = horario.nombreAula;
        const profesor = asignaturasMap[horario.horarioId] || 'Sin asignar';
        const events = generarEventosRecurrentes(horario, profesor);
        if (!acc[aula]) {
          acc[aula] = [];
        }
        acc[aula].push(...events);
        return acc;
      }, {});
      setEventsByAula(eventsByAula);
      setSelectedAula(Object.keys(eventsByAula)[0] || ''); // Seleccionar la primera aula por defecto
    } catch (error) {
      setError('Error al obtener los horarios');
      console.error('Error al obtener los horarios', error);
    }
  };

  const generarEventosRecurrentes = (horario, profesor) => {
    const eventos = [];
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const targetDay = diasSemana.indexOf(horario.nombreDia);

    for (let i = 0; i < 12; i++) { // Generar eventos para 12 semanas
      const start = transformarFechaHora(targetDay, horario.horaInicio, i);
      const end = transformarFechaHora(targetDay, horario.horaFin, i);
      eventos.push({
        id: `${horario.horarioId}-${i}`,
        title: `Clase: ${horario.nombreClase} - Profesor: ${profesor}`,
        start,
        end,
        allDay: false,
        date: moment(start).format('YYYY-MM-DD'),
        time: `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
        event: `Clase: ${horario.nombreClase} - Profesor: ${profesor}`,
      });
    }

    return eventos;
  };

  const transformarFechaHora = (targetDay, hora, weeksToAdd) => {
    const today = moment().startOf('week').add(weeksToAdd, 'weeks');
    const fechaHora = moment(today).add(targetDay, 'days').set({
      hour: hora.split(':')[0],
      minute: hora.split(':')[1]
    });
    return fechaHora.toDate();
  };

  const handleAulaChange = (event) => {
    setSelectedAula(event.target.value);
  };

  const columns = [
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'time', headerName: 'Time', width: 150 },
    { field: 'event', headerName: 'Event', width: 400 },
  ];

  return (
    <Container>
      <h2>Calendario de Horarios por Aula</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <FormControl fullWidth margin="normal">
        <Select value={selectedAula} onChange={handleAulaChange}>
          {Object.keys(eventsByAula).map(aula => (
            <MenuItem key={aula} value={aula}>{aula}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedAula && (
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={eventsByAula[selectedAula] || []}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </div>
      )}
    </Container>
  );
};

export default CalendarioHorarios;
