// components/Admin/Contact.jsx
import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaReply, FaArchive, FaTrash, FaSearch, FaFilter, FaEnvelope, FaUser, FaCalendar, FaCheckCircle, FaExclamationCircle, FaSort, FaSortUp, FaSortDown, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from "react-toastify";

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [adminNotes, setAdminNotes] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    unread: 0,
    read: 0,
    replied: 0,
    archived: 0
  });

  const itemsPerPage = 10;

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, [currentPage, statusFilter, searchTerm, sortConfig]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${BASE_URL}/contact/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          limit: itemsPerPage,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          search: searchTerm || undefined
        }
      });
      
      if (response.data.success) {
        setContacts(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      toast.error('Failed to fetch contacts');
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${BASE_URL}/contact/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${BASE_URL}/contact/admin/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success(`Contact marked as ${newStatus}`);
        fetchContacts();
        fetchStats();
        if (selectedContact?.id === id) {
          setSelectedContact(response.data.data);
        }
      }
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(
        `${BASE_URL}/contact/admin/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success('Contact deleted successfully');
        fetchContacts();
        fetchStats();
        if (selectedContact?.id === id) {
          setSelectedContact(null);
          setShowDetails(false);
        }
      }
    } catch (error) {
      toast.error('Failed to delete contact');
      console.error('Error deleting contact:', error);
    }
  };

  const handleViewDetails = async (contact) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `${BASE_URL}/contact/admin/${contact._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setSelectedContact(response.data.data);
        setAdminNotes(response.data.data.adminNotes || '');
        
        // Mark as read if unread
        if (response.data.data.status === 'unread') {
          await handleStatusUpdate(contact._id, 'read');
        }
        
        setShowDetails(true);
      }
    } catch (error) {
      console.error('Error fetching contact details:', error);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedContact) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${BASE_URL}/contact/admin/${selectedContact._id}`,
        { adminNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success('Notes saved successfully');
        setSelectedContact(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to save notes');
      console.error('Error saving notes:', error);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Update your AdminDashboard menu items to include Contact
  // Add this to the menuItems array in AdminDashboard.jsx:
  // { id: 'contact', label: 'Contact Messages', icon: <FaEnvelope />, component: <Contact /> },

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Contact Messages</h1>
        <p className="text-gray-600">Manage and respond to contact form submissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Messages</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <FaEnvelope className="text-blue-500 text-xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-2xl font-bold">{stats.today}</p>
            </div>
            <FaCalendar className="text-green-500 text-xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Unread</p>
              <p className="text-2xl font-bold">{stats.unread}</p>
            </div>
            <FaExclamationCircle className="text-red-500 text-xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Read</p>
              <p className="text-2xl font-bold">{stats.read}</p>
            </div>
            <FaEye className="text-blue-500 text-xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Replied</p>
              <p className="text-2xl font-bold">{stats.replied}</p>
            </div>
            <FaCheckCircle className="text-green-500 text-xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Archived</p>
              <p className="text-2xl font-bold">{stats.archived}</p>
            </div>
            <FaArchive className="text-gray-500 text-xl" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, subject, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Contact List */}
        <div className={`${showDetails ? 'lg:w-2/3' : 'w-full'} bg-white rounded-lg shadow overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      {sortConfig.key === 'name' && (
                        sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-1">
                      Email
                      {sortConfig.key === 'email' && (
                        sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortConfig.key === 'status' && (
                        sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      {sortConfig.key === 'createdAt' && (
                        sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : contacts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No contact messages found
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => (
                    <tr 
                      key={contact._id} 
                      className={`hover:bg-gray-50 cursor-pointer ${contact.status === 'unread' ? 'bg-red-50' : ''}`}
                      onClick={() => handleViewDetails(contact)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaUser className="text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                            <div className="text-sm text-gray-500">{contact.phone || 'No phone'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{contact.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{truncateText(contact.subject, 30)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                          {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(contact.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleViewDetails(contact)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          {contact.status !== 'replied' && (
                            <button
                              onClick={() => handleStatusUpdate(contact._id, 'replied')}
                              className="text-green-600 hover:text-green-900"
                              title="Mark as Replied"
                            >
                              <FaReply />
                            </button>
                          )}
                          {contact.status !== 'archived' && (
                            <button
                              onClick={() => handleStatusUpdate(contact._id, 'archived')}
                              className="text-gray-600 hover:text-gray-900"
                              title="Archive"
                            >
                              <FaArchive />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(contact._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded border ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded border ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contact Details Sidebar */}
        {showDetails && selectedContact && (
          <div className="lg:w-1/3 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Message Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Sender Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{selectedContact.name}</h3>
                    <p className="text-gray-600">{selectedContact.email}</p>
                    {selectedContact.phone && (
                      <p className="text-gray-600">{selectedContact.phone}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedContact.status)}`}>
                    {selectedContact.status.charAt(0).toUpperCase() + selectedContact.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(selectedContact.createdAt)}
                  </span>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Subject</h4>
                <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedContact.subject}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Message</h4>
                <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Admin Notes</h4>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes here..."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                />
                <button
                  onClick={handleSaveNotes}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Save Notes
                </button>
              </div>

              {/* Quick Actions */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-3">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedContact.status !== 'read' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedContact._id, 'read')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                    >
                      <FaEye /> Mark as Read
                    </button>
                  )}
                  {selectedContact.status !== 'replied' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedContact._id, 'replied')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                    >
                      <FaReply /> Mark Replied
                    </button>
                  )}
                  {selectedContact.status !== 'archived' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedContact._id, 'archived')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                      <FaArchive /> Archive
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedContact._id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>

              {/* Timeline */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-3">Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Received: {formatDate(selectedContact.createdAt)}</span>
                  </div>
                  {selectedContact.repliedAt && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">Replied: {formatDate(selectedContact.repliedAt)}</span>
                    </div>
                  )}
                  {selectedContact.archivedAt && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <span className="text-gray-600">Archived: {formatDate(selectedContact.archivedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
