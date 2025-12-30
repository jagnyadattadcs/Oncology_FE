import React, { useEffect, useState } from "react";
import { 
  FaBook, 
  FaGraduationCap, 
  FaMicroscope, 
  FaUsers,
  FaCalendarAlt,
  FaChartLine,
  FaHandsHelping,
  FaLightbulb,
  FaUniversity,
  FaCertificate,
  FaVideo,
  FaFileAlt,
  FaQuoteLeft,
  FaChevronRight,
  FaExternalLinkAlt
} from "react-icons/fa";
import { 
  GiBookshelf,
  GiTeacher,
  GiMedal
} from "react-icons/gi";
import { MdScience, MdSchool, MdLibraryBooks } from "react-icons/md";
import { Link } from "react-router-dom";

// Mock data for academic programs
const academicPrograms = [
  {
    id: 1,
    title: "Fellowship Programs",
    description: "Comprehensive fellowship programs in various oncology subspecialties including breast, gastrointestinal, and head & neck oncology.",
    icon: <FaGraduationCap className="text-2xl" />,
    duration: "1-2 Years",
    level: "Advanced",
    features: ["Hands-on training", "Research component", "Mentorship"]
  },
  {
    id: 2,
    title: "Residency Training",
    description: "Structured residency programs in collaboration with leading medical institutions across Odisha.",
    icon: <MdSchool className="text-2xl" />,
    duration: "3 Years",
    level: "Intermediate",
    features: ["Clinical rotations", "Academic sessions", "Skill development"]
  },
  {
    id: 3,
    title: "CME Workshops",
    description: "Regular Continuing Medical Education workshops covering latest advancements in oncology.",
    icon: <FaBook className="text-2xl" />,
    duration: "1-5 Days",
    level: "All Levels",
    features: ["Latest techniques", "Interactive sessions", "Networking"]
  },
  {
    id: 4,
    title: "Surgical Skills Lab",
    description: "State-of-the-art simulation lab for practicing minimally invasive and robotic surgical techniques.",
    icon: <GiTeacher className="text-2xl" />,
    duration: "Flexible",
    level: "Hands-on",
    features: ["Simulation training", "Expert guidance", "Feedback sessions"]
  }
];

// Research areas
const researchAreas = [
  {
    id: 1,
    title: "Oncologic Outcomes Research",
    description: "Studies focusing on surgical outcomes, patient survival rates, and quality of life post-surgery.",
    icon: <FaChartLine />,
    projects: 15,
    active: true
  },
  {
    id: 2,
    title: "Minimally Invasive Techniques",
    description: "Research on laparoscopic, robotic, and endoscopic surgical approaches in oncology.",
    icon: <FaMicroscope />,
    projects: 8,
    active: true
  },
  {
    id: 3,
    title: "Cancer Biomarkers",
    description: "Identification and validation of biomarkers for early detection and targeted therapy.",
    icon: <MdScience />,
    projects: 12,
    active: true
  },
  {
    id: 4,
    title: "Palliative Care Research",
    description: "Studies on improving quality of life and pain management for advanced cancer patients.",
    icon: <FaHandsHelping />,
    projects: 6,
    active: true
  }
];

// Academic resources
const academicResources = [
  {
    id: 1,
    title: "OSO Journal",
    description: "Quarterly peer-reviewed journal publishing original research and review articles.",
    icon: <MdLibraryBooks />,
    link: "/academic/journal",
    type: "Publication"
  },
  {
    id: 2,
    title: "Video Library",
    description: "Collection of surgical procedure videos, lectures, and conference recordings.",
    icon: <FaVideo />,
    link: "/academic/videos",
    type: "Multimedia"
  },
  {
    id: 3,
    title: "Protocols & Guidelines",
    description: "Clinical practice guidelines and treatment protocols for various cancers.",
    icon: <FaFileAlt />,
    link: "/academic/guidelines",
    type: "Document"
  },
  {
    id: 4,
    title: "Research Database",
    description: "Database of ongoing and completed research projects by OSOO members.",
    icon: <GiBookshelf />,
    link: "/academic/research",
    type: "Database"
  }
];

