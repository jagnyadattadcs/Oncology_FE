import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaImages, 
  FaCalendarAlt, 
  FaSearch,
  FaFilter,
  FaChevronRight,
  FaDownload,
  FaShareAlt,
  FaEye,
  FaExclamationTriangle,
  FaArrowLeft,
  FaRegImages,
  FaCamera,
  FaTimes,
  FaExpand
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

// Mock gallery data (you'll replace this with your actual data)
const mockGalleries = [
  {
    id: 1,
    title: "Annual Conference 2023",
    description: "Photos from OSOO Annual Conference held in Bhubaneswar",
    thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=60",
    imageCount: 45,
    eventDate: "2023-12-15",
    category: "conference",
    images: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=60",
      "https://images.unsplash.com/photo-1580281657521-6b9a7b5d0a3b?w=800&q=60",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=60"
    ]
  },
  {
    id: 2,
    title: "Surgical Workshop - November 2023",
    description: "Hands-on workshop on laparoscopic techniques",
    thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=60",
    imageCount: 32,
    eventDate: "2023-11-20",
    category: "workshop",
    images: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=60",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=60"
    ]
  },
  {
    id: 3,
    title: "Medical Seminar October 2023",
    description: "Seminar on latest oncology treatments and techniques",
    thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=60",
    imageCount: 28,
    eventDate: "2023-10-10",
    category: "seminar",
    images: [
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=60",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=60"
    ]
  },
  {
    id: 4,
    title: "Webinar Series 2023",
    description: "Virtual webinar sessions with international experts",
    thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=60",
    imageCount: 18,
    eventDate: "2023-09-05",
    category: "webinar",
    images: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=60",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=60"
    ]
  },
  {
    id: 5,
    title: "Symposium on Cancer Care",
    description: "Symposium discussing advancements in cancer treatment",
    thumbnail: "https://images.unsplash.com/photo-1580281657521-6b9a7b5d0a3b?w=800&q=60",
    imageCount: 52,
    eventDate: "2023-08-15",
    category: "symposium",
    images: [
      "https://images.unsplash.com/photo-1580281657521-6b9a7b5d0a3b?w=800&q=60",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=60"
    ]
  },
  {
    id: 6,
    title: "Training Program July 2023",
    description: "Resident training program on surgical procedures",
    thumbnail: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=60",
    imageCount: 37,
    eventDate: "2023-07-10",
    category: "training",
    images: [
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=60",
      "https://images.unsplash.com/photo-1580281657521-6b9a7b5d0a3b?w=800&q=60"
    ]
  }
];

