import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaPlayCircle, 
  FaCalendarAlt, 
  FaClock, 
  FaSearch,
  FaFilter,
  FaChevronRight,
  FaYoutube,
  FaDownload,
  FaShareAlt,
  FaEye,
  FaExclamationTriangle,
  FaArrowLeft,
  FaRegPlayCircle
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

// Mock video data (you'll replace this with your actual data)
const mockVideos = [
  {
    id: 1,
    title: "Annual Conference 2023 - Day 1 Keynote",
    description: "Keynote speech by Dr. Rajesh Kumar Panda on advancements in surgical oncology",
    thumbnail: "https://img.youtube.com/vi/abc123/maxresdefault.jpg",
    youtubeId: "abc123",
    duration: "45:30",
    eventDate: "2023-12-15",
    views: 1250,
    speaker: "Dr. Rajesh Kumar Panda",
    category: "conference"
  },
  {
    id: 2,
    title: "Workshop: Laparoscopic Techniques in GI Oncology",
    description: "Hands-on workshop demonstrating latest laparoscopic techniques",
    thumbnail: "https://img.youtube.com/vi/def456/maxresdefault.jpg",
    youtubeId: "def456",
    duration: "1:30:15",
    eventDate: "2023-11-20",
    views: 890,
    speaker: "Dr. Sanghamitra Mohanty",
    category: "workshop"
  },
  {
    id: 3,
    title: "Webinar: Breast Cancer Surgical Management",
    description: "Interactive webinar on modern breast cancer surgical approaches",
    thumbnail: "https://img.youtube.com/vi/ghi789/maxresdefault.jpg",
    youtubeId: "ghi789",
    duration: "58:45",
    eventDate: "2023-10-10",
    views: 2150,
    speaker: "Dr. Swati Behera",
    category: "webinar"
  },
  {
    id: 4,
    title: "Symposium: Head & Neck Oncology Advances",
    description: "Panel discussion on recent advances in head and neck cancer surgery",
    thumbnail: "https://img.youtube.com/vi/jkl012/maxresdefault.jpg",
    youtubeId: "jkl012",
    duration: "1:15:20",
    eventDate: "2023-09-05",
    views: 950,
    speaker: "Dr. Pradeep Kumar Sahoo",
    category: "symposium"
  },
  {
    id: 5,
    title: "Seminar: Pediatric Surgical Oncology",
    description: "Specialized seminar focusing on pediatric cancer surgeries",
    thumbnail: "https://img.youtube.com/vi/mno345/maxresdefault.jpg",
    youtubeId: "mno345",
    duration: "50:10",
    eventDate: "2023-08-15",
    views: 720,
    speaker: "Dr. Nandita Dash",
    category: "seminar"
  },
  {
    id: 6,
    title: "Conference 2023 - Day 2 Panel Discussion",
    description: "Expert panel discussing future trends in surgical oncology",
    thumbnail: "https://img.youtube.com/vi/pqr678/maxresdefault.jpg",
    youtubeId: "pqr678",
    duration: "1:05:45",
    eventDate: "2023-12-16",
    views: 1400,
    speaker: "Multiple Speakers",
    category: "conference"
  }
];

