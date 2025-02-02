import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import ManagerDashboard from '../components/Manager1';
import { useAuth } from '../context/AuthContext';
import Graphs from '../components/Graphs';
import EmployeeDetails from '../components/EmployeeDetails';
import NCalendarAndAttendance from '../components/New';
// import Visualization from '../components/Visualization';
// import Piechart from '../dummy/Piechart';
// import Manager2 from '../dummy/Manager2';
// import Design from '../dummy/Design';
// import DashboardGraphs from '../components/DashboardGraphs'
// import EventTypeDonut from '../components/EventTypeDonut';
// import Calendar from '../components/Calendar';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard/*" element={isAuthenticated ? <ManagerDashboard /> : <Navigate to="/login" />} />
      <Route path="/employeedashboard" element={<EmployeeDetails />} />
      <Route path="/Managerdashboard" element={<NCalendarAndAttendance />} />
      <Route path="/graph3" element={<Graphs />} />
      {/* <Route path="/" element={<Home />} /> */}
      {/* <Route path="/dashboard" element={<ManagerDashboard />} /> */}
      {/* <Route path="/Calendar" element={<Calendar />} /> */}
      {/* <Route path="/graph1" element={<EventTypeDonut />} /> */}
      {/* <Route path="/" element={<Navigate to="/dashboard" />} /> */}
      {/* <Route path="/team" element={<CalendarAndAttendance />} /> */}
    </Routes>
  );
};

export default AppRoutes;