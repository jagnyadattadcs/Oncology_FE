import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaSearch, 
  FaExclamationTriangle, 
  FaArrowLeft,
  FaCompass,
  FaQuestionCircle
} from 'react-icons/fa';
import { MdOutlineErrorOutline } from 'react-icons/md';

const PageNotFound = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Quick navigation links
  const quickLinks = [
    { name: 'Home', path: '/', icon: <FaHome />, color: 'bg-blue-500' },
    { name: 'About Us', path: '/about-us', icon: <FaCompass />, color: 'bg-blue-500' },
    { name: 'Events', path: '/events/upcoming-events', icon: <FaCompass />, color: 'bg-blue-500' },
    { name: 'Academic', path: '/academic', icon: <FaQuestionCircle />, color: 'bg-blue-500' },
    { name: 'Membership', path: '/member/register', icon: <FaSearch />, color: 'bg-blue-500' },
    { name: 'Contact', path: '/contact', icon: <FaQuestionCircle />, color: 'bg-blue-500' },
  ];

  return (
    <div className="relative min-h-screen bg-linear-to-br from-gray-50 to-blue-50 overflow-hidden">      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10">
        {/* Main Content */}
        <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl w-full">
            {/* Error Code Display */}
            <div className="text-center mb-8">
              <div className="inline-block relative">
                <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-blue-500 rounded-full blur-xl opacity-30"></div>
                <div className="relative flex items-center justify-center w-48 h-48 mx-auto mb-6 bg-linear-to-br from-red-50 to-white rounded-full border-8 border-white shadow-2xl">
                  <div className="text-center">
                    <MdOutlineErrorOutline className="text-6xl text-blue-500 mx-auto mb-2" />
                    <div className="text-5xl font-bold text-blue-800">404</div>
                  </div>
                </div>
              </div>
              
              {/* Error Message */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full mb-4">
                  <FaExclamationTriangle />
                  <span className="font-medium">Page Not Found</span>
                </div>
                {/* <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Oops! Lost in{' '}
                  <span className="bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                    Medical Space
                  </span>
                </h1> */}
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  The page you're looking for seems to have wandered off. Don't worry - even the best surgeons sometimes misplace things!
                </p>
              </div>
            </div>

            {/* Main Action */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-12 border border-gray-200">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Let's get you back on track
                  </h3>
                  <p className="text-gray-600 mb-6">
                    While we locate that missing page, here are some quick ways to find what you need:
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/"
                      className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-linear-to-r from-[#326EAC] to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
                    >
                      <FaHome />
                      Return Home
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-[#326EAC] hover:text-[#326EAC] transition-all duration-300"
                    >
                      <FaQuestionCircle />
                      Report Issue
                    </Link>
                  </div>
                </div>
                
                <div className="lg:w-80">
                  <div className="bg-linear-to-br from-blue-50 to-gray-50 p-6 rounded-xl border border-blue-100">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FaSearch className="text-[#326EAC]" />
                      Quick Search Tips
                    </h4>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#326EAC] mt-2"></div>
                        <span>Check the URL for typos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#326EAC] mt-2"></div>
                        <span>Use the navigation menu above</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#326EAC] mt-2"></div>
                        <span>Try our search feature</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Navigation Grid */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
                Quick Navigation
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className="group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative p-6">
                      <div className={`${link.color} w-12 h-12 rounded-full flex items-center justify-center text-white text-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        {link.icon}
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">{link.name}</h4>
                      <div className="flex items-center text-[#326EAC] font-medium text-sm">
                        <span>Go to {link.name}</span>
                        <FaArrowLeft className="ml-2 transform rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-linear-to-r from-[#326EAC]/10 to-blue-600/10 rounded-2xl p-8 border border-[#326EAC]/20">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Need Immediate Assistance?
                  </h3>
                  <p className="text-gray-600">
                    Our team is here to help you navigate our website. Contact us if you need further assistance.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link
                    to="/contact"
                    className="px-6 py-3 bg-[#326EAC] text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-lg"
                  >
                    Contact Support
                  </Link>
                  <a
                    href="mailto:support@osoo.org"
                    className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:border-[#326EAC] hover:text-[#326EAC] transition-all duration-300"
                  >
                    Email Us
                  </a>
                </div>
              </div>
            </div>

            {/* Decorative Footer */}
            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm">
                Still can't find what you're looking for? Try our{' '}
                <Link to="/sitemap" className="text-[#326EAC] hover:underline font-medium">
                  sitemap
                </Link>
                {' '}or browse through our{' '}
                <Link to="/about-us" className="text-[#326EAC] hover:underline font-medium">
                  about page
                </Link>
                .
              </p>
              <div className="mt-4 flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((dot) => (
                  <div
                    key={dot}
                    className="w-2 h-2 rounded-full bg-gray-300"
                    style={{ animationDelay: `${dot * 200}ms` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default PageNotFound;
