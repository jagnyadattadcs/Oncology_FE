import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message should be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success(data.message || 'Message sent successfully!');
        setIsSubmitted(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        
        // Show success state for 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 10000);
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#326EAC] focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2";
  const errorClass = "text-red-500 text-xs mt-1 flex items-center gap-1";

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 py-12 sm:py-16 md:py-20 px-4 sm:px-6">      
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-[#326EAC] mb-4 sm:mb-6">
            Get In Touch
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed px-4">
            Have questions or want to learn more about OSOO? We'd love to hear from you. 
            Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
          {/* Contact Information Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg h-full">
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                Contact Information
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-lg">Odisha Surgical Oncology Society</h4>
                  <p className="text-gray-600">
                    Committed to advancing surgical oncology practices and patient care across Odisha.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <FaEnvelope className="text-[#326EAC]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Email</p>
                      <p className="text-gray-600 text-sm">contact@osoo.org</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <FaPhone className="text-[#326EAC]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Phone</p>
                      <p className="text-gray-600 text-sm">+91 XXX XXX XXXX</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    <span className="font-semibold text-gray-800">Office Hours:</span><br />
                    Monday - Friday: 9:00 AM - 5:00 PM<br />
                    Saturday: 10:00 AM - 2:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaCheckCircle className="text-green-500 text-4xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Sent Successfully!</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Thank you for contacting OSOO. We have received your message and will get back to you soon.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-lg font-semibold p-3 px-8 border rounded-lg shadow-md shadow-[#326EAC] text-[#326EAC] hover:bg-[#326EAC] hover:text-white transition-all duration-300"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                    Send us a Message
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Name Field */}
                      <div>
                        <label className={labelClass}>
                          <FaUser className="text-[#326EAC]" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`${inputClass} ${errors.name ? 'border-red-500' : ''}`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && (
                          <p className={errorClass}>
                            <FaExclamationCircle />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div>
                        <label className={labelClass}>
                          <FaEnvelope className="text-[#326EAC]" />
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`${inputClass} ${errors.email ? 'border-red-500' : ''}`}
                          placeholder="Enter your email"
                        />
                        {errors.email && (
                          <p className={errorClass}>
                            <FaExclamationCircle />
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Phone Field */}
                      <div>
                        <label className={labelClass}>
                          <FaPhone className="text-[#326EAC]" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="Enter your phone number"
                        />
                      </div>

                      {/* Subject Field */}
                      <div>
                        <label className={labelClass}>
                          <FaEnvelope className="text-[#326EAC]" />
                          Subject *
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className={`${inputClass} ${errors.subject ? 'border-red-500' : ''}`}
                          placeholder="What is this regarding?"
                        />
                        {errors.subject && (
                          <p className={errorClass}>
                            <FaExclamationCircle />
                            {errors.subject}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Message Field */}
                    <div>
                      <label className={labelClass}>
                        <FaEnvelope className="text-[#326EAC]" />
                        Your Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="5"
                        className={`${inputClass} resize-none ${errors.message ? 'border-red-500' : ''}`}
                        placeholder="Please type your message here..."
                      />
                      {errors.message && (
                        <p className={errorClass}>
                          <FaExclamationCircle />
                          {errors.message}
                        </p>
                      )}
                      <div className="text-xs text-gray-500 mt-2 text-right">
                        {formData.message.length}/2000 characters
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="pt-4"
                    >
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full text-lg font-semibold p-4 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-3 ${
                          isSubmitting 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-[#326EAC] text-white hover:bg-[#2a5a8a] shadow-[#326EAC]/30'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane />
                            Send Message
                          </>
                        )}
                      </button>
                    </motion.div>

                    <p className="text-xs text-gray-500 text-center pt-4">
                      By submitting this form, you agree to our privacy policy. We respect your privacy and will never share your information.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 bg-white rounded-2xl p-6 sm:p-8 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Response Time & Follow-up</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-[#326EAC] transition-colors">
              <div className="text-2xl font-bold text-[#326EAC] mb-2">24-48 Hours</div>
              <p className="text-gray-600">Initial Response Time</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-[#326EAC] transition-colors">
              <div className="text-2xl font-bold text-[#326EAC] mb-2">Personalized</div>
              <p className="text-gray-600">Reply from OSOO Team</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-[#326EAC] transition-colors">
              <div className="text-2xl font-bold text-[#326EAC] mb-2">Confidential</div>
              <p className="text-gray-600">All Information Protected</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactForm;
