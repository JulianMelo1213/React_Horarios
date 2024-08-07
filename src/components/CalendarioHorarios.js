import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarioHorarios.css';
import api from '../services/api';
import { Container, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const localizer = momentLocalizer(moment);

const classColors = {
  Matemáticas: '#FF5733',
  Historia: '#33FF57',
  Biología: '#3357FF',
  // Añadir más clases y colores aquí
};

const CalendarioHorarios = () => {
  const [eventsByAula, setEventsByAula] = useState({});
  const [selectedAula, setSelectedAula] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerHorarios();
    console.log(obtenerHorarios())
  }, []);

  const obtenerHorarios = async () => {
    try {
      const responseHorarios = await api.get('/horarios');
      const responseAsignaturas = await api.get('/horarioAsignatura');
      
      const asignaturasMap = responseAsignaturas.data.reduce((acc, asignatura) => {
        acc[asignatura.horarioId] = asignatura.nombreProfesor + " " + asignatura.apellidoProfesor;
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
        title: `Clase: ${horario.nombreClase} - Profesor: ${profesor}`,
        start,
        end,
        allDay: false,
        resource: {
          clase: horario.nombreClase,
          profesor,
          aula: horario.nombreAula,
        }
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

  const eventStyleGetter = (event) => {
    const backgroundColor = classColors[event.resource?.clase] || '#3174ad';
    const style = {
      backgroundColor,
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    return {
      style,
    };
  };

  const handleAulaChange = (event) => {
    setSelectedAula(event.target.value);
  };

  return (
    <Container>
      <h2>Calendario de Horarios por Aula</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <FormControl fullWidth margin="normal">
        <InputLabel>Aula</InputLabel>
        <Select value={selectedAula} onChange={handleAulaChange}>
          {Object.keys(eventsByAula).map(aula => (
            <MenuItem key={aula} value={aula}>{aula}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedAula && (
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={eventsByAula[selectedAula] || []}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            eventPropGetter={eventStyleGetter}
            views={['agenda']}
            defaultView="agenda"
            messages={{
              agenda: 'Agenda',
              noEventsInRange: 'No hay eventos en este rango'
            }}
          />
        </div>
      )}
    </Container>
  );
};

export default CalendarioHorarios;
