// components/Admin/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
    FaUser,
    FaLock,
    FaEnvelope,
    FaIdCard,
    FaCalendarAlt,
    FaSave,
    FaKey,
    FaEye,
    FaEyeSlash,
    FaCheckCircle,
    FaExclamationCircle
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Settings = () => {
    const { admin, setAdmin } = useAuth();
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
        adminId: ''
    });

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Password validation
    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    useEffect(() => {
        if (admin) {
            setProfileForm({
                name: admin.name || '',
                email: admin.email || '',
                adminId: admin.adminId || ''
            });
        }
    }, [admin]);

    // Load admin profile data
    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                setProfileLoading(true);
                const token = localStorage.getItem('adminToken');
                const response = await axios.get(`${BASE_URL}/admin/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    setAdmin(response?.data?.data);
                }
            } catch (error) {
                console.error('Error fetching admin profile:', error);
                toast.error('Failed to load profile data');
            } finally {
                setProfileLoading(false);
            }
        };

        fetchAdminProfile();
    }, [setAdmin]);

    // Handle profile form changes
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle password form changes
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));

        // Password validation rules
        if (name === 'newPassword') {
            setPasswordValidation({
                length: value.length >= 6,
                uppercase: /[A-Z]/.test(value),
                lowercase: /[a-z]/.test(value),
                number: /[0-9]/.test(value),
                special: /[^A-Za-z0-9]/.test(value)
            });
        }
    };

    // Update profile
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.put(`${BASE_URL}/admin/profile`, profileForm, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                updateAdmin(response.data.data);
                toast.success('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            const message = error.response?.data?.message || 'Failed to update profile';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    // Change password
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.post(`${BASE_URL}/admin/change-password`, passwordForm, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                toast.success('Password changed successfully!');
                setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            const message = error.response?.data?.message || 'Failed to change password';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>

            {profileLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0b61a8]"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Information */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile Form */}
                        <div className="bg-white rounded-xl shadow border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <FaUser className="text-[#0b61a8]" />
                                    Profile Information
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Update your personal information
                                </p>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaUser className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                value={profileForm.name}
                                                onChange={handleProfileChange}
                                                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Admin ID
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaIdCard className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name="adminId"
                                                value={profileForm.adminId}
                                                disabled
                                                className="pl-10 w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg cursor-not-allowed"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Admin ID cannot be changed
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileForm.email}
                                            onChange={handleProfileChange}
                                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2.5 bg-[#0b61a8] text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaSave />
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Password Form */}
                        <div className="bg-white rounded-xl shadow border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <FaLock className="text-[#0b61a8]" />
                                    Change Password
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Update your password regularly for better security
                                </p>
                            </div>

                            <form onSubmit={handleChangePassword} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaKey className="text-gray-400" />
                                        </div>
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            name="currentPassword"
                                            value={passwordForm.currentPassword}
                                            onChange={handlePasswordChange}
                                            className="pl-10 pr-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaKey className="text-gray-400" />
                                            </div>
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                name="newPassword"
                                                value={passwordForm.newPassword}
                                                onChange={handlePasswordChange}
                                                className="pl-10 pr-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                            >
                                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaKey className="text-gray-400" />
                                            </div>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={passwordForm.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className="pl-10 pr-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Password Strength Indicator */}
                                {passwordForm.newPassword && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                            Password Strength
                                        </p>
                                        <div className="space-y-2">
                                            {[
                                                { key: 'length', text: 'At least 6 characters' },
                                                { key: 'uppercase', text: 'Contains uppercase letter' },
                                                { key: 'lowercase', text: 'Contains lowercase letter' },
                                                { key: 'number', text: 'Contains number' },
                                                { key: 'special', text: 'Contains special character' }
                                            ].map((rule) => (
                                                <div key={rule.key} className="flex items-center gap-2">
                                                    {passwordValidation[rule.key] ? (
                                                        <FaCheckCircle className="text-green-500" />
                                                    ) : (
                                                        <FaExclamationCircle className="text-gray-400" />
                                                    )}
                                                    <span className={`text-sm ${passwordValidation[rule.key] ? 'text-green-600' : 'text-gray-500'}`}>
                                                        {rule.text}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading || passwordForm.newPassword !== passwordForm.confirmPassword}
                                        className="px-6 py-2.5 bg-[#0b61a8] text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaKey />
                                        {loading ? 'Updating...' : 'Change Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column - Account Info */}
                    <div className="space-y-8">
                        {/* Account Summary */}
                        <div className="bg-white rounded-xl shadow border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Account Summary
                                </h3>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="w-24 h-24 rounded-full bg-linear-to-r from-[#0b61a8] to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                                        {admin?.name?.charAt(0).toUpperCase() || 'A'}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Account Status</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span className="font-medium text-green-600">Active</span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Role</p>
                                        <p className="font-medium text-gray-800">Super Administrator</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Member Since</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <FaCalendarAlt className="text-gray-400" />
                                            <span className="font-medium text-gray-800">
                                                {formatDate(admin?.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Last Updated</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <FaCalendarAlt className="text-gray-400" />
                                            <span className="font-medium text-gray-800">
                                                {formatDate(admin?.updatedAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Tips */}
                        <div className="bg-linear-to-r from-blue-50 to-gray-50 rounded-xl shadow border border-blue-100">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                  Security Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#0b61a8] mt-2"></div>
                                        <span className="text-sm text-gray-600">
                                            Use a strong, unique password
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#0b61a8] mt-2"></div>
                                        <span className="text-sm text-gray-600">
                                            Never share your login credentials
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#0b61a8] mt-2"></div>
                                        <span className="text-sm text-gray-600">
                                            Log out when not using the dashboard
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#0b61a8] mt-2"></div>
                                        <span className="text-sm text-gray-600">
                                            Regularly update your password
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
