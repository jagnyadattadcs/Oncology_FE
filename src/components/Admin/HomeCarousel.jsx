// components/Admin/HomeCarousel.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaImage, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const HomeCarousel = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    image: null,
    title: '',
    altText: '',
    order: 0,
    isActive: true
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch all carousel images
  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/carousel`);
      if (response.data.success) {
        setImages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load carousel images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  // Upload new carousel image
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!isEditMode && !formData.image) {
      toast.error('Please select an image');
      return;
    }

    const uploadFormData = new FormData();
    
    // Only append image if it's new or being updated
    if (formData.image && !isEditMode) {
      uploadFormData.append('image', formData.image);
    }
    
    // Append other fields
    uploadFormData.append('title', formData.title);
    uploadFormData.append('altText', formData.altText);
    uploadFormData.append('order', formData.order);
    uploadFormData.append('isActive', formData.isActive);

    setUploading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      let response;

      if (isEditMode && selectedImage) {
        // Update existing image (without changing the image file)
        response = await axios.put(
          `${BASE_URL}/carousel/${selectedImage._id}`,
          {
            title: formData.title,
            altText: formData.altText,
            order: formData.order,
            isActive: formData.isActive
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Upload new image with file
        response = await axios.post(`${BASE_URL}/carousel/upload`, uploadFormData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      if (response.data.success) {
        toast.success(isEditMode ? 'Image updated successfully!' : 'Image uploaded successfully!');
        resetForm();
        fetchImages(); // Refresh the list
      }
    } catch (error) {
      console.error(isEditMode ? 'Update error:' : 'Upload error:', error);
      toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'upload'} image`);
    } finally {
      setUploading(false);
    }
  };

  // Delete carousel image
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(`${BASE_URL}/carousel/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Image deleted successfully!');
        fetchImages(); // Refresh the list
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image');
    }
  };

  // Toggle image active status
  const toggleActiveStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${BASE_URL}/carousel/status/${id}`,
        { isActive: !currentStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success(`Image ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
        fetchImages(); // Refresh the list
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error('Failed to update image status');
    }
  };

  // Edit carousel image
  const handleEdit = (image) => {
    setSelectedImage(image);
    setIsEditMode(true);
    setFormData({
      image: null,
      title: image.title || '',
      altText: image.altText || '',
      order: image.order || 0,
      isActive: image.isActive !== false // Default to true if undefined
    });
    setPreview(image.imageUrl); // Show existing image as preview
    setShowUploadForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({ 
      image: null, 
      title: '', 
      altText: '', 
      order: 0, 
      isActive: true 
    });
    setSelectedImage(null);
    setPreview('');
    setShowUploadForm(false);
    setIsEditMode(false);
  };

  // Cancel form
  const handleCancel = () => {
    resetForm();
  };

  return (
    <div className="p-4 md:p-6">      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Home Carousel</h2>
          <p className="text-gray-600 mt-1">Manage homepage carousel images</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowUploadForm(!showUploadForm);
          }}
          className="flex items-center gap-2 bg-[#0b61a8] hover:bg-[#0a5597] text-white px-4 py-3 rounded-lg font-medium transition"
        >
          <FaPlus /> {showUploadForm ? 'Cancel' : 'Add Carousel'}
        </button>
      </div>

      {/* Upload/Edit Form */}
      {showUploadForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {isEditMode ? 'Edit Carousel Image' : 'Upload New Carousel Image'}
            </h3>
            {isEditMode && (
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedImage?.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedImage?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            )}
          </div>
          
          <form onSubmit={handleUpload}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carousel Image {!isEditMode && '*'}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#0b61a8] transition">
                    {preview ? (
                      <div className="relative">
                        <img
                          src={preview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        {isEditMode ? (
                          <div className="mt-3 text-sm text-gray-500">
                            <p>Current image (Click to replace)</p>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, image: null });
                              setPreview('');
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
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
                      id="image-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      required={!isEditMode} // Only required for new uploads
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-block mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm transition"
                    >
                      {isEditMode ? 'Replace Image' : 'Choose Image'}
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended size: 1920x1080px • Formats: JPG, PNG, GIF, WebP
                  </p>
                </div>
              </div>

              {/* Details Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition"
                    placeholder="Enter image title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text (Accessibility)
                  </label>
                  <input
                    type="text"
                    name="altText"
                    value={formData.altText}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition"
                    placeholder="Description for screen readers"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b61a8] focus:border-transparent outline-none transition"
                    placeholder="Lower number shows first"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#0b61a8] rounded focus:ring-[#0b61a8]"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Active (Visible on website)
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
                        {isEditMode ? 'Updating...' : 'Uploading...'}
                      </span>
                    ) : isEditMode ? (
                      'Update Image'
                    ) : (
                      'Upload Image'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
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

      {/* Carousel Images Grid */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Carousel Images ({images.length})
        </h3>

        {loading ? (
          <div className="flex justify-center py-12">
            <FaSpinner className="animate-spin text-4xl text-[#0b61a8]" />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No carousel images found</p>
            <p className="text-gray-400">Click "Add Carousel" to upload your first image</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image._id}
                className={`border rounded-xl overflow-hidden hover:shadow-lg transition ${
                  !image.isActive ? 'border-red-200 opacity-75' : 'border-gray-200'
                }`}
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={image.imageUrl}
                    alt={image.altText || 'Carousel image'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex gap-2">
                    <div className={`px-2 py-1 text-xs rounded ${
                      image.isActive 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {image.isActive ? 'Active' : 'Inactive'}
                    </div>
                    <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
                      Order: {image.order}
                    </div>
                  </div>
                  {!image.isActive && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm">
                        Hidden
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h4 className="font-medium text-gray-800 truncate">
                    {image.title || 'Untitled'}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {image.altText || 'No description'}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-400">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActiveStatus(image._id, image.isActive)}
                        className={`p-2 rounded-lg transition ${
                          image.isActive
                            ? 'text-yellow-600 hover:bg-yellow-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={image.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {image.isActive ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <button
                        onClick={() => handleEdit(image)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(image._id)}
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

        {/* Quick Stats */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Images</p>
              <p className="text-2xl font-bold text-blue-700">{images.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Active</p>
              <p className="text-2xl font-bold text-green-700">
                {images.filter(img => img.isActive !== false).length}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Inactive</p>
              <p className="text-2xl font-bold text-red-700">
                {images.filter(img => img.isActive === false).length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Last Added</p>
              <p className="text-lg font-bold text-purple-700 truncate">
                {images.length > 0 
                  ? new Date(images[0].createdAt).toLocaleDateString()
                  : '-'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCarousel;
