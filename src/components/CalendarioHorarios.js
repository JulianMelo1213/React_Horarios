// src/components/CalendarioHorarios.js
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarioHorarios.css';
import api from '../services/api';

const localizer = momentLocalizer(moment);

const CalendarioHorarios = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerHorarios();
  });

  const obtenerHorarios = async () => {
    try {
      const response = await api.get('/horarios');
      console.log(response.data); // Para verificar los datos
      const horarios = response.data.map(horario => ({
        title: `Clase: ${horario.nombreClase} - Aula: ${horario.nombreAula}`,
        start: transformarFechaHora(horario.nombreDia, horario.horaInicio),
        end: transformarFechaHora(horario.nombreDia, horario.horaFin),
      }));
      setEvents(horarios);
    } catch (error) {
      setError('Error al obtener los horarios');
      console.error('Error al obtener los horarios', error);
    }
  };

  const transformarFechaHora = (dia, hora) => {
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const today = moment().startOf('week');
    const targetDay = diasSemana.indexOf(dia);
    const fechaHora = moment(today).add(targetDay, 'days').set({
      hour: hora.split(':')[0],
      minute: hora.split(':')[1]
    });
    return fechaHora.toDate();
  };

  return (
    <div className="calendar-container">
      <h2>Calendario de Horarios</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        eventPropGetter={() => ({
          className: 'calendar-event',
        })}
      />
    </div>
  );
};

export default CalendarioHorarios;
