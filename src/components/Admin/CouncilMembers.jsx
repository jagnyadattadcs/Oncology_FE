// components/Admin/CouncilMembers.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaTrash, 
  FaUser, 
  FaEnvelope,
  FaPhone,
  FaHospital,
  FaGraduationCap,
  FaBriefcaseMedical,
  FaAward,
  FaCalendar,
  FaPlus,
  FaSpinner,
  FaTimes,
  FaCheck,
  FaEye,
  FaDownload,
  FaUserTie,
  FaUserShield,
  FaUserCheck,
  FaUserMd,
  FaIdBadge,
  FaRegIdCard
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import CouncilMemberForm from './CouncilMemberForm';

const CouncilMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    president: 0,
    vicePresident: 0,
    secretary: 0,
    treasurer: 0,
    executive: 0
  });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch all council members
  const fetchCouncilMembers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${BASE_URL}/councilmember`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setMembers(response.data.data);
        calculateStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching council members:', error);
      toast.error('Failed to load council members');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${BASE_URL}/councilmember/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const calculateStats = (membersList) => {
    const stats = {
      total: membersList.length,
      president: membersList.filter(m => m.role === 'President').length,
      vicePresident: membersList.filter(m => m.role === 'Vice-President').length,
      secretary: membersList.filter(m => m.role === 'Secretary').length,
      treasurer: membersList.filter(m => m.role === 'Treasurer').length,
      executive: membersList.filter(m => m.role === 'Executive-Member').length
    };
    setStats(stats);
  };

  useEffect(() => {
    fetchCouncilMembers();
    fetchStats();
  }, []);

  // Filter members based on search and role filter
  const filteredMembers = members.filter(member => {
    // Search filter
    const searchMatch = searchTerm === '' || 
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone?.includes(searchTerm) ||
      member.specialization?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      member.qualification?.some(q => q.toLowerCase().includes(searchTerm.toLowerCase()));

    // Role filter
    let roleMatch = true;
    if (roleFilter !== 'all') {
      roleMatch = member.role === roleFilter;
    }

    return searchMatch && roleMatch;
  });

  // Add new member
  const handleAddMember = () => {
    setEditingMember(null);
    setShowForm(true);
  };

  // Edit member
  const handleEditMember = (member) => {
    setEditingMember(member);
    setShowForm(true);
  };

  // Delete member
  const handleDeleteMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to delete this council member? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(`${BASE_URL}/councilmember/${memberId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Council member deleted successfully');
        fetchCouncilMembers();
        fetchStats();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete member');
    }
  };

  // View member details
  const handleViewDetails = (member) => {
    setSelectedMember(member);
    setShowDetails(true);
  };

  // Close form
  const handleFormClose = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  // Handle form submission success
  const handleFormSuccess = () => {
    fetchCouncilMembers();
    fetchStats();
    handleFormClose();
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Role', 'Qualifications', 'Specializations', 'Current Hospitals', 'Achievements'],
      ...members.map(m => [
        m.name,
        m.email,
        m.phone,
        m.role,
        `"${m.qualification.join(', ')}"`,
        `"${m.specialization.join(', ')}"`,
        `"${m.currHospital.map(h => h.name).join(', ')}"`,
        `"${m.achievements.join(', ')}"`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `osoo-council-members-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('Council members exported to CSV successfully');
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case 'President': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Vice-President': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Secretary': return 'bg-green-100 text-green-800 border-green-200';
      case 'Treasurer': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Executive-Member': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case 'President': return <FaUserTie className="inline mr-1" />;
      case 'Vice-President': return <FaUserShield className="inline mr-1" />;
      case 'Secretary': return <FaUserCheck className="inline mr-1" />;
      case 'Treasurer': return <FaIdBadge className="inline mr-1" />;
      default: return <FaUserMd className="inline mr-1" />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Council Members</h2>
          <p className="text-gray-600 mt-1">Manage OSOO Council Members and their information</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchCouncilMembers()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition"
          >
            <FaUser /> Refresh
          </button>
          <button
            onClick={handleAddMember}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition"
          >
            <FaPlus /> Add Member
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition"
          >
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <FaUser className="text-xl text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total</p>
              <p className="text-2xl font-bold text-gray-700">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaUserTie className="text-xl text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">President</p>
              <p className="text-2xl font-bold text-purple-700">{stats.president}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaUserShield className="text-xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Vice President</p>
              <p className="text-2xl font-bold text-blue-700">{stats.vicePresident}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FaUserCheck className="text-xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Secretary</p>
              <p className="text-2xl font-bold text-green-700">{stats.secretary}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FaIdBadge className="text-xl text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-yellow-600 font-medium">Treasurer</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.treasurer}</p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FaUserMd className="text-xl text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-indigo-600 font-medium">Executive</p>
              <p className="text-2xl font-bold text-indigo-700">{stats.executive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Search by name, email, specialization, qualification..."
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="w-full md:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none"
              >
                <option value="all">All Roles</option>
                <option value="President">President</option>
                <option value="Vice-President">Vice President</option>
                <option value="Secretary">Secretary</option>
                <option value="Treasurer">Treasurer</option>
                <option value="Executive-Member">Executive Member</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Members Grid/List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No council members found</p>
            <p className="text-gray-400">
              {searchTerm || roleFilter !== 'all' 
                ? 'Try changing your search or filter criteria' 
                : 'No council members added yet'}
            </p>
            <button
              onClick={handleAddMember}
              className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition mx-auto"
            >
              <FaPlus /> Add First Council Member
            </button>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div key={member._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition">
              {/* Member Card Header */}
              <div className="relative">
                <div className="h-32 bg-linear-to-r from-blue-500 to-indigo-600"></div>
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white">
                    {member.imageUrl ? (
                      <img 
                        src={member.imageUrl} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                        <FaUser className="text-3xl text-blue-600" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Member Card Body */}
              <div className="pt-16 pb-6 px-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                  <div className={`inline-flex items-center mt-2 px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(member.role)}`}>
                    {getRoleIcon(member.role)}
                    {member.role}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaRegIdCard className="text-blue-500" />
                    <span className="truncate">{member?.id || "Not Assigned"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaEnvelope className="text-blue-500" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaPhone className="text-green-500" />
                    <span>{member.phone}</span>
                  </div>
                  {member.currHospital && member.currHospital.length > 0 && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaHospital className="text-red-500" />
                      <span className="truncate">{member.currHospital[0].name}</span>
                      {member.currHospital.length > 1 && (
                        <span className="text-xs text-gray-400">
                          +{member.currHospital.length - 1} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Specializations */}
                {member.specialization && member.specialization.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.specialization.slice(0, 3).map((spec, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                          {spec}
                        </span>
                      ))}
                      {member.specialization.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{member.specialization.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => handleViewDetails(member)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                  >
                    <FaEye /> View
                  </button>
                  <button
                    onClick={() => handleEditMember(member)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member._id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <CouncilMemberForm
          member={editingMember}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Details Modal */}
      {showDetails && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Council Member Details</h3>
                <p className="text-sm text-gray-500">Complete information about the council member</p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column - Image and Basic Info */}
                <div className="md:w-1/3">
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="w-48 h-48 rounded-full mx-auto overflow-hidden border-4 border-white shadow-lg mb-4">
                      {selectedMember.imageUrl ? (
                        <img 
                          src={selectedMember.imageUrl} 
                          alt={selectedMember.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                          <FaUser className="text-5xl text-blue-600" />
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-2xl font-bold text-gray-800">{selectedMember.name}</h4>
                      <div className={`inline-flex items-center mt-2 px-4 py-2 rounded-full font-medium border ${getRoleColor(selectedMember.role)}`}>
                        {getRoleIcon(selectedMember.role)}
                        {selectedMember.role}
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <FaRegIdCard className="text-blue-500" />
                        <div className="text-left">
                          <p className="text-sm text-gray-500">Member ID</p>
                          <p className="font-medium">{selectedMember?.id || "Not Assigned"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaEnvelope className="text-blue-500" />
                        <div className="text-left">
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{selectedMember.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaPhone className="text-green-500" />
                        <div className="text-left">
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{selectedMember.phone}</p>
                        </div>
                      </div>
                      {selectedMember.dateOfJoining && (
                        <div className="flex items-center gap-3">
                          <FaCalendar className="text-purple-500" />
                          <div className="text-left">
                            <p className="text-sm text-gray-500">Joined on</p>
                            <p className="font-medium">{formatDate(selectedMember.dateOfJoining)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Detailed Info */}
                <div className="md:w-2/3">
                  {/* Bio */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FaUser className="text-blue-500" /> Biography
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{selectedMember.bio}</p>
                  </div>

                  {/* Qualifications */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FaGraduationCap className="text-green-500" /> Qualifications
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.qualification.map((qual, index) => (
                        <span key={index} className="px-3 py-2 bg-green-50 text-green-700 rounded-lg">
                          {qual}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FaBriefcaseMedical className="text-red-500" /> Specializations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.specialization.map((spec, index) => (
                        <span key={index} className="px-3 py-2 bg-red-50 text-red-700 rounded-lg">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Current Hospitals */}
                  {selectedMember.currHospital && selectedMember.currHospital.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <FaHospital className="text-purple-500" /> Current Hospitals
                      </h4>
                      <div className="space-y-2">
                        {selectedMember.currHospital.map((hospital, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>{hospital.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Achievements */}
                  {selectedMember.achievements && selectedMember.achievements.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <FaAward className="text-yellow-500" /> Achievements
                      </h4>
                      <ul className="space-y-3">
                        {selectedMember.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <FaAward className="text-yellow-500 mt-1 shrink-0" />
                            <span className="text-gray-700">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  handleEditMember(selectedMember);
                  setShowDetails(false);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
              >
                <FaEdit /> Edit Member
              </button>
              <button
                onClick={() => setShowDetails(false)}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                <FaTimes /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouncilMembers;
