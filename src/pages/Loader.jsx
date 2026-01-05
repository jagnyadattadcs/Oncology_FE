import React, { useEffect } from 'react';

const Loader = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-linear-to-br from-blue-50 to-gray-50 overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      
      {/* Main loader container */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Outer rotating ring */}
        <div className="relative w-48 h-48 mb-8">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-blue-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
          
          {/* Rotating ring */}
          <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-blue-500 border-r-blue-400 animate-spin-slow"></div>
          
          {/* Inner rotating ring (reverse direction) */}
          <div className="absolute inset-6 rounded-full border-6 border-transparent border-b-blue-400 border-l-blue-300 animate-spin-slow-reverse opacity-70"></div>
          
          {/* Logo container */}
          <div className="absolute inset-8 flex items-center justify-center">
            <div className="relative w-32 h-32">
              {/* Logo with rotation */}
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping-slow opacity-50"></div>
              
              {/* Logo image */}
              <div className="relative w-full h-full rounded-full overflow-hidden bg-white shadow-2xl flex items-center justify-center p-4">
                <img
                  src="https://res.cloudinary.com/dxvovx7s2/image/upload/v1767616302/osoo_logo_tkce2x.png"
                  alt="OSO Logo"
                  className="w-full h-full object-contain animate-pulse-slow"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Loading text */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-600 font-medium">Loading</span>
          </div>
          {/* <p className="text-gray-600 text-sm mt-2">
            Please wait while we prepare the content...
          </p> */}
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes spin-slow-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        
        @keyframes ping-slow {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          70%, 100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite ease-in-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 4s linear infinite;
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;