// Video Categories
const videoCategories = [
  { id: "all", name: "All Videos" },
  { id: "conference", name: "Conference Recordings" },
  { id: "workshop", name: "Workshop Videos" },
  { id: "seminar", name: "Seminar Recordings" },
  { id: "webinar", name: "Webinar Videos" },
  { id: "symposium", name: "Symposiums" },
  { id: "training", name: "Training Videos" }
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

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export default function EventVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Load videos
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/videos`);
        setVideos(response.data.data);
        setFilteredVideos(response.data.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
        toast.error('Failed to load videos');
        // Fallback to mock data
        setVideos(mockVideos);
        setFilteredVideos(mockVideos);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Filter videos based on search and category
  useEffect(() => {
    let result = videos;

    if (searchTerm) {
      result = result.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.speaker.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter(video => video.category === selectedCategory);
    }

    setFilteredVideos(result);
  }, [searchTerm, selectedCategory, videos]);

  // Handle video click
  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  // Close video modal
  const handleCloseModal = () => {
    setShowVideoModal(false);
    setTimeout(() => setSelectedVideo(null), 300);
  };

  // Handle share
  const handleShareVideo = async (video) => {
  try {
    // Track share in backend
    await axios.post(`${API_URL}/videos/${video._id}/meta/shares`);
  } catch (error) {
    console.error('Error tracking share:', error);
  }
  
  const videoUrl = `https://youtube.com/watch?v=${video.youtubeId}`;
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
        url: videoUrl,
      });
    } else {
      navigator.clipboard.writeText(videoUrl);
      toast.success("Video link copied to clipboard!");
    }
  };

  // Handle download
  const handleDownload = async (video) => {
    try {
      // Track download in backend
      await axios.post(`${API_URL}/videos/${video._id}/meta/downloads`);
    } catch (error) {
      console.error('Error tracking download:', error);
    }
    
    toast.info(`Download link for "${video.title}" will be available soon!`);
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
              backgroundImage: "url('https://images.unsplash.com/photo-1492684223066-e9e5dcab6a53?w=1600&q=60&fit=crop')",
            }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-[#326EAC]/90 to-blue-800/90"></div>
            
            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col items-center justify-start py-4 text-center">
              <div className="mb-4">
                <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-3">
                  <span className="text-white text-sm font-medium">Video Library</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                  Event <span className="text-blue-200">Videos</span>
                </h1>
                <p className="text-lg text-white/90 max-w-2xl mx-auto">
                  Watch recordings of OSOO conferences, workshops, and seminars
                </p>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{videos.length}</div>
                  <div className="text-sm text-white/80">Videos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {videos.reduce((total, video) => total + video.views, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-white/80">Total Views</div>
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
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <FaYoutube />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">OSOO Video Library</h2>
                  <p className="text-gray-600 text-sm">
                    Educational content from past events
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
                  to="/events/gallery"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#326EAC] rounded-lg hover:bg-blue-100 transition"
                >
                  View Gallery
                </Link>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-linear-to-r from-blue-50 to-gray-50 rounded-xl p-6 mb-8">
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
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Search videos by title, speaker, or description..."
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
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none"
                    >
                      {videoCategories.map(category => (
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
                  Found <span className="font-bold">{filteredVideos.length}</span> videos
                </p>
                {(searchTerm || selectedCategory !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* Videos Grid */}
            <div className="mb-12">
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
                </div>
              ) : filteredVideos.length === 0 ? (
                <div className="text-center py-16">
                  <FaExclamationTriangle className="text-4xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-600 mb-2">No Videos Found</h3>
                  <p className="text-gray-500">
                    {searchTerm || selectedCategory !== "all" 
                      ? "Try changing your search criteria" 
                      : "No videos available yet"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVideos.map((video) => (
                    <div
                      key={video.id}
                      className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:border-blue-500/40 transition-all duration-300 overflow-hidden group"
                    >
                      {/* Video Thumbnail */}
                      <div className="relative h-48 overflow-hidden cursor-pointer">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Play Button Overlay */}
                        <div 
                          onClick={() => handleVideoClick(video)}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <FaPlayCircle className="text-white text-5xl" />
                        </div>
                        {/* Duration Badge */}
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="p-4">
                        <h3 
                          onClick={() => handleVideoClick(video)}
                          className="font-bold text-gray-800 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 transition"
                        >
                          {video.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <FaCalendarAlt className="text-blue-600" />
                          <span>{formatDate(video.eventDate)}</span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {video.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <FaEye />
                              <span>{video.views.toLocaleString()}</span>
                            </div>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                              {video.category}
                            </span>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleShareVideo(video)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Share Video"
                            >
                              <FaShareAlt className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleDownload(video)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Download"
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

            {/* YouTube Channel CTA */}
            <div className="bg-linear-to-r from-[#326EAC] to-[#162b41] rounded-2xl p-8 text-white mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <FaYoutube className="text-3xl" />
                    <h3 className="text-xl font-bold">Subscribe to OSOO YouTube Channel</h3>
                  </div>
                  <p className="text-white/90">
                    Get notified when new event videos are uploaded. Watch live streams and access exclusive content.
                  </p>
                </div>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white text-[#326EAC] rounded-lg hover:bg-gray-100 transition font-bold"
                >
                  Subscribe Now
                </a>
              </div>
            </div>

            {/* Request Videos Section */}
            <div className="bg-linear-to-r from-blue-50 to-gray-50 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#326EAC] flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  <FaRegPlayCircle />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Looking for a specific event video?
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Can't find the video you're looking for? Contact us and we'll help you find it or upload it if available.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="mailto:videos@osoo.org"
                    className="px-6 py-3 bg-[#326EAC] text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Contact Video Team
                  </a>
                  <button className="px-6 py-3 border border-[#326EAC] text-[#326EAC] rounded-lg hover:bg-blue-50 transition font-medium">
                    Request Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedVideo.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{selectedVideo.speaker}</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Video Player */}
            <div className="p-6">
              <div className="aspect-w-16 aspect-h-9 mb-6">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
                  title={selectedVideo.title}
                  className="w-full h-64 md:h-96 rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Video Details */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt />
                    <span>{formatDate(selectedVideo.eventDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock />
                    <span>{selectedVideo.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEye />
                    <span>{selectedVideo.views.toLocaleString()} views</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedVideo.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleShareVideo(selectedVideo)}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Share Video
                  </button>
                  <button
                    onClick={() => handleDownload(selectedVideo)}
                    className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}