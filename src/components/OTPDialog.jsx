import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaCheckCircle, FaTimes, FaRedo } from 'react-icons/fa';

const OTPDialog = ({ email, onVerify, onResend, onClose }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300); // 5 minutes
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    await onResend(email);
    setTimer(300); // Reset timer
    setOtp(['', '', '', '', '', '']);
    document.getElementById('otp-0').focus();
    setIsResending(false);
  };

  const handleSubmit = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      onVerify(email, otpString);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Verify OTP</h3>
              <p className="text-gray-600 text-sm mt-1">Enter the 6-digit code sent to your email</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              <FaTimes />
            </button>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FaEnvelope className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Email sent to:</p>
                <p className="text-gray-600 text-sm">{email}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Enter OTP Code
            </label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#326EAC] focus:ring-2 focus:ring-[#326EAC] focus:ring-opacity-20 outline-none transition"
                />
              ))}
            </div>
            <p className="text-center text-xs text-gray-500 mt-3">
              Type the 6-digit verification code
            </p>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="text-sm">
              {timer > 0 ? (
                <span className="text-gray-600">
                  Code expires in: <span className="font-semibold text-red-600">{formatTime(timer)}</span>
                </span>
              ) : (
                <span className="text-red-600 font-medium">OTP expired!</span>
              )}
            </div>
            <button
              onClick={handleResend}
              disabled={isResending || timer > 0}
              className={`flex items-center gap-2 text-sm font-medium ${timer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#326EAC] hover:text-[#2a5c8f]'}`}
            >
              <FaRedo className={isResending ? 'animate-spin' : ''} />
              {isResending ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSubmit}
              disabled={otp.join('').length !== 6}
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${otp.join('').length === 6 ? 'bg-[#326EAC] text-white hover:bg-[#2a5c8f]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              <FaCheckCircle /> Verify & Continue
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={handleResend}
                className="text-[#326EAC] hover:underline font-medium"
              >
                click here to resend
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPDialog;
