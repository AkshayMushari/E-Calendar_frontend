// src/context/CalendarContext.js
import React, { createContext, useContext, useState } from 'react';

const CalendarContext = createContext(null);

export const CalendarProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month');

  const addEvent = (event) => {
    setEvents([...events, event]);
  };

  const updateEvent = (updatedEvent) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  return (
    <CalendarContext.Provider value={{
      events,
      selectedDate,
      view,
      setSelectedDate,
      setView,
      addEvent,
      updateEvent
    }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => useContext(CalendarContext);