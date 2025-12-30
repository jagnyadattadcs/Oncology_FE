import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaClock, 
  FaChevronRight,
  FaChevronLeft,
  FaRegCalendarCheck,
  FaFilter,
  FaSearch,
  FaRegBookmark,
  FaShareAlt,
  FaUsers,
  FaInfoCircle,
  FaArrowRight,
  FaTimes,
  FaExclamationTriangle,
  FaDownload,
  FaVideo,
  FaImages,
  FaCheckCircle,
  FaGraduationCap,
  FaTag,
  FaStar,
  FaCertificate
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

// Event Categories (aligned with backend)
const eventCategories = [
  { id: "all", name: "All Events", value: "all" },
  { id: "cancer_celebration", name: "Cancer Celebrations", value: "cancer_celebration" },
  { id: "conference_symposium", name: "Conferences & Symposiums", value: "conference_symposium" },
  { id: "workshop_training", name: "Workshops & Training", value: "workshop_training" },
  { id: "awareness_campaign", name: "Awareness Campaigns", value: "awareness_campaign" },
  { id: "fundraising", name: "Fundraising Events", value: "fundraising" },
  { id: "other", name: "Other Events", value: "other" }
];

// Category labels for display
const categoryLabels = {
  'cancer_celebration': 'Cancer Celebrations',
  'conference_symposium': 'Conferences & Symposiums', 
  'workshop_training': 'Workshops & Training',
  'awareness_campaign': 'Awareness Campaigns',
  'fundraising': 'Fundraising Events',
  'other': 'Other Events'
};

// Format date function
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format short date
const formatShortDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Get relative time
const getRelativeTime = (dateString) => {
  const now = new Date();
  const eventDate = new Date(dateString);
  const diffTime = eventDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return "Past";
  } else if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Tomorrow";
  } else if (diffDays <= 7) {
    return `In ${diffDays} days`;
  } else if (diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7);
    return `In ${weeks} week${weeks > 1 ? 's' : ''}`;
  }
  return null;
};

// Get category display name
const getCategoryDisplay = (category) => {
  return categoryLabels[category] || category || 'General Event';
};

