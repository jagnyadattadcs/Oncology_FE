import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaUserPlus, FaHospitalSymbol } from 'react-icons/fa';
import { useMember } from '../context/MemberContext';

const MemberLogin = () => {
  const { login } = useMember();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    uniqueId: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.uniqueId.trim()) {
      newErrors.uniqueId = 'Member ID is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await login(formData.uniqueId, formData.password);
    
    if (result.success) {
      if (result.requiresPasswordChange) {
        navigate('/member/change-password');
      } else {
        navigate('/member/dashboard');
      }
    }
  };

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
      <div className="absolute inset-0 bg-linear-to-r from-blue-50/60 to-pink-50/60"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#326EAC] p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <FaHospitalSymbol className="text-3xl text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Member Login</h2>
            <p className="text-white/80 mt-1">Enter your credentials to access your account</p>
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Unique ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="uniqueId"
                    value={formData.uniqueId}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition ${errors.uniqueId ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your Member ID"
                  />
                </div>
                {errors.uniqueId && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <span className="mr-1">⚠</span> {errors.uniqueId}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-700 text-sm font-medium">
                    Password
                  </label>
                  
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <span className="mr-1">⚠</span> {errors.password}
                  </p>
                )}
              </div>

              <div className="flex justify-between mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#326EAC] focus:ring-[#326EAC] border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link 
                    to="/forgot-password" 
                    className="text-sm text-[#326EAC] hover:text-[#2a5c8f] hover:underline"
                >
                Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#326EAC] text-white font-medium rounded-lg hover:bg-[#2a5c8f] transition duration-300 flex items-center justify-center gap-2"
              >
                Login <FaArrowRight />
              </button>
            </form>

            <div className="my-6 flex items-center">
              <div className="grow border-t border-gray-300"></div>
              <span className="mx-4 text-sm text-gray-500">New to OSO?</span>
              <div className="grow border-t border-gray-300"></div>
            </div>

            <Link
              to="/member/register"
              className="w-full py-3 px-4 border-2 border-[#326EAC] text-[#326EAC] font-medium rounded-lg hover:bg-[#326EAC] hover:text-white transition duration-300 flex items-center justify-center gap-2"
            >
              <FaUserPlus /> Become a Member
            </Link>
          </div>

          <div className="bg-gray-50 px-6 py-4 text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact us at{' '}
              <a href="mailto:support@osoo.org" className="text-[#326EAC] hover:underline">
                support@oso.org
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Why Join OSO?</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-[#326EAC] mr-2">✓</span>
              <span>Patient-Centric Care</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#326EAC] mr-2">✓</span>
              <span>Professional Growth & Network</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#326EAC] mr-2">✓</span>
              <span>Community Impact & Awareness</span>
            </li>
          </ul>
          <div className="mt-4">
            <Link
              to="/why-join"
              className="text-sm text-[#326EAC] hover:underline font-medium"
            >
              Learn more about benefits →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberLogin;
