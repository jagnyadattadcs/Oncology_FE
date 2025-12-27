import React, { useEffect } from "react";
import { 
  FaFlask, 
  FaMicroscope, 
  FaChartLine, 
  FaUsers,
  FaBook,
  FaGraduationCap,
  FaCalendarAlt,
  FaFileAlt,
  FaDatabase,
  FaHandsHelping,
  FaLightbulb,
  FaUniversity,
  FaCertificate,
  FaQuoteLeft,
  FaChevronRight,
  FaExternalLinkAlt,
  FaSeedling,
  FaDna,
  FaLaptopMedical,
  FaVial
} from "react-icons/fa";
import { 
  GiBookshelf,
  GiTeacher,
  GiMedal,
  GiChemicalTank,
  GiHeartPlus
} from "react-icons/gi";
import { MdScience, MdSchool, MdLibraryBooks, MdBiotech } from "react-icons/md";
import { Link } from "react-router-dom";

// Research focus areas
const researchAreas = [
  {
    id: 1,
    title: "Clinical Trials & Oncology Research",
    description: "Conducting Phase I-IV clinical trials for new cancer treatments, surgical techniques, and therapeutic interventions.",
    icon: <FaFlask className="text-2xl" />,
    status: "Active",
    projects: 8,
    collaborators: 5
  },
  {
    id: 2,
    title: "Surgical Outcomes Research",
    description: "Long-term studies on surgical outcomes, patient recovery, and quality of life post-oncological surgeries.",
    icon: <FaChartLine className="text-2xl" />,
    status: "Active",
    projects: 12,
    collaborators: 8
  },
  {
    id: 3,
    title: "Cancer Genomics & Biomarkers",
    description: "Research on genetic markers, personalized medicine, and molecular profiling for targeted cancer therapies.",
    icon: <FaDna className="text-2xl" />,
    status: "Ongoing",
    projects: 6,
    collaborators: 4
  },
  {
    id: 4,
    title: "Minimally Invasive Techniques",
    description: "Development and evaluation of laparoscopic, robotic, and endoscopic surgical approaches in oncology.",
    icon: <FaLaptopMedical className="text-2xl" />,
    status: "Active",
    projects: 5,
    collaborators: 3
  }
];

// Research projects
const researchProjects = [
  {
    id: 1,
    title: "OD-CaRe Study",
    description: "Odisha Cancer Registry: A comprehensive population-based cancer registry study across the state.",
    icon: <MdBiotech />,
    duration: "2022-2025",
    funding: "Government Funded",
    status: "In Progress"
  },
  {
    id: 2,
    title: "BREAST-SURV",
    description: "Long-term survival analysis of breast cancer patients undergoing different surgical interventions.",
    icon: <GiHeartPlus />,
    duration: "2021-2024",
    funding: "ICMR Grant",
    status: "Data Analysis"
  },
  {
    id: 3,
    title: "GI-Onco Database",
    description: "Development of a comprehensive database for gastrointestinal cancer patients in Eastern India.",
    icon: <FaDatabase />,
    duration: "2023-2026",
    funding: "Private Partnership",
    status: "Recruiting"
  },
  {
    id: 4,
    title: "Pain Management Protocols",
    description: "Developing evidence-based pain management protocols for post-operative cancer patients.",
    icon: <FaHandsHelping />,
    duration: "2022-2024",
    funding: "Pharma Grant",
    status: "Completed"
  }
];

// Research resources
const researchResources = [
  {
    id: 1,
    title: "Research Protocols",
    description: "Standardized research protocols and SOPs for conducting clinical studies and trials.",
    icon: <FaFileAlt />,
    link: "/research/protocols",
    type: "Document"
  },
  {
    id: 2,
    title: "Statistical Support",
    description: "Access to biostatisticians and statistical software for data analysis and interpretation.",
    icon: <FaChartLine />,
    link: "/research/stats-support",
    type: "Service"
  },
  {
    id: 3,
    title: "Ethics Committee",
    description: "Information about the institutional ethics committee and approval processes.",
    icon: <FaBook />,
    link: "/research/ethics",
    type: "Committee"
  },
  {
    id: 4,
    title: "Grant Opportunities",
    description: "Database of available research grants, fellowships, and funding opportunities.",
    icon: <FaCertificate />,
    link: "/research/grants",
    type: "Funding"
  }
];

