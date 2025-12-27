import React, { useState } from "react";
import { FaLocationDot, FaChevronRight } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const EventCard = ({ title, image, events }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="w-full flex flex-col rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-lg transition-all duration-300"
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
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-102' : 'scale-100'}`}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="w-full flex-1 p-4 sm:p-5 bg-linear-to-b from-white to-blue-50">
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {events.map((event, index) => (
            <Link 
              key={index}
              to={`/event/${index}`}
              className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-blue-50 hover:shadow-sm transition-all duration-200 group"
            >
              <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-linear-to-r from-blue-100 to-blue-200 border border-blue-300 text-blue-800 font-semibold text-sm transition-all duration-300 group-hover:scale-110 group-hover:from-blue-200 group-hover:to-blue-300">
                {index + 1}
              </div>
              <span className="flex-1 text-gray-700 font-medium text-sm sm:text-base group-hover:text-blue-700 transition-colors duration-200">
                {event}
              </span>
              <FaChevronRight className="text-blue-500 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function EventSection() {
  const { events } = useData();
  const [hoveredCard, setHoveredCard] = useState(null);

  if (!events || events.length === 0) return null;
  
  // Sample data - replace with your actual data
  const eventCategories = [
    {
      title: "Cancer Celebration Month & Week",
      image: "https://res.cloudinary.com/dxvovx7s2/image/upload/v1766474013/osoo_events/av0dnrtypucblm9rj8if.png",
      events: [
        "Breast Cancer Awareness Walkathon",
        "Cancer Survivors Meet & Greet",
        "Nutrition Workshop for Patients",
        "Yoga and Meditation Session",
        "Fundraising Gala Dinner",
        "Medical Camp for Early Detection",
        "Art Therapy Workshop"
      ]
    },
    {
      title: "State & National Conferences & Symposium",
      image: "https://res.cloudinary.com/dxvovx7s2/image/upload/v1766474013/osoo_events/av0dnrtypucblm9rj8if.png",
      events: [
        "National Oncology Conference 2024",
        "State Level Cancer Research Symposium",
        "Pediatric Oncology Workshop",
        "Radiation Therapy Advances Seminar",
        "Palliative Care Conference",
        "Cancer Genetics Symposium",
        "Oncology Nursing Summit"
      ]
    }
  ];
  
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

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 p-4 sm:p-6">
        {eventCategories.map((category, index) => (
          <EventCard 
            key={index}
            title={category.title}
            image={category.image}
            events={category.events}
          />
        ))}
      </div>

      {/* Show More Button */}
      <div className="w-full text-center mt-10 sm:mt-12 md:mt-16">
        <Link 
          to="/events/upcoming-events"
          className="text-lg font-semibold p-2 sm:p-3 px-8 border rounded-lg shadow-md shadow-[#326EAC] text-[#326EAC] hover:bg-[#326EAC] hover:text-white transition-all duration-300 cursor-pointer"
        >
          View All Events
        </Link>
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
      `}</style>
    </div>
  );
}