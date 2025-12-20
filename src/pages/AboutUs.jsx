import React, { useEffect, useState } from "react";
import { 
  FaBullseye, 
  FaEye,
  FaChevronRight,
  FaQuoteLeft,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaHospital,
  FaGraduationCap,
  FaCalendarAlt,
  FaMapMarkerAlt
} from "react-icons/fa";
import { GiStethoscope } from "react-icons/gi";
import { RiGroupLine } from "react-icons/ri";
import { MdVerified, MdSchool, MdMedicalServices, MdWork } from "react-icons/md";
import { Link } from "react-router-dom";

const councilMembers = [
  { 
    id: 1, 
    name: "Dr. Rajesh Kumar Panda", 
    title: "President", 
    sub: "MS, MCh (Surg. Onco.)", 
    img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=800&q=60",
    email: "rajesh.panda@example.com",
    phone: "+91 9876543210",
    hospital: "Apollo Hospitals, Bhubaneswar",
    experience: "15+ Years",
    specialization: "Surgical Oncology",
    qualifications: "MS, MCh (Surgical Oncology), FRCS",
    bio: "Renowned surgical oncologist with extensive experience in cancer surgeries. Pioneered several minimally invasive surgical techniques in Odisha.",
    achievements: [
      "Published 50+ research papers",
      "Awarded Best Oncologist 2020",
      "Member of National Cancer Board"
    ]
  },
  { 
    id: 2, 
    name: "Dr. Sanghamitra Mohanty", 
    title: "Vice President", 
    sub: "MS, MCh (Surg. Onco.)", 
    img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=800&q=60",
    email: "sanghamitra.m@example.com",
    phone: "+91 9876543211",
    hospital: "KIMS Hospital, Bhubaneswar",
    experience: "12+ Years",
    specialization: "Breast Oncology",
    qualifications: "MS, MCh (Surgical Oncology), FICS",
    bio: "Specialized in breast cancer surgeries and reconstruction. Active researcher in oncoplastic surgery techniques.",
    achievements: [
      "Breast Cancer Research Award 2021",
      "Women in Medicine Excellence Award",
      "Published 30+ papers"
    ]
  },
  { 
    id: 3, 
    name: "Dr. Pradeep Kumar Sahoo", 
    title: "Secretary", 
    sub: "MS, MCh (Surg. Onco.)", 
    img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=800&q=60",
    email: "pradeep.sahoo@example.com",
    phone: "+91 9876543212",
    hospital: "AIIMS, Bhubaneswar",
    experience: "18+ Years",
    specialization: "GI Oncology",
    qualifications: "MS, MCh, PhD (Oncology)",
    bio: "Expert in gastrointestinal cancer surgeries. Published extensively on pancreatic and colorectal cancers.",
    achievements: [
      "National Research Excellence Award",
      "Best Paper Award - ASI Conference",
      "Reviewer for International Journals"
    ]
  },
  { 
    id: 4, 
    name: "Dr. Nandita Dash", 
    title: "Treasurer", 
    sub: "MS, MCh (Surg. Onco.)", 
    img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=800&q=60",
    email: "nandita.dash@example.com",
    phone: "+91 9876543213",
    hospital: "SUM Hospital, Bhubaneswar",
    experience: "10+ Years",
    specialization: "Head & Neck Oncology",
    qualifications: "MS, MCh (Surgical Oncology), Fellowship",
    bio: "Specialized in head and neck cancer surgeries with focus on functional preservation and reconstruction.",
    achievements: [
      "Young Oncologist Award 2019",
      "International Fellowship Recipient",
      "Conference Speaker - National Level"
    ]
  },
  { 
    id: 5, 
    name: "Dr. Ashok Kumar Mishra", 
    title: "Executive Member", 
    sub: "MS, MCh (Surg. Onco.)", 
    img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=800&q=60",
    email: "ashok.mishra@example.com",
    phone: "+91 9876543214",
    hospital: "SCB Medical College, Cuttack",
    experience: "20+ Years",
    specialization: "Thoracic Oncology",
    qualifications: "MS, MCh, DNB (Surgical Oncology)",
    bio: "Senior surgical oncologist specializing in lung and esophageal cancers. Trained many young surgeons in the field.",
    achievements: [
      "Lifetime Achievement Award 2022",
      "Editor - Indian Journal of Oncology",
      "National Faculty Member"
    ]
  },
  { 
    id: 6, 
    name: "Dr. Swati Behera", 
    title: "Executive Member", 
    sub: "MS, MCh (Surg. Onco.)", 
    img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=800&q=60",
    email: "swati.behera@example.com",
    phone: "+91 9876543215",
    hospital: "Capital Hospital, Bhubaneswar",
    experience: "8+ Years",
    specialization: "Gynecological Oncology",
    qualifications: "MS, MCh (Surgical Oncology), FNB",
    bio: "Focused on gynecological cancers with expertise in radical surgeries and fertility preservation techniques.",
    achievements: [
      "Women's Health Excellence Award",
      "Research Grant Recipient - ICMR",
      "Best Young Surgeon Award"
    ]
  },
];

