// components/Admin/NewsEvents.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCalendar, 
  FaMapMarkerAlt, 
  FaCheck, 
  FaTimes,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaImage,
  FaCalendarAlt,
  FaChartBar
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const NewsEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    past: 0,
    completed: 0
  });
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    venue: '',
    description: '',
    isCompleted: false,
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, completed
  const [selectedEvent, setSelectedEvent] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/events?type=${filter}`);
      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/events/stats`);
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchStats();
  }, [filter]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      venue: '',
      description: '',
      isCompleted: false,
      image: null
    });
    setImagePreview('');
    setEditingEvent(null);
    setShowForm(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.venue || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!editingEvent && !formData.image) {
      toast.error('Please select an event image');
      return;
    }

    const eventFormData = new FormData();
    eventFormData.append('title', formData.title);
    eventFormData.append('date', formData.date);
    eventFormData.append('venue', formData.venue);
    eventFormData.append('description', formData.description);
    eventFormData.append('isCompleted', formData.isCompleted.toString());
    
    if (formData.image) {
      eventFormData.append('image', formData.image);
    }

    setUploading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      let response;

      if (editingEvent) {
        // Update event
        response = await axios.put(
          `${BASE_URL}/events/${editingEvent._id}`,
          eventFormData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        // Create event
        response = await axios.post(
          `${BASE_URL}/events/create`,
          eventFormData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      if (response.data.success) {
        toast.success(editingEvent ? 'Event updated successfully!' : 'Event created successfully!');
        resetForm();
        fetchEvents();
        fetchStats();
      }
    } catch (error) {
      console.error('Event save error:', error);
      toast.error(error.response?.data?.message || `Failed to ${editingEvent ? 'update' : 'create'} event`);
    } finally {
      setUploading(false);
    }
  };

  // Edit event
  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: new Date(event.date).toISOString().split('T')[0],
      venue: event.venue,
      description: event.description,
      isCompleted: event.isCompleted,
      image: null
    });
    setImagePreview(event.imageUrl);
    setShowForm(true);
  };

  // Delete event
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(`${BASE_URL}/events/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Event deleted successfully!');
        fetchEvents();
        fetchStats();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete event');
    }
  };

  // Toggle event completion
  const toggleCompletion = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${BASE_URL}/events/${id}/status`,
        { isCompleted: !currentStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success(`Event ${!currentStatus ? 'marked as completed' : 'marked as upcoming'}`);
        fetchEvents();
        fetchStats();
      }
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error('Failed to update event status');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
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
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Events Management</h2>
          <p className="text-gray-600 mt-1">Create and manage events & news</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 bg-[#0b61a8] hover:bg-[#0a5597] text-white px-4 py-3 rounded-lg font-medium transition"
        >
          <FaPlus /> {showForm ? 'Cancel' : 'Add New Event'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaCalendarAlt className="text-xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Events</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FaEye className="text-xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Upcoming</p>
              <p className="text-2xl font-bold text-green-700">{stats.upcoming}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaChartBar className="text-xl text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Past Events</p>
              <p className="text-2xl font-bold text-purple-700">{stats.past}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FaCheck className="text-xl text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-yellow-600 font-medium">Completed</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Image */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Image {!editingEvent && '*'}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#0b61a8] transition">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, image: null });
                            setImagePreview('');
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <FaImage className="text-4xl text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 mb-2">
                          Click to select image (Max 10MB)
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      id="event-image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required={!editingEvent}
                    />
                    <label
                      htmlFor="event-image"
                      className="cursor-pointer inline-block mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm transition"
                    >
                      {editingEvent ? 'Replace Image' : 'Choose Image'}
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended size: 1200x630px • Formats: JPG, PNG, WebP
                  </p>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue *
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition"
                    placeholder="Enter event venue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition resize-none"
                    placeholder="Enter event description"
                    required
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isCompleted"
                    name="isCompleted"
                    checked={formData.isCompleted}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#0b61a8] rounded focus:ring-[#0b61a8]"
                  />
                  <label htmlFor="isCompleted" className="text-sm text-gray-700">
                    Mark as completed event
                  </label>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="submit"
                    disabled={uploading}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition ${
                      uploading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-[#0b61a8] hover:bg-[#0a5597]'
                    }`}
                  >
                    {uploading ? (
                      <span className="flex items-center justify-center gap-2">
                        <FaSpinner className="animate-spin" />
                        {editingEvent ? 'Updating...' : 'Creating...'}
                      </span>
                    ) : editingEvent ? (
                      'Update Event'
                    ) : (
                      'Create Event'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-[#0b61a8] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'upcoming'
                ? 'bg-[#0b61a8] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'past'
                ? 'bg-[#0b61a8] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Past Events
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'completed'
                ? 'bg-[#0b61a8] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-4xl text-[#0b61a8]" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No events found</p>
            <p className="text-gray-400">
              {filter !== 'all' 
                ? `No ${filter} events available` 
                : 'Click "Add New Event" to create your first event'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {events.map((event) => (
              <div
                key={event._id}
                className={`border rounded-xl overflow-hidden hover:shadow-lg transition ${
                  event.isCompleted ? 'border-green-200' : 'border-gray-200'
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 right-0 bg-linear-to-b from-black/50 to-transparent p-4">
                    <div className="flex justify-between items-start">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        event.isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        {event.isCompleted ? 'Completed' : 'Upcoming'}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        new Date(event.date) < new Date() && !event.isCompleted
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}>
                        {formatDate(event.date)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">
                    {event.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                    <FaMapMarkerAlt />
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      Created: {new Date(event.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleCompletion(event._id, event.isCompleted)}
                        className={`p-2 rounded-lg transition ${
                          event.isCompleted
                            ? 'text-yellow-600 hover:bg-yellow-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={event.isCompleted ? 'Mark as upcoming' : 'Mark as completed'}
                      >
                        {event.isCompleted ? <FaTimes /> : <FaCheck />}
                      </button>
                      <button
                        onClick={() => handleEdit(event)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsEvents;
