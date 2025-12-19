import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaEnvelope, FaClock, FaHome } from 'react-icons/fa';

const RegistrationSuccess = () => {
  return (
    <div 
      className="min-h-screen relative flex items-center justify-center p-4"
      style={{
        backgroundImage: `url("https://res.cloudinary.com/dxvovx7s2/image/upload/v1765972142/blob-scene-haikei_qidc0k.svg")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-blue-50/90 to-pink-50/90"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-green-600 p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-4xl text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Registration Submitted!</h2>
            <p className="text-white/80 mt-1">Your application is under review</p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* Email Verification Info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <FaEnvelope className="text-xl text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Check Your Email</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    We've sent a confirmation email with your application details. 
                    Please check your inbox (and spam folder).
                  </p>
                </div>
              </div>

              {/* Admin Review Info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                  <FaClock className="text-xl text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Awaiting Admin Approval</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Your application is now pending admin review. 
                    This process typically takes 2-3 working days.
                  </p>
                </div>
              </div>

              {/* What's Next */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h5 className="font-semibold text-blue-800 mb-2">What happens next?</h5>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Admin reviews your application</li>
                  <li>2. You'll receive approval/rejection via email</li>
                  <li>3. If approved, login credentials will be sent</li>
                  <li>4. Login and access member dashboard</li>
                </ol>
              </div>

              {/* Contact Info */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Questions? Contact us at{' '}
                  <a href="mailto:support@osoo.org" className="text-[#326EAC] hover:underline font-medium">
                    support@osoo.org
                  </a>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col space-y-3">
              <Link
                to="/"
                className="w-full py-3 px-4 bg-[#326EAC] text-white font-medium rounded-lg hover:bg-[#2a5c8f] transition duration-300 flex items-center justify-center gap-2"
              >
                <FaHome /> Return to Home
              </Link>
              <Link
                to="/member/login"
                className="w-full py-3 px-4 border border-[#326EAC] text-[#326EAC] font-medium rounded-lg hover:bg-[#326EAC] hover:text-white transition duration-300 text-center"
              >
                Already have an account? Login here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
