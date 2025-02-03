import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { CalendarProvider } from './context/CalendarContext';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    
    <BrowserRouter>
      <AuthProvider>
        <CalendarProvider>
          <AppRoutes />
        </CalendarProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;