const timeline = [
  { 
    year: "2008", 
    title: "Foundation", 
    text: "OSOO was established by a group of dedicated surgical oncologists with a vision to improve cancer care in Odisha.",
    icon: <MdMedicalServices className="text-xl" />
  },
  { 
    year: "2012", 
    title: "First Annual Conference", 
    text: "Launched our flagship annual conference, bringing together surgical oncologists from across the state and beyond.",
    icon: <RiGroupLine className="text-xl" />
  },
  { 
    year: "2018", 
    title: "Expansion of Programs", 
    text: "Introduced specialized training workshops, research grants, and community outreach programs.",
    icon: <MdSchool className="text-xl" />
  },
  { 
    year: "2023", 
    title: "Digital Transformation", 
    text: "Launched online platforms for member collaboration, webinars, and virtual conferences to enhance accessibility.",
    icon: <FaBullseye className="text-xl" />
  },
];

// Member Details Dialog Component
const MemberDetailsDialog = ({ member, isOpen, onClose }) => {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-[#326EAC]">{member.name}</h3>
              <p className="text-gray-600">{member.title} • OSOO Council Member</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl p-2 hover:bg-gray-100 rounded-full transition"
            >
              <FaTimes />
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
                    src={member.img}
                    alt={member.name}
                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                  />
                  <div className="absolute -bottom-3 right-4">
                    <MdVerified className="text-4xl text-[#326EAC] bg-white rounded-full p-1 shadow-lg" />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaEnvelope className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FaPhone className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{member.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <FaHospital className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hospital</p>
                      <p className="font-medium">{member.hospital}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                    <div className="text-2xl font-bold text-[#326EAC]">{member.experience}</div>
                    <p className="text-sm text-gray-500">Experience</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                    <MdWork className="text-2xl text-[#326EAC] mx-auto mb-2" />
                    <p className="text-sm font-medium">Specialist</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2">
              {/* Bio */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaGraduationCap className="text-[#326EAC]" />
                  Professional Bio
                </h4>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <p className="text-gray-700 leading-relaxed">{member.bio}</p>
                </div>
              </div>

              {/* Qualifications */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaGraduationCap className="text-[#326EAC]" />
                  Qualifications
                </h4>
                <div className="bg-linear-to-r from-blue-50 to-white p-6 rounded-xl border-l-4 border-[#326EAC]">
                  <p className="text-lg font-medium text-gray-800">{member.qualifications}</p>
                  <p className="text-gray-600 mt-2">{member.sub}</p>
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
                    {member.specialization}
                  </span>
                </div>
              </div>

              {/* Key Achievements */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaCalendarAlt className="text-[#326EAC]" />
                  Key Achievements
                </h4>
                <div className="space-y-3">
                  {member.achievements.map((achievement, idx) => (
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

              {/* OSOO Role */}
              <div className="bg-linear-to-r from-[#326EAC] to-blue-600 rounded-xl p-6 text-white">
                <h4 className="text-xl font-bold mb-2">OSOO Council Role</h4>
                <p className="mb-4">Active member contributing to society's growth and initiatives</p>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-white/80" />
                  <span>Odisha Society of Oncology</span>
                </div>
                <div className="mt-4">
                  <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                    {member.title}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-sm">
              Member since 2008 • OSOO ID: OSOO-{member.id.toString().padStart(3, '0')}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#326EAC] text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AboutUs() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberDialog, setShowMemberDialog] = useState(false);

  const handleViewProfile = (member) => {
    setSelectedMember(member);
    setShowMemberDialog(true);
  };

  const handleCloseDialog = () => {
    setShowMemberDialog(false);
    setTimeout(() => setSelectedMember(null), 300);
  };

  useEffect(()=>{
    window.scrollTo(0,0);
  },[]);

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
        {/* Hero */}
        <header className="relative overflow-hidden">
          <div
            className="h-56 md:h-72 lg:h-100 bg-center bg-cover relative"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1580281657521-6b9a7b5d0a3b?w=1600&q=60&fit=crop')",
            }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-[#326EAC]/90 to-blue-800/90"></div>
            
            {/* Content */}
            <div className="relative max-w-6xl mx-auto px-6 h-full flex flex-col items-center justify-start py-4 text-center">
              <div className="mb-6">
                <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                  <span className="text-white text-sm font-medium">About Our Society</span>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  About <span className="text-blue-200">OSOO</span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                  Committed to excellence in surgical oncology since 2008
                </p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-6 left-10 w-24 h-24 border-6 border-white/30 rounded-2xl hidden lg:block"></div>
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
            {/* Who We Are Section */}
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-12">
                <div className="inline-block px-6 py-2 bg-[#326EAC] text-white rounded-full mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold">Who We Are</h2>
                </div>
                <div className="max-w-4xl mx-auto">
                  <div className="bg-linear-to-r from-blue-50 to-gray-50 p-8 rounded-2xl shadow-lg border border-blue-100">
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                      The <span className="font-bold text-[#326EAC]">Odisha Society Of Oncology (OSOO)</span> is a premier professional organization dedicated to advancing the practice of surgical oncology throughout the state of Odisha. Founded in 2008, we have grown into a vibrant community of surgeons, residents, and allied healthcare professionals.
                    </p>
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                      Our members are at the forefront of cancer treatment, bringing world-class surgical expertise to patients across Odisha. Through education, research, and collaboration, we work tirelessly to improve outcomes for cancer patients and advance the field.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Mission & Vision Cards */}
            <section className="mb-16 md:mb-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Mission Card */}
                <div className="bg-linear-to-br from-blue-50 to-white rounded-2xl shadow-xl p-8 border border-blue-100 transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-full bg-linear-to-r from-[#326EAC] to-blue-600 flex items-center justify-center text-white text-2xl shadow-lg">
                      <FaBullseye />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-[#326EAC] mb-4">Our Mission</h3>
                      <div className="bg-white p-6 rounded-xl shadow-inner border-l-4 border-[#326EAC]">
                        <p className="text-gray-700 leading-relaxed">
                          To promote excellence in the practice of surgical oncology through continuing medical education, research, and professional development. We strive to create a collaborative platform where surgical oncologists can share knowledge and ultimately improve patient care across Odisha.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vision Card */}
                <div className="bg-linear-to-br from-blue-50 to-white rounded-2xl shadow-xl p-8 border border-blue-100 transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-full bg-linear-to-r from-[#326EAC] to-blue-600 flex items-center justify-center text-white text-2xl shadow-lg">
                      <FaEye />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-[#326EAC] mb-4">Our Vision</h3>
                      <div className="bg-white p-6 rounded-xl shadow-inner border-l-4 border-blue-500">
                        <p className="text-gray-700 leading-relaxed">
                          To be the leading professional body for surgical oncologists in Eastern India, recognized for clinical excellence, innovative research, and compassionate patient care. We envision a future where every cancer patient in Odisha has access to high quality surgical oncology services.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Objectives Section */}
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-[#326EAC] mb-4">Our Objectives</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Core pillars that drive our society's initiatives and programs
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <GiStethoscope />,
                    title: "Professional Development",
                    desc: "Provide continuous learning opportunities through workshops, conferences, and training programs for surgical oncologists."
                  },
                  {
                    icon: <RiGroupLine />,
                    title: "Research & Innovation",
                    desc: "Encourage and facilitate research in surgical oncology to advance treatment methods and patient outcomes."
                  },
                  {
                    icon: <FaBullseye />,
                    title: "Patient Care Excellence",
                    desc: "Promote best practices and quality standards in surgical oncology to ensure optimal patient care throughout Odisha."
                  }
                ].map((obj, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl hover:border-[#326EAC]/30 transition-all duration-300 group"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full bg-linear-to-r from-[#326EAC] to-blue-600 flex items-center justify-center text-white text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {obj.icon}
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 text-center mb-4">{obj.title}</h4>
                    <p className="text-gray-600 text-center leading-relaxed">
                      {obj.desc}
                    </p>
                    <div className="mt-6 flex justify-center">
                      <div className="w-12 h-1 bg-linear-to-r from-[#326EAC] to-blue-600 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Council Members Section */}
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-[#326EAC] mb-2">Council Members</h3>
                <p className="text-gray-600">Leadership guiding OSOO towards excellence</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {councilMembers.map((member) => (
                  <div 
                    key={member.id} 
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl hover:border-[#326EAC]/30 transition-all duration-300 group"
                  >
                    {/* Image Container */}
                    <div className="h-64 overflow-hidden">
                      <img
                        src={member.img}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4">
                        <MdVerified className="text-3xl text-[#326EAC] bg-white rounded-full p-1 shadow-lg" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h4>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-[#326EAC] text-white text-sm font-medium rounded-full">
                          {member.title}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{member.sub}</p>
                      
                      <div className="pt-4 border-t border-gray-100">
                        <button 
                          onClick={() => handleViewProfile(member)}
                          className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-[#326EAC] hover:text-white transition-all duration-300 group-hover:shadow-md"
                        >
                          View Profile
                          <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* History / Timeline Section */}
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-[#326EAC] mb-2">Our Journey</h3>
                <p className="text-gray-600">Milestones that shaped our society's growth and impact</p>
              </div>

              <div className="relative">
                {/* Timeline Line */}
                <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-linear-to-b from-[#326EAC] to-blue-600 transform -translate-x-1/2"></div>

                <div className="space-y-12">
                  {timeline.map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`relative flex flex-col lg:flex-row items-center ${
                        idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                      }`}
                    >
                      {/* Year Circle */}
                      <div className="relative z-10 w-24 h-24 rounded-full bg-linear-to-r from-[#326EAC] to-blue-600 flex flex-col items-center justify-center text-white shadow-xl mb-6 lg:mb-0 mx-auto lg:mx-0">
                        <span className="text-2xl font-bold">{item.year}</span>
                        <span className="text-xs">Year</span>
                      </div>

                      {/* Content Card */}
                      <div className={`lg:w-1/2 ${idx % 2 === 0 ? 'lg:pl-12' : 'lg:pr-12'}`}>
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#326EAC]">
                              {item.icon}
                            </div>
                            <h4 className="text-xl font-bold text-gray-800">{item.title}</h4>
                          </div>
                          <p className="text-gray-600 leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="text-center">
              <div className="bg-linear-to-r from-[#326EAC] to-blue-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
                
                <div className="relative z-10">
                  <FaQuoteLeft className="text-4xl text-white/30 mb-6 mx-auto" />
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Join Our Community of Surgical Oncology Professionals
                  </h3>
                  <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                    Become part of Odisha's premier surgical oncology society and contribute to advancing cancer care in our state.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/member/register"
                      className="px-8 py-3 bg-white text-[#326EAC] font-semibold rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Become a Member
                    </Link>
                    <Link
                      to="/member/login"
                      className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
                    >
                      Member Login
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Member Details Dialog */}
      <MemberDetailsDialog 
        member={selectedMember}
        isOpen={showMemberDialog}
        onClose={handleCloseDialog}
      />
    </div>
  );
}