// Academic calendar events
const academicEvents = [
  {
    id: 1,
    title: "Annual Oncology Conference",
    date: "March 15-17, 2024",
    type: "Conference",
    location: "Bhubaneswar",
    status: "Upcoming"
  },
  {
    id: 2,
    title: "Breast Cancer Symposium",
    date: "June 8, 2024",
    type: "Symposium",
    location: "Virtual",
    status: "Upcoming"
  },
  {
    id: 3,
    title: "Research Methodology Workshop",
    date: "August 20-22, 2024",
    type: "Workshop",
    location: "Cuttack",
    status: "Upcoming"
  }
];

export default function Academic() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            className="h-56 md:h-72 lg:h-100 bg-center bg-cover relative"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1600&q=80&fit=crop')",
            }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-[#326EAC]/90 to-blue-800/90"></div>
            
            {/* Content */}
            <div className="relative max-w-6xl mx-auto px-6 h-full flex flex-col items-center justify-start py-4 text-center">
              <div className="mb-6">
                <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                  <span className="text-white text-sm font-medium">Education & Research</span>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  Academic <span className="text-blue-200">Programs</span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                  Advancing oncology through education, research, and innovation
                </p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-6 right-10 w-24 h-24 border-6 border-white/30 rounded-2xl hidden lg:block"></div>
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
            {/* Introduction Section */}
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-12">
                <div className="inline-block px-6 py-2 bg-[#326EAC] text-white rounded-full mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold">Academic Excellence</h2>
                </div>
                <div className="max-w-4xl mx-auto">
                  <div className="bg-linear-to-r from-blue-50 to-gray-50 p-8 rounded-2xl shadow-lg border border-blue-100">
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                      The <span className="font-bold text-[#326EAC]">Odisha Society Of Oncology (OSO)</span> is committed to advancing oncology through comprehensive academic programs, cutting-edge research, and continuous professional development. Our academic initiatives are designed to foster excellence in oncology practice across Odisha.
                    </p>
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                      Through our educational programs, research opportunities, and collaborative networks, we empower oncologists to deliver the highest standard of cancer care while pushing the boundaries of medical knowledge.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Academic Programs Section */}
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-[#326EAC] mb-2">Academic Programs</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Structured educational programs designed for oncology professionals at all career stages
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {academicPrograms.map((program) => (
                  <div 
                    key={program.id} 
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl hover:border-[#326EAC]/30 transition-all duration-300 group"
                  >
                    <div className="p-6">
                      <div className="w-16 h-16 mx-auto rounded-full bg-linear-to-r from-[#326EAC] to-blue-600 flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {program.icon}
                      </div>
                      
                      <h4 className="text-xl font-bold text-gray-800 text-center mb-3">{program.title}</h4>
                      <p className="text-gray-600 text-center mb-4">{program.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-[#326EAC] text-sm font-medium rounded-full">
                          {program.duration}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                          {program.level}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {program.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#326EAC]"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <button className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-[#326EAC] hover:text-white transition-all duration-300">
                          Learn More
                          <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Research Areas Section */}
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-[#326EAC] mb-2">Research Initiatives</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Pioneering research areas and collaborative projects advancing surgical oncology
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {researchAreas.map((research) => (
                  <div 
                    key={research.id} 
                    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:border-[#326EAC]/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#326EAC] text-xl group-hover:bg-[#326EAC] group-hover:text-white transition-all duration-300">
                        {research.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xl font-bold text-gray-800">{research.title}</h4>
                          <span className="px-3 py-1 bg-blue-50 text-[#326EAC] text-sm font-medium rounded-full">
                            {research.projects} Projects
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{research.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${research.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className="text-sm text-gray-500">
                              {research.active ? 'Active Research' : 'Completed'}
                            </span>
                          </div>
                          
                          <button className="text-[#326EAC] hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                            View Projects
                            <FaExternalLinkAlt className="text-xs" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Research Stats */}
              <div className="mt-12 bg-linear-to-r from-[#326EAC] to-blue-600 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold mb-2">41+</div>
                    <p className="text-blue-100">Research Projects</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold mb-2">28+</div>
                    <p className="text-blue-100">Publications</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold mb-2">15+</div>
                    <p className="text-blue-100">Collaborating Institutions</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold mb-2">5+</div>
                    <p className="text-blue-100">International Partnerships</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Academic Resources Section */}
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-[#326EAC] mb-2">Academic Resources</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Comprehensive resources for learning, research, and professional development
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {academicResources.map((resource) => (
                  <Link
                    key={resource.id}
                    to={resource.link}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:border-[#326EAC]/30 transition-all duration-300 group hover:-translate-y-1"
                  >
                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-[#326EAC] text-2xl mb-4 group-hover:bg-[#326EAC] group-hover:text-white transition-all duration-300">
                      {resource.icon}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        {resource.type}
                      </span>
                    </div>
                    
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{resource.title}</h4>
                    <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                    
                    <div className="flex items-center text-[#326EAC] font-medium text-sm">
                      <span>Access Resource</span>
                      <FaChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Academic Calendar Section */}
            <section className="mb-16 md:mb-20">
              <div className="bg-linear-to-br from-blue-50 to-white rounded-2xl shadow-xl p-8 border border-blue-100">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
                  <div>
                    <h3 className="text-3xl font-bold text-[#326EAC] mb-2">Academic Calendar</h3>
                    <p className="text-gray-600">Upcoming events, conferences, and workshops</p>
                  </div>
                  <Link 
                    to="/events/upcoming-events"
                    className="mt-4 lg:mt-0 px-6 py-2.5 bg-[#326EAC] text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium flex items-center gap-2"
                  >
                    View All Events
                    <FaCalendarAlt />
                  </Link>
                </div>

                <div className="space-y-4">
                  {academicEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#326EAC] transition-all duration-300 group"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-blue-50 text-[#326EAC] text-sm font-medium rounded-full">
                              {event.type}
                            </span>
                            <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                              {event.status}
                            </span>
                          </div>
                          <h4 className="text-xl font-bold text-gray-800 mb-1">{event.title}</h4>
                          <div className="flex items-center gap-4 text-gray-600">
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="text-gray-400" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaUniversity className="text-gray-400" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        <button className="px-6 py-2 border border-[#326EAC] text-[#326EAC] rounded-lg hover:bg-[#326EAC] hover:text-white transition-all duration-300 font-medium whitespace-nowrap">
                          Register Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Collaboration Section */}
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-[#326EAC] mb-2">Academic Collaborations</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Partnering with leading institutions for academic excellence
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                  {[
                    { name: "AIIMS Bhubaneswar", logo: "🏥" },
                    { name: "SCB Medical College", logo: "⚕️" },
                    { name: "IIT Bhubaneswar", logo: "🎓" },
                    { name: "NISER", logo: "🔬" },
                    { name: "Tata Memorial", logo: "🏛️" },
                    { name: "NCI Delhi", logo: "🇮🇳" }
                  ].map((institution, idx) => (
                    <div 
                      key={idx} 
                      className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all duration-300 group"
                    >
                      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                        {institution.logo}
                      </div>
                      <p className="text-center text-sm font-medium text-gray-700">{institution.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="text-center">
              <div className="bg-linear-to-r from-[#326EAC] to-blue-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
                
                <div className="relative z-10">
                  <FaQuoteLeft className="text-4xl text-white/30 mb-6 mx-auto" />
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Advance Your Career in Oncology
                  </h3>
                  <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                    Join our academic programs, participate in groundbreaking research, and collaborate with leading experts in oncology.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/academic/programs"
                      className="px-8 py-3 bg-white text-[#326EAC] font-semibold rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Explore Programs
                    </Link>
                    <Link
                      to="/academic/research-opportunities"
                      className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
                    >
                      Research Opportunities
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
