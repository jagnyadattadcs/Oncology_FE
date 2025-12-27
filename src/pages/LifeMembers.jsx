import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaUserTie,
  FaHospital,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaAward,
  FaStar,
  FaRegStar,
  FaChevronLeft,
  FaChevronRight,
  FaIdCard,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaGlobe,
  FaCertificate
} from "react-icons/fa";
import { GiStethoscope, GiMedal } from "react-icons/gi";
import { MdVerified, MdEmail, MdLocationOn, MdDateRange } from "react-icons/md";

// Mock data for life members (replace with API data)
const mockLifeMembers = Array.from({ length: 24 }, (_, index) => ({
  id: index + 1,
  name: `Dr. ${['Rajesh', 'Priyanka', 'Ananya', 'Suresh', 'Meera', 'Amit'][index % 6]} ${['Patra', 'Das', 'Mohanty', 'Nayak', 'Sahoo', 'Mishra'][index % 6]}`,
  title: ['Senior Consultant', 'Professor', 'Head of Department', 'Director', 'Senior Surgeon'][index % 5],
  hospital: `${['Apollo Hospitals', 'AIIMS', 'KIMS', 'SCB Medical', 'SUM Hospital'][index % 5]}, ${['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur'][index % 5]}`,
  specialization: [
    'Breast Oncology',
    'GI Oncology', 
    'Head & Neck Oncology',
    'Gynecologic Oncology',
    'Thoracic Oncology',
    'Urologic Oncology'
  ][index % 6],
  yearOfMembership: 2015 + (index % 8),
  city: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur'][index % 5],
  state: 'Odisha',
  qualification: ['MBBS', 'MS', 'MCh', 'FRCS'][index % 4],
  isActive: index % 3 !== 0,
  achievements: index % 3 === 0 ? ['Gold Medalist', 'Published 50+ Papers'] : ['Published 20+ Papers'],
  email: `member${index + 1}@example.com`,
  phone: `+91 ${9876500000 + index}`,
  profileImage: `https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${index % 10}.jpg`,
  bio: `Dr. ${['Rajesh', 'Priyanka', 'Ananya', 'Suresh', 'Meera', 'Amit'][index % 6]} is a dedicated surgical oncologist with over ${15 + (index % 10)} years of experience. Specializing in ${['Breast Oncology', 'GI Oncology', 'Head & Neck Oncology'][index % 3]}, they have contributed significantly to cancer care in Eastern India.`,
  membershipNumber: `OSOO-LM-${String(index + 101).padStart(3, '0')}`,
  isCouncilMember: index % 5 === 0,
  publications: 10 + (index * 3) % 30,
  conferencesAttended: 15 + (index * 2) % 25,
  researchProjects: 3 + (index % 5)
}));

const cities = ['All', 'Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur'];
const specializations = [
  'All',
  'Breast Oncology',
  'GI Oncology',
  'Head & Neck Oncology',
  'Gynecologic Oncology',
  'Thoracic Oncology',
  'Urologic Oncology',
  'Pediatric Oncology',
  'Sarcoma Surgery'
];
const years = ['All', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];

