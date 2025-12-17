// components/OtpVerification.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaKey, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ImSpinner9 } from 'react-icons/im';

const AdminOtpVerification = () => {
  const { verifyAdminOtp, adminLogin, setStep } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminId, setAdminId] = useState('');
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdminId = localStorage.getItem('tempAdminId');
    if (storedAdminId) {
      setAdminId(storedAdminId);
    }
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    const result = await verifyAdminOtp(adminId, otpString);
    
    if (result.success) {
      navigate("/admin/dashboard");
    } else{
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleResendOtp = async () => {
    // You'll need to implement resend OTP logic
    // For now, go back to login
    localStorage.removeItem('tempAdminId');
    setStep('login');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-[#0b61a8] text-white p-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaKey className="text-3xl" />
          </div>
          <h2 className="text-2xl font-bold">OTP Verification</h2>
          <p className="text-white/80 mt-2">
            Enter the 6-digit code sent to your registered email
          </p>
        </div>

        <div className="p-8">
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
              <FaClock />
              <span className={`font-medium ${timer < 60 ? 'text-red-500' : ''}`}>
                {formatTime(timer)}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Admin ID: <span className="font-medium">{adminId}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-medium mb-3 text-center">
                Enter OTP
              </label>
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#0b61a8] focus:ring-2 focus:ring-blue-100 outline-none transition"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || timer === 0}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition mb-4 ${
                loading || timer === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#0b61a8] hover:bg-[#0a5597]'
              }`}
            >
              {loading ? <ImSpinner9 className='animate-spin m-auto text-lg' /> : 'Verify OTP'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-sm text-[#0b61a8] hover:text-[#0a5597] font-medium"
              >
                Didn't receive code? Resend OTP
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminOtpVerification;
