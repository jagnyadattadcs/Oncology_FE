// components/Admin/AdminPage.js
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminOtpVerification from '../../pages/AdminOtpVerification';
import AdminDashboard from './AdminDashboard';

const AdminPage = () => {
  const { admin, step, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0b61a8]"></div>
      </div>
    );
  }

  return (
    <div className="admin-portal">
      <Routes>
        {/* Redirect based on auth state */}
        <Route 
          path="/" 
          element={
            step === 'dashboard' && admin ? 
            <Navigate to="dashboard" replace /> : 
            <Navigate to="login" replace />
          } 
        />
        
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/verify-otp" element={<AdminOtpVerification />} />
        
        <Route 
          path="/dashboard/*" 
          element={
            step === 'dashboard' && admin ? 
            <AdminDashboard /> : 
            <Navigate to="/admin/login" replace />
          } 
        />
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </div>
  );
};

export default AdminPage;
