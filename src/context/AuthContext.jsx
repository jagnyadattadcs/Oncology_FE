// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

const API_URL = 'http://localhost:8080/api/admin'; // Change to your backend URL

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('login'); // 'login', 'otp', 'dashboard'

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    const storedAdmin = localStorage.getItem('adminData');
    
    if (storedToken && storedAdmin) {
      try {
        setToken(storedToken);
        setAdmin(JSON.parse(storedAdmin));
        setStep('dashboard');
      } catch (error) {
        console.error('Failed to parse stored admin data:', error);
        logout();
      }
    } else {
      setStep('login'); // Explicitly set to login if no token
    }
    
    setLoading(false);
  }, []);

  // Admin Login
  const adminLogin = async (adminId, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        adminId,
        password
      });

      if (response.data.success) {
        localStorage.setItem('tempAdminId', adminId);
        setStep('otp');
        return { success: true, message: response.data.message, adminId: response.data.adminId };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Verify OTP
  const verifyAdminOtp = async (adminId, otp) => {
    try {
      const response = await axios.post(`${API_URL}/verify-otp`, {
        adminId,
        otp
      });

      if (response.data.success && response.data.token) {
        // Save token and admin data
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminData', JSON.stringify(response.data.admin));
        
        setToken(response.data.token);
        setAdmin(response.data.admin);
        setStep('dashboard');
        
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'OTP verification failed'
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    localStorage.removeItem('tempAdminId');
    setToken(null);
    setAdmin(null);
    setStep('login');
  };

  const value = {
    admin,
    token,
    loading,
    step,
    setStep,
    adminLogin,
    verifyAdminOtp,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
