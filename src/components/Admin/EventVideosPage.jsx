import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FaPlayCircle,
  FaCalendarAlt,
  FaClock,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaYoutube,
  FaFilter,
  FaSearch,
  FaDownload,
  FaShareAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaRegStar,
  FaExternalLinkAlt,
  FaCopy
} from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const EventVideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    duration: '',
    eventDate: '',
    speaker: '',
    speakerDesignation: '',
    speakerInstitution: '',
    category: 'conference',
    tags: '',
    isFeatured: false,
    isPublic: true
  });

  const videoCategories = [
    { id: 'conference', name: 'Conference Recordings' },
    { id: 'workshop', name: 'Workshop Videos' },
    { id: 'seminar', name: 'Seminar Recordings' },
    { id: 'webinar', name: 'Webinar Videos' },
    { id: 'symposium', name: 'Symposiums' },
    { id: 'training', name: 'Training Videos' },
    { id: 'lecture', name: 'Lectures' },
    { id: 'panel-discussion', name: 'Panel Discussions' },
    { id: 'keynote', name: 'Keynote Speeches' },
    { id: 'other', name: 'Other Videos' }
  ];

  // Fetch videos
  useEffect(() => {
    fetchVideos();
  }, []);

  // Filter videos
  useEffect(() => {
    let result = videos;

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(video =>
        video.title.toLowerCase().includes(searchLower) ||
        video.description.toLowerCase().includes(searchLower) ||
        video.speaker.toLowerCase().includes(searchLower) ||
        (video.tags && video.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(video => video.category === selectedCategory);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      const isPublic = statusFilter === 'published';
      result = result.filter(video => video.isPublic === isPublic);
    }

    setFilteredVideos(result);
  }, [searchTerm, selectedCategory, statusFilter, videos]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/videos/admin/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVideos(response.data.data);
      setFilteredVideos(response.data.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingVideo 
        ? `${API_URL}/videos/${editingVideo._id}`
        : `${API_URL}/videos`;

      const method = editingVideo ? 'put' : 'post';
      
      const response = await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(response.data.message);
      setShowForm(false);
      setEditingVideo(null);
      resetForm();
      fetchVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error(error.response?.data?.message || 'Failed to save video');
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      youtubeUrl: video.youtubeUrl,
      duration: video.duration,
      eventDate: video.eventDate.split('T')[0],
      speaker: video.speaker,
      speakerDesignation: video.speakerDesignation || '',
      speakerInstitution: video.speakerInstitution || '',
      category: video.category,
      tags: video.tags ? video.tags.join(', ') : '',
      isFeatured: video.isFeatured || false,
      isPublic: video.isPublic !== false
    });
    setShowForm(true);
  };

  const handleDelete = async (videoId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/videos/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Video deleted successfully');
      fetchVideos();
      setShowDeleteConfirm(false);
      setVideoToDelete(null);
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video');
    }
  };

  const confirmDelete = (video) => {
    setVideoToDelete(video);
    setShowDeleteConfirm(true);
  };

  const toggleVideoSelection = (videoId) => {
    setSelectedVideos(prev =>
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const bulkUpdateStatus = async (isPublic) => {
    if (selectedVideos.length === 0) {
      toast.warning('Please select videos first');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${API_URL}/videos/bulk/status`, {
        ids: selectedVideos,
        isPublic
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(`Updated ${selectedVideos.length} video(s)`);
      setSelectedVideos([]);
      fetchVideos();
    } catch (error) {
      console.error('Error updating videos:', error);
      toast.error('Failed to update videos');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      youtubeUrl: '',
      duration: '',
      eventDate: '',
      speaker: '',
      speakerDesignation: '',
      speakerInstitution: '',
      category: 'conference',
      tags: '',
      isFeatured: false,
      isPublic: true
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const copyYouTubeId = (youtubeId) => {
    navigator.clipboard.writeText(youtubeId);
    toast.success('YouTube ID copied to clipboard');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Event Videos Management</h1>
          <p className="text-gray-600">Manage YouTube videos from conferences and events</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => {
              resetForm();
              setEditingVideo(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#0b61a8] text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus /> Add New Video
          </button>
          
          <a
            href="/event-videos"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-[#0b61a8] text-[#0b61a8] rounded-lg hover:bg-blue-50 transition"
          >
            <FaExternalLinkAlt /> View Public Page
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <FaPlayCircle className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Videos</p>
              <p className="text-2xl font-bold text-gray-800">
                {videos.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <FaEye className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Views</p>
              <p className="text-2xl font-bold text-gray-800">
                {videos.reduce((sum, video) => sum + (video.views || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <FaStar className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Featured Videos</p>
              <p className="text-2xl font-bold text-gray-800">
                {videos.filter(v => v.isFeatured).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <FaYoutube className="text-red-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">YouTube Videos</p>
              <p className="text-2xl font-bold text-gray-800">
                {videos.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedVideos.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-blue-800 font-medium">
              {selectedVideos.length} video(s) selected
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => bulkUpdateStatus(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Publish Selected
              </button>
              <button
                onClick={() => bulkUpdateStatus(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Unpublish Selected
              </button>
              <button
                onClick={() => setSelectedVideos([])}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-gray-50 p-4 rounded-xl mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search videos by title, speaker, description..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-64">
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Categories</option>
                {videoCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-bold">{filteredVideos.length}</span> of <span className="font-bold">{videos.length}</span> videos
          </p>
          {(searchTerm || selectedCategory !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setStatusFilter('all');
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Videos Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-16">
            <FaExclamationTriangle className="text-4xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No Videos Found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== 'all' || statusFilter !== 'all'
                ? 'Try changing your search criteria'
                : 'No videos available yet. Add your first video!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedVideos.length === filteredVideos.length && filteredVideos.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedVideos(filteredVideos.map(v => v._id));
                        } else {
                          setSelectedVideos([]);
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Video
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Speaker & Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVideos.map((video) => (
                  <tr key={video._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedVideos.includes(video._id)}
                        onChange={() => toggleVideoSelection(video._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-24 h-16 rounded object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                            <FaPlayCircle className="text-white text-lg" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                            {video.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                              {video.category}
                            </span>
                            {video.isFeatured && (
                              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded flex items-center gap-1">
                                <FaStar className="text-xs" /> Featured
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => copyYouTubeId(video.youtubeId)}
                            className="text-xs text-gray-500 hover:text-blue-600 mt-1 flex items-center gap-1"
                          >
                            <FaCopy /> {video.youtubeId.substring(0, 8)}...
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{video.speaker}</p>
                        {video.speakerDesignation && (
                          <p className="text-sm text-gray-600">{video.speakerDesignation}</p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <FaCalendarAlt />
                          <span>{formatDate(video.eventDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FaClock />
                          <span>{video.duration}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <FaEye className="text-gray-400" />
                          <span className="font-medium">{video.views?.toLocaleString() || 0}</span>
                          <span className="text-gray-500">views</span>
                        </div>
                        {video.meta && (
                          <>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="w-4 text-center">👍</span>
                              <span className="font-medium">{video.meta.likes || 0}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <FaShareAlt className="text-gray-400" />
                              <span className="font-medium">{video.meta.shares || 0}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <FaDownload className="text-gray-400" />
                              <span className="font-medium">{video.meta.downloads || 0}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${video.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {video.isPublic ? (
                            <>
                              <FaCheckCircle /> Published
                            </>
                          ) : (
                            <>
                              <FaTimesCircle /> Unpublished
                            </>
                          )}
                        </span>
                        {video.createdAt && (
                          <span className="text-xs text-gray-500">
                            Added: {formatDate(video.createdAt)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(video)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => confirmDelete(video)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                        <a
                          href={`https://youtube.com/watch?v=${video.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                          title="View on YouTube"
                        >
                          <FaExternalLinkAlt />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Video Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingVideo ? 'Edit Video' : 'Add New Video'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingVideo(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter video title"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter video description"
                    />
                  </div>

                  {/* YouTube URL */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube URL *
                    </label>
                    <div className="relative">
                      <FaYoutube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600" />
                      <input
                        type="url"
                        name="youtubeUrl"
                        value={formData.youtubeUrl}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Example: https://youtube.com/watch?v=dQw4w9WgXcQ
                    </p>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration *
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="HH:MM:SS or MM:SS"
                    />
                  </div>

                  {/* Event Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Speaker */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Speaker Name *
                    </label>
                    <input
                      type="text"
                      name="speaker"
                      value={formData.speaker}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Dr. Speaker Name"
                    />
                  </div>

                  {/* Speaker Designation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Speaker Designation
                    </label>
                    <input
                      type="text"
                      name="speakerDesignation"
                      value={formData.speakerDesignation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Professor, Head of Department, etc."
                    />
                  </div>

                  {/* Speaker Institution */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Speaker Institution
                    </label>
                    <input
                      type="text"
                      name="speakerInstitution"
                      value={formData.speakerInstitution}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Medical College, Hospital, etc."
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      {videoCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="oncology, surgery, conference, workshop"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                        Mark as Featured Video
                      </label>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isPublic"
                        name="isPublic"
                        checked={formData.isPublic}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                        Publish immediately (visible to public)
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-6 border-t">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    {editingVideo ? 'Update Video' : 'Add Video'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingVideo(null);
                      resetForm();
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && videoToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Video</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{videoToDelete.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(videoToDelete._id)}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setVideoToDelete(null);
                  }}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventVideosPage;
