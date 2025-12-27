import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaUpload, FaArrowRight, FaHospitalSymbol } from 'react-icons/fa';
import { useMember } from '../context/MemberContext';
import OTPDialog from '../components/OTPDialog';

const MemberRegister = () => {
  const { register, verifyOtp, resendOtp } = useMember();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    speciality: '',
    qualification: [],
    agreeWithTerms: false
  });
  const [documentImage, setDocumentImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const specialityTypes = [
    { value: 'surgical_oncology', label: 'Surgical Oncology' },
    { value: 'radiation_oncology', label: 'Radiation Oncology' },
    { value: 'medical_oncology', label: 'Medical Oncology' },
    { value: 'paediatric_oncology', label: 'Paediatric Oncology' },
    { value: 'haematology_haematooncology', label: 'Haematology & Haemato-oncology' },
    { value: 'gynaecologic_oncology', label: 'Gynaecologic Oncology' },
    { value: 'head_neck_oncology', label: 'Head and Neck Oncology' },
    { value: 'oncopathology', label: 'Oncopathology' },
    { value: 'uro_oncology', label: 'Uro-Oncology' },
    { value: 'radiology', label: 'Radiology' },
    { value: 'nuclear_medicine', label: 'Nuclear Medicine' },
    { value: 'palliative_care', label: 'Palliative Care' },
    { value: 'others', label: 'Others' }
  ];

  const certificateTypes = [
    { value: 'dm', label: 'DM' },
    { value: 'mch', label: 'MCh' },
    { value: 'md', label: 'MD' },
    { value: 'ms', label: 'MS' },
    { value: 'fellowship', label: 'Fellowship' },
    { value: 'drnb', label: 'DrNB' },
    { value: 'dnb', label: 'DNB' },
    { value: 'others', label: 'Others' }
  ];

  const handleChange = (e) => {
    const { name, value, options } = e.target;
    if (name === 'qualification') {
      const selectedValues = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setFormData(prev => ({
        ...prev,
        [name]: selectedValues
      }));
    }else{
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Size validation (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        documentImage: 'File size must be less than 5MB'
      }));
      return;
    }

    // Type validation (IMAGE OR PDF)
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';

    if (!isImage && !isPdf) {
      setErrors(prev => ({
        ...prev,
        documentImage: 'Please upload JPG, PNG, or PDF only'
      }));
      return;
    }

    setDocumentImage(file);
    setErrors(prev => ({ ...prev, documentImage: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.documentNo.trim()) {
      newErrors.documentNo = 'Document number is required';
    }

    if (!documentImage) {
      newErrors.documentImage = 'Document image is required';
    }

    if (!formData.agreeWithTerms) {
      newErrors.agreeWithTerms = 'You must agree to the Terms & Conditions';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('speciality', formData.speciality);
      formDataToSend.append('qualification', formData.qualification);
      formDataToSend.append('agreeWithTerms', formData.agreeWithTerms);
      formDataToSend.append('documentImage', documentImage);

      const result = await register(formDataToSend);
      
      if (result.success) {
        setRegistrationEmail(formData.email);
        setShowOtpDialog(true);
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpVerify = async (email, otp) => {
    const result = await verifyOtp(email, otp);
    if (result.success) {
      setShowOtpDialog(false);
      navigate('/registration-success');
    }
  };

  const handleOtpResend = async (email) => {
    await resendOtp(email);
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center p-4 py-8"
      style={{
        backgroundImage: `url("https://res.cloudinary.com/dxvovx7s2/image/upload/v1765972142/blob-scene-haikei_qidc0k.svg")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-blue-50/60 to-pink-50/60"></div>
      
      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#326EAC] p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <FaHospitalSymbol className="text-3xl text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Become an OSOO Member</h2>
            <p className="text-white/80 mt-1">Join our community of surgical oncologists</p>
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter 10-digit phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Speciality Type */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Speciality <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="speciality"
                    value={formData.speciality}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#326EAC] focus:border-transparent outline-none transition"
                  >
                    {specialityTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Qualifications <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    {certificateTypes.map((type) => (
                      <label key={type.value} className="flex items-center">
                        <input
                          type="checkbox"
                          name="qualification"
                          value={type.value}
                          checked={formData.qualification.includes(type.value)}
                          onChange={(e) => {
                            const { value, checked } = e.target;
                            setFormData(prev => ({
                              ...prev,
                              qualification: checked
                                ? [...prev.qualification, value]
                                : prev.qualification.filter(q => q !== value)
                            }));
                          }}
                          className="mr-2"
                        />
                        {type.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Document Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Qualification Image <span className="text-red-500">*</span>
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center transition ${errors.documentImage ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-[#326EAC] hover:bg-blue-50'}`}>
                    <input
                      type="file"
                      id="documentImage"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <label htmlFor="documentImage" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <FaUpload className="text-2xl text-gray-400" />
                        </div>
                        <p className="text-gray-700 font-medium">
                          {documentImage ? documentImage.name : 'Click to upload document image'}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Upload a clear photo of your document (Max 5MB)
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Supported: JPG, PNG, PDF
                        </p>
                      </div>
                    </label>
                  </div>
                  {errors.documentImage && (
                    <p className="text-red-500 text-xs mt-1">{errors.documentImage}</p>
                  )}
                  
                  {documentImage && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>    
                      {/* IMAGE PREVIEW */}
                      {documentImage.type.startsWith('image/') && (
                        <img
                          src={URL.createObjectURL(documentImage)}
                          alt="Document preview"
                          className="max-w-xs max-h-48 object-contain border border-gray-300 rounded-lg"
                        />
                      )}

                      {/* PDF PREVIEW */}
                      {documentImage.type === 'application/pdf' && (
                        <iframe
                          src={URL.createObjectURL(documentImage)}
                          title="PDF Preview"
                          className="w-full max-w-md h-64 border border-gray-300 rounded-lg"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="mt-6">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreeWithTerms"
                    name="agreeWithTerms"
                    checked={formData.agreeWithTerms}
                    onChange={(e) => {
                        setFormData(prev => ({
                        ...prev,
                        agreeWithTerms: e.target.checked
                        }));
                        if (errors.agreeWithTerms) {
                        setErrors(prev => ({ ...prev, agreeWithTerms: '' }));
                        }
                    }}
                    required
                    className="h-4 w-4 text-[#326EAC] focus:ring-[#326EAC] border-gray-300 rounded mt-1"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="/terms" className="text-[#326EAC] hover:underline">
                      Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-[#326EAC] hover:underline">
                      Privacy Policy
                    </a>{' '}
                    of OSOO
                  </label>
                </div>
                {errors.agreeWithTerms && (
                    <p className="text-red-500 text-xs mt-1">{errors.agreeWithTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-[#326EAC] text-white font-medium rounded-lg hover:bg-[#2a5c8f] transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Registration <FaArrowRight />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Already have account */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/member/login" className="text-[#326EAC] hover:underline font-medium">
                  Login here
                </Link>
              </p>
            </div>

            {/* Registration Process Info */}
            <div className="mt-8 bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Registration Process:</h4>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Fill and submit this form</li>
                <li>2. Verify OTP sent to your email</li>
                <li>3. Wait for admin approval (2-3 working days)</li>
                <li>4. Receive login credentials via email upon approval</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Dialog */}
      {showOtpDialog && (
        <OTPDialog
          email={registrationEmail}
          onVerify={handleOtpVerify}
          onResend={handleOtpResend}
          onClose={() => setShowOtpDialog(false)}
        />
      )}
    </div>
  );
};

export default MemberRegister;
