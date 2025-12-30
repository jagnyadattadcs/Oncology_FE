import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaUser, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

const MemberSection = () => {
  const [activeYear, setActiveYear] = useState(2026);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const timelineData = [
    {
      year: "2026-2027",
      president: {
        name: "Prof. Surendra Nath Senapati",
        role: "President",
        photo: "https://res.cloudinary.com/dxvovx7s2/image/upload/v1766812775/Screenshot_2025-12-27_104908_ntbpx4.png",
        department: "Odisha Society of Oncology",
        institution: "Bhubaneswar",
        tenure: "Jan 2026 - Present"
      },
      secretary: {
        name: "Prof. Sunil Agrawala",
        role: "Secretary",
        photo: "https://res.cloudinary.com/dxvovx7s2/image/upload/v1767007385/Screenshot_2025-12-29_165221_dtdg6k.png",
        department: "Odisha Society of Oncology",
        institution: "Bhubaneswar",
        tenure: "Jan 2026 - Present"
      }
    },
    {
      year: "2024-2025",
      president: {
        name: "Prof. Sushil Kumar Giri",
        role: "President",
        photo: "https://res.cloudinary.com/dxvovx7s2/image/upload/v1767094287/Screenshot_2025-12-30_170056_ktmduj.png",
        department: "Odisha Society of Oncology",
        institution: "Bhubaneswar",
        tenure: "Jan 2024 - Dec 2025"
      },
      secretary: {
        name: "Prof. Kshitish Chandra Mishra",
        role: "Secretary",
        photo: "https://res.cloudinary.com/dxvovx7s2/image/upload/v1766813469/Screenshot_2025-12-27_110051_wzyapk.png",
        department: "Odisha Society of Oncology",
        institution: "Bhubaneswar",
        tenure: "Jan 2024 - Dec 2025"
      }
    },
    {
      year: "2022-2023",
      president: {
        name: "Dr. Lalatendu Sarangi",
        role: "President",
        photo: "https://res.cloudinary.com/dxvovx7s2/image/upload/v1766813646/Screenshot_2025-12-27_110334_x0asnw.png",
        department: "Odisha Society of Oncology",
        institution: "Bhubaneswar",
        tenure: "Jan 2022 - Dec 2023"
      },
      secretary: {
        name: "Dr. Ghanashyam Biswas",
        role: "Secretary",
        photo: "https://res.cloudinary.com/dxvovx7s2/image/upload/v1766811270/Screenshot_2025-12-27_102406_kfn675.png",
        department: "Odisha Society of Oncology",
        institution: "Bhubaneswar",
        tenure: "Jan 2022 - Dec 2023"
      }
    },
    {
      year: "2020-2021",
      president: {
        name: "Dr. Prafulla Ku. Das",
        role: "President",
        photo: "https://res.cloudinary.com/dxvovx7s2/image/upload/v1766813786/Screenshot_2025-12-27_110607_qmibf1.png",
        department: "Odisha Society of Oncology",
        institution: "Bhubaneswar",
        tenure: "Jan 2020 - Dec 2021"
      },
      secretary: {
        name: "Dr. Sanjeev Kumar Mishra",
        role: "Secretary",
        photo: "https://res.cloudinary.com/dxvovx7s2/image/upload/v1766813925/dr_sanjiv_mishra_r6dupc.jpg",
        department: "Odisha Society of Oncology",
        institution: "Bhubaneswar",
        tenure: "Jan 2020 - Dec 2021"
      }
    }
  ];

  const currentYearData = timelineData.find(item => item.year.startsWith(activeYear.toString()));

  const MemberCard = ({ member, position }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white w-sm rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-blue-200 `}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 border-gray-200">
              <img
                src={member.photo}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <h3 className="font-bold text-gray-800 text-sm sm:text-base">{member.name}</h3>
              </div>
            </div>
            
            <div className="mt-3 space-y-1">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-400 text-xs" />
                <p className="text-xs text-gray-600">{member.institution}</p>
              </div>
              <p className="text-xs text-gray-500">{member.department}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const TimelineDesktopView = () => (
    <div className="hidden lg:block">
      <div className="mb-8">
        <div className="grid grid-cols-13 gap-6 mb-6 px-4">
          <div className="col-span-3">
            <h3 className="text-lg font-bold text-[#2D6399] text-center">Year</h3>
          </div>
          <div className="col-span-5">
            <h3 className="text-lg font-bold text-[#2D6399] text-center">President</h3>
          </div>
          <div className="col-span-5">
            <h3 className="text-lg font-bold text-[#2D6399] text-center">Secretary</h3>
          </div>
        </div>

        <div className="space-y-4">
          {timelineData.map((item, index) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`grid grid-cols-13 gap-6 p-4 rounded-xl transition-all duration-300 bg-gray-50 hover:bg-gray-100 `}
            >
              {/* Year Column */}
              <div className="col-span-3 flex items-center justify-center">
                <div className="relative">
                  <div className={`text-2xl font-bold ${
                    activeYear === parseInt(item.year.split('-')[0])
                      ? 'text-blue-700'
                      : 'text-gray-700'
                  }`}>
                    {item.year}
                  </div>
                  {activeYear === parseInt(item.year.split('-')[0]) && (
                    <motion.div
                      layoutId="activeYear"
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-linear-to-r from-blue-500 to-blue-500 rounded-full"
                    />
                  )}
                </div>
              </div>

              {/* President Column */}
              <div className="col-span-5">
                <MemberCard member={item.president} position="left" />
              </div>

              {/* Secretary Column */}
              <div className="col-span-5">
                <MemberCard member={item.secretary} position="right" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const TimelineMobileTabletView = () => (
    <div className="lg:hidden">
      <div className="mb-8">
        {/* Year Selector */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
          {timelineData.map((item) => {
            const year = parseInt(item.year.split('-')[0]);
            return (
              <button
                key={item.year}
                onClick={() => setActiveYear(year)}
                className={`shrink-0 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeYear === year
                    ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {item.year}
              </button>
            );
          })}
        </div>

        {/* Selected Year Details */}
        <AnimatePresence mode="wait">
          {currentYearData && (
            <motion.div
              key={currentYearData.year}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-linear-to-br from-blue-50 to-green-50 rounded-2xl p-4 sm:p-6 shadow-lg"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <FaCalendarAlt className="text-blue-500" />
                  <span className="text-xl font-bold text-gray-800">{currentYearData.year}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* President Card */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-1 bg-blue-500 rounded-full"></div>
                    <h3 className="font-bold text-blue-600">President</h3>
                  </div>
                  <MemberCard member={currentYearData.president} position="left" />
                </div>

                {/* Secretary Card */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-1 bg-green-500 rounded-full"></div>
                    <h3 className="font-bold text-green-600">Secretary</h3>
                  </div>
                  <MemberCard member={currentYearData.secretary} position="right" />
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    const currentIndex = timelineData.findIndex(item => 
                      parseInt(item.year.split('-')[0]) === activeYear
                    );
                    if (currentIndex < timelineData.length - 1) {
                      setActiveYear(parseInt(timelineData[currentIndex + 1].year.split('-')[0]));
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                >
                  <FaChevronLeft />
                  <span className="text-sm font-medium">Previous</span>
                </button>
                
                <Link
                  to={`/members/${currentYearData.year}`}
                  className="px-4 py-2 rounded-lg bg-linear-to-r from-blue-500 to-green-500 text-white font-medium hover:shadow-lg transition-all duration-300"
                >
                  Full Details
                </Link>
                
                <button
                  onClick={() => {
                    const currentIndex = timelineData.findIndex(item => 
                      parseInt(item.year.split('-')[0]) === activeYear
                    );
                    if (currentIndex > 0) {
                      setActiveYear(parseInt(timelineData[currentIndex - 1].year.split('-')[0]));
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="text-sm font-medium">Next</span>
                  <FaChevronRight />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-b from-gray-50 to-white">
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="pt-8 sm:pt-12 md:pt-16 px-4 sm:px-6 md:px-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-[#336EAA] to-[#255280] bg-clip-text text-transparent">
              Our Leadership
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-2 max-w-3xl mx-auto px-4">
              Leadership evolution through the years - dedicated professionals guiding our mission forward
            </p>
            <div className="mt-4 flex justify-center">
              <div className="w-24 h-1 bg-linear-to-r from-blue-300 to-blue-500 rounded-full"></div>
            </div>
          </motion.div>

          {/* Main Content Container */}
          <div className="bg-white rounded-2xl shadow-xl mx-auto p-4 sm:p-6 md:p-8 min-h-[500px]">
            {/* Desktop View */}
            <TimelineDesktopView />
            
            {/* Mobile & Tablet View */}
            <TimelineMobileTabletView />

            {/* View All Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center mt-10 sm:mt-12 md:mt-14"
            >
              <Link
                to="/member/benifits"
                className="group inline-flex items-center gap-2 text-sm sm:text-base font-semibold py-3 px-8 rounded-xl bg-linear-to-r from-white to-blue-50 border-2 border-blue-300 text-[#326EAC] hover:text-white hover:border-[#326EAC] hover:from-[#326EAC] hover:to-[#255280] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View Members
                <FaChevronRight className="transform transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberSection;
