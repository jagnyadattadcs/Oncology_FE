import React, { useState, useEffect } from 'react'
import { MdPeopleAlt } from "react-icons/md";
import { FiAward } from "react-icons/fi";
import { IoBookSharp } from "react-icons/io5";
import { RiCalendarTodoFill } from "react-icons/ri";
import { FaArrowRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const AboutSection = () => {
  const [counters, setCounters] = useState({
    members: 0,
    years: 0,
    publications: 0,
    events: 0
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const sectionElement = document.querySelector('#about-section');
    if (sectionElement) {
      observer.observe(sectionElement);
    }

    return () => {
      if (sectionElement) {
        observer.unobserve(sectionElement);
      }
    };
  }, []);

  // Counter animation
  useEffect(() => {
    if (isVisible) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const interval = duration / steps;

      const targetValues = {
        members: 200,
        years: 15,
        publications: 150,
        events: 12
      };

      const incrementValues = {
        members: targetValues.members / steps,
        years: targetValues.years / steps,
        publications: targetValues.publications / steps,
        events: targetValues.events / steps
      };

      let currentStep = 0;
      const counterInterval = setInterval(() => {
        currentStep++;
        setCounters(prev => ({
          members: Math.min(Math.floor(incrementValues.members * currentStep), targetValues.members),
          years: Math.min(Math.floor(incrementValues.years * currentStep), targetValues.years),
          publications: Math.min(Math.floor(incrementValues.publications * currentStep), targetValues.publications),
          events: Math.min(Math.floor(incrementValues.events * currentStep), targetValues.events)
        }));

        if (currentStep >= steps) {
          clearInterval(counterInterval);
        }
      }, interval);

      return () => clearInterval(counterInterval);
    }
  }, [isVisible]);

  // Handle image load
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div 
      id="about-section" 
      className='w-full py-6 md:py-12 bg-linear-to-r from-blue-50 to-pink-50'
    >
      {/* Stats Section */}
      <div className='flex flex-col sm:flex-row items-center justify-center w-full max-w-6xl mx-auto p-2 md:p-4 gap-6 md:gap-12 lg:gap-40 mt-5 md:mt-10'>
        <div className='flex flex-col items-center justify-center group cursor-pointer hover:scale-105 transition-transform duration-300'>
          <div className='bg-[#0052A8] w-16 h-16 md:w-20 md:h-20 p-2 flex items-center justify-center rounded-full text-white text-3xl md:text-4xl group-hover:bg-[#004080] transition-colors duration-300 shadow-lg group-hover:shadow-xl'>
            <MdPeopleAlt />
          </div>
          <span className='font-semibold text-2xl md:text-3xl text-[#0052AB] mt-3'>
            {counters.members}+
          </span>
          <span className='text-base md:text-lg text-gray-600 mt-1'>Active Members</span>
        </div>
        
        <div className='flex flex-col items-center justify-center group cursor-pointer hover:scale-105 transition-transform duration-300'>
          <div className='bg-[#0052A8] w-16 h-16 md:w-20 md:h-20 p-2 flex items-center justify-center rounded-full text-white text-3xl md:text-4xl group-hover:bg-[#004080] transition-colors duration-300 shadow-lg group-hover:shadow-xl'>
            <FiAward />
          </div>
          <span className='font-semibold text-2xl md:text-3xl text-[#0052AB] mt-3'>
            {counters.years}+
          </span>
          <span className='text-base md:text-lg text-gray-600 mt-1'>Years of Service</span>
        </div>
        
        <div className='flex flex-col items-center justify-center group cursor-pointer hover:scale-105 transition-transform duration-300'>
          <div className='bg-[#0052A8] w-16 h-16 md:w-20 md:h-20 p-2 flex items-center justify-center rounded-full text-white text-3xl md:text-4xl group-hover:bg-[#004080] transition-colors duration-300 shadow-lg group-hover:shadow-xl'>
            <IoBookSharp />
          </div>
          <span className='font-semibold text-2xl md:text-3xl text-[#0052AB] mt-3'>
            {counters.publications}+
          </span>
          <span className='text-base md:text-lg text-gray-600 mt-1'>Publications</span>
        </div>
        
        <div className='flex flex-col items-center justify-center group cursor-pointer hover:scale-105 transition-transform duration-300'>
          <div className='bg-[#0052A8] w-16 h-16 md:w-20 md:h-20 p-2 flex items-center justify-center rounded-full text-white text-3xl md:text-4xl group-hover:bg-[#004080] transition-colors duration-300 shadow-lg group-hover:shadow-xl'>
            <RiCalendarTodoFill />
          </div>
          <span className='font-semibold text-2xl md:text-3xl text-[#0052AB] mt-3'>
            {counters.events}+
          </span>
          <span className='text-base md:text-lg text-gray-600 mt-1'>Annual Events</span>
        </div>
      </div>

      {/* Content Section */}
      <div className='w-full mx-auto p-4 md:p-8 mt-8 md:mt-16'>
        <div className='flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12'>
          {/* Text Content */}
          <div className='w-full px-4 md:px-8'>
            <h2 className='text-[#0052B0] text-2xl md:text-3xl lg:text-3xl font-bold mb-4 md:mb-6'>
              About OSOO
            </h2>
            <div className='space-y-4 md:space-y-6'>
              <p className='text-justify text-base md:text-lg text-gray-700 leading-relaxed'>
                The <span className='font-semibold'>ODISHA SOCIETY OF ONCOLOGY</span> (OSOO) was established in 2008 with a mission to advance the field of surgical oncology in the state. We bring together leading oncologists, surgeons, and medical professionals dedicated to improving cancer care.
              </p>
              <p className='text-justify text-base md:text-lg text-gray-700 leading-relaxed'>
                Through continuous education, research collaboration, and clinical excellence, we strive to set the highest standards in oncological surgery and patient care across Odisha.
              </p>
            </div>
            <Link 
              to="/about-us" 
              className='inline-flex items-center gap-2 mt-6 md:mt-8 text-[#0052B0] text-base md:text-lg font-medium group hover:text-[#003d80] transition-colors duration-300'
            >
              <span>Learn More</span>
              <FaArrowRight className='mt-1 group-hover:translate-x-1.5 duration-300'/>
            </Link>
          </div>

          {/* Image Content */}
          <div className='w-full'>
            <div className={`relative overflow-hidden rounded-xl md:rounded-2xl shadow-lg transition-all duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <img 
                className='w-full h-auto object-cover transition-transform duration-500 hover:scale-105'
                src="https://aroi.org/images/slider-pic/4.jpg" 
                alt="OSOO Medical Conference"
                loading="lazy"
                onLoad={handleImageLoad}
              />
              {/* Loading skeleton */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl md:rounded-2xl"></div>
              )}
            </div>
            <div className="mt-4 text-center text-sm text-gray-500 italic">
              OSOO Annual Conference 2024
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutSection
