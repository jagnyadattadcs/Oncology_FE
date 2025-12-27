import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaImage, 
  FaSpinner,
  FaUpload,
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaFilter,
  FaSearch,
  FaEye,
  FaCheckSquare,
  FaSquare,
  FaTags,
  FaInfoCircle,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const Gallery = () => {
  const [galleryEntries, setGalleryEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showMultiUploadForm, setShowMultiUploadForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'detail'
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    eventDate: '',
    image: null
  });
  
  const [multiFormData, setMultiFormData] = useState({
    title: '',
    description: '',
    category: '',
    eventDate: '',
    images: []
  });
  
  const [imagePreview, setImagePreview] = useState('');
  const [multiImagePreviews, setMultiImagePreviews] = useState([]);
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalImages: 0,
    categories: []
  });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const categoriesList = ['Event', 'Portrait', 'Landscape', 'Wedding', 'Sports', 'Other'];

  // Fetch gallery entries
  const fetchGalleryEntries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await axios.get(`${BASE_URL}/gallery?${params}`);
      if (response.data.success) {
        setGalleryEntries(response.data.data);
        extractCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching gallery entries:', error);
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/gallery/stats`);
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const extractCategories = (entries) => {
    const uniqueCategories = [...new Set(entries.map(entry => entry.category).filter(Boolean))];
    setCategories(['all', ...uniqueCategories]);
  };

  useEffect(() => {
    fetchGalleryEntries();
    fetchStats();
  }, [selectedCategory, searchTerm]);

  // Handle single entry form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle multi entry form input changes
  const handleMultiInputChange = (e) => {
    const { name, value } = e.target;
    setMultiFormData({
      ...multiFormData,
      [name]: value
    });
  };

  // Handle single image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Handle multiple image selection
  const handleMultiImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = [];
    
    files.forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      previews.push(previewUrl);
    });

    setMultiFormData({
      ...multiFormData,
      images: files
    });
    setMultiImagePreviews(previews);
  };

  // Reset single form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      eventDate: '',
      image: null
    });
    setImagePreview('');
    setEditingEntry(null);
    setShowUploadForm(false);
  };

  // Reset multi form
  const resetMultiForm = () => {
    setMultiFormData({
      title: '',
      description: '',
      category: '',
      eventDate: '',
      images: []
    });
    setMultiImagePreviews([]);
    setShowMultiUploadForm(false);
    
    multiImagePreviews.forEach(url => URL.revokeObjectURL(url));
  };

  // Handle single entry submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category) {
      toast.error('Title and category are required');
      return;
    }

    if (!editingEntry && !formData.image) {
      toast.error('Please select an image');
      return;
    }

    const entryFormData = new FormData();
    entryFormData.append('title', formData.title);
    entryFormData.append('description', formData.description);
    entryFormData.append('category', formData.category);
    if (formData.eventDate) entryFormData.append('eventDate', formData.eventDate);
    
    if (formData.image) {
      entryFormData.append('image', formData.image);
    }

    setUploading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      let response;

      if (editingEntry) {
        // Update gallery entry (adds new image to existing entry)
        response = await axios.put(
          `${BASE_URL}/gallery/${editingEntry._id}`,
          entryFormData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        // Upload new gallery entry
        response = await axios.post(
          `${BASE_URL}/gallery/upload`,
          entryFormData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      if (response.data.success) {
        toast.success(editingEntry ? 'Entry updated successfully!' : 'Entry uploaded successfully!');
        resetForm();
        fetchGalleryEntries();
        fetchStats();
      }
    } catch (error) {
      console.error('Gallery save error:', error);
      toast.error(error.response?.data?.message || `Failed to ${editingEntry ? 'update' : 'upload'} entry`);
    } finally {
      setUploading(false);
    }
  };

  // Handle multiple images submission (single entry with multiple images)
  const handleMultiSubmit = async (e) => {
    e.preventDefault();
    
    if (!multiFormData.title || !multiFormData.category) {
      toast.error('Title and category are required');
      return;
    }

    if (multiFormData.images.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    const multiFormDataObj = new FormData();
    multiFormDataObj.append('title', multiFormData.title);
    multiFormDataObj.append('description', multiFormData.description);
    multiFormDataObj.append('category', multiFormData.category);
    if (multiFormData.eventDate) multiFormDataObj.append('eventDate', multiFormData.eventDate);
    
    multiFormData.images.forEach(image => {
      multiFormDataObj.append('images', image);
    });

    setUploading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `${BASE_URL}/gallery/upload-multiple`,
        multiFormDataObj,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success(`${response.data.message} (${multiFormData.images.length} images)`);
        resetMultiForm();
        fetchGalleryEntries();
        fetchStats();
      }
    } catch (error) {
      console.error('Multi upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  // Edit gallery entry
  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title,
      description: entry.description || '',
      category: entry.category,
      eventDate: entry.eventDate ? entry.eventDate.split('T')[0] : '',
      image: null
    });
    setImagePreview(entry.imageUrl[0]);
    setShowUploadForm(true);
    setShowMultiUploadForm(false);
  };

  // View gallery entry details
  const handleViewDetails = (entry) => {
    setEditingEntry(entry);
    setViewMode('detail');
    setCurrentImageIndex(0);
  };

  // Navigate images in detail view
  const handleImageNavigation = (direction) => {
    if (!editingEntry) return;
    
    if (direction === 'prev') {
      setCurrentImageIndex(prev => 
        prev === 0 ? editingEntry.imageUrl.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === editingEntry.imageUrl.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Delete specific image from entry
  const handleDeleteImage = async (entryId, imageIndex) => {
    if (!window.confirm('Are you sure you want to delete this specific image?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(
        `${BASE_URL}/gallery/${entryId}/image/${imageIndex}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Image deleted successfully!');
        if (editingEntry && editingEntry._id === entryId) {
          if (response.data.data) {
            setEditingEntry(response.data.data);
          } else {
            setViewMode('grid');
            setEditingEntry(null);
          }
        }
        fetchGalleryEntries();
        fetchStats();
      }
    } catch (error) {
      console.error('Delete image error:', error);
      toast.error('Failed to delete image');
    }
  };

  // Delete gallery entry
  const handleDeleteEntry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entire gallery entry?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(`${BASE_URL}/gallery/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Gallery entry deleted successfully!');
        if (editingEntry && editingEntry._id === id) {
          setViewMode('grid');
          setEditingEntry(null);
        }
        setSelectedEntries(selectedEntries.filter(entryId => entryId !== id));
        fetchGalleryEntries();
        fetchStats();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete gallery entry');
    }
  };

  // Delete multiple gallery entries
  const handleDeleteMultiple = async () => {
    if (selectedEntries.length === 0) {
      toast.error('Please select entries to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedEntries.length} selected entry(s)?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `${BASE_URL}/gallery/delete-multiple`,
        { ids: selectedEntries },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setSelectedEntries([]);
        if (editingEntry && selectedEntries.includes(editingEntry._id)) {
          setViewMode('grid');
          setEditingEntry(null);
        }
        fetchGalleryEntries();
        fetchStats();
      }
    } catch (error) {
      console.error('Delete multiple error:', error);
      toast.error('Failed to delete entries');
    }
  };

  // Toggle entry selection
  const toggleEntrySelection = (id) => {
    if (selectedEntries.includes(id)) {
      setSelectedEntries(selectedEntries.filter(entryId => entryId !== id));
    } else {
      setSelectedEntries([...selectedEntries, id]);
    }
  };

  // Select all entries
  const selectAllEntries = () => {
    if (selectedEntries.length === filteredEntries.length) {
      setSelectedEntries([]);
    } else {
      setSelectedEntries(filteredEntries.map(entry => entry._id));
    }
  };

  // Filter entries
  const filteredEntries = galleryEntries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Detail View Component
  const DetailView = () => {
    if (!editingEntry) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{editingEntry.title}</h2>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
                  <FaTags /> {editingEntry.category}
                </span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full flex items-center gap-1">
                  <FaCalendarAlt /> {formatDate(editingEntry.eventDate)}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  {editingEntry.imageUrl.length} image(s)
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(editingEntry)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                title="Edit Entry"
              >
                <FaEdit size={18} />
              </button>
              <button
                onClick={() => handleDeleteEntry(editingEntry._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="Delete Entry"
              >
                <FaTrash size={18} />
              </button>
              <button
                onClick={() => {
                  setViewMode('grid');
                  setEditingEntry(null);
                }}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-y-auto max-h-[60vh]">
            {/* Image Viewer */}
            <div className="lg:col-span-2">
              <div className="relative bg-gray-900 rounded-xl overflow-hidden">
                <img
                  src={editingEntry.imageUrl[currentImageIndex]}
                  alt={`${editingEntry.title} - ${currentImageIndex + 1}`}
                  className="w-full h-96 object-contain"
                />
                
                {/* Navigation Buttons */}
                {editingEntry.imageUrl.length > 1 && (
                  <>
                    <button
                      onClick={() => handleImageNavigation('prev')}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={() => handleImageNavigation('next')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full"
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}
                
                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full">
                  {currentImageIndex + 1} / {editingEntry.imageUrl.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 mt-4 overflow-x-auto py-2">
                {editingEntry.imageUrl.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                        currentImageIndex === index 
                          ? 'border-blue-500' 
                          : 'border-transparent'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                    <button
                      onClick={() => handleDeleteImage(editingEntry._id, index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Entry Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {editingEntry.description || 'No description provided'}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">{formatDate(editingEntry.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">{formatDate(editingEntry.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  setViewMode('grid');
                  setEditingEntry(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back to Gallery
              </button>
              <div className="text-sm text-gray-500">
                ID: {editingEntry._id}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Gallery Management</h2>
          <p className="text-gray-600 mt-1">Manage gallery entries with multiple images</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              resetForm();
              setShowUploadForm(!showUploadForm);
              setShowMultiUploadForm(false);
            }}
            className="flex items-center gap-2 bg-[#0b61a8] hover:bg-[#0a5597] text-white px-4 py-3 rounded-lg font-medium transition"
          >
            <FaPlus /> {showUploadForm ? 'Cancel' : 'Add Single Image Entry'}
          </button>
          <button
            onClick={() => {
              resetMultiForm();
              setShowMultiUploadForm(!showMultiUploadForm);
              setShowUploadForm(false);
            }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition"
          >
            <FaUpload /> {showMultiUploadForm ? 'Cancel' : 'Add Multi-Image Entry'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaImage className="text-2xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Entries</p>
              <p className="text-3xl font-bold text-blue-700">{stats.totalEntries}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaImage className="text-2xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Total Images</p>
              <p className="text-3xl font-bold text-green-700">{stats.totalImages}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaTags className="text-2xl text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Categories</p>
              <p className="text-3xl font-bold text-purple-700">{stats.categories?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Single Image Entry Form */}
      {showUploadForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            {editingEntry ? 'Edit Gallery Entry' : 'Create Gallery Entry'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Upload Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {editingEntry ? 'Add Another Image' : 'Upload Image *'}
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
                          Click to select image (Max 5MB)
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      id="gallery-image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required={!editingEntry}
                    />
                    <label
                      htmlFor="gallery-image"
                      className="cursor-pointer inline-block mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm transition"
                    >
                      {editingEntry ? 'Add Image' : 'Choose Image'}
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Formats: JPG, PNG, GIF, WebP
                  </p>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition"
                    required
                  >
                    <option value="">Select a category</option>
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Details Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition"
                    placeholder="Enter gallery entry title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition resize-none"
                    placeholder="Enter description (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date (Optional)
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition"
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
                        {editingEntry ? 'Updating...' : 'Uploading...'}
                      </span>
                    ) : editingEntry ? (
                      'Update Entry'
                    ) : (
                      'Create Entry'
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

      {/* Multiple Image Entry Form */}
      {showMultiUploadForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Create Gallery Entry with Multiple Images
          </h3>
          
          <form onSubmit={handleMultiSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Details Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={multiFormData.title}
                    onChange={handleMultiInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition"
                    placeholder="Enter gallery entry title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={multiFormData.category}
                    onChange={handleMultiInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition"
                    required
                  >
                    <option value="">Select a category</option>
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={multiFormData.description}
                    onChange={handleMultiInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition resize-none"
                    placeholder="Enter description (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date (Optional)
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={multiFormData.eventDate}
                    onChange={handleMultiInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Images *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition">
                    <FaUpload className="text-4xl text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-2">
                      Drag & drop images here or click to select (Max 20 images)
                    </p>
                    <input
                      type="file"
                      id="gallery-images"
                      accept="image/*"
                      onChange={handleMultiImageChange}
                      className="hidden"
                      multiple
                      required
                    />
                    <label
                      htmlFor="gallery-images"
                      className="cursor-pointer inline-block bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg font-medium text-sm transition"
                    >
                      Choose Images
                    </label>
                    <p className="text-xs text-gray-500 mt-3">
                      Selected: {multiFormData.images.length} image(s)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Previews */}
            {multiFormData.images.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Image Previews ({multiFormData.images.length} images)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {multiFormData.images.map((image, index) => (
                    <div key={index} className="border rounded-lg p-2">
                      <div className="relative">
                        <img
                          src={multiImagePreviews[index]}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = [...multiFormData.images];
                            const newPreviews = [...multiImagePreviews];
                            newImages.splice(index, 1);
                            newPreviews.splice(index, 1);
                            setMultiFormData({...multiFormData, images: newImages});
                            setMultiImagePreviews(newPreviews);
                            URL.revokeObjectURL(multiImagePreviews[index]);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                        >
                          <FaTimes size={10} />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploading || multiFormData.images.length === 0}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition ${
                  uploading || multiFormData.images.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  `Create Entry with ${multiFormData.images.length} Image(s)`
                )}
              </button>
              <button
                type="button"
                onClick={resetMultiForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Category Filter */}
          <div className="flex-1 md:max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <FaFilter /> Filter by Category
              </div>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition"
            >
              <option value="all">All Categories</option>
              {categories.filter(cat => cat !== 'all').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <FaSearch /> Search
              </div>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition"
                placeholder="Search by title, description, or category..."
              />
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedEntries.length > 0 && (
            <div className="flex gap-3 items-end">
              <div className="flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg">
                <span className="font-medium">{selectedEntries.length} selected</span>
              </div>
              <button
                onClick={handleDeleteMultiple}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition"
              >
                <FaTrash /> Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Entries Grid */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-4xl text-[#0b61a8]" />
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No gallery entries found</p>
            <p className="text-gray-400">
              {searchTerm || selectedCategory !== 'all' 
                ? 'No entries match your filters' 
                : 'Click "Add Single Image Entry" to get started'}
            </p>
          </div>
        ) : (
          <>
            {/* Bulk Select Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <button
                  onClick={selectAllEntries}
                  className="flex items-center gap-2 text-gray-700 hover:text-[#0b61a8]"
                >
                  {selectedEntries.length === filteredEntries.length ? (
                    <FaCheckSquare className="text-[#0b61a8]" />
                  ) : (
                    <FaSquare className="text-gray-400" />
                  )}
                  <span className="text-sm font-medium">
                    {selectedEntries.length === filteredEntries.length 
                      ? 'Deselect All' 
                      : 'Select All'}
                  </span>
                </button>
                {selectedEntries.length > 0 && (
                  <span className="text-sm text-gray-500 ml-auto">
                    {selectedEntries.length} of {filteredEntries.length} selected
                  </span>
                )}
              </div>
            </div>

            {/* Entries Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredEntries.map((entry) => (
                <div
                  key={entry._id}
                  className={`border rounded-xl overflow-hidden hover:shadow-lg transition relative group ${
                    selectedEntries.includes(entry._id) 
                      ? 'border-[#0b61a8] ring-2 ring-[#0b61a8]' 
                      : 'border-gray-200'
                  }`}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <button
                      onClick={() => toggleEntrySelection(entry._id)}
                      className={`p-1 rounded transition ${
                        selectedEntries.includes(entry._id)
                          ? 'bg-[#0b61a8] text-white'
                          : 'bg-white/80 text-gray-400 hover:bg-white'
                      }`}
                    >
                      {selectedEntries.includes(entry._id) ? <FaCheck /> : <FaEye />}
                    </button>
                  </div>

                  {/* Image Carousel */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {entry.imageUrl[0] ? (
                      <img
                        src={entry.imageUrl[0]}
                        alt={entry.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <FaImage className="text-4xl text-gray-400" />
                      </div>
                    )}
                    
                    {/* Image Counter */}
                    {entry.imageUrl.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                        +{entry.imageUrl.length - 1}
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                      {entry.category}
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                      <div>
                        <h3 className="text-white font-medium truncate">
                          {entry.title}
                        </h3>
                        <p className="text-white/80 text-sm mt-1">
                          {entry.imageUrl.length} image(s)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Entry Details */}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 mb-2 line-clamp-1">
                      {entry.title}
                    </h3>
                    
                    {entry.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {entry.description}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        {entry.eventDate && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <FaCalendarAlt /> {formatDate(entry.eventDate)}
                          </div>
                        )}
                        <div className="text-xs text-gray-400">
                          {formatDate(entry.createdAt)}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(entry)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <FaInfoCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(entry)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Edit"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Info */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{filteredEntries.length}</span> of{' '}
                  <span className="font-medium">{galleryEntries.length}</span> entries
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="text-sm text-gray-500">
                    Total images across all entries: <span className="font-medium">
                      {galleryEntries.reduce((sum, entry) => sum + entry.imageUrl.length, 0)}
                    </span>
                  </div>
                  
                  {selectedEntries.length > 0 && (
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-[#0b61a8]">{selectedEntries.length}</span> entries selected
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detail View Modal */}
      {viewMode === 'detail' && <DetailView />}
    </div>
  );
};

export default Gallery;