const LifeMembers = () => {
  const [members, setMembers] = useState(mockLifeMembers);
  const [filteredMembers, setFilteredMembers] = useState(mockLifeMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    city: 'All',
    specialization: 'All',
    year: 'All',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const membersPerPage = 12;

  // Apply filters and search
  useEffect(() => {
    let result = [...members];

    // Apply search
    if (searchTerm) {
      result = result.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.city !== 'All') {
      result = result.filter(member => member.city === filters.city);
    }
    if (filters.specialization !== 'All') {
      result = result.filter(member => member.specialization === filters.specialization);
    }
    if (filters.year !== 'All') {
      result = result.filter(member => member.yearOfMembership === parseInt(filters.year));
    }

    // Apply sorting
    result.sort((a, b) => {
      if (filters.sortBy === 'name') {
        return filters.sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (filters.sortBy === 'year') {
        return filters.sortOrder === 'asc'
          ? a.yearOfMembership - b.yearOfMembership
          : b.yearOfMembership - a.yearOfMembership;
      } else if (filters.sortBy === 'city') {
        return filters.sortOrder === 'asc'
          ? a.city.localeCompare(b.city)
          : b.city.localeCompare(a.city);
      }
      return 0;
    });

    setFilteredMembers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, filters, members]);

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle sort change
  const handleSortChange = (sortBy) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy ? 
        (prev.sortOrder === 'asc' ? 'desc' : 'asc') : 
        'asc'
    }));
  };

  // Calculate pagination
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  // Open member details modal
  const openMemberModal = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
    document.body.style.overflow = 'auto';
  };

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
            className="h-60 md:h-80 lg:h-96 bg-center bg-cover relative"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1600&q=60&fit=crop')",
            }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-[#326EAC]/90 to-blue-800/90"></div>
            
            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col items-center justify-start py-4 text-center">
              <div className="mb-6">
                <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                  <span className="text-white text-sm font-medium">Life Members Directory</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  OSOO <span className="text-blue-200">Life Members</span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                  Distinguished surgical oncologists who have made lifelong commitment to advancing cancer care in Odisha
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                    <FaUserTie className="text-white" />
                    <span className="text-white font-medium">{members.length} Life Members</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                    <FaCertificate className="text-white" />
                    <span className="text-white font-medium">Lifetime Recognition</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Wave Divider */}
          <div className="absolute -bottom-20 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </header>

        {/* Main Content Container */}
        <div className="bg-white -mt-20 md:-mt-24 relative rounded-t-3xl shadow-2xl overflow-hidden">          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            
            {/* Introduction */}
            <section className="mb-12">
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-block px-6 py-2 bg-[#326EAC] text-white rounded-full mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold">Life Membership</h2>
                </div>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                  Life Members of the Odisha Society of Oncology represent the highest commitment to the field of surgical oncology. 
                  These distinguished professionals have made a lifelong pledge to support and advance cancer care through their membership.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-2xl">
                    <GiMedal className="text-3xl text-[#326EAC] mx-auto mb-3" />
                    <h4 className="font-bold text-gray-800 text-center">Lifetime Recognition</h4>
                    <p className="text-gray-600 text-center text-sm mt-2">Permanent membership status with all benefits</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-2xl">
                    <FaAward className="text-3xl text-[#326EAC] mx-auto mb-3" />
                    <h4 className="font-bold text-gray-800 text-center">Elite Community</h4>
                    <p className="text-gray-600 text-center text-sm mt-2">Part of an exclusive network of senior oncologists</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-2xl">
                    <FaStar className="text-3xl text-[#326EAC] mx-auto mb-3" />
                    <h4 className="font-bold text-gray-800 text-center">Special Privileges</h4>
                    <p className="text-gray-600 text-center text-sm mt-2">VIP access to all OSOO events and programs</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Search and Filters Section */}
            <section className="mb-12">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Search Bar */}
                  <div className="flex-1">
                    <div className="relative">
                      <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search life members by name, hospital, or city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Filter Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <div className="relative">
                      <select
                        value={filters.city}
                        onChange={(e) => handleFilterChange('city', e.target.value)}
                        className="appearance-none pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent bg-white"
                      >
                        <option value="All">All Cities</option>
                        {cities.slice(1).map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      <MdLocationOn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    <div className="relative">
                      <select
                        value={filters.specialization}
                        onChange={(e) => handleFilterChange('specialization', e.target.value)}
                        className="appearance-none pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent bg-white"
                      >
                        <option value="All">All Specializations</option>
                        {specializations.slice(1).map(spec => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                      <GiStethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    <div className="relative">
                      <select
                        value={filters.year}
                        onChange={(e) => handleFilterChange('year', e.target.value)}
                        className="appearance-none pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent bg-white"
                      >
                        <option value="All">All Years</option>
                        {years.slice(1).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      <MdDateRange className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Sort Options */}
                <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">Sort by:</span>
                    <button
                      onClick={() => handleSortChange('name')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${filters.sortBy === 'name' ? 'bg-[#326EAC] text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      Name
                      {filters.sortBy === 'name' && (
                        filters.sortOrder === 'asc' ? <FaSortAmountDown /> : <FaSortAmountUp />
                      )}
                    </button>
                    <button
                      onClick={() => handleSortChange('year')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${filters.sortBy === 'year' ? 'bg-[#326EAC] text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      Year
                      {filters.sortBy === 'year' && (
                        filters.sortOrder === 'asc' ? <FaSortAmountDown /> : <FaSortAmountUp />
                      )}
                    </button>
                    <button
                      onClick={() => handleSortChange('city')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${filters.sortBy === 'city' ? 'bg-[#326EAC] text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      City
                      {filters.sortBy === 'city' && (
                        filters.sortOrder === 'asc' ? <FaSortAmountDown /> : <FaSortAmountUp />
                      )}
                    </button>
                  </div>

                  {/* Results count */}
                  <div className="ml-auto">
                    <span className="text-gray-600">
                      Showing {indexOfFirstMember + 1}-{Math.min(indexOfLastMember, filteredMembers.length)} of {filteredMembers.length} life members
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Members Grid */}
            <section className="mb-12">
              {currentMembers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl hover:border-[#326EAC]/30 transition-all duration-300 group"
                    >
                      {/* Member Image and Badge */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={member.profileImage}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4">
                          <div className="bg-[#326EAC] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                            <FaCertificate />
                            Life Member
                          </div>
                        </div>
                        {member.isCouncilMember && (
                          <div className="absolute top-4 left-4">
                            <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                              <MdVerified />
                              Council Member
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Member Info */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">{member.title}</p>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-start gap-2">
                            <FaHospital className="text-gray-400 mt-1 shrink-0" />
                            <span className="text-sm text-gray-700">{member.hospital}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <GiStethoscope className="text-gray-400 mt-1 shrink-0" />
                            <span className="text-sm text-gray-700">{member.specialization}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <FaMapMarkerAlt className="text-gray-400 mt-1 shrink-0" />
                            <span className="text-sm text-gray-700">{member.city}, {member.state}</span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-between items-center mb-4 pt-4 border-t border-gray-100">
                          <div className="text-center">
                            <div className="text-lg font-bold text-[#326EAC]">{member.publications}</div>
                            <p className="text-xs text-gray-500">Publications</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-[#326EAC]">{member.conferencesAttended}</div>
                            <p className="text-xs text-gray-500">Conferences</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-[#326EAC]">{member.yearOfMembership}</div>
                            <p className="text-xs text-gray-500">Member Since</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => openMemberModal(member)}
                            className="flex-1 py-2 px-4 bg-[#326EAC] text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            View Profile
                          </button>
                          <button className="py-2 px-4 border border-[#326EAC] text-[#326EAC] rounded-lg hover:bg-[#326EAC] hover:text-white transition-colors">
                            Connect
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <FaSearch className="text-3xl text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">No Life Members Found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({
                        city: 'All',
                        specialization: 'All',
                        year: 'All',
                        sortBy: 'name',
                        sortOrder: 'asc'
                      });
                    }}
                    className="mt-4 px-6 py-2 bg-[#326EAC] text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
              <section className="mb-12">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronLeft />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`w-10 h-10 rounded-lg font-medium ${
                          currentPage === pageNumber
                            ? 'bg-[#326EAC] text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronRight />
                  </button>
                </div>
                <p className="text-center text-gray-600 mt-4">
                  Page {currentPage} of {totalPages}
                </p>
              </section>
            )}

            {/* Statistics Section */}
            <section className="mb-12">
              <div className="bg-linear-to-r from-[#326EAC] to-blue-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6 text-center">Life Members Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold mb-2">{members.length}</div>
                    <p className="text-blue-100">Total Life Members</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold mb-2">
                      {Math.max(...members.map(m => m.yearOfMembership))}
                    </div>
                    <p className="text-blue-100">Latest Induction Year</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold mb-2">
                      {Math.min(...members.map(m => m.yearOfMembership))}
                    </div>
                    <p className="text-blue-100">Earliest Induction Year</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold mb-2">5</div>
                    <p className="text-blue-100">Distinct Cities</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Become Life Member CTA */}
            <section>
              <div className="bg-linear-to-r from-[#326EAC] to-blue-900 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/10 rounded-full"></div>
                
                <div className="relative z-10 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <FaAward className="text-white text-3xl" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Become a Life Member Today
                  </h3>
                  <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                    Join the elite community of surgical oncologists committed to lifelong support of OSOO's mission. 
                    Enjoy permanent membership status with exclusive benefits and recognition.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/member/register"
                      className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-white text-[#326EAC] font-bold rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <FaCertificate /> Apply for Life Membership
                    </Link>
                    <Link
                      to="/member/benifits"
                      className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300"
                    >
                      <FaStar /> View Benefits
                    </Link>
                  </div>
                  
                  <p className="text-white/70 mt-6 text-sm">
                    For Life Membership queries, contact{' '}
                    <a href="mailto:membership@osoo.org" className="text-white underline hover:no-underline">
                      membership@osoo.org
                    </a>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Member Details Modal */}
      {isModalOpen && selectedMember && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-[#326EAC]">{selectedMember.name}</h3>
                  <p className="text-gray-600">{selectedMember.title} • OSOO Life Member</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl p-2 hover:bg-gray-100 rounded-full transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Image and Basic Info */}
                <div className="lg:col-span-1">
                  <div className="bg-linear-to-br from-blue-50 to-gray-50 rounded-2xl p-6">
                    {/* Profile Image */}
                    <div className="relative mb-6">
                      <img
                        src={selectedMember.profileImage}
                        alt={selectedMember.name}
                        className="w-full h-64 object-cover rounded-xl shadow-lg"
                      />
                      <div className="absolute -bottom-3 right-4">
                        <MdVerified className="text-4xl text-[#326EAC] bg-white rounded-full p-1 shadow-lg" />
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaIdCard className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Member ID</p>
                          <p className="font-medium">{selectedMember.membershipNumber}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <FaCalendarAlt className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Member Since</p>
                          <p className="font-medium">{selectedMember.yearOfMembership}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <FaHospital className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Hospital</p>
                          <p className="font-medium">{selectedMember.hospital}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <FaMapMarkerAlt className="text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{selectedMember.city}, {selectedMember.state}</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-6 grid grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                        <div className="text-lg font-bold text-[#326EAC]">{selectedMember.publications}</div>
                        <p className="text-xs text-gray-500">Papers</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                        <div className="text-lg font-bold text-[#326EAC]">{selectedMember.conferencesAttended}</div>
                        <p className="text-xs text-gray-500">Conferences</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                        <div className="text-lg font-bold text-[#326EAC]">{selectedMember.researchProjects}</div>
                        <p className="text-xs text-gray-500">Projects</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="lg:col-span-2">
                  {/* Bio */}
                  <div className="mb-8">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FaUserTie className="text-[#326EAC]" />
                      Professional Bio
                    </h4>
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <p className="text-gray-700 leading-relaxed">{selectedMember.bio}</p>
                    </div>
                  </div>

                  {/* Specialization */}
                  <div className="mb-8">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <GiStethoscope className="text-[#326EAC]" />
                      Specialization
                    </h4>
                    <div className="bg-white p-4 rounded-xl border border-blue-100">
                      <span className="inline-block px-4 py-2 bg-[#326EAC] text-white rounded-full font-medium">
                        {selectedMember.specialization}
                      </span>
                    </div>
                  </div>

                  {/* Qualifications */}
                  <div className="mb-8">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FaGraduationCap className="text-[#326EAC]" />
                      Qualifications
                    </h4>
                    <div className="bg-linear-to-r from-blue-50 to-white p-6 rounded-xl border-l-4 border-[#326EAC]">
                      <p className="font-medium text-gray-800">{selectedMember.qualification}</p>
                    </div>
                  </div>

                  {/* Key Achievements */}
                  {selectedMember.achievements && selectedMember.achievements.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FaAward className="text-[#326EAC]" />
                        Key Achievements
                      </h4>
                      <div className="space-y-3">
                        {selectedMember.achievements.map((achievement, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#326EAC] transition"
                          >
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                              <span className="text-xs font-bold text-[#326EAC]">{idx + 1}</span>
                            </div>
                            <p className="text-gray-700">{achievement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="bg-linear-to-r from-[#326EAC] to-blue-600 rounded-xl p-6 text-white">
                    <h4 className="text-xl font-bold mb-4">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <FaEnvelope className="text-white/80" />
                        <div>
                          <p className="text-sm text-white/80">Email</p>
                          <p className="font-medium">{selectedMember.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaPhone className="text-white/80" />
                        <div>
                          <p className="text-sm text-white/80">Phone</p>
                          <p className="font-medium">{selectedMember.phone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <p className="text-sm mb-2">Connect on:</p>
                      <div className="flex gap-3">
                        <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                          <FaLinkedin />
                        </button>
                        <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                          <MdEmail />
                        </button>
                        <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                          <FaGlobe />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white p-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-gray-600 text-sm">
                  Life Member since {selectedMember.yearOfMembership}
                </p>
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-[#326EAC] text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LifeMembers;