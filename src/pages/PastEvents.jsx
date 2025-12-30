import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaClock, 
  FaSearch,
  FaFilter,
  FaChevronRight,
  FaImages,
  FaVideo,
  FaExclamationTriangle,
  FaHistory,
  FaArrowLeft,
  FaTag,
  FaStar,
  FaDownload,
  FaChartBar,
  FaBookOpen,
  FaRegFileAlt,
  FaCertificate
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

// Event Categories (aligned with backend)
const eventCategories = [
  { id: "all", name: "All Categories", value: "all" },
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

// Get category display name
const getCategoryDisplay = (category) => {
  return categoryLabels[category] || category || 'General Event';
};

// Get year from date
const getYear = (dateString) => {
  return new Date(dateString).getFullYear();
};

// Group events by year
const groupEventsByYear = (events) => {
  return events.reduce((groups, event) => {
    const year = getYear(event.date);
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(event);
    return groups;
  }, {});
};

export default function PastEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [groupedEvents, setGroupedEvents] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    byCategory: {}
  });
  const [viewMode, setViewMode] = useState("list"); // list or timeline
  const [selectedYear, setSelectedYear] = useState("all");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const DEFAULT_EVENT_IMAGE = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=60&fit=crop";

  // Fetch past events from backend
  const fetchPastEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/events?type=completed`);
      
      if (response.data.success) {
        // Sort events by date (most recent first)
        const sortedEvents = (response.data.events || []).sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        setEvents(sortedEvents);
        setFilteredEvents(sortedEvents);
        
        // Group events by year
        const grouped = groupEventsByYear(sortedEvents);
        setGroupedEvents(grouped);
        
        // Calculate stats
        calculateStats(sortedEvents);
      }
    } catch (error) {
      console.error("Error fetching past events:", error);
      toast.error("Failed to load past events");
      setEvents([]);
      setFilteredEvents([]);
      setGroupedEvents({});
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (eventsList) => {
    const stats = {
      total: eventsList.length,
      byCategory: {},
      byYear: {}
    };
    
    eventsList.forEach(event => {
      // Count by category
      if (!stats.byCategory[event.category]) {
        stats.byCategory[event.category] = 0;
      }
      stats.byCategory[event.category]++;
      
      // Count by year
      const year = getYear(event.date);
      if (!stats.byYear[year]) {
        stats.byYear[year] = 0;
      }
      stats.byYear[year]++;
    });
    
    setStats(stats);
  };

  useEffect(() => {
    fetchPastEvents();
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

    // Filter by year
    if (selectedYear !== "all") {
      result = result.filter(event => getYear(event.date) === parseInt(selectedYear));
    }

    setFilteredEvents(result);
    
    // Update grouped events
    if (selectedCategory === "all" && selectedYear === "all") {
      const grouped = groupEventsByYear(result);
      setGroupedEvents(grouped);
    }
  }, [searchTerm, selectedCategory, selectedYear, events]);

  // Get unique years from events
  const getUniqueYears = () => {
    const years = new Set(events.map(event => getYear(event.date)));
    return Array.from(years).sort((a, b) => b - a); // Sort descending
  };

  // Download event materials
  const handleDownloadMaterials = (event) => {
    toast.info(`Materials for "${event.title}" are being prepared`);
  };

  // View event details
  const handleViewDetails = (event) => {
    // You can implement a modal or navigate to event details page
    toast.info(`Details for "${event.title}"`);
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
            className="h-48 md:h-60 lg:h-120 bg-center bg-cover relative"
            style={{
              backgroundImage: `url(${DEFAULT_EVENT_IMAGE})`,
            }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-[#326EAC]/90 to-blue-800/90"></div>
            
            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col items-center justify-start py-4 text-center">
              <div className="mb-4">
                <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-3">
                  <span className="text-white text-sm font-medium">Event Archive</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                  Past <span className="text-blue-200">Events</span>
                </h1>
                <p className="text-lg text-white/90 max-w-2xl mx-auto">
                  Browse through our archive of completed surgical oncology events, conferences, and workshops
                </p>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <div className="text-center px-4">
                  <div className="text-xl font-bold text-white mb-1">{stats.total}</div>
                  <div className="text-xs text-white/80">Total Events</div>
                </div>
                <div className="text-center px-4">
                  <div className="text-xl font-bold text-white mb-1">{Object.keys(stats.byCategory || {}).length}</div>
                  <div className="text-xs text-white/80">Categories</div>
                </div>
                <div className="text-center px-4">
                  <div className="text-xl font-bold text-white mb-1">{getUniqueYears().length}</div>
                  <div className="text-xs text-white/80">Years</div>
                </div>
              </div>
              
              {/* Back to Forthcoming Events */}
              <div className="mt-6">
                <Link
                  to="/events/upcoming-events"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition"
                >
                  <FaArrowLeft className="text-sm" />
                  Back to Forthcoming Events
                </Link>
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
            
            {/* Stats and Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#326EAC] flex items-center justify-center text-white">
                    <FaHistory />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Event Archive</h2>
                    <p className="text-gray-600 text-sm">
                      {stats.total} completed events • {getUniqueYears().length} years
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Quick Navigation */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setViewMode(viewMode === "list" ? "timeline" : "list")}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#326EAC] rounded-lg hover:bg-blue-100 transition"
                >
                  {viewMode === "list" ? <FaChartBar /> : <FaBookOpen />}
                  {viewMode === "list" ? "Timeline View" : "List View"}
                </button>
                <Link
                  to="/events/event-videos"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#326EAC] rounded-lg hover:bg-blue-100 transition"
                >
                  <FaVideo /> Event Videos
                </Link>
                <Link
                  to="/events/gallery"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#326EAC] rounded-lg hover:bg-blue-100 transition"
                >
                  <FaImages /> Image Gallery
                </Link>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-linear-to-r from-blue-50 to-gray-50 rounded-2xl p-6 mb-8 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4 mb-4">
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
                      placeholder="Search past events by title, venue, description, or tags..."
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="lg:w-56">
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

                {/* Year Filter */}
                <div className="lg:w-40">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </div>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition appearance-none"
                    >
                      <option value="all">All Years</option>
                      {getUniqueYears().map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Results Info and Quick Stats */}
              <div className="flex flex-wrap justify-between items-center">
                <div>
                  <p className="text-gray-600">
                    Found <span className="font-bold">{filteredEvents.length}</span> events
                    {selectedCategory !== "all" && (
                      <span className="text-gray-500 ml-2">
                        in {getCategoryDisplay(selectedCategory)}
                      </span>
                    )}
                    {selectedYear !== "all" && (
                      <span className="text-gray-500 ml-2">
                        from {selectedYear}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex gap-4">
                  {(searchTerm || selectedCategory !== "all" || selectedYear !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("all");
                        setSelectedYear("all");
                      }}
                      className="text-sm text-[#326EAC] hover:text-blue-700 hover:bg-blue-50 px-3 py-1 rounded-lg transition"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Category Stats */}
            {Object.keys(stats.byCategory || {}).length > 0 && selectedCategory === "all" && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Events by Category</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {Object.entries(stats.byCategory).map(([category, count]) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="bg-white border border-gray-200 rounded-lg p-3 hover:border-[#326EAC] hover:shadow-md transition text-center group"
                    >
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        {getCategoryDisplay(category)}
                      </div>
                      <div className="text-2xl font-bold text-[#326EAC]">{count}</div>
                      <div className="text-xs text-gray-500 mt-1">events</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Events List/Timeline */}
            <div className="mb-12">
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#326EAC]"></div>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-16">
                  <FaExclamationTriangle className="text-4xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-600 mb-2">No Past Events Found</h3>
                  <p className="text-gray-500">
                    {searchTerm || selectedCategory !== "all" || selectedYear !== "all"
                      ? "Try changing your search criteria" 
                      : "No completed events recorded yet"}
                  </p>
                </div>
              ) : viewMode === "timeline" ? (
                /* Timeline View */
                <div className="space-y-8">
                  {Object.entries(groupedEvents)
                    .sort(([yearA], [yearB]) => yearB - yearA) // Sort years descending
                    .map(([year, yearEvents]) => (
                      <div key={year} className="relative">
                        {/* Year Header */}
                        <div className="sticky top-0 bg-white py-4 mb-6 border-b border-gray-200 z-10">
                          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-8 h-8 bg-[#326EAC] rounded-full flex items-center justify-center text-white text-sm">
                              {year}
                            </span>
                            {year}
                            <span className="text-sm font-normal text-gray-500 ml-2">
                              ({yearEvents.length} events)
                            </span>
                          </h3>
                        </div>

                        {/* Events for this year */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-4 md:ml-8">
                          {yearEvents.map((event) => (
                            <div
                              key={event._id}
                              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#326EAC]/20 transition-all duration-300 overflow-hidden"
                            >
                              {/* Event Image */}
                              <div className="relative h-48 overflow-hidden">
                                <img
                                  src={event.imageUrl || DEFAULT_EVENT_IMAGE}
                                  alt={event.title}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-4">
                                  <div className="flex justify-between items-center">
                                    <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded">
                                      {getCategoryDisplay(event.category)}
                                    </span>
                                    <span className="text-white text-xs">
                                      {formatShortDate(event.date)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Event Content */}
                              <div className="p-4">
                                <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                                  {event.title}
                                </h3>
                                
                                <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                                  <FaMapMarkerAlt className="text-[#326EAC] text-xs" />
                                  <span className="line-clamp-1">{event.venue}</span>
                                </div>
                                
                                {/* Tags */}
                                {event.tags && event.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {event.tags.slice(0, 2).map((tag, index) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                    {event.tags.length > 2 && (
                                      <span className="px-2 py-1 bg-gray-100 text-gray-400 rounded text-xs">
                                        +{event.tags.length - 2}
                                      </span>
                                    )}
                                  </div>
                                )}

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleViewDetails(event)}
                                    className="flex-1 py-2 px-3 bg-[#326EAC] text-white rounded-lg hover:bg-blue-700 transition text-xs font-medium"
                                  >
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => handleDownloadMaterials(event)}
                                    className="p-2 text-gray-600 hover:text-[#326EAC] hover:bg-blue-50 rounded-lg transition"
                                    title="Download Materials"
                                  >
                                    <FaDownload className="text-sm" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                /* List View */
                <div className="space-y-4">
                  {filteredEvents.map((event) => {
                    const isFeatured = event.isFeatured;
                    
                    return (
                      <div
                        key={event._id}
                        className={`bg-white rounded-lg border hover:shadow-sm transition-all duration-200 ${
                          isFeatured 
                            ? 'border-l-4 border-pink-500 bg-pink-50/50' 
                            : 'border border-gray-200 hover:border-[#326EAC]/30 hover:shadow'
                        }`}
                      >
                        <div className="p-4 sm:p-5">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            {/* Event Details - Left Side */}
                            <div className="flex-1">
                              {/* Event Header with Status and Date */}
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                {/* Completed Status */}
                                <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium inline-flex items-center gap-1">
                                  <FaClock className="text-xs" /> Completed
                                </span>
                                
                                {/* Category Badge */}
                                <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                  {getCategoryDisplay(event.category)}
                                </span>
                                
                                {/* Featured Badge */}
                                {isFeatured && (
                                  <span className="px-2.5 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-medium inline-flex items-center gap-1">
                                    <FaStar className="text-xs" /> Featured
                                  </span>
                                )}
                                
                                {/* Date */}
                                <span className="text-sm text-gray-500">
                                  {formatDate(event.date)}
                                </span>
                              </div>
                              
                              {/* Event Title */}
                              <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">
                                {event.title}
                              </h3>
                              
                              {/* Event Details Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                {/* Venue */}
                                <div className="flex items-start gap-2">
                                  <FaMapMarkerAlt className="text-[#326EAC] mt-0.5 text-sm shrink-0" />
                                  <div>
                                    <p className="text-xs text-gray-500 mb-0.5">Venue</p>
                                    <p className="text-sm text-gray-800 font-medium">{event.venue}</p>
                                  </div>
                                </div>
                                
                                {/* Year */}
                                <div className="flex items-start gap-2">
                                  <FaCalendarAlt className="text-[#326EAC] mt-0.5 text-sm shrink-0" />
                                  <div>
                                    <p className="text-xs text-gray-500 mb-0.5">Year</p>
                                    <p className="text-sm text-gray-800 font-medium">{getYear(event.date)}</p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Tags */}
                              {event.tags && event.tags.length > 0 && (
                                <div className="mb-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <FaTag className="text-gray-400 text-sm" />
                                    <p className="text-xs text-gray-500">Tags</p>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {event.tags.map((tag, index) => (
                                      <span
                                        key={index}
                                        className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200 transition"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Description */}
                              <div className="mb-4">
                                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                  {event.description}
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons - Right Side */}
                            <div className="lg:w-40">
                              <div className="flex flex-col gap-2">
                                {/* View Details Button */}
                                <button
                                  onClick={() => handleViewDetails(event)}
                                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#326EAC] text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium w-full"
                                >
                                  View Details
                                  <FaChevronRight className="text-xs" />
                                </button>
                                
                                {/* Quick Info */}
                                <div className="flex items-center justify-center gap-3 mt-2">
                                  <div className="text-center">
                                    <div className="text-xs text-gray-500">Event ID</div>
                                    <div className="text-sm font-medium text-gray-800 truncate" title={event._id}>
                                      {event._id.substring(0, 8)}...
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Archive Summary */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-[#326EAC] flex items-center justify-center text-white">
                      <FaCertificate />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">OSO Event Archive</h3>
                      <p className="text-gray-600">Comprehensive record of all completed events</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#326EAC]">{stats.total}</div>
                      <div className="text-sm text-gray-600">Total Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#326EAC]">{Object.keys(stats.byCategory || {}).length}</div>
                      <div className="text-sm text-gray-600">Categories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#326EAC]">{getUniqueYears().length}</div>
                      <div className="text-sm text-gray-600">Years Covered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#326EAC]">
                        {events.filter(e => e.isFeatured).length}
                      </div>
                      <div className="text-sm text-gray-600">Featured Events</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Link
                    to="/events/reports"
                    className="flex items-center gap-2 px-5 py-3 bg-[#326EAC] text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    <FaRegFileAlt /> View Annual Reports
                  </Link>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-linear-to-r from-blue-50 to-gray-50 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Looking for upcoming events?
                  </h3>
                  <p className="text-gray-600">
                    Check our forthcoming events section for the latest conferences and workshops.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    to="/events/upcoming-events"
                    className="px-6 py-3 bg-[#326EAC] text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    View Forthcoming Events
                  </Link>
                  <Link
                    to="/events/event-videos"
                    className="px-6 py-3 border border-[#326EAC] text-[#326EAC] rounded-lg hover:bg-blue-50 transition font-medium"
                  >
                    Watch Event Videos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
