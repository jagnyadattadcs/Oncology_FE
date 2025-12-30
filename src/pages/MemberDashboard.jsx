import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMember } from '../context/MemberContext';
import { 
  FaUser, FaSignOutAlt, FaHistory, FaIdCard, FaCalendar, 
  FaFileAlt, FaCheckCircle, FaEdit, FaSave, FaTimes, 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaBuilding,
  FaBriefcase, FaStethoscope
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const MemberDashboard = () => {
  const { member, logout, updateProfile } = useMember();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: '',
    speciality: '',
    designation: '',
    hospital: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Speciality options (same as registration)
  const specialityOptions = [
    { value: 'surgical_oncology', label: 'Surgical Oncology' },
    { value: 'radiation_oncology', label: 'Radiation Oncology' },
    { value: 'medical_oncology', label: 'Medical Oncology' },
    { value: 'paediatric_oncology', label: 'Paediatric Oncology' },
    { value: 'haematology_haematooncology', label: 'Haematology & Haemato-oncology' },
    { value: 'gynaecologic_oncology', label: 'Gynaecologic Oncology' },
    { value: 'head_neck_oncology', label: 'Head and Neck Oncology' },
    { value: 'oncopathology', label: 'Oncopathology' },
    { value: 'uro_oncology', label: 'Uro-Oncology' },
    { value: 'radiology', label: 'Radiology' },
    { value: 'nuclear_medicine', label: 'Nuclear Medicine' },
    { value: 'palliative_care', label: 'Palliative Care' },
    { value: 'others', label: 'Others' }
  ];

  useEffect(() => {
    if (!member) {
      navigate('/member/login');
    } else {
      // Initialize edit form with member data
      setEditForm({
        name: member.name || '',
        phone: member.phone || '',
        email: member.email || '',
        speciality: member.speciality || '',
        designation: member.designation || '',
        hospital: member.hospital || '',
        address: member.address || ''
      });
    }
  }, [member, navigate]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form on cancel
      setEditForm({
        name: member.name || '',
        phone: member.phone || '',
        email: member.email || '',
        speciality: member.speciality || '',
        designation: member.designation || '',
        hospital: member.hospital || '',
        address: member.address || ''
      });
      setMessage({ type: '', text: '' });
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await updateProfile(editForm);
      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/member/login');
  };

  const availableSoon = () => {
    toast.info("This feature will available soon!");
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#326EAC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#326EAC] text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">OSO Member Dashboard</h1>
              <p className="text-white/80">Welcome back, {member.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-white/80">ID: {member.uniqueId}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-[#326EAC] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {member.name?.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.email}</p>
                <div className="mt-2">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Active Member
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition"
                >
                  <FaUser className="text-gray-400" />
                  <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
                </button>
                <button onClick={() => availableSoon()} className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition">
                  <FaIdCard className="text-gray-400" />
                  <span>Member Card</span>
                </button>
                <button onClick={() => availableSoon()} className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition">
                  <FaCalendar className="text-gray-400" />
                  <span>Events & Conferences</span>
                </button>
                <button onClick={() => availableSoon()} className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition">
                  <FaFileAlt className="text-gray-400" />
                  <span>Documents & Resources</span>
                </button>
                <button onClick={() => availableSoon()} className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition">
                  <FaHistory className="text-gray-400" />
                  <span>Activity History</span>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Membership Status</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member ID:</span>
                  <span className="font-medium">{member.uniqueId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Joined:</span>
                  <span className="font-medium">
                    {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">Approved</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Verification:</span>
                  <span className="font-medium text-green-600">Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Profile Editing */}
          <div className="lg:col-span-3">
            {/* Welcome Card */}
            <div className="bg-linear-to-r from-[#326EAC] to-blue-600 rounded-xl shadow-lg p-6 text-white mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">My Profile</h2>
                  <p className="text-white/90">
                    {isEditing 
                      ? 'Update your personal and professional information below.' 
                      : 'View and manage your profile information.'
                    }
                  </p>
                </div>
                {!isEditing && (
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
                  >
                    <FaEdit /> Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Profile Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={editForm.phone}
                          onChange={handleChange}
                          required
                          pattern="[0-9]{10}"
                          maxLength="10"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition"
                          placeholder="Enter 10-digit mobile number"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleChange}
                          required
                          disabled
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                          placeholder="Your email address"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>
                    </div>

                    {/* Designation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Designation
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaBriefcase className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="designation"
                          value={editForm.designation}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition"
                          placeholder="e.g., Senior Consultant"
                        />
                      </div>
                    </div>

                    {/* Speciality */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Speciality <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaStethoscope className="text-gray-400" />
                        </div>
                        <select
                          name="speciality"
                          value={editForm.speciality}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition appearance-none"
                        >
                          <option value="">Select Speciality</option>
                          {specialityOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Hospital */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hospital / Institution
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaBuilding className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="hospital"
                          value={editForm.hospital}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition"
                          placeholder="Enter hospital name"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address - Full width */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Residential Address
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3">
                        <FaMapMarkerAlt className="text-gray-400" />
                      </div>
                      <textarea
                        name="address"
                        value={editForm.address}
                        onChange={handleChange}
                        rows="3"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition resize-none"
                        placeholder="Enter your complete residential address"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleEditToggle}
                      disabled={isLoading}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium flex items-center gap-2"
                    >
                      <FaTimes /> Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 bg-[#326EAC] text-white rounded-lg hover:bg-[#2a5c8f] transition font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave /> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Profile View Mode */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                      <p className="text-gray-900 font-medium text-lg">{member.name}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Mobile Number</label>
                      <p className="text-gray-900 font-medium">{member.phone}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                      <p className="text-gray-900">{member.email}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Designation</label>
                      <p className="text-gray-900">{member.designation || 'Not specified'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Speciality</label>
                      <p className="text-gray-900">
                        {specialityOptions.find(s => s.value === member.speciality)?.label || member.speciality || 'Not specified'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Hospital/Institution</label>
                      <p className="text-gray-900">{member.hospital || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Residential Address</label>
                    <p className="text-gray-900 whitespace-pre-line">{member.address || 'Not specified'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
                <button className="text-sm text-[#326EAC] hover:text-[#2a5c8f] font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Membership Approved</p>
                    <p className="text-sm text-gray-600">Your membership was approved by admin</p>
                  </div>
                  <div className="ml-auto text-sm text-gray-500">
                    {member.adminReviewedAt ? new Date(member.adminReviewedAt).toLocaleDateString() : 'Recent'}
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Profile Created</p>
                    <p className="text-sm text-gray-600">Your member profile was created successfully</p>
                  </div>
                  <div className="ml-auto text-sm text-gray-500">
                    {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'Recent'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