// Default image for events
const DEFAULT_EVENT_IMAGE = "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&q=60&fit=crop";

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    past: 0,
    completed: 0,
    featured: 0
  });
  const eventsPerPage = 6;

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  // Fetch events from backend
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/events?type=upcoming`);
      
      if (response.data.success) {
        // Sort events by date (closest first)
        const sortedEvents = (response.data.events || []).sort((a, b) => 
          new Date(a.date) - new Date(b.date)
        );
        setEvents(sortedEvents);
        setFilteredEvents(sortedEvents);
        
        // Update stats if available
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
      // Fallback to empty events
      setEvents([]);
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch event stats
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/events/stats`);
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchStats();
  }, []);

  // Filter events based on search and category
  useEffect(() => {
    let result = events;

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(event =>
        event.title?.toLowerCase().includes(searchLower) ||
        event.description?.toLowerCase().includes(searchLower) ||
        event.venue?.toLowerCase().includes(searchLower) ||
        event.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        getCategoryDisplay(event.category).toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(event => event.category === selectedCategory);
    }

    setFilteredEvents(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory, events]);

  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  // Close event details
  const handleCloseDetails = () => {
    setShowEventDetails(false);
    setTimeout(() => setSelectedEvent(null), 300);
  };

  // Handle registration
  const handleRegister = (event) => {
    toast.info(`Registration for "${event.title}" will open soon!`);
  };

  // Pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Get pagination numbers
  const getPaginationNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);
      
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber !== '...') {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Share event
  const handleShareEvent = (event) => {
    const eventUrl = `${window.location.origin}/events/${event._id}`;
    const shareText = `Check out this event: ${event.title} on ${formatShortDate(event.date)} at ${event.venue}`;
    
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: shareText,
        url: eventUrl,
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${eventUrl}`);
      toast.success("Event details copied to clipboard!");
    }
  };

  // Bookmark event
  const handleBookmark = (event) => {
    const bookmarks = JSON.parse(localStorage.getItem('osoo_event_bookmarks') || '[]');
    const index = bookmarks.findIndex(b => b._id === event._id);
    
    if (index === -1) {
      bookmarks.push({ 
        _id: event._id, 
        title: event.title, 
        date: event.date,
        category: event.category,
        venue: event.venue 
      });
      localStorage.setItem('osoo_event_bookmarks', JSON.stringify(bookmarks));
      toast.success("Event bookmarked!");
    } else {
      bookmarks.splice(index, 1);
      localStorage.setItem('osoo_event_bookmarks', JSON.stringify(bookmarks));
      toast.info("Event removed from bookmarks");
    }
  };

  // Add to calendar
  const handleAddToCalendar = (event) => {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
    
    const calendarEvent = {
      title: event.title,
      description: event.description,
      location: event.venue,
      startTime: startDate,
      endTime: endDate
    };
    
    // Create .ics file or use Google Calendar link
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/-|:|\.\d+/g, '')}/${endDate.toISOString().replace(/-|:|\.\d+/g, '')}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.venue)}`;
    
    window.open(googleCalendarUrl, '_blank');
    toast.success("Opening Google Calendar...");
  };

  // Get featured events count
  const featuredEventsCount = events.filter(e => e.isFeatured).length;

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
            className="h-60 md:h-80 lg:h-120 bg-center bg-cover relative"
            style={{
              backgroundImage: `url(${DEFAULT_EVENT_IMAGE})`,
            }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-[#326EAC]/60 to-blue-800/60"></div>
            
            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col items-center justify-start py-4 text-center">
              <div className="mb-6">
                <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                  <span className="text-white text-sm font-medium">Stay Updated</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  Forthcoming <span className="text-blue-200">Events</span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                  Join oncology conferences, workshops, and seminars across Odisha
                </p>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{stats.upcoming || events.length}</div>
                  <div className="text-sm text-white/80">Upcoming Events</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {events.filter(e => new Date(e.date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
                  </div>
                  <div className="text-sm text-white/80">Next 7 Days</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{featuredEventsCount}</div>
                  <div className="text-sm text-white/80">Featured Events</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {Object.keys(categoryLabels).length}
                  </div>
                  <div className="text-sm text-white/80">Categories</div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-6 left-10 w-24 h-24 border-6 border-white/30 rounded-2xl hidden lg:block"></div>
              <div className="absolute -top-6 right-10 w-20 h-20 border-6 border-r-0 border-white/30 rounded-2xl hidden lg:block"></div>
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
        <div className="bg-white -mt-20 md:-mt-24 relative rounded-t-3xl shadow-2xl overflow-hidden">         
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Search and Filter Section */}
            <section className="mb-12">
              <div className="bg-linear-to-r from-blue-50 to-gray-50 rounded-2xl p-6 md:p-8 shadow-lg">
                <div className="flex flex-col lg:flex-row gap-6">
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition"
                        placeholder="Search events by title, venue, description, or tags..."
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition appearance-none"
                      >
                        {eventCategories.map(category => (
                          <option key={category.id} value={category.value}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Results Info */}
                <div className="mt-6 flex flex-wrap justify-between items-center">
                  <div>
                    <p className="text-gray-600">
                      Showing <span className="font-bold">{filteredEvents.length}</span> of{" "}
                      <span className="font-bold">{events.length}</span> upcoming events
                      {selectedCategory !== "all" && (
                        <span className="text-gray-500 ml-2">
                          in {getCategoryDisplay(selectedCategory)}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={fetchEvents}
                      className="flex items-center gap-2 text-sm text-[#326EAC] hover:text-blue-700 hover:bg-blue-50 px-3 py-1 rounded-lg transition"
                    >
                      <FaRegCalendarCheck /> Refresh
                    </button>
                    <Link
                      to="/events/past-events"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#326EAC] hover:bg-gray-50 px-3 py-1 rounded-lg transition"
                    >
                      View Past Events <FaChevronRight className="text-xs" />
                    </Link>
                    <Link
                      to="/events/featured"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#326EAC] hover:bg-gray-50 px-3 py-1 rounded-lg transition"
                    >
                      <FaStar /> Featured Events
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Events Grid */}
            <section className="mb-16">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#326EAC]"></div>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-20">
                  <FaExclamationTriangle className="text-5xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-600 mb-2">No Events Found</h3>
                  <p className="text-gray-500">
                    {searchTerm || selectedCategory !== "all" 
                      ? "Try changing your search criteria" 
                      : "No upcoming events scheduled yet"}
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className="mt-4 px-6 py-2 bg-[#326EAC] text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Events Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentEvents.map((event) => {
                      const relativeTime = getRelativeTime(event.date);
                      const isSoon = relativeTime === "Today" || relativeTime === "Tomorrow";
                      const isFeatured = event.isFeatured;
                      
                      return (
                        <div
                          key={event._id}
                          className={`bg-white rounded-2xl shadow-lg overflow-hidden border hover:shadow-xl transition-all duration-300 group ${
                            isFeatured 
                              ? 'border-pink-300 ring-2 ring-pink-100' 
                              : 'border-gray-100 hover:border-[#326EAC]/30'
                          }`}
                        >
                          {/* Event Image */}
                          <div className="relative h-56 overflow-hidden">
                            <img
                              src={event.imageUrl || DEFAULT_EVENT_IMAGE}
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.target.src = DEFAULT_EVENT_IMAGE;
                              }}
                            />
                            
                            {/* Event Date Badge */}
                            <div className="absolute top-4 left-4">
                              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center shadow-lg">
                                <div className="text-lg font-bold text-[#326EAC]">
                                  {new Date(event.date).getDate()}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {new Date(event.date).toLocaleDateString('en-IN', { month: 'short' })}
                                </div>
                              </div>
                            </div>
                            
                            {/* Category Badge */}
                            <div className="absolute bottom-4 left-4">
                              <span className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                                {getCategoryDisplay(event.category)}
                              </span>
                            </div>
                            
                            {/* Featured Badge */}
                            {isFeatured && (
                              <div className="absolute top-4 right-4">
                                <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                  <FaStar className="text-xs" /> Featured
                                </span>
                              </div>
                            )}
                            
                            {/* Time Badge */}
                            {relativeTime && (
                              <div className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                                isSoon 
                                  ? 'bg-red-500 text-white' 
                                  : 'bg-blue-100 text-[#326EAC]'
                              }`}>
                                {relativeTime}
                              </div>
                            )}
                          </div>

                          {/* Event Content */}
                          <div className="p-6">
                            <div className="mb-4">
                              <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                                {event.title}
                              </h3>
                              
                              <div className="space-y-3">
                                {/* Date & Time */}
                                <div className="flex items-center gap-2 text-gray-600">
                                  <FaCalendarAlt className="text-[#326EAC]" />
                                  <span className="text-sm">{formatDate(event.date)}</span>
                                </div>
                                
                                {/* Venue */}
                                <div className="flex items-center gap-2 text-gray-600">
                                  <FaMapMarkerAlt className="text-[#326EAC]" />
                                  <span className="text-sm">{event.venue}</span>
                                </div>
                                
                                {/* Tags */}
                                {event.tags && event.tags.length > 0 && (
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <FaTag className="text-[#326EAC]" />
                                    <div className="flex flex-wrap gap-1">
                                      {event.tags.slice(0, 3).map((tag, index) => (
                                        <span 
                                          key={index}
                                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
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
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                              {event.description}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEventClick(event)}
                                className="flex-1 py-2 px-4 bg-[#326EAC] text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                              >
                                View Details
                              </button>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleBookmark(event)}
                                  className="p-2 text-gray-400 hover:text-[#326EAC] hover:bg-blue-50 rounded-lg transition"
                                  title="Bookmark Event"
                                >
                                  <FaRegBookmark />
                                </button>
                                <button
                                  onClick={() => handleShareEvent(event)}
                                  className="p-2 text-gray-400 hover:text-[#326EAC] hover:bg-blue-50 rounded-lg transition"
                                  title="Share Event"
                                >
                                  <FaShareAlt />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <nav className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaChevronLeft />
                        </button>
                        
                        {getPaginationNumbers().map((page, index) => (
                          <button
                            key={index}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-lg border ${
                              page === currentPage
                                ? 'bg-[#326EAC] text-white border-[#326EAC]'
                                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                            } ${page === '...' ? 'cursor-default' : ''}`}
                            disabled={page === '...'}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaChevronRight />
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </section>

            {/* Calendar View CTA */}
            <section className="mb-16">
              <div className="bg-linear-to-r from-blue-50 to-gray-50 rounded-2xl p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-[#326EAC] flex items-center justify-center text-white text-3xl">
                    <FaCalendarAlt />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Never Miss an Important Event
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Download our event calendar and stay updated with all forthcoming oncology events in Odisha.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => handleAddToCalendar(events[0] || {})}
                    className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-[#326EAC] text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    <FaDownload /> Add to Calendar
                  </button>
                  <button className="inline-flex items-center justify-center gap-3 px-6 py-3 border border-[#326EAC] text-[#326EAC] rounded-lg hover:bg-blue-50 transition font-medium">
                    Subscribe to Newsletter
                  </button>
                </div>
              </div>
            </section>

            {/* Navigation Links */}
            <section className="mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link
                  to="/events/past-events"
                  className="bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <FaRegCalendarCheck className="text-xl" />
                    </div>
                    <FaChevronRight className="text-sm group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Past Events</h3>
                  <p className="text-white/80 text-sm">Browse completed events and conferences</p>
                </Link>

                <Link
                  to="/events/featured"
                  className="bg-linear-to-r from-pink-600 to-pink-700 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <FaStar className="text-xl" />
                    </div>
                    <FaChevronRight className="text-sm group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Featured Events</h3>
                  <p className="text-white/80 text-sm">Highlighted conferences and workshops</p>
                </Link>

                <Link
                  to="/events/videos"
                  className="bg-linear-to-r from-purple-600 to-purple-500 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <FaVideo className="text-xl" />
                    </div>
                    <FaChevronRight className="text-sm group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Event Videos</h3>
                  <p className="text-white/80 text-sm">Watch recordings of past events</p>
                </Link>

                <Link
                  to="/events/gallery"
                  className="bg-linear-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <FaImages className="text-xl" />
                    </div>
                    <FaChevronRight className="text-sm group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Image Gallery</h3>
                  <p className="text-white/80 text-sm">Photos from OSO events</p>
                </Link>
              </div>
            </section>

            {/* Call to Organize Event */}
            <section>
              <div className="bg-linear-to-r from-[#326EAC] to-blue-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
                
                <div className="relative z-10 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <FaCertificate className="text-white text-3xl" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Interested in Organizing an Event?
                  </h3>
                  <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                    Collaborate with Odisha Society of Oncology to organize conferences, workshops, 
                    or training programs for oncologists.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-white text-[#326EAC] font-bold rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Contact Events Team
                      <FaArrowRight />
                    </Link>
                    <button className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300">
                      <FaInfoCircle /> Event Guidelines
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedEvent.isFeatured && (
                      <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium flex items-center gap-1">
                        <FaStar className="text-xs" /> Featured
                      </span>
                    )}
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {getCategoryDisplay(selectedEvent.category)}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#326EAC]">{selectedEvent.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <FaCalendarAlt className="text-gray-400 text-sm" />
                    <span className="text-sm text-gray-600">{formatDate(selectedEvent.date)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-400 hover:text-gray-600 text-2xl p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Event Image */}
                <div className="lg:col-span-2">
                  <div className="mb-6 rounded-xl overflow-hidden">
                    <img
                      src={selectedEvent.imageUrl || DEFAULT_EVENT_IMAGE}
                      alt={selectedEvent.title}
                      className="w-full h-72 object-cover"
                    />
                  </div>

                  {/* Event Description */}
                  <div className="mb-8">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">About This Event</h4>
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {selectedEvent.description}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-xl font-bold text-gray-800 mb-4">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-xl">
                      <h5 className="font-bold text-[#326EAC] mb-3">Who Should Attend?</h5>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-500" />
                          <span>Surgical Oncologists</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-500" />
                          <span>Medical Oncologists</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-500" />
                          <span>Residents & Fellows</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-500" />
                          <span>Healthcare Professionals</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h5 className="font-bold text-gray-800 mb-3">Event Highlights</h5>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-2">
                          <FaUsers className="text-[#326EAC]" />
                          <span>Expert Speakers</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <FaGraduationCap className="text-[#326EAC]" />
                          <span>CME Credits Available</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <FaRegCalendarCheck className="text-[#326EAC]" />
                          <span>Networking Opportunities</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <FaDownload className="text-[#326EAC]" />
                          <span>Resource Materials</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Right Column - Event Details */}
                <div className="lg:col-span-1">
                  <div className="bg-linear-to-br from-blue-50 to-gray-50 rounded-2xl p-6 sticky top-6">
                    {/* Quick Info */}
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#326EAC] flex items-center justify-center text-white">
                          <FaCalendarAlt />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date & Time</p>
                          <p className="font-medium">{formatDate(selectedEvent.date)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                          <FaMapMarkerAlt />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Venue</p>
                          <p className="font-medium">{selectedEvent.venue}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                          <FaUsers />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-medium">{getCategoryDisplay(selectedEvent.category)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white">
                          <FaClock />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p className="font-medium text-green-600">
                            {new Date(selectedEvent.date) < new Date() ? "Completed" : "Forthcoming"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Registration */}
                    <div className="mb-8">
                      <h5 className="font-bold text-gray-800 mb-4">Registration Information</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">OSO Members</span>
                          <span className="font-bold text-[#326EAC]">₹ 1,000</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Non-Members</span>
                          <span className="font-bold text-[#326EAC]">₹ 2,000</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Residents</span>
                          <span className="font-bold text-[#326EAC]">₹ 500</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={() => handleRegister(selectedEvent)}
                        className="w-full py-3 px-4 bg-[#326EAC] text-white rounded-lg hover:bg-blue-700 transition font-medium"
                      >
                        Register Now
                      </button>
                      <button
                        onClick={() => handleAddToCalendar(selectedEvent)}
                        className="w-full py-3 px-4 border border-[#326EAC] text-[#326EAC] rounded-lg hover:bg-blue-50 transition font-medium"
                      >
                        Add to Calendar
                      </button>
                      <button
                        onClick={() => handleShareEvent(selectedEvent)}
                        className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                      >
                        Share Event
                      </button>
                      <button
                        onClick={() => handleBookmark(selectedEvent)}
                        className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                      >
                        {localStorage.getItem('osoo_event_bookmarks')?.includes(selectedEvent._id) 
                          ? 'Remove Bookmark' 
                          : 'Bookmark Event'}
                      </button>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">Need help with registration?</p>
                      <a
                        href="mailto:events@osoo.org"
                        className="text-[#326EAC] hover:underline text-sm font-medium"
                      >
                        events@oso.org
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
