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
  FaChartBar,
  FaTag,
  FaStar,
  FaFilter
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
    completed: 0,
    featured: 0,
    byCategory: {}
  });
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    venue: '',
    description: '',
    isCompleted: false,
    isFeatured: false,
    tags: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, completed, featured
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Category options
  const categories = [
    { value: 'cancer_celebration', label: 'Cancer Celebration Month & Week' },
    { value: 'conference_symposium', label: 'State & National Conferences & Symposium' },
    { value: 'workshop_training', label: 'Workshops & Training Programs' },
    { value: 'awareness_campaign', label: 'Awareness Campaigns' },
    { value: 'fundraising', label: 'Fundraising Events' },
    { value: 'other', label: 'Other Events' }
  ];

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'all') params.type = filter;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      
      const response = await axios.get(`${BASE_URL}/events`, { params });
      if (response.data.success) {
        setEvents(response.data.events || []);
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
  }, [filter, categoryFilter]);

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
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB');
        return;
      }
      
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
      category: '',
      date: '',
      venue: '',
      description: '',
      isCompleted: false,
      isFeatured: false,
      tags: '',
      image: null
    });
    setImagePreview('');
    setEditingEvent(null);
    setShowForm(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.category || !formData.date || !formData.venue || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!editingEvent && !formData.image) {
      toast.error('Please select an event image');
      return;
    }

    const eventFormData = new FormData();
    eventFormData.append('title', formData.title);
    eventFormData.append('category', formData.category);
    eventFormData.append('date', formData.date);
    eventFormData.append('venue', formData.venue);
    eventFormData.append('description', formData.description);
    eventFormData.append('isCompleted', formData.isCompleted.toString());
    eventFormData.append('isFeatured', formData.isFeatured.toString());
    
    if (formData.tags) {
      eventFormData.append('tags', formData.tags);
    }
    
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
      category: event.category,
      date: new Date(event.date).toISOString().split('T')[0],
      venue: event.venue,
      description: event.description,
      isCompleted: event.isCompleted,
      isFeatured: event.isFeatured || false,
      tags: event.tags ? event.tags.join(', ') : '',
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

  // Toggle featured status
  const toggleFeatured = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${BASE_URL}/events/${id}/featured`,
        { isFeatured: !currentStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success(`Event ${!currentStatus ? 'marked as featured' : 'removed from featured'}`);
        fetchEvents();
        fetchStats();
      }
    } catch (error) {
      console.error('Toggle featured error:', error);
      toast.error('Failed to update featured status');
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

  // Get category label
  const getCategoryLabel = (categoryValue) => {
    const category = categories.find(c => c.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Events Management</h2>
          <p className="text-gray-600 mt-1">Create and manage events with categories</p>
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
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaCalendarAlt className="text-xl text-blue-600" />
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
              <p className="text-sm text-purple-600 font-medium">Past</p>
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

        <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <FaStar className="text-xl text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-pink-600 font-medium">Featured</p>
              <p className="text-2xl font-bold text-pink-700">{stats.featured}</p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FaTag className="text-xl text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-indigo-600 font-medium">Categories</p>
              <p className="text-2xl font-bold text-indigo-700">{Object.keys(stats.byCategory || {}).length}</p>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Image */}
              <div className="space-y-6">
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
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, image: null });
                            setImagePreview('');
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="py-8">
                        <FaImage className="text-4xl text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 mb-2">
                          Click to upload event image
                        </p>
                        <p className="text-xs text-gray-400">Max size: 10MB • JPG, PNG, WebP</p>
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
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition appearance-none"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (Optional)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition"
                    placeholder="Enter tags separated by commas (e.g., workshop, oncology, free)"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Separate tags with commas. These will help in searching and filtering.
                  </p>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
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
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#0b61a8] rounded focus:ring-[#0b61a8]"
                    />
                    <label htmlFor="isFeatured" className="text-sm text-gray-700">
                      Mark as featured event
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
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
                    placeholder="Enter event venue/location"
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
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition resize-none"
                    placeholder="Enter detailed event description"
                    required
                  />
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

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
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
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter('past')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'past'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Past Events
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'completed'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('featured')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'featured'
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Featured
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
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
              {filter !== 'all' || categoryFilter !== 'all'
                ? `No events match the selected filters` 
                : 'Click "Add New Event" to create your first event'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {events.map((event) => (
              <div
                key={event._id}
                className={`border rounded-xl overflow-hidden hover:shadow-lg transition group ${
                  event.isCompleted ? 'border-green-200' : 'border-gray-200'
                } ${event.isFeatured ? 'ring-2 ring-pink-500' : ''}`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        event.isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        {event.isCompleted ? 'Completed' : 'Upcoming'}
                      </span>
                      {event.isFeatured && (
                        <span className="px-2 py-1 bg-pink-500 text-white rounded text-xs font-medium flex items-center gap-1">
                          <FaStar className="text-xs" /> Featured
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {formatDate(event.date)}
                      </span>
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                        {getCategoryLabel(event.category)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">
                    {event.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {event.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {event.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-400 rounded text-xs">
                          +{event.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      Created: {new Date(event.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleFeatured(event._id, event.isFeatured)}
                        className={`p-2 rounded-lg transition ${
                          event.isFeatured
                            ? 'text-pink-600 hover:bg-pink-50'
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={event.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        <FaStar />
                      </button>
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

      {/* Summary */}
      {events.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {events.length} event{events.length !== 1 ? 's' : ''}
          {filter !== 'all' && ` (${filter})`}
          {categoryFilter !== 'all' && ` in ${getCategoryLabel(categoryFilter)}`}
        </div>
      )}
    </div>
  );
};

export default NewsEvents;
