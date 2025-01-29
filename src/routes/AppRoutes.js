import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import Home from '../components/Home';
import Login from '../components/Login';
import Register from '../components/Register';
import ManagerDashboard from '../components/ManagerDashboard';
import { useAuth } from '../context/AuthContext';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
      {/* <Route path="/dashboard/*" element={isAuthenticated ? <ManagerDashboard /> : <Navigate to="/login" />} /> */}
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/dashboard" element={<ManagerDashboard />} />
      
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;