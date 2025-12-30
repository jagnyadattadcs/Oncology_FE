import React, { useState, useEffect } from "react";
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
  FaCertificate,
  FaUserMd,
  FaBriefcase
} from "react-icons/fa";
import { GiStethoscope } from "react-icons/gi";
import { MdVerified, MdDateRange } from "react-icons/md";
import { useData } from "../context/DataContext";

// Speciality mapping for display
const specialityLabels = {
  "surgical_oncology": "Surgical Oncology",
  "radiation_oncology": "Radiation Oncology", 
  "medical_oncology": "Medical Oncology",
  "paediatric_oncology": "Paediatric Oncology",
  "haematology_haematooncology": "Haematology & Haemato-oncology",
  "gynaecologic_oncology": "Gynaecologic Oncology",
  "head_neck_oncology": "Head and Neck Oncology",
  "oncopathology": "Oncopathology",
  "uro_oncology": "Uro-Oncology", 
  "radiology": "Radiology",
  "nuclear_medicine": "Nuclear Medicine",
  "palliative_care": "Palliative Care",
  "others": "Others"
};

const LifeMembers = () => {
  const { members } = useData();
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    speciality: 'All',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 12;

  // Extract unique specialities from members
  const specialities = ['All', ...new Set(members.map(m => m.speciality).filter(Boolean))];

  // Apply filters and search
  useEffect(() => {
    let result = [...members];

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(member =>
        member.name?.toLowerCase().includes(searchLower) ||
        member.email?.toLowerCase().includes(searchLower) ||
        member.hospital?.toLowerCase().includes(searchLower) ||
        member.designation?.toLowerCase().includes(searchLower) ||
        member.uniqueId?.toLowerCase().includes(searchLower) ||
        specialityLabels[member.speciality]?.toLowerCase().includes(searchLower)
      );
    }

    // Apply speciality filter
    if (filters.speciality !== 'All') {
      result = result.filter(member => member.speciality === filters.speciality);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (filters.sortBy === 'name') {
        return filters.sortOrder === 'asc' 
          ? (a.name || '').localeCompare(b.name || '')
          : (b.name || '').localeCompare(a.name || '');
      } else if (filters.sortBy === 'date') {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return filters.sortOrder === 'asc'
          ? dateA - dateB
          : dateB - dateA;
      }
      return 0;
    });

    setFilteredMembers(result);
    setCurrentPage(1);
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

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get member initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get speciality display name
  const getSpecialityDisplay = (speciality) => {
    return specialityLabels[speciality] || speciality || 'Not Specified';
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

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
            className="h-60 md:h-80 lg:h-110 bg-center bg-cover relative"
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
                  <span className="text-white text-sm font-medium">OSO Members Directory</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  OSOO <span className="text-blue-200">Members</span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                  Distinguished oncologists dedicated to advancing cancer care in Odisha
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                    <FaUserTie className="text-white" />
                    <span className="text-white font-medium">{members.length} Members</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                    <FaCertificate className="text-white" />
                    <span className="text-white font-medium">Verified Members</span>
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
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            
            {/* Introduction */}
            <section className="mb-12">
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-block px-6 py-2 bg-[#326EAC] text-white rounded-full mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold">OSO Members</h2>
                </div>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                  Our esteemed members are dedicated oncologists committed to advancing cancer care and research in Odisha. 
                  Each member brings unique expertise and experience to our growing community.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-2xl">
                    <FaUserMd className="text-3xl text-[#326EAC] mx-auto mb-3" />
                    <h4 className="font-bold text-gray-800 text-center">Expert Oncologists</h4>
                    <p className="text-gray-600 text-center text-sm mt-2">Specialized cancer care professionals</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-2xl">
                    <FaAward className="text-3xl text-[#326EAC] mx-auto mb-3" />
                    <h4 className="font-bold text-gray-800 text-center">Verified Members</h4>
                    <p className="text-gray-600 text-center text-sm mt-2">All members are verified and approved</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-2xl">
                    <FaStar className="text-3xl text-[#326EAC] mx-auto mb-3" />
                    <h4 className="font-bold text-gray-800 text-center">Active Community</h4>
                    <p className="text-gray-600 text-center text-sm mt-2">Participating in research and conferences</p>
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
                        placeholder="Search members by name, email, hospital, or speciality..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326EAC] outline-none focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Filter Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <div className="relative">
                      <select
                        value={filters.speciality}
                        onChange={(e) => handleFilterChange('speciality', e.target.value)}
                        className="appearance-none outline-none pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent bg-white"
                      >
                        {specialities.map(spec => (
                          <option key={spec} value={spec}>
                            {spec === 'All' ? 'All Specialities' : getSpecialityDisplay(spec)}
                          </option>
                        ))}
                      </select>
                      <GiStethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                      onClick={() => handleSortChange('date')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${filters.sortBy === 'date' ? 'bg-[#326EAC] text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      Join Date
                      {filters.sortBy === 'date' && (
                        filters.sortOrder === 'asc' ? <FaSortAmountDown /> : <FaSortAmountUp />
                      )}
                    </button>
                  </div>

                  {/* Results count */}
                  <div className="ml-auto">
                    <span className="text-gray-600">
                      Showing {indexOfFirstMember + 1}-{Math.min(indexOfLastMember, filteredMembers.length)} of {filteredMembers.length} members
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Members Grid */}
            <section className="mb-12">
              {currentMembers.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                  {/* Table Header */}
                  <div className="hidden md:grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200">
                    <div className="col-span-4 font-medium text-gray-700">Member Details</div>
                    <div className="col-span-2 font-medium text-gray-700">Speciality</div>
                    <div className="col-span-2 font-medium text-gray-700">Hospital</div>
                    <div className="col-span-2 font-medium text-gray-700">Contact</div>
                    <div className="col-span-2 font-medium text-gray-700">Qualifications</div>
                  </div>

                  {/* Mobile Header */}
                  <div className="md:hidden bg-gray-50 p-4 border-b border-gray-200">
                    <h3 className="font-medium text-gray-700">OSO Members List</h3>
                    <p className="text-sm text-gray-500">{currentMembers.length} members found</p>
                  </div>

                  {/* Members List */}
                  <div className="divide-y divide-gray-100">
                    {currentMembers.map((member) => (
                      <div
                        key={member._id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        {/* Desktop View */}
                        <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                          {/* Member Details Column */}
                          <div className="col-span-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-[#326EAC] flex items-center justify-center text-white font-bold">
                                  {getInitials(member.name)}
                                </div>
                                {member.isVerified && (
                                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                                    <MdVerified className="text-white text-xs" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-gray-800">{member.name}</h4>
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                    <FaCertificate className="text-xs" /> Life Member
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{member.designation || 'Not Specified'}</p>
                                <p className="text-xs text-gray-500 mt-1">ID: {member.uniqueId || 'N/A'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Speciality Column */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-2">
                              <GiStethoscope className="text-gray-400" />
                              <span className="font-medium text-gray-800">
                                {getSpecialityDisplay(member.speciality)}
                              </span>
                            </div>
                          </div>

                          {/* Hospital Column */}
                          <div className="col-span-2">
                            {member.hospital ? (
                              <div className="flex items-center gap-2">
                                <FaHospital className="text-gray-400" />
                                <span className="text-gray-700 truncate">{member.hospital}</span>
                              </div>
                            ) : (
                              <span className="text-gray-500 text-sm">Not specified</span>
                            )}
                          </div>

                          {/* Contact Column */}
                          <div className="col-span-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <FaEnvelope className="text-gray-400 text-sm" />
                                <span className="text-gray-700 text-sm truncate">{member.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaPhone className="text-gray-400 text-sm" />
                                <span className="text-gray-700 text-sm">{member.phone}</span>
                              </div>
                            </div>
                          </div>

                          {/* Qualifications Column */}
                          <div className="col-span-2">
                            {member.qualification && member.qualification.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {Array.isArray(member.qualification) ? (
                                  member.qualification.slice(0, 2).map((qual, index) => (
                                    <span
                                      key={index}
                                      className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                                    >
                                      {qual}
                                    </span>
                                  ))
                                ) : (
                                  <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                    {member.qualification}
                                  </span>
                                )}
                                {Array.isArray(member.qualification) && member.qualification.length > 2 && (
                                  <span className="text-xs text-gray-500">+{member.qualification.length - 2} more</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-500 text-sm">Not specified</span>
                            )}
                          </div>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-[#326EAC] flex items-center justify-center text-white font-bold">
                                  {getInitials(member.name)}
                                </div>
                                {member.isVerified && (
                                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                                    <MdVerified className="text-white text-xs" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-gray-800">{member.name}</h4>
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                    <FaCertificate className="text-xs" /> Life
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{member.designation || 'Not Specified'}</p>
                                <p className="text-xs text-gray-500 mt-1">ID: {member.uniqueId || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                member.isVerified 
                                  ? 'bg-green-100 text-green-800 border border-green-200' 
                                  : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                              }`}>
                                {member.isVerified ? 'Verified' : 'Pending'}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Speciality</p>
                              <div className="flex items-center gap-2">
                                <GiStethoscope className="text-gray-400" />
                                <span className="font-medium text-gray-800 text-sm">
                                  {getSpecialityDisplay(member.speciality)}
                                </span>
                              </div>
                            </div>

                            <div>
                              <p className="text-xs text-gray-500 mb-1">Hospital</p>
                              {member.hospital ? (
                                <div className="flex items-center gap-2">
                                  <FaHospital className="text-gray-400" />
                                  <span className="text-gray-700 text-sm truncate">{member.hospital}</span>
                                </div>
                              ) : (
                                <span className="text-gray-500 text-sm">Not specified</span>
                              )}
                            </div>

                            <div>
                              <p className="text-xs text-gray-500 mb-1">Email</p>
                              <div className="flex items-center gap-2">
                                <FaEnvelope className="text-gray-400 text-sm" />
                                <span className="text-gray-700 text-sm truncate">{member.email}</span>
                              </div>
                            </div>

                            <div>
                              <p className="text-xs text-gray-500 mb-1">Phone</p>
                              <div className="flex items-center gap-2">
                                <FaPhone className="text-gray-400 text-sm" />
                                <span className="text-gray-700 text-sm">{member.phone}</span>
                              </div>
                            </div>
                          </div>

                          {member.qualification && member.qualification.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-500 mb-2">Qualifications</p>
                              <div className="flex flex-wrap gap-1">
                                {Array.isArray(member.qualification) ? (
                                  member.qualification.map((qual, index) => (
                                    <span
                                      key={index}
                                      className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                                    >
                                      {qual}
                                    </span>
                                  ))
                                ) : (
                                  <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                    {member.qualification}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="text-xs text-gray-500">
                            Member since: {formatDate(member.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <FaSearch className="text-3xl text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">No Members Found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({
                        speciality: 'All',
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
                <h3 className="text-2xl font-bold mb-6 text-center">Members Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold mb-2">{members.length}</div>
                    <p className="text-blue-100">Total Members</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold mb-2">
                      {members.filter(m => m.isVerified).length}
                    </div>
                    <p className="text-blue-100">Verified Members</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold mb-2">
                      {specialities.length - 1}
                    </div>
                    <p className="text-blue-100">Specialities</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Become Member CTA */}
            <section>
              <div className="bg-linear-to-r from-[#326EAC] to-blue-900 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/10 rounded-full"></div>
                
                <div className="relative z-10 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <FaUserTie className="text-white text-3xl" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Join OSO Today
                  </h3>
                  <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                    Become part of Odisha's premier oncology society. Connect with fellow professionals, 
                    access exclusive resources, and contribute to advancing cancer care in our region.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="/member/register"
                      className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-white text-[#326EAC] font-bold rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <FaCertificate /> Register as Member
                    </a>
                    <a
                      href="/about-us"
                      className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300"
                    >
                      <FaStar /> Learn More
                    </a>
                  </div>
                  
                  <p className="text-white/70 mt-6 text-sm">
                    For membership queries, contact{' '}
                    <a href="mailto:membership@oso.org" className="text-white underline hover:no-underline">
                      membership@oso.org
                    </a>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeMembers;