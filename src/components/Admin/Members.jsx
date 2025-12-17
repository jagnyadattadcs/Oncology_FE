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
  FaSpinner
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, verified, unverified, paid, unpaid
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    unverified: 0,
    paid: 0,
    unpaid: 0
  });

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
      verified: membersList.filter(m => m.isVerified).length,
      unverified: membersList.filter(m => !m.isVerified).length,
      paid: membersList.filter(m => m.isPaymentDone).length,
      unpaid: membersList.filter(m => !m.isPaymentDone).length
    };
    setStats(stats);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Filter members based on search and filter type
  const filteredMembers = members.filter(member => {
    // Search filter
    const searchMatch = searchTerm === '' || 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.uniqueId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm);

    // Type filter
    let typeMatch = true;
    switch (filterType) {
      case 'verified':
        typeMatch = member.isVerified;
        break;
      case 'unverified':
        typeMatch = !member.isVerified;
        break;
      case 'paid':
        typeMatch = member.isPaymentDone;
        break;
      case 'unpaid':
        typeMatch = !member.isPaymentDone;
        break;
      default:
        typeMatch = true;
    }

    return searchMatch && typeMatch;
  });

  // View member details
  const viewMemberDetails = (member) => {
    setSelectedMember(member);
    setShowDetails(true);
  };

  // Toggle verification status
  const toggleVerification = async (memberId, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${BASE_URL}/member/admin/toggle-verify/${memberId}`,
        { isVerified: !currentStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success(`Member ${!currentStatus ? 'verified' : 'unverified'} successfully`);
        fetchMembers(); // Refresh list
      }
    } catch (error) {
      console.error('Toggle verification error:', error);
      toast.error('Failed to update verification status');
    }
  };

  // Toggle payment status
  const togglePayment = async (memberId, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${BASE_URL}/member/admin/toggle-payment/${memberId}`,
        { isPaymentDone: !currentStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success(`Payment status ${!currentStatus ? 'marked as paid' : 'marked as unpaid'}`);
        fetchMembers(); // Refresh list
      }
    } catch (error) {
      console.error('Toggle payment error:', error);
      toast.error('Failed to update payment status');
    }
  };

  // Delete member
  const deleteMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(`${BASE_URL}/member/admin/${memberId}`, {
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
      toast.error('Failed to delete member');
    }
  };

  // Export members to CSV
  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Member ID', 'Document Type', 'Verified', 'Payment Done', 'Registration Date'],
      ...filteredMembers.map(m => [
        m.name,
        m.email,
        m.phone,
        m.uniqueId || 'N/A',
        m.documentType,
        m.isVerified ? 'Yes' : 'No',
        m.isPaymentDone ? 'Yes' : 'No',
        new Date(m.createdAt).toLocaleDateString()
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

  // Format date
  const formatDate = (dateString) => {
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
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Manage Members</h2>
          <p className="text-gray-600 mt-1">View and manage all registered members</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition"
        >
          <FaDownload /> Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaUser className="text-xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FaCheck className="text-xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Verified</p>
              <p className="text-2xl font-bold text-green-700">{stats.verified}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FaTimes className="text-xl text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-yellow-600 font-medium">Unverified</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.unverified}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaMoneyCheck className="text-xl text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Paid</p>
              <p className="text-2xl font-bold text-purple-700">{stats.paid}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FaFileAlt className="text-xl text-red-600" />
            </div>
            <div>
              <p className="text-sm text-red-600 font-medium">Unpaid</p>
              <p className="text-2xl font-bold text-red-700">{stats.unpaid}</p>
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition"
                placeholder="Search by name, email, phone, or ID..."
              />
            </div>
          </div>

          {/* Filter */}
          <div className="w-full md:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition appearance-none"
              >
                <option value="all">All Members</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
                <option value="paid">Paid Members</option>
                <option value="unpaid">Unpaid Members</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-4xl text-[#0b61a8]" />
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No members found</p>
            <p className="text-gray-400">
              {searchTerm || filterType !== 'all' 
                ? 'Try changing your search or filter criteria' 
                : 'No members registered yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
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
                    Date
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
                          <div className="h-10 w-10 rounded-full bg-[#0b61a8] flex items-center justify-center text-white font-semibold">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <FaIdCard className="text-xs" />
                            {member.uniqueId || 'Pending ID'}
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
                      <div className="text-sm text-gray-500 truncate max-w-[150px]">
                        {member.documentNo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          member.isVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {member.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          member.isPaymentDone 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {member.isPaymentDone ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="text-xs" />
                        {formatDate(member.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleVerification(member._id, member.isVerified)}
                          className={`p-2 rounded-lg transition ${
                            member.isVerified
                              ? 'text-yellow-600 hover:bg-yellow-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={member.isVerified ? 'Unverify' : 'Verify'}
                        >
                          {member.isVerified ? <FaEyeSlash /> : <FaCheck />}
                        </button>
                        <button
                          onClick={() => togglePayment(member._id, member.isPaymentDone)}
                          className={`p-2 rounded-lg transition ${
                            member.isPaymentDone
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={member.isPaymentDone ? 'Mark as Unpaid' : 'Mark as Paid'}
                        >
                          <FaMoneyCheck />
                        </button>
                        <button
                          onClick={() => deleteMember(member._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <FaTrash />
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
                        <p className="text-gray-900 font-medium">{selectedMember.uniqueId || 'Pending'}</p>
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
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                        <p className="text-gray-900">{formatDate(selectedMember.updatedAt)}</p>
                      </div>
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
                    
                    {/* Verification Status */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Verification Status</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedMember.isVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedMember.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          toggleVerification(selectedMember._id, selectedMember.isVerified);
                          setShowDetails(false);
                        }}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition ${
                          selectedMember.isVerified
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {selectedMember.isVerified ? 'Mark as Unverified' : 'Mark as Verified'}
                      </button>
                    </div>

                    {/* Payment Status */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Payment Status</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedMember.isPaymentDone 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedMember.isPaymentDone ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          togglePayment(selectedMember._id, selectedMember.isPaymentDone);
                          setShowDetails(false);
                        }}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition ${
                          selectedMember.isPaymentDone
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {selectedMember.isPaymentDone ? 'Mark as Unpaid' : 'Mark as Paid'}
                      </button>
                    </div>

                    {/* Payment History */}
                    {selectedMember.paymentHistory && selectedMember.paymentHistory.length > 0 && (
                      <div className="mb-6">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Payment History</h5>
                        <div className="space-y-2">
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
                      className="w-full py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                    >
                      Delete Member
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
