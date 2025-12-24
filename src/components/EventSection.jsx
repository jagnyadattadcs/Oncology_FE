import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function EventSection() {
  const {events} = useData();

  if (!events || events.length === 0) return null;
  
  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-10 bg-gray-50">
      {/* Header Section */}
      <div className="mb-6 md:mb-8">
        <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-[#326EAC] text-center md:text-left">
          Upcoming Events
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-[#255280] font-semibold text-center md:text-left mt-2">
          Join us in our upcoming initiatives and events
        </p>
      </div>

      {/* Events Container */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 mt-4">
        {/* Main Featured Event - Full width on mobile, half on desktop */}
        <div className="w-full lg:w-1/2 px-2 sm:px-4">
          <div className="bg-white rounded-2xl shadow-lg shadow-[#87b7e7] overflow-hidden">
            <img 
              src={events[0].imageUrl} 
              alt="Upcoming event-1" 
              className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover" 
            />
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex-1">
                  <h3 className="text-[#326EAC] font-bold text-lg sm:text-xl md:text-2xl">
                    {events[0].title}
                  </h3>
                  <p className="flex items-center text-xs sm:text-sm text-gray-600 mt-1">
                    <FaLocationDot className="text-[#326EAC] mr-1" /> 
                    {events[0].venue}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-1 border-l-4 border-[#326EAC] bg-[#93d0db] font-semibold text-[#245d97] rounded-sm px-2 py-1 text-sm">
                  <SlCalender /> 
                  <span className="whitespace-nowrap">{formatDate(events[0].date)}</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-justify text-gray-700">
                {events[0].description}
              </p>
            </div>
          </div>
        </div>

        {/* Side Events List - Full width on mobile, half on desktop */}
        <div className="w-full lg:w-1/2 px-2 sm:px-4">
          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
            {/* Map through remaining events for better maintainability */}
            {events.slice(1).map((event) => (
              <div 
                key={event._id}
                className="bg-white rounded-lg shadow-lg shadow-[#87b7e7] overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Event Image */}
                  <div className="w-full sm:w-2/5">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title} 
                      className="w-full h-40 sm:h-full object-cover"
                    />
                  </div>
                  
                  {/* Event Details */}
                  <div className="w-full sm:w-3/5 p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <h3 className="text-[#326EAC] font-bold text-base sm:text-lg md:text-xl">
                          {event.title}
                        </h3>
                        <p className="flex items-center text-xs text-gray-600 mt-1">
                          <FaLocationDot className="text-[#326EAC] mr-1" /> 
                          {event.venue}
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-1 border-l-4 border-[#326EAC] bg-[#93d0db] font-semibold text-[#245d97] text-xs sm:text-sm rounded-sm px-2 py-1">
                        <SlCalender /> 
                        <span className="whitespace-nowrap">{formatDate(event.date)}</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-justify text-gray-700 line-clamp-3">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Show More Button */}
      <div className="w-full text-center mt-8 sm:mt-10 md:mt-12 lg:mt-15 mb-4 md:mb-5">
        <Link 
          to="/events/upcoming-events"
          className='inline-block text-sm sm:text-base md:text-lg font-semibold p-2 sm:p-3 px-6 sm:px-8 border rounded-lg shadow-md shadow-[#326EAC] text-[#326EAC] hover:bg-[#326EAC] hover:text-white transition-all duration-300 cursor-pointer'
        >
          Show More
        </Link>
      </div>
    </div>
  );
}
