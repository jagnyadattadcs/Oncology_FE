import React, { useState, useEffect } from "react";
import { FaLocationDot, FaChevronRight } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import { Link } from "react-router-dom";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const EventCard = ({ title, image, events, category }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="w-full flex flex-col rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full relative h-60 overflow-hidden">
        <div className="absolute top-4 left-4 z-10">
          <h2 className="py-2 px-4 rounded-3xl bg-white border border-blue-300 font-bold text-blue-800 text-sm sm:text-base shadow-md">
            {title}
          </h2>
        </div>
        <img 
          src={image} 
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
          onError={(e) => {
            e.target.src = "https://res.cloudinary.com/dxvovx7s2/image/upload/v1766474013/osoo_events/av0dnrtypucblm9rj8if.png";
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="w-full flex-1 p-4 sm:p-5 bg-linear-to-b from-white to-blue-50">
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {events && events.length > 0 ? (
            events.map((event, index) => (
              <Link 
                key={index}
                to={`/events/upcoming-events`}
                className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-blue-50 hover:shadow-sm transition-all duration-200 group"
              >
                <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-linear-to-r from-blue-100 to-blue-200 border border-blue-300 text-blue-800 font-semibold text-sm transition-all duration-300 group-hover:scale-110 group-hover:from-blue-200 group-hover:to-blue-300">
                  {index + 1}
                </div>
                <span className="flex-1 text-gray-700 font-medium text-sm sm:text-base group-hover:text-blue-700 transition-colors duration-200 line-clamp-2">
                  {typeof event === 'object' ? event.title : event}
                </span>
                <FaChevronRight className="text-blue-500 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
              </Link>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">No events scheduled yet</p>
              <p className="text-gray-400 text-xs mt-1">Check back soon for updates</p>
            </div>
          )}
        </div>
        
        {/* View All Button */}
        {events && events.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              to={`/events/upcoming-events`}
              className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              View all events in this category
              <FaChevronRight className="text-xs" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default function EventSection() {
  const [eventCategories, setEventCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEventsByCategory();
  }, []);

  const fetchEventsByCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/events/by-category`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        // Transform API data to match EventCard format
        const formattedData = data.data.map(category => ({
          title: category.title,
          image: category.image,
          category: category.category,
          events: category.events || []
        }));
        setEventCategories(formattedData);
      } else {
        // Use fallback data if API returns empty
        setEventCategories(getFallbackData());
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again later.");
      // Use fallback data on error
      setEventCategories(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackData = () => {
    return [
      {
        title: "Cancer Celebration Month & Week",
        category: "cancer_celebration",
        image: "https://res.cloudinary.com/dxvovx7s2/image/upload/v1766474013/osoo_events/av0dnrtypucblm9rj8if.png",
        events: [
          "Breast Cancer Awareness Walkathon",
          "Cancer Survivors Meet & Greet",
          "Nutrition Workshop for Patients",
          "Yoga and Meditation Session"
        ]
      },
      {
        title: "State & National Conferences & Symposium",
        category: "conference_symposium",
        image: "https://res.cloudinary.com/dxvovx7s2/image/upload/v1766474013/osoo_events/av0dnrtypucblm9rj8if.png",
        events: [
          "National Oncology Conference 2024",
          "State Level Cancer Research Symposium",
          "Pediatric Oncology Workshop",
          "Radiation Therapy Advances Seminar"
        ]
      }
    ];
  };

  const retryFetch = () => {
    fetchEventsByCategory();
  };

  if (loading) {
    return (
      <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-10 bg-linear-to-b from-gray-50 to-white">
        {/* Header Section */}
        <div className="mb-8 md:mb-10 lg:mb-12 text-center">
          <div className="inline-block mb-3">
            <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl bg-linear-to-r from-[#326EAC] to-[#255280] bg-clip-text text-transparent">
              Upcoming Events
            </h2>
            <div className="h-1 w-3/4 mx-auto bg-linear-to-r from-blue-300 to-blue-500 rounded-full mt-2"></div>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-[#255280] font-semibold mt-3">
            Join us in our upcoming initiatives and events
          </p>
        </div>

        {/* Loading Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 p-4 sm:p-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="w-full h-60 bg-gray-200 animate-pulse"></div>
              <div className="p-4 sm:p-5 space-y-3">
                {[1, 2, 3].map(j => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-10 bg-linear-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="mb-8 md:mb-10 lg:mb-12 text-center">
        <div className="inline-block mb-3">
          <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl bg-linear-to-r from-[#326EAC] to-[#255280] bg-clip-text text-transparent">
            Upcoming Events
          </h2>
          <div className="h-1 w-3/4 mx-auto bg-linear-to-r from-blue-300 to-blue-500 rounded-full mt-2"></div>
        </div>
        <p className="text-base sm:text-lg lg:text-xl text-[#255280] font-semibold mt-3">
          Join us in our upcoming initiatives and events
        </p>
        
        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
            <p className="text-red-700">{error}</p>
            <button
              onClick={retryFetch}
              className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Events Grid */}
      {eventCategories.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 p-4 sm:p-6">
          {eventCategories.map((category, index) => (
            <EventCard 
              key={index}
              title={category.title}
              image={category.image}
              category={category.category}
              events={category.events}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <SlCalender className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No Events Scheduled</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            We don't have any upcoming events at the moment. Please check back later for updates.
          </p>
          <button
            onClick={retryFetch}
            className="mt-4 px-6 py-2 bg-[#326EAC] text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Show More Button */}
      {eventCategories.length > 0 && (
        <div className="w-full text-center mt-10 sm:mt-12 md:mt-16">
          <Link 
            to="/events/upcoming-events"
            className="inline-flex items-center gap-2 text-lg font-semibold p-2 sm:p-3 px-8 border border-blue-300 rounded-lg shadow-md shadow-blue-100 text-[#326EAC] hover:bg-[#326EAC] hover:text-white hover:shadow-lg transition-all duration-300"
          >
            View All Events
            <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}

      {/* Stats Info */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-[#326EAC]">
              {eventCategories.reduce((total, cat) => total + (cat.events?.length || 0), 0)}
            </div>
            <p className="text-gray-600 text-sm">Upcoming Events</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#326EAC]">
              {eventCategories.length}
            </div>
            <p className="text-gray-600 text-sm">Active Categories</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#326EAC]">
              {eventCategories.filter(cat => cat.events?.length > 0).length}
            </div>
            <p className="text-gray-600 text-sm">Categories with Events</p>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #93c5fd, #3b82f6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #60a5fa, #2563eb);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}