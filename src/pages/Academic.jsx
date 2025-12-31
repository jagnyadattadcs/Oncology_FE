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
  FaExternalLinkAlt,
  FaSearch,
  FaAngleRight,
  FaAngleDown
} from "react-icons/fa";
import { 
  GiBookshelf,
  GiTeacher,
  GiMedal
} from "react-icons/gi";
import { MdScience, MdSchool, MdLibraryBooks } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// Mock data for academic council members
const academicCouncilMembers = [
  {
    id: 1,
    name: "Dr. S. N. Senapati",
    designation: "Director, AHRCC",
    qualification: "MCh, FRCS",
    role: "Chairman",
    image: "https://static.vecteezy.com/system/resources/previews/026/375/249/non_2x/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg",
    specialization: "Surgical Oncology",
    institution: "Acharya Harihar Regional Cancer Centre",
    email: "senapati@oso.ac.in"
  },
  {
    id: 2,
    name: "Dr. Sunil Agarwala",
    designation: "Professor & Head",
    qualification: "MS, MCh",
    role: "Vice Chairman",
    image: "https://static.vecteezy.com/system/resources/previews/026/375/249/non_2x/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg",
    specialization: "Uro-Oncology",
    institution: "SUM Hospital",
    email: "agarwala@oso.ac.in"
  },
  {
    id: 3,
    name: "Dr. Sandip Barik",
    designation: "Associate Professor",
    qualification: "MCh, DNB",
    role: "Secretary",
    image: "https://static.vecteezy.com/system/resources/previews/026/375/249/non_2x/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg",
    specialization: "Pediatric Oncology",
    institution: "AIIMS Bhubaneswar",
    email: "barik@oso.ac.in"
  },
  {
    id: 4,
    name: "Dr. Khitish Mishra",
    designation: "Senior Consultant",
    qualification: "MCh, FIAGES",
    role: "Treasurer",
    image: "https://static.vecteezy.com/system/resources/previews/026/375/249/non_2x/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg",
    specialization: "GI Oncology",
    institution: "Carcinova Cancer Centre",
    email: "mishra@oso.ac.in"
  },
  {
    id: 5,
    name: "Dr. Asit Mohapatra",
    designation: "Professor",
    qualification: "MS, MCh",
    role: "Member",
    image: "https://static.vecteezy.com/system/resources/previews/026/375/249/non_2x/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg",
    specialization: "Head & Neck Oncology",
    institution: "KIMS Hospital",
    email: "mohapatra@oso.ac.in"
  },
  {
    id: 6,
    name: "Dr. Ghanshyam Biswas",
    designation: "Director",
    qualification: "MCh, FACS",
    role: "Member",
    image: "https://static.vecteezy.com/system/resources/previews/026/375/249/non_2x/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg",
    specialization: "Gynecologic Oncology",
    institution: "Sparsh Hospital",
    email: "biswas@oso.ac.in"
  },
  {
    id: 7,
    name: "Dr. Garima Sarawgi",
    designation: "Associate Director",
    qualification: "MCh, MRCS",
    role: "Member",
    image: "https://static.vecteezy.com/system/resources/previews/026/375/249/non_2x/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg",
    specialization: "Endocrine Surgery",
    institution: "SUM Hospital II",
    email: "sarawgi@oso.ac.in"
  },
  {
    id: 8,
    name: "Dr. Satyabrata Das",
    designation: "Chief Consultant",
    qualification: "MCh, FRCS",
    role: "Member",
    image: "https://static.vecteezy.com/system/resources/previews/026/375/249/non_2x/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg",
    specialization: "GI & HPB Oncology",
    institution: "Utkal Hospital",
    email: "das@oso.ac.in"
  }
];

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
  const [searchQuery, setSearchQuery] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'slNo', direction: 'asc' });
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const academicSchedule = [
    { id: 1, slNo: 1, institute: 'AHRCC', month: 'January', topic: 'Cervix', inCharge: 'Dr. S N Senapati' },
    { id: 2, slNo: 2, institute: 'SUM I', month: 'February', topic: 'Urology', inCharge: 'Dr. Sunil Agarwala' },
    { id: 3, slNo: 3, institute: 'AHRCC', month: 'March', topic: 'Colorectal', inCharge: 'Dr. S N Senapati' },
    { id: 4, slNo: 4, institute: 'AIIMS', month: 'April', topic: 'Testis', inCharge: 'Dr. Sandip Barik' },
    { id: 5, slNo: 5, institute: 'CARCINOVA', month: 'May', topic: 'Skin', inCharge: 'Dr. Khitish Mishra' },
    { id: 6, slNo: 6, institute: 'KIIMS', month: 'June', topic: 'Paediatric & Hematology', inCharge: 'Dr. Asit Mohapatra' },
    { id: 7, slNo: 7, institute: 'AHRCC', month: 'July', topic: 'Sarcoma', inCharge: 'Dr. S N Senapati' },
    { id: 8, slNo: 8, institute: 'SPARSH', month: 'August', topic: 'Ovary', inCharge: 'Dr. Ghanshyam Biswas' },
    { id: 9, slNo: 9, institute: 'AHRCC', month: 'September', topic: 'Head & Neck', inCharge: 'Dr. S N Senapati' },
    { id: 10, slNo: 10, institute: 'SUM II', month: 'October', topic: 'Endocrine', inCharge: 'Dr. Garima Sarawgi' },
    { id: 11, slNo: 11, institute: 'AHRCC', month: 'November', topic: 'Breast', inCharge: 'Dr. S N Senapati' },
    { id: 12, slNo: 12, institute: 'UTKAL', month: 'December', topic: 'Gastric', inCharge: 'Dr. Satyabrata Das' }
  ];

  // Helper functions
  const getInstituteFullName = (abbreviation) => {
    const names = {
      'AHRCC': 'Acharya Harihar Regional Cancer Centre',
      'AIIMS': 'All India Institute of Medical Sciences',
      'SUM': 'SOA University Medical College',
      'KIIMS': 'Kalinga Institute of Medical Sciences',
      'SPARSH': 'Sparsh Hospital',
      'CARCINOVA': 'Carcinova Cancer Centre',
      'UTKAL': 'Utkal Hospital'
    };
    return names[abbreviation] || abbreviation;
  };

  const isMonthUpcoming = (month) => {
    const monthIndex = new Date(Date.parse(month + " 1, 2024")).getMonth();
    const currentMonth = new Date().getMonth();
    return monthIndex > currentMonth;
  };

  const isMonthCurrent = (month) => {
    const monthIndex = new Date(Date.parse(month + " 1, 2024")).getMonth();
    const currentMonth = new Date().getMonth();
    return monthIndex === currentMonth;
  };

  // Sorting function
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role.toLowerCase()) {
      case 'chairman':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'vice chairman':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'secretary':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'treasurer':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'advisor':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter and sort schedule
  const filteredSchedule = academicSchedule
    .filter(program => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          program.institute.toLowerCase().includes(query) ||
          program.month.toLowerCase().includes(query) ||
          program.topic.toLowerCase().includes(query) ||
          program.inCharge.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter(program => {
      // Month filter
      if (monthFilter === 'upcoming') return isMonthUpcoming(program.month);
      if (monthFilter === 'current') return isMonthCurrent(program.month);
      if (monthFilter !== 'all') return program.month === monthFilter;
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortConfig.key === 'slNo') {
        return sortConfig.direction === 'asc' ? a.slNo - b.slNo : b.slNo - a.slNo;
      }
      
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (sortConfig.direction === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

  // Filter academic council members
  const filteredMembers = academicCouncilMembers
    .filter(member => {
      // Search filter
      if (memberSearch) {
        const query = memberSearch.toLowerCase();
        return (
          member.name.toLowerCase().includes(query) ||
          member.designation.toLowerCase().includes(query) ||
          member.specialization.toLowerCase().includes(query) ||
          member.institution.toLowerCase().includes(query) ||
          member.role.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter(member => {
      // Role filter
      if (roleFilter !== 'all') {
        return member.role.toLowerCase() === roleFilter.toLowerCase();
      }
      return true;
    });
  
  // Get visible members based on showAllMembers state
  const visibleMembers = showAllMembers ? filteredMembers : filteredMembers.slice(0, 8);

  // Get unique roles for filter
  const uniqueRoles = ['all', ...new Set(academicCouncilMembers.map(member => member.role))];

  // Action handlers
  const handleViewDetails = (program) => {
    toast.info(`Viewing details for: ${program.topic} at ${program.institute}. Full details will available soon!`);
    // You can implement modal or navigation here
  };

  const handleAddToCalendar = (program) => {
    const date = new Date(Date.parse(program.month + " 15, 2024")).toISOString().split('T')[0];
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(program.topic)}&dates=${date}/${date}&details=${encodeURIComponent(`Program at ${program.institute}, In Charge: ${program.inCharge}`)}`;
    window.open(calendarUrl, '_blank');
  };

  const handleMemberClick = (member) => {
    toast.info(`Viewing profile of ${member.name} - ${member.role}`);
    // You can implement modal or navigation here for detailed view
  };

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

            {/* Academic Council Members */}
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-[#326EAC] mb-2">Academic Council Members</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Distinguished experts guiding our academic programs and research initiatives
                </p>
              </div>

              {/* Search and Filter Controls */}
              <div className="mb-8 bg-gray-50 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search members by name, specialization, or institution..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition"
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                    />
                  </div>
                  
                  {/* Role Filter */}
                  <div className="w-full md:w-64">
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition"
                    >
                      {uniqueRoles.map((role) => (
                        <option key={role} value={role}>
                          {role === 'all' ? 'All Roles' : role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="mt-4 flex flex-wrap items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {visibleMembers.length} of {filteredMembers.length} members
                    {memberSearch && (
                      <span className="ml-2">
                        • Search: "<span className="font-medium">{memberSearch}</span>"
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-[#326EAC] font-medium">
                    Total Members: {academicCouncilMembers.length}
                  </div>
                </div>
              </div>

              {/* Members Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {visibleMembers.map((member) => (
                  <div 
                    key={member.id}
                    onClick={() => handleMemberClick(member)}
                    className="group cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl hover:border-[#326EAC] transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Member Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Role Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRoleBadgeColor(member.role)}`}>
                          {member.role}
                        </span>
                      </div>
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
                    </div>
                    
                    {/* Member Info */}
                    <div className="p-6">
                      <div className="mb-4">
                        <h4 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.designation}</p>
                        <p className="text-xs text-[#326EAC] font-medium mt-1">{member.qualification}</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Specialization</p>
                          <p className="text-sm font-medium text-gray-700">{member.specialization}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Institution</p>
                          <p className="text-sm font-medium text-gray-700 line-clamp-2">{member.institution}</p>
                        </div>
                        
                        <div className="pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{member.email}</span>
                            <button className="text-[#326EAC] hover:text-blue-700 transition-colors">
                              <FaExternalLinkAlt className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show More/Less Button */}
              {filteredMembers.length > 8 && (
                <div className="text-center">
                  <button
                    onClick={() => setShowAllMembers(!showAllMembers)}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-[#326EAC] text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {showAllMembers ? (
                      <>
                        <FaAngleDown className="text-lg" />
                        Show Less
                      </>
                    ) : (
                      <>
                        Show More Members
                        <FaAngleRight className="text-lg" />
                      </>
                    )}
                  </button>
                  <p className="text-sm text-gray-600 mt-4">
                    {showAllMembers 
                      ? `Showing all ${filteredMembers.length} members` 
                      : `Showing 8 of ${filteredMembers.length} members. Click "Show More" to view all.`
                    }
                  </p>
                </div>
              )}

              {/* Legend for Role Badges */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">Role Legend</h4>
                <div className="flex flex-wrap gap-3 justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm text-gray-600">Chairman</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-sm text-gray-600">Vice Chairman</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-600">Secretary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600">Treasurer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm text-gray-600">Advisor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span className="text-sm text-gray-600">Member</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Academic Programs Section */}
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-[#326EAC] mb-2">Academic Programs</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Monthly academic meetings and educational programs across Odisha
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                {/* Table Header with Controls */}
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Monthly Academic Meetings Schedule</h4>
                      <p className="text-sm text-gray-600 mt-1">Showing {academicSchedule.length} programs</p>
                    </div>
                    
                    {/* Search Input */}
                    <div className="relative w-full md:w-64">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search by institute or topic..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('slNo')}>
                          <div className="flex items-center gap-1">
                            Sl.No
                            {sortConfig.key === 'slNo' && (
                              sortConfig.direction === 'asc' ? '↑' : '↓'
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('institute')}>
                          <div className="flex items-center gap-1">
                            Institute
                            {sortConfig.key === 'institute' && (
                              sortConfig.direction === 'asc' ? '↑' : '↓'
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('month')}>
                          <div className="flex items-center gap-1">
                            Month
                            {sortConfig.key === 'month' && (
                              sortConfig.direction === 'asc' ? '↑' : '↓'
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('topic')}>
                          <div className="flex items-center gap-1">
                            Topic
                            {sortConfig.key === 'topic' && (
                              sortConfig.direction === 'asc' ? '↑' : '↓'
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('inCharge')}>
                          <div className="flex items-center gap-1">
                            In Charge
                            {sortConfig.key === 'inCharge' && (
                              sortConfig.direction === 'asc' ? '↑' : '↓'
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSchedule.map((program, index) => {
                        const isUpcoming = isMonthUpcoming(program.month);
                        const isCurrent = isMonthCurrent(program.month);
                        
                        return (
                          <tr 
                            key={program.id} 
                            className={`hover:bg-gray-50 transition-colors ${
                              isCurrent ? 'bg-blue-50' : ''
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                                  isCurrent 
                                    ? 'bg-[#326EAC] text-white' 
                                    : 'bg-gray-100 text-gray-800'
                                } font-semibold text-sm`}>
                                  {program.slNo}
                                </span>
                              </div>
                            </td>
                            
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {/* <div className={`w-3 h-3 rounded-full ${
                                  program.institute === 'AHRCC' ? 'bg-red-500' :
                                  program.institute === 'AIIMS' ? 'bg-blue-500' :
                                  program.institute === 'SUM' ? 'bg-green-500' :
                                  program.institute === 'KIIMS' ? 'bg-purple-500' :
                                  program.institute === 'SPARSH' ? 'bg-pink-500' :
                                  'bg-yellow-500'
                                }`}></div> */}
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{program.institute}</div>
                                  <div className="text-xs text-gray-500">{getInstituteFullName(program.institute)}</div>
                                </div>
                              </div>
                            </td>
                            
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  isCurrent 
                                    ? 'bg-[#326EAC] text-white' 
                                    : isUpcoming 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {program.month}
                                </div>
                                {isCurrent && (
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                    Current
                                  </span>
                                )}
                              </div>
                            </td>
                            
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-sm font-medium text-gray-900">{program.topic}</span>
                                {program.topic.includes('Cancer') && (
                                  <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-xs font-medium">
                                    Oncology
                                  </span>
                                )}
                              </div>
                            </td>
                            
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                                  {program.inCharge.split(' ')[1]?.[0] || program.inCharge[0]}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{program.inCharge}</div>
                                  <div className="text-xs text-gray-500">Program In Charge</div>
                                </div>
                              </div>
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleViewDetails(program)}
                                  className="px-3 py-1.5 bg-[#326EAC] text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  Details
                                </button>
                                {/* <button 
                                  onClick={() => handleAddToCalendar(program)}
                                  className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                                >
                                  <FaCalendarAlt className="text-xs" /> Calendar
                                </button> */}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-sm text-gray-600">
                      Showing {filteredSchedule.length} of {academicSchedule.length} programs
                      {searchQuery && (
                        <span className="ml-2">
                          • Search: "<span className="font-medium">{searchQuery}</span>"
                        </span>
                      )}
                    </div>
                    
                    {/* Month Filter */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 mr-2">Filter by:</span>
                      <select
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition"
                      >
                        <option value="all">All Months</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="current">Current Month</option>
                        {Array.from(new Set(academicSchedule.map(p => p.month))).sort().map(month => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#326EAC]"></div>
                  <span className="text-sm text-gray-600">Current Month</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Upcoming</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
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
