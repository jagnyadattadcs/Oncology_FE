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
  FaArrowLeft
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

// Format date function
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Event Categories
const eventCategories = [
  { id: "all", name: "All Events" },
  { id: "conference", name: "Conferences" },
  { id: "workshop", name: "Workshops" },
  { id: "seminar", name: "Seminars" },
  { id: "webinar", name: "Webinars" }
];

export default function PastEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState([]);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch past events from backend
  const fetchPastEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/events?type=past`);
      
      if (response.data.success) {
        // Sort events by date (most recent first)
        const sortedEvents = response.data.data.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        setEvents(sortedEvents);
        setFilteredEvents(sortedEvents);
      }
    } catch (error) {
      console.error("Error fetching past events:", error);
      toast.error("Failed to load past events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPastEvents();
  }, []);

  // Filter events based on search and category
  useEffect(() => {
    let result = events;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(event => {
        return event.category === selectedCategory;
      });
    }

    setFilteredEvents(result);
  }, [searchTerm, selectedCategory, events]);

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
              backgroundImage: "url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=60&fit=crop')",
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
                  Browse through our archive of completed surgical oncology events
                </p>
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
                      {events.length} past events recorded
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Quick Navigation */}
              <div className="flex flex-wrap gap-3">
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
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition"
                      placeholder="Search past events..."
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
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition appearance-none"
                    >
                      {eventCategories.map(category => (
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
                  Found <span className="font-bold">{filteredEvents.length}</span> events
                </p>
                {(searchTerm || selectedCategory !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className="text-sm text-[#326EAC] hover:text-blue-700"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* Events List */}
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
                    {searchTerm || selectedCategory !== "all" 
                      ? "Try changing your search criteria" 
                      : "No past events recorded yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredEvents.map((event) => (
                    <div
                      key={event._id}
                      className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:border-[#326EAC]/20 transition-all duration-300 overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Event Image */}
                        <div className="md:w-48 lg:w-56 h-48 md:h-auto">
                          <img
                            src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=60"}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Event Content */}
                        <div className="flex-1 p-6">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-800 mb-2">
                                {event.title}
                              </h3>
                              
                              <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <FaCalendarAlt className="text-[#326EAC] text-sm" />
                                  <span className="text-sm">{formatDate(event.date)}</span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-gray-600">
                                  <FaMapMarkerAlt className="text-[#326EAC] text-sm" />
                                  <span className="text-sm">{event.venue}</span>
                                </div>
                              </div>
                              
                              <p className="text-gray-600 text-sm line-clamp-2">
                                {event.description}
                              </p>
                            </div>

                            <div className="flex flex-col gap-2 lg:w-40">
                              <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium inline-flex items-center justify-center w-fit lg:w-full">
                                <FaClock className="mr-2" />
                                Completed
                              </div>
                              
                              <Link
                                to={`/events/${event._id}`}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#326EAC] text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                              >
                                View Details
                                <FaChevronRight className="text-xs" />
                              </Link>
                              
                              <div className="flex gap-2">
                                <Link
                                  to="/events/event-videos"
                                  className="flex-1 text-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-xs"
                                >
                                  Videos
                                </Link>
                                <Link
                                  to="/events/gallery"
                                  className="flex-1 text-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-xs"
                                >
                                  Photos
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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