// Research publications
const recentPublications = [
  {
    id: 1,
    title: "Surgical Outcomes in Advanced Gastric Cancer",
    journal: "Indian Journal of Surgical Oncology",
    authors: "Patra S, et al.",
    year: 2023,
    impactFactor: "2.4"
  },
  {
    id: 2,
    title: "Minimally Invasive Breast Conservation Surgery",
    journal: "Journal of Oncology Practice",
    authors: "Mohanty R, et al.",
    year: 2023,
    impactFactor: "3.1"
  },
  {
    id: 3,
    title: "Genetic Markers in Oral Cavity Cancers",
    journal: "Cancer Genetics",
    authors: "Das P, et al.",
    year: 2022,
    impactFactor: "2.8"
  },
  {
    id: 4,
    title: "Quality of Life Post-Colorectal Surgery",
    journal: "Surgical Oncology",
    authors: "Nayak S, et al.",
    year: 2022,
    impactFactor: "2.6"
  }
];

// Research collaborators
const researchCollaborators = [
  {
    id: 1,
    name: "AIIMS Bhubaneswar",
    type: "Medical Institute",
    collaboration: "Clinical Trials",
    logo: "🏥"
  },
  {
    id: 2,
    name: "IIT Bhubaneswar",
    type: "Engineering",
    collaboration: "Medical Devices",
    logo: "🔬"
  },
  {
    id: 3,
    name: "NISER",
    type: "Research Institute",
    collaboration: "Basic Science",
    logo: "🧪"
  },
  {
    id: 4,
    name: "Tata Memorial Centre",
    type: "Cancer Hospital",
    collaboration: "Multi-center Trials",
    logo: "🏛️"
  },
  {
    id: 5,
    name: "ICMR",
    type: "Government Body",
    collaboration: "Funding & Grants",
    logo: "🇮🇳"
  },
  {
    id: 6,
    name: "International Universities",
    type: "Global Partners",
    collaboration: "Exchange Programs",
    logo: "🌍"
  }
];

