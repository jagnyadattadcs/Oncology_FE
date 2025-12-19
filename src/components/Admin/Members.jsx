// components/Admin/Members.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaEyeSlash, 
  FaCheck, 
  FaTimes, 
  FaDownload,
  FaEdit,
  FaTrash,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaFileAlt,
  FaMoneyCheck,
  FaCalendarAlt,
  FaSpinner,
  FaHourglassHalf,
  FaThumbsUp,
  FaThumbsDown,
  FaUserCheck,
  FaUserClock,
  FaUserPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardCheck
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, approved, rejected
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [uniqueId, setUniqueId] = useState('');

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch all members
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${BASE_URL}/member/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setMembers(response.data.members);
        calculateStats(response.data.members);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (membersList) => {
    const stats = {
      total: membersList.length,
      pending: membersList.filter(m => m.status === 'pending').length,
      approved: membersList.filter(m => m.status === 'approved').length,
      rejected: membersList.filter(m => m.status === 'rejected').length
    };
    setStats(stats);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Filter members based on search and status filter
  const filteredMembers = members.filter(member => {
    // Search filter
    const searchMatch = searchTerm === '' || 
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.uniqueId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone?.includes(searchTerm) ||
      member.documentNo?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    let statusMatch = true;
    if (statusFilter !== 'all') {
      statusMatch = member.status === statusFilter;
    }

    return searchMatch && statusMatch;
  });

  // View member details
  const viewMemberDetails = (member) => {
    setSelectedMember(member);
    setShowDetails(true);
  };

  // Open approve modal
  const openApproveModal = (memberId, e) => {
    e?.stopPropagation();
    setSelectedMemberId(memberId);
    setAdminNotes('');
    setUniqueId(''); // Clear previous value
    setShowApproveModal(true);
  };

  // Open reject modal
  const openRejectModal = (memberId, e) => {
    e?.stopPropagation();
    setSelectedMemberId(memberId);
    setAdminNotes('');
    setShowRejectModal(true);
  };

  // Approve member
  const approveMember = async () => {
    if (!adminNotes.trim()) {
      toast.error('Please add admin notes');
      return;
    }

    if (!uniqueId.trim()) {
      toast.error('Please provide a unique ID for the member');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${BASE_URL}/member/admin/approve/${selectedMemberId}`,
        { 
          adminNotes,
          uniqueId: uniqueId.trim() // Send uniqueId to backend
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Member approved successfully! Login credentials sent to member.');
        setShowApproveModal(false);
        setUniqueId(''); // Clear after successful approval
        fetchMembers(); // Refresh list
        setShowDetails(false);
      }
    } catch (error) {
      console.error('Approve member error:', error);
      toast.error(error.response?.data?.message || 'Failed to approve member');
    }
  };

  // Reject member
  const rejectMember = async () => {
    if (!adminNotes.trim()) {
      toast.error('Please provide rejection reason');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${BASE_URL}/member/admin/reject/${selectedMemberId}`,
        { adminNotes },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Member rejected successfully! Notification sent to member.');
        setShowRejectModal(false);
        fetchMembers(); // Refresh list
        setShowDetails(false);
      }
    } catch (error) {
      console.error('Reject member error:', error);
      toast.error(error.response?.data?.message || 'Failed to reject member');
    }
  };

  // Update payment status
  const updatePaymentStatus = async (memberId, isPaymentDone) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${BASE_URL}/member/admin/payment/${memberId}`,
        { isPaymentDone },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success(`Payment status ${isPaymentDone ? 'marked as paid' : 'marked as unpaid'}`);
        fetchMembers(); // Refresh list
        setShowDetails(false);
      }
    } catch (error) {
      console.error('Update payment error:', error);
      toast.error(error.response?.data?.message || 'Failed to update payment status');
    }
  };

  // Delete member
  const deleteMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(`${BASE_URL}/member/admin/delete/${memberId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Member deleted successfully');
        fetchMembers(); // Refresh list
        setShowDetails(false);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete member');
    }
  };

  // Export members to CSV
  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Member ID', 'Status', 'Payment Done', 'Registration Date', 'Admin Reviewed Date', 'Admin Notes'],
      ...filteredMembers.map(m => [
        m.name,
        m.email,
        m.phone,
        m.uniqueId || 'N/A',
        m.status,
        m.isPaymentDone ? 'Yes' : 'No',
        new Date(m.createdAt).toLocaleDateString(),
        m.adminReviewedAt ? new Date(m.adminReviewedAt).toLocaleDateString() : 'N/A',
        m.adminNotes ? `"${m.adminNotes.replace(/"/g, '')}"` : ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `osoo-members-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('Members exported to CSV successfully');
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaHourglassHalf className="inline mr-1" />;
      case 'approved': return <FaCheckCircle className="inline mr-1" />;
      case 'rejected': return <FaTimesCircle className="inline mr-1" />;
      default: return <FaUser className="inline mr-1" />;
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Manage Members</h2>
          <p className="text-gray-600 mt-1">View and manage all registered members</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchMembers()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition"
          >
            <FaUser /> Refresh
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition"
          >
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <FaUser className="text-xl text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Members</p>
              <p className="text-2xl font-bold text-gray-700">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FaHourglassHalf className="text-xl text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FaCheckCircle className="text-xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Approved</p>
              <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FaTimesCircle className="text-xl text-red-600" />
            </div>
            <div>
              <p className="text-sm text-red-600 font-medium">Rejected</p>
              <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
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
                placeholder="Search by name, email, phone, member ID..."
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="mx-auto w-full max-w-full bg-white rounded-xl shadow-lg overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No members found</p>
            <p className="text-gray-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try changing your search or filter criteria' 
                : 'No members registered yet'}
            </p>
          </div>
        ) : (
          <div className="relative overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <tr 
                    key={member._id} 
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => viewMemberDetails(member)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                            {member.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <FaIdCard className="text-xs" />
                            {member.uniqueId || 'Not assigned'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.email}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <FaPhone className="text-xs" />
                        {member.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.documentType}</div>
                      <div className="text-sm text-gray-500 truncate max-w-[120px]">
                        {member.documentNo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(member.status)}`}>
                        {getStatusIcon(member.status)}
                        {getStatusText(member.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {member.status === 'approved' ? (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          member.isPaymentDone 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {member.isPaymentDone ? 'Paid' : 'Unpaid'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          N/A
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="text-xs" />
                        {formatDate(member.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        {/* Pending members: Approve/Reject buttons */}
                        {member.status === 'pending' && (
                          <>
                            <button
                              onClick={(e) => openApproveModal(member._id, e)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs"
                              title="Approve Member"
                            >
                              <FaThumbsUp /> Approve
                            </button>
                            <button
                              onClick={(e) => openRejectModal(member._id, e)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs"
                              title="Reject Member"
                            >
                              <FaThumbsDown /> Reject
                            </button>
                          </>
                        )}

                        {/* Approved members: Payment status toggle */}
                        {member.status === 'approved' && (
                          <select
                            value={member.isPaymentDone ? 'paid' : 'unpaid'}
                            onChange={(e) => {
                              const newStatus = e.target.value === 'paid';
                              updatePaymentStatus(member._id, newStatus);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-xs"
                          >
                            <option value="unpaid">Mark as Unpaid</option>
                            <option value="paid">Mark as paid</option>
                          </select>
                        )}

                        {/* Delete button for all */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this member?')) {
                              deleteMember(member._id);
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs"
                          title="Delete Member"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Info */}
        {filteredMembers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{filteredMembers.length}</span> of{' '}
                <span className="font-medium">{members.length}</span> members
              </div>
              <div className="text-sm text-gray-500">
                {searchTerm && `Results for "${searchTerm}"`}
                {statusFilter !== 'all' && ` • Status: ${statusFilter}`}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Member Details Modal */}
      {showDetails && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Member Details</h3>
                <p className="text-sm text-gray-500">Complete information about the member</p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Personal Info */}
                <div className="md:col-span-2">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                        <p className="text-gray-900 font-medium">{selectedMember.name}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Member ID</label>
                        <p className="text-gray-900 font-medium">{selectedMember.uniqueId || 'Not assigned yet'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                        <p className="text-gray-900">{selectedMember.email}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                        <p className="text-gray-900">{selectedMember.phone}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Registration Date</label>
                        <p className="text-gray-900">{formatDate(selectedMember.createdAt)}</p>
                      </div>
                      
                      {selectedMember.adminReviewedAt && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Admin Review Date</label>
                          <p className="text-gray-900">{formatDate(selectedMember.adminReviewedAt)}</p>
                        </div>
                      )}
                      
                      {selectedMember.adminReviewedBy && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-500 mb-1">Reviewed By</label>
                          <p className="text-gray-900">{selectedMember.adminReviewedBy}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Document Information */}
                  <div className="mt-6 bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Document Information</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Document Type</label>
                        <p className="text-gray-900 font-medium">{selectedMember.documentType}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Document Number</label>
                        <p className="text-gray-900">{selectedMember.documentNo}</p>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-500 mb-2">Document Image</label>
                        <a
                          href={selectedMember.documentImage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <img
                            src={selectedMember.documentImage}
                            alt="Document"
                            className="max-w-full h-48 object-contain border border-gray-300 rounded-lg"
                          />
                        </a>
                        <p className="text-xs text-gray-500 mt-2">Click image to view full size</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Status & Actions */}
                <div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Status & Actions</h4>
                    
                    {/* Status Display */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-500 mb-2">Current Status</label>
                      <div className={`flex items-center justify-between px-4 py-3 rounded-lg border ${getStatusColor(selectedMember.status)}`}>
                        <div className="flex items-center">
                          {getStatusIcon(selectedMember.status)}
                          <span className="font-medium">{getStatusText(selectedMember.status)}</span>
                        </div>
                        {selectedMember.isVerified && (
                          <FaCheckCircle className="text-green-500" />
                        )}
                      </div>
                    </div>

                    {/* Admin Notes */}
                    {selectedMember.adminNotes && (
                      <div className="mb-6">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Admin Notes</h5>
                        <div className="bg-white p-3 rounded border text-sm text-gray-700">
                          {selectedMember.adminNotes}
                        </div>
                      </div>
                    )}

                    {/* Actions based on status */}
                    {selectedMember.status === 'pending' && (
                      <div className="space-y-3 mb-6">
                        <button
                          onClick={() => {
                            setSelectedMemberId(selectedMember._id);
                            setShowApproveModal(true);
                          }}
                          className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
                        >
                          <FaThumbsUp /> Approve Member
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMemberId(selectedMember._id);
                            setShowRejectModal(true);
                          }}
                          className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center justify-center gap-2"
                        >
                          <FaThumbsDown /> Reject Member
                        </button>
                      </div>
                    )}

                    {/* Payment Status (only for approved members) */}
                    {selectedMember.status === 'approved' && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                        <select
                          value={selectedMember.isPaymentDone ? 'paid' : 'unpaid'}
                          onChange={(e) => {
                            const newStatus = e.target.value === 'paid';
                            updatePaymentStatus(selectedMember._id, newStatus);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option value="unpaid">Unpaid</option>
                          <option value="paid">Paid</option>
                        </select>
                      </div>
                    )}

                    {/* Payment History */}
                    {selectedMember.paymentHistory && selectedMember.paymentHistory.length > 0 && (
                      <div className="mb-6">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Payment History</h5>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {selectedMember.paymentHistory.map((payment, index) => (
                            <div key={index} className="bg-white p-3 rounded border">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">₹{payment.paymentAmount}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(payment.paymentDate).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">ID: {payment.paymentId}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this member?')) {
                          deleteMember(selectedMember._id);
                          setShowDetails(false);
                        }
                      }}
                      className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                      <FaTrash /> Delete Member
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Member Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Approve Member</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to approve this member? They will receive their login credentials via email.
              </p>
              
              {/* Add Unique ID Input Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unique Member ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={uniqueId}
                  onChange={(e) => setUniqueId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="Enter unique ID (e.g., OSOO001)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This ID will be used for member login and identification
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  rows="3"
                  placeholder="Add any notes about this approval..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">These notes will be recorded in the member's record</p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowApproveModal(false);
                    setUniqueId(''); // Clear when canceling
                  }}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={approveMember}
                  className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                >
                  Approve Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Member Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Reject Member</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to reject this member? They will receive a notification email.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  rows="3"
                  placeholder="Why are you rejecting this member?"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">This reason will be sent to the member</p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={rejectMember}
                  className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                >
                  Reject Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
