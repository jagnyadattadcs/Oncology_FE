import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MemberContext = createContext();

export const useMember = () => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMember must be used within MemberProvider');
  }
  return context;
};

export const MemberProvider = ({ children }) => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Check if member is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('memberToken');
    const memberData = localStorage.getItem('memberData');
    
    if (token && memberData) {
      try {
        setMember(JSON.parse(memberData));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing member data:', error);
        logout();
      }
    }
  }, []);

  // Member Login
  const login = async (uniqueId, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/member/login`, {
        uniqueId,
        password
      });

      if (response.data.success) {
        const { member, requiresPasswordChange } = response.data;
        
        // Store token and member data
        localStorage.setItem('memberToken', response.data.token || 'dummy-token');
        localStorage.setItem('memberData', JSON.stringify(member));
        
        setMember(member);
        setIsAuthenticated(true);
        
        toast.success('Login successful!');
        
        return {
          success: true,
          requiresPasswordChange,
          member
        };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
      return { success: false, message: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  // Member Logout
  const logout = () => {
    localStorage.removeItem('memberToken');
    localStorage.removeItem('memberData');
    setMember(null);
    setIsAuthenticated(false);
    toast.info('Logged out successfully');
  };

  // Member Registration
  const register = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/member/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Registration submitted successfully!');
        return {
          success: true,
          email: response.data.email,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      return { success: false, message: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async (email, otp) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/member/verify-otp`, {
        email,
        otp
      });

      if (response.data.success) {
        toast.success(response.data.message || 'OTP verified successfully!');
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(error.response?.data?.message || 'OTP verification failed.');
      return { success: false, message: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async (email) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/member/resend-otp`, {
        email
      });

      if (response.data.success) {
        toast.success(response.data.message || 'OTP resent successfully!');
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error(error.response?.data?.message || 'Failed to resend OTP.');
      return { success: false, message: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  // Change Password
  const changePassword = async (uniqueId, currentPassword, newPassword) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/member/change-password`, {
        uniqueId,
        currentPassword,
        newPassword
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Password changed successfully!');
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message || 'Password change failed');
      }
    } catch (error) {
      console.error('Change password error:', error);
      toast.error(error.response?.data?.message || 'Password change failed.');
      return { success: false, message: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  // Get Member Profile
  const getProfile = async (uniqueId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('memberToken');
      const response = await axios.get(`${BASE_URL}/member/profile/${uniqueId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        return { success: true, profile: response.data.member };
      } else {
        throw new Error(response.data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Get profile error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch profile.');
      return { success: false, message: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  // Update Member Profile
  const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('memberToken'); // if using JWT
      const response = await axios.put(
        `${BASE_URL}/member/profile/${member.uniqueId}`,
        profileData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setMember(response.data.member); // Update context with new data
      }
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: error.response?.data?.message || 'Update failed' };
    }
  };

  // Forgot Password (to be implemented with backend)
  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      // This endpoint needs to be created in backend
      const response = await axios.post(`${BASE_URL}/member/forgot-password`, {
        email
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Password reset instructions sent to email!');
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message || 'Failed to process request');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(error.response?.data?.message || 'Failed to process request.');
      return { success: false, message: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    member,
    loading,
    isAuthenticated,
    login,
    logout,
    register,
    verifyOtp,
    resendOtp,
    changePassword,
    getProfile,
    updateProfile,
    forgotPassword
  };

  return (
    <MemberContext.Provider value={value}>
      {children}
    </MemberContext.Provider>
  );
};