export default function Research() {
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
                  <span className="text-white text-sm font-medium">Research & Innovation</span>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  Research <span className="text-blue-200">Initiatives</span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                  Advancing surgical oncology through evidence-based research and innovation
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
                  <h2 className="text-2xl md:text-3xl font-bold">Research Excellence</h2>
                </div>
                <div className="max-w-4xl mx-auto">
                  <div className="bg-linear-to-r from-blue-50 to-gray-50 p-8 rounded-2xl shadow-lg border border-blue-100">
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                      The <span className="font-bold text-[#326EAC]">Odisha Society Of Oncology (OSOO)</span> is at the forefront of surgical oncology research in Eastern India. Our research initiatives aim to bridge the gap between clinical practice and scientific discovery, ultimately improving patient outcomes.
                    </p>
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                      Through collaborative research projects, clinical trials, and translational studies, we contribute to the global knowledge base in surgical oncology while addressing region-specific cancer challenges.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Research Focus Areas */}
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-[#326EAC] mb-2">Research Focus Areas</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Key research domains driving innovation in surgical oncology
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {researchAreas.map((area) => (
                  <div 
                    key={area.id} 
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl hover:border-[#326EAC]/30 transition-all duration-300 group"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-linear-to-r from-[#326EAC] to-blue-600 flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-300">
                          {area.icon}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="text-xl font-bold text-gray-800">{area.title}</h4>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                              {area.status}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mt-2">{area.description}</p>
                          
                          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-[#326EAC]">{area.projects}</div>
                              <p className="text-xs text-gray-500">Projects</p>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-[#326EAC]">{area.collaborators}</div>
                              <p className="text-xs text-gray-500">Collaborators</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Ongoing Research Projects */}
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-[#326EAC] mb-2">Ongoing Research Projects</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Currently active research studies and clinical trials
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {researchProjects.map((project) => (
                  <div 
                    key={project.id} 
                    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:border-[#326EAC]/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#326EAC] text-xl group-hover:bg-[#326EAC] group-hover:text-white transition-all duration-300">
                        {project.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xl font-bold text-gray-800">{project.title}</h4>
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                            project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{project.description}</p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="text-gray-400 text-sm" />
                              <span className="text-sm text-gray-600">{project.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaCertificate className="text-gray-400 text-sm" />
                              <span className="text-sm text-gray-600">{project.funding}</span>
                            </div>
                          </div>
                          
                          <button className="text-[#326EAC] hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                            View Details
                            <FaExternalLinkAlt className="text-xs" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Research Resources Section */}
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-[#326EAC] mb-2">Research Resources</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Tools and support for conducting quality research
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {researchResources.map((resource) => (
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

            {/* Recent Publications */}
            <section className="mb-16 md:mb-20">
              <div className="bg-linear-to-br from-blue-50 to-white rounded-2xl shadow-xl p-8 border border-blue-100">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
                  <div>
                    <h3 className="text-3xl font-bold text-[#326EAC] mb-2">Recent Publications</h3>
                    <p className="text-gray-600">Selected research publications by OSOO members</p>
                  </div>
                  <Link 
                    to="/research/publications"
                    className="mt-4 lg:mt-0 px-6 py-2.5 bg-[#326EAC] text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium flex items-center gap-2"
                  >
                    View All Publications
                    <FaBook />
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentPublications.map((publication) => (
                    <div 
                      key={publication.id} 
                      className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#326EAC] transition-all duration-300 group"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-[#326EAC] transition-colors">
                            {publication.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">{publication.journal}</p>
                          <div className="flex items-center gap-4 text-gray-500 text-sm">
                            <span className="flex items-center gap-1">
                              <FaUsers className="text-xs" />
                              {publication.authors}
                            </span>
                            <span>•</span>
                            <span>{publication.year}</span>
                            <span>•</span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              IF: {publication.impactFactor}
                            </span>
                          </div>
                        </div>
                        
                        <button className="px-4 py-2 border border-[#326EAC] text-[#326EAC] rounded-lg hover:bg-[#326EAC] hover:text-white transition-all duration-300 font-medium text-sm whitespace-nowrap">
                          Read Abstract
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Research Collaborations */}
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-[#326EAC] mb-2">Research Collaborations</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Partnering with leading institutions for impactful research
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
                {researchCollaborators.map((collaborator) => (
                  <div 
                    key={collaborator.id} 
                    className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow border border-gray-100 hover:shadow-lg hover:border-[#326EAC] transition-all duration-300 group"
                  >
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {collaborator.logo}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700 mb-1">{collaborator.name}</p>
                      <p className="text-xs text-gray-500 mb-2">{collaborator.type}</p>
                      <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        {collaborator.collaboration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Research Impact Stats */}
              <div className="bg-linear-to-r from-[#326EAC] to-blue-600 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold mb-2">31+</div>
                    <p className="text-blue-100">Research Projects</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold mb-2">45+</div>
                    <p className="text-blue-100">Publications</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold mb-2">18+</div>
                    <p className="text-blue-100">Collaborating Institutions</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold mb-2">6+</div>
                    <p className="text-blue-100">Active Clinical Trials</p>
                  </div>
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
                    Contribute to Surgical Oncology Research
                  </h3>
                  <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                    Join our research initiatives, collaborate with experts, and help advance cancer care through evidence-based research.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/research/get-involved"
                      className="px-8 py-3 bg-white text-[#326EAC] font-semibold rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Get Involved
                    </Link>
                    <Link
                      to="/research/grants"
                      className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
                    >
                      Research Grants
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