// Gallery Categories
const galleryCategories = [
  { id: "all", name: "All Galleries" },
  { id: "conference", name: "Conferences" },
  { id: "workshop", name: "Workshops" },
  { id: "seminar", name: "Seminars" },
  { id: "webinar", name: "Webinars" },
  { id: "symposium", name: "Symposiums" },
  { id: "training", name: "Training Programs" }
];

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function ImageGallery() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredGalleries, setFilteredGalleries] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  // Load galleries (in real app, fetch from backend)
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setGalleries(mockGalleries);
      setFilteredGalleries(mockGalleries);
      setLoading(false);
    }, 500);
  }, []);

  // Filter galleries based on search and category
  useEffect(() => {
    let result = galleries;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(gallery =>
        gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gallery.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(gallery => gallery.category === selectedCategory);
    }

    setFilteredGalleries(result);
  }, [searchTerm, selectedCategory, galleries]);

  // Handle gallery click
  const handleGalleryClick = (gallery) => {
    setSelectedGallery(gallery);
    setShowGalleryModal(true);
  };

  // Handle image click
  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
    setShowImageModal(true);
  };

  // Close gallery modal
  const handleCloseGalleryModal = () => {
    setShowGalleryModal(false);
    setTimeout(() => setSelectedGallery(null), 300);
  };

  // Close image modal
  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setTimeout(() => setSelectedImage(null), 300);
  };

  // Handle download
  const handleDownloadGallery = (gallery) => {
    toast.info(`Download link for "${gallery.title}" gallery will be available soon!`);
  };

  // Handle share
  const handleShareGallery = (gallery) => {
    if (navigator.share) {
      navigator.share({
        title: gallery.title,
        text: gallery.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Gallery link copied to clipboard!");
    }
  };

  // Download single image
  const handleDownloadImage = (imageSrc) => {
    toast.info("Image download feature will be available soon!");
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url("https://res.cloudinary.com/dxvovx7s2/image/upload/v1765972142/blob-scene-haikei_qidc0k.svg")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.1
        }}
      ></div>
      
      <div className="relative z-10">
        {/* Hero Section */}
        <header className="relative overflow-hidden">
          <div
            className="h-48 md:h-60 lg:h-100 bg-center bg-cover relative"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&q=60&fit=crop')",
            }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-[#326EAC]/60 to-[#326EAC]/90"></div>
            
            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col items-center justify-start py-4 text-center">
              <div className="mb-4">
                <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-3">
                  <span className="text-white text-sm font-medium">Photo Collection</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                  Image <span className="text-[#b5d3f1]">Gallery</span>
                </h1>
                <p className="text-lg text-white/90 max-w-2xl mx-auto">
                  Browse photos from OSOO events, conferences, and activities
                </p>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{galleries.length}</div>
                  <div className="text-sm text-white/80">Galleries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {galleries.reduce((total, gallery) => total + gallery.imageCount, 0)}
                  </div>
                  <div className="text-sm text-white/80">Total Photos</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Wave Divider */}
          <div className="absolute -bottom-15 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </header>

        {/* Main Content Container */}
        <div className="bg-white -mt-16 md:-mt-20 relative rounded-t-3xl shadow-xl overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            
            {/* Navigation Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#326EAC] flex items-center justify-center text-white">
                  <FaImages />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">OSOO Photo Gallery</h2>
                  <p className="text-gray-600 text-sm">
                    Visual memories from our events
                  </p>
                </div>
              </div>
              
              {/* Quick Links */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/events/past-events"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  <FaArrowLeft className="text-sm" />
                  Past Events
                </Link>
                <Link
                  to="/events/event-videos"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#326EAC] rounded-lg hover:bg-blue-100 transition"
                >
                  Watch Videos
                </Link>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-linear-to-r from-[#326EAC]/10 to-gray-50 rounded-xl p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition"
                      placeholder="Search galleries by title or description..."
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="lg:w-64">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaFilter className="text-gray-400" />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition appearance-none"
                    >
                      {galleryCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Results Info */}
              <div className="mt-4 flex justify-between items-center">
                <p className="text-gray-600 text-sm">
                  Found <span className="font-bold">{filteredGalleries.length}</span> galleries
                </p>
                {(searchTerm || selectedCategory !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* Galleries Grid */}
            <div className="mb-12">
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                </div>
              ) : filteredGalleries.length === 0 ? (
                <div className="text-center py-16">
                  <FaExclamationTriangle className="text-4xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-600 mb-2">No Galleries Found</h3>
                  <p className="text-gray-500">
                    {searchTerm || selectedCategory !== "all" 
                      ? "Try changing your search criteria" 
                      : "No galleries available yet"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGalleries.map((gallery) => (
                    <div
                      key={gallery.id}
                      className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:border-blue-500/40 transition-all duration-300 overflow-hidden group"
                    >
                      {/* Gallery Thumbnail */}
                      <div 
                        onClick={() => handleGalleryClick(gallery)}
                        className="relative h-48 overflow-hidden cursor-pointer"
                      >
                        <img
                          src={gallery.thumbnail}
                          alt={gallery.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Image Count Badge */}
                        <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                          <FaImages className="text-xs" />
                          <span>{gallery.imageCount} photos</span>
                        </div>
                        {/* View Gallery Overlay */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="bg-white text-[#326EAC] px-4 py-2 rounded-lg font-medium">
                            View Gallery
                          </span>
                        </div>
                      </div>

                      {/* Gallery Info */}
                      <div className="p-4">
                        <h3 
                          onClick={() => handleGalleryClick(gallery)}
                          className="font-bold text-gray-800 mb-2 line-clamp-1 cursor-pointer hover:text-[#326EAC] transition"
                        >
                          {gallery.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <FaCalendarAlt className="text-[#326EAC]" />
                          <span>{formatDate(gallery.eventDate)}</span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {gallery.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs px-2 py-1 bg-[#d1e5f8] text-blue-800 rounded">
                            {gallery.category}
                          </span>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShareGallery(gallery);
                              }}
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition"
                              title="Share Gallery"
                            >
                              <FaShareAlt className="text-sm" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadGallery(gallery);
                              }}
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition"
                              title="Download All"
                            >
                              <FaDownload className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Photos CTA */}
            <div className="bg-linear-to-r from-[#326EAC]/70 to-[#326EAC] rounded-2xl p-8 text-white mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <FaCamera className="text-3xl" />
                    <h3 className="text-xl font-bold">Have Photos from OSOO Events?</h3>
                  </div>
                  <p className="text-white/90">
                    Share your photos with the OSOO community. Upload your event pictures and help us build our gallery.
                  </p>
                </div>
                <button className="px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition font-bold">
                  Upload Photos
                </button>
              </div>
            </div>

            {/* Request Photos Section */}
            <div className="bg-linear-to-r from-blue-50 to-gray-50 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#326EAC] flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  <FaRegImages />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Looking for specific event photos?
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Can't find photos from a particular event? Contact our gallery team and we'll help you find them.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="mailto:gallery@osoo.org"
                    className="px-6 py-3 bg-[#326EAC] text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Contact Gallery Team
                  </a>
                  <button className="px-6 py-3 border border-[#326EAC] text-[#326EAC] rounded-lg hover:bg-blue-50 transition font-medium">
                    Photo Request Form
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {showGalleryModal && selectedGallery && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedGallery.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      <span>{formatDate(selectedGallery.eventDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaImages />
                      <span>{selectedGallery.imageCount} photos</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCloseGalleryModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Gallery Content */}
            <div className="p-6">
              {/* Description */}
              <p className="text-gray-700 mb-6">{selectedGallery.description}</p>

              {/* Images Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedGallery.images.map((imageSrc, index) => (
                  <div 
                    key={index} 
                    className="relative group cursor-pointer"
                    onClick={() => handleImageClick(imageSrc)}
                  >
                    <img
                      src={imageSrc}
                      alt={`${selectedGallery.title} - Image ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg group-hover:opacity-90 transition"
                    />
                    {/* Expand Icon */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <FaExpand className="text-white text-2xl" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => handleDownloadGallery(selectedGallery)}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Download All Photos
                </button>
                <button
                  onClick={() => handleShareGallery(selectedGallery)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Share Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Single Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-6xl max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={handleCloseImageModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl"
            >
              <FaTimes />
            </button>
            
            {/* Image */}
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            
            {/* Action Buttons */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
              <button
                onClick={() => handleDownloadImage(selectedImage)}
                className="px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition font-medium flex items-center gap-2"
              >
                <FaDownload /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
