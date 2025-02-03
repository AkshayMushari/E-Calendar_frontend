import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import ManagerDashboard from '../components/Manager1';
import { useAuth } from '../context/AuthContext';
import Graphs from '../components/Graphs';
import EmployeeDetails from '../components/EmployeeDetails';
import NCalendarAndAttendance from '../components/New';
import Header from '../components/Header';
import '../App.css';
import HomePage from '../pages/HomePage';
import LoginPage from '../components/LoginPage';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="App">
        <Header />
    <Routes>
    <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={!isAuthenticated ? <EmployeeDetails /> : <Navigate to="/Managerdashboard" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/Managerdashboard" />} />
      {/* <Route path="/dashboard/*" element={isAuthenticated ? <ManagerDashboard /> : <Navigate to="/login" />} /> */}
      <Route path="/employeedashboard" element={<EmployeeDetails />} />
      <Route path="/Managerdashboard" element={<NCalendarAndAttendance />} />
      <Route path="/graph3" element={<Graphs />} />
    </Routes>
    
    </div>
  );
};

export default AppRoutes;