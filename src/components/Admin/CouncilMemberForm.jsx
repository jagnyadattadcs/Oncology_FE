// components/Admin/CouncilMemberForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaHospital, FaCalendar, FaGraduationCap, FaBriefcaseMedical, FaAward, FaUpload, FaSpinner } from 'react-icons/fa';

const CouncilMemberForm = ({ member, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: '',
    email: '',
    phone: '',
    bio: '',
    dateOfJoining: '',
    role: 'Executive-Member',
    currHospital: [{ name: '' }],
    qualification: [''],
    specialization: [''],
    achievements: [''],
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Initialize form with member data if editing
  useEffect(() => {
    if (member) {
      setFormData({
        id: member.id || '',
        name: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        bio: member.bio || '',
        dateOfJoining: member.dateOfJoining ? new Date(member.dateOfJoining).toISOString().split('T')[0] : '',
        role: member.role || 'Executive-Member',
        currHospital: member.currHospital && member.currHospital.length > 0 
          ? member.currHospital 
          : [{ name: '' }],
        qualification: member.qualification && member.qualification.length > 0 
          ? member.qualification 
          : [''],
        specialization: member.specialization && member.specialization.length > 0 
          ? member.specialization 
          : [''],
        achievements: member.achievements && member.achievements.length > 0 
          ? member.achievements 
          : [''],
        image: null
      });
      if (member.imageUrl) {
        setPreviewImage(member.imageUrl);
      }
    }
  }, [member]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle array field changes
  const handleArrayFieldChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  // Add new item to array field
  const addArrayFieldItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  // Remove item from array field
  const removeArrayFieldItem = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  // Handle hospital field changes
  const handleHospitalChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      currHospital: prev.currHospital.map((item, i) => 
        i === index ? { ...item, name: value } : item
      )
    }));
  };

  // Add new hospital
  const addHospital = () => {
    setFormData(prev => ({
      ...prev,
      currHospital: [...prev.currHospital, { name: '' }]
    }));
  };

  // Remove hospital
  const removeHospital = (index) => {
    if (formData.currHospital.length > 1) {
      setFormData(prev => ({
        ...prev,
        currHospital: prev.currHospital.filter((_, i) => i !== index)
      }));
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      
      // Prepare form data
      const submitFormData = new FormData();
      submitFormData.append("id", formData.id);
      submitFormData.append('name', formData.name);
      submitFormData.append('email', formData.email);
      submitFormData.append('phone', formData.phone);
      submitFormData.append('bio', formData.bio);
      submitFormData.append('role', formData.role);
      
      if (formData.dateOfJoining) {
        submitFormData.append('dateOfJoining', formData.dateOfJoining);
      }
      
      submitFormData.append('currHospital', JSON.stringify(
        formData.currHospital.filter(h => h.name.trim() !== '')
      ));
      submitFormData.append('qualification', JSON.stringify(
        formData.qualification.filter(q => q.trim() !== '')
      ));
      submitFormData.append('specialization', JSON.stringify(
        formData.specialization.filter(s => s.trim() !== '')
      ));
      submitFormData.append('achievements', JSON.stringify(
        formData.achievements.filter(a => a.trim() !== '')
      ));
      
      if (formData.image) {
        submitFormData.append('image', formData.image);
      }

      let response;
      if (member) {
        // Update existing member
        response = await axios.put(
          `${BASE_URL}/councilmember/${member._id}`,
          submitFormData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        // Create new member
        response = await axios.post(
          `${BASE_URL}/councilmember`,
          submitFormData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      if (response.data.success) {
        toast.success(member ? 'Council member updated successfully!' : 'Council member added successfully!');
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving council member:', error);
      toast.error(error.response?.data?.message || 'Failed to save council member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center z-1">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {member ? 'Edit Council Member' : 'Add New Council Member'}
            </h3>
            <p className="text-sm text-gray-500">
              {member ? 'Update council member information' : 'Fill in the details to add a new council member'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div>
              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Profile Image <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                      {previewImage ? (
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaUser className="text-4xl text-gray-400" />
                        </div>
                      )}
                    </div>
                    <label
                      htmlFor="image-upload"
                      className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition"
                    >
                      <FaUpload />
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required={!member}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Upload a clear profile photo</p>
                    <p className="text-xs text-gray-500">
                      Recommended: 500×500 pixels, Max 5MB
                      {member && <span className="block mt-1">Leave empty to keep current image</span>}
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Enter Member Id"
                      required
                    />
                  </div>
                </div>
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
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Joining
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendar className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="dateOfJoining"
                      value={formData.dateOfJoining}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  >
                    <option value="Executive-Member">Executive Member</option>
                    <option value="President">President</option>
                    <option value="Past-President">Past President</option>
                    <option value="Vice-President">Vice President</option>
                    <option value="Secretary">Secretary</option>
                    <option value="Joint-Secretary">Joint Secretary</option>
                    <option value="Treasurer">Treasurer</option>
                    <option value="Editor">Editor</option>
                    <option value="Advisory-Board-Member">Advisory Board Member</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column - Professional Details */}
            <div>
              {/* Biography */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biography <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter professional biography"
                  required
                />
              </div>

              {/* Current Hospitals */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Current Hospital(s)
                  </label>
                  <button
                    type="button"
                    onClick={addHospital}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <FaHospital /> Add Hospital
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.currHospital.map((hospital, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaHospital className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={hospital.name}
                          onChange={(e) => handleHospitalChange(index, e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                          placeholder="Enter hospital name"
                        />
                      </div>
                      {formData.currHospital.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHospital(index)}
                          className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Qualifications */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Qualifications <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayFieldItem('qualification')}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <FaGraduationCap /> Add
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.qualification.map((qual, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaGraduationCap className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={qual}
                          onChange={(e) => handleArrayFieldChange('qualification', index, e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                          placeholder="Enter qualification"
                          required={index === 0}
                        />
                      </div>
                      {formData.qualification.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayFieldItem('qualification', index)}
                          className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Specializations */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Specializations <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayFieldItem('specialization')}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <FaBriefcaseMedical /> Add
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.specialization.map((spec, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaBriefcaseMedical className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={spec}
                          onChange={(e) => handleArrayFieldChange('specialization', index, e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                          placeholder="Enter specialization"
                          required={index === 0}
                        />
                      </div>
                      {formData.specialization.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayFieldItem('specialization', index)}
                          className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Achievements
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayFieldItem('achievements')}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <FaAward /> Add
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.achievements.map((achievement, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaAward className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={achievement}
                          onChange={(e) => handleArrayFieldChange('achievements', index, e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                          placeholder="Enter achievement"
                        />
                      </div>
                      {formData.achievements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayFieldItem('achievements', index)}
                          className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="sticky bottom-0 bg-white pt-6 border-t border-gray-200 mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  {member ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {member ? 'Update Member' : 'Add Member'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouncilMemberForm;
