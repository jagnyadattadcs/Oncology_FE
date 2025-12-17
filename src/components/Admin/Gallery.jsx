// components/Admin/Gallery.jsx
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
  FaDownload,
  FaSearch,
  FaEye,
  FaCheckSquare,
  FaSquare
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showMultiUploadForm, setShowMultiUploadForm] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    image: null
  });
  const [multiFormData, setMultiFormData] = useState({
    titles: [''],
    images: []
  });
  const [imagePreview, setImagePreview] = useState('');
  const [multiImagePreviews, setMultiImagePreviews] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    recentUploads: 0
  });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch gallery images
  const fetchGalleryImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/gallery`);
      if (response.data.success) {
        setGalleryImages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast.error('Failed to load gallery images');
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

  useEffect(() => {
    fetchGalleryImages();
    fetchStats();
  }, []);

  // Handle single image form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle multi image form input changes
  const handleMultiInputChange = (e, index) => {
    const { value } = e.target;
    const newTitles = [...multiFormData.titles];
    newTitles[index] = value;
    setMultiFormData({
      ...multiFormData,
      titles: newTitles
    });
  };

  // Handle single image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Handle multiple image selection
  const handleMultiImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Create title placeholders for new images
    const newTitles = [...multiFormData.titles];
    const previews = [];
    
    files.forEach((file, index) => {
      // Add title placeholder if needed
      if (index >= newTitles.length) {
        newTitles.push(`Gallery Image ${galleryImages.length + index + 1}`);
      }
      
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      previews.push(previewUrl);
    });

    setMultiFormData({
      ...multiFormData,
      images: files,
      titles: newTitles
    });
    setMultiImagePreviews(previews);
  };

  // Add title field for multi upload
  const addTitleField = () => {
    setMultiFormData({
      ...multiFormData,
      titles: [...multiFormData.titles, '']
    });
  };

  // Remove title field for multi upload
  const removeTitleField = (index) => {
    const newTitles = [...multiFormData.titles];
    newTitles.splice(index, 1);
    setMultiFormData({
      ...multiFormData,
      titles: newTitles
    });
  };

  // Reset single form
  const resetForm = () => {
    setFormData({
      title: '',
      image: null
    });
    setImagePreview('');
    setEditingImage(null);
    setShowUploadForm(false);
  };

  // Reset multi form
  const resetMultiForm = () => {
    setMultiFormData({
      titles: [''],
      images: []
    });
    setMultiImagePreviews([]);
    setShowMultiUploadForm(false);
    
    // Clean up object URLs
    multiImagePreviews.forEach(url => URL.revokeObjectURL(url));
  };

  // Handle single image submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Please enter a title');
      return;
    }

    if (!editingImage && !formData.image) {
      toast.error('Please select an image');
      return;
    }

    const imageFormData = new FormData();
    imageFormData.append('title', formData.title);
    
    if (formData.image) {
      imageFormData.append('image', formData.image);
    }

    setUploading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      let response;

      if (editingImage) {
        // Update gallery image
        response = await axios.put(
          `${BASE_URL}/gallery/${editingImage._id}`,
          imageFormData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        // Upload new gallery image
        response = await axios.post(
          `${BASE_URL}/gallery/upload`,
          imageFormData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      if (response.data.success) {
        toast.success(editingImage ? 'Image updated successfully!' : 'Image uploaded successfully!');
        resetForm();
        fetchGalleryImages();
        fetchStats();
      }
    } catch (error) {
      console.error('Gallery save error:', error);
      toast.error(error.response?.data?.message || `Failed to ${editingImage ? 'update' : 'upload'} image`);
    } finally {
      setUploading(false);
    }
  };

  // Handle multiple image submission
  const handleMultiSubmit = async (e) => {
    e.preventDefault();
    
    if (multiFormData.images.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    const multiFormDataObj = new FormData();
    
    // Append each image
    multiFormData.images.forEach(image => {
      multiFormDataObj.append('images', image);
    });
    
    // Append titles as JSON array
    multiFormDataObj.append('titles', JSON.stringify(multiFormData.titles));

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
        toast.success(response.data.message);
        resetMultiForm();
        fetchGalleryImages();
        fetchStats();
      }
    } catch (error) {
      console.error('Multi upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  // Edit gallery image
  const handleEdit = (image) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      image: null
    });
    setImagePreview(image.imageUrl);
    setShowUploadForm(true);
    setShowMultiUploadForm(false);
  };

  // Delete single gallery image
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
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
        toast.success('Image deleted successfully!');
        fetchGalleryImages();
        fetchStats();
        // Remove from selected images if present
        setSelectedImages(selectedImages.filter(imgId => imgId !== id));
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image');
    }
  };

  // Delete multiple gallery images
  const handleDeleteMultiple = async () => {
    if (selectedImages.length === 0) {
      toast.error('Please select images to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedImages.length} selected image(s)?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `${BASE_URL}/gallery/delete-multiple`,
        { ids: selectedImages },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setSelectedImages([]);
        fetchGalleryImages();
        fetchStats();
      }
    } catch (error) {
      console.error('Delete multiple error:', error);
      toast.error('Failed to delete images');
    }
  };

  // Toggle image selection
  const toggleImageSelection = (id) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter(imgId => imgId !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  };

  // Select all images
  const selectAllImages = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredImages.map(img => img._id));
    }
  };

  // Filter images based on search
  const filteredImages = galleryImages.filter(image =>
    image.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Gallery Management</h2>
          <p className="text-gray-600 mt-1">Manage image gallery for the website</p>
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
            <FaPlus /> {showUploadForm ? 'Cancel' : 'Add Single Image'}
          </button>
          <button
            onClick={() => {
              resetMultiForm();
              setShowMultiUploadForm(!showMultiUploadForm);
              setShowUploadForm(false);
            }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition"
          >
            <FaUpload /> {showMultiUploadForm ? 'Cancel' : 'Add Multiple Images'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaImage className="text-2xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Images</p>
              <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaCalendarAlt className="text-2xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Recent Uploads</p>
              <p className="text-3xl font-bold text-green-700">{stats.recentUploads}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Single Image Upload Form */}
      {showUploadForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            {editingImage ? 'Edit Gallery Image' : 'Upload Single Image'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image {!editingImage && '*'}
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
                      required={!editingImage}
                    />
                    <label
                      htmlFor="gallery-image"
                      className="cursor-pointer inline-block mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm transition"
                    >
                      {editingImage ? 'Replace Image' : 'Choose Image'}
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Formats: JPG, PNG, GIF, WebP
                  </p>
                </div>
              </div>

              {/* Details Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition"
                    placeholder="Enter image title"
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
                        {editingImage ? 'Updating...' : 'Uploading...'}
                      </span>
                    ) : editingImage ? (
                      'Update Image'
                    ) : (
                      'Upload Image'
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

      {/* Multiple Image Upload Form */}
      {showMultiUploadForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Upload Multiple Images
          </h3>
          
          <form onSubmit={handleMultiSubmit}>
            {/* Image Upload Section */}
            <div className="mb-6">
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

            {/* Image Previews and Title Inputs */}
            {multiFormData.images.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Image Titles
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {multiFormData.images.map((image, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="mb-3">
                        <img
                          src={multiImagePreviews[index] || URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={multiFormData.titles[index] || ''}
                          onChange={(e) => handleMultiInputChange(e, index)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                          placeholder={`Image ${index + 1} Title`}
                        />
                        {multiFormData.titles.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTitleField(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addTitleField}
                  className="mt-4 flex items-center gap-2 text-sm text-[#0b61a8] hover:text-[#0a5597]"
                >
                  <FaPlus /> Add More Title Fields
                </button>
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
                  `Upload ${multiFormData.images.length} Image(s)`
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

      {/* Search and Bulk Actions */}
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
                placeholder="Search images by title..."
              />
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedImages.length > 0 && (
            <div className="flex gap-3">
              <div className="flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg">
                <span className="font-medium">{selectedImages.length} selected</span>
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

      {/* Gallery Images Grid */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-4xl text-[#0b61a8]" />
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No gallery images found</p>
            <p className="text-gray-400">
              {searchTerm 
                ? 'No images match your search' 
                : 'Click "Add Single Image" or "Add Multiple Images" to upload'}
            </p>
          </div>
        ) : (
          <>
            {/* Bulk Select Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <button
                  onClick={selectAllImages}
                  className="flex items-center gap-2 text-gray-700 hover:text-[#0b61a8]"
                >
                  {selectedImages.length === filteredImages.length ? (
                    <FaCheckSquare className="text-[#0b61a8]" />
                  ) : (
                    <FaSquare className="text-gray-400" />
                  )}
                  <span className="text-sm font-medium">
                    {selectedImages.length === filteredImages.length 
                      ? 'Deselect All' 
                      : 'Select All'}
                  </span>
                </button>
                {selectedImages.length > 0 && (
                  <span className="text-sm text-gray-500 ml-auto">
                    {selectedImages.length} of {filteredImages.length} selected
                  </span>
                )}
              </div>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
              {filteredImages.map((image) => (
                <div
                  key={image._id}
                  className={`border rounded-xl overflow-hidden hover:shadow-lg transition relative group ${
                    selectedImages.includes(image._id) 
                      ? 'border-[#0b61a8] ring-2 ring-[#0b61a8]' 
                      : 'border-gray-200'
                  }`}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <button
                      onClick={() => toggleImageSelection(image._id)}
                      className={`p-1 rounded transition ${
                        selectedImages.includes(image._id)
                          ? 'bg-[#0b61a8] text-white'
                          : 'bg-white/80 text-gray-400 hover:bg-white'
                      }`}
                    >
                      {selectedImages.includes(image._id) ? <FaCheck /> : <FaEye />}
                    </button>
                  </div>

                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                      <span className="text-white text-sm font-medium truncate">
                        {image.title}
                      </span>
                    </div>
                  </div>
                  
                  {/* Details and Actions */}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 mb-1 line-clamp-1">
                      {image.title}
                    </h3>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        {formatDate(image.createdAt)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(image)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Edit"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(image._id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Info */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{filteredImages.length}</span> of{' '}
                  <span className="font-medium">{galleryImages.length}</span> images
                </div>
                {selectedImages.length > 0 && (
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-[#0b61a8]">{selectedImages.length}</span> images selected
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Gallery;
