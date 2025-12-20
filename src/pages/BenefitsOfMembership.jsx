import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaCheckCircle, 
  FaUsers, 
  FaBookOpen, 
  FaCalendarAlt, 
  FaGraduationCap,
  FaCertificate,
  FaNetworkWired,
  FaHandshake,
  FaStar,
  FaChartLine,
  FaUserMd,
  FaRegNewspaper,
  FaAward,
  FaUserPlus,
  FaFileAlt,
  FaArrowRight,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";

const benefits = [
  {
    icon: <FaBookOpen className="text-3xl" />,
    title: "Access to Knowledge Resources",
    description: "Exclusive access to research papers, journals, surgical techniques, and latest oncology guidelines.",
    features: [
      "Online library with 1000+ medical journals",
      "Monthly research digests",
      "Surgical technique videos",
      "Case study repository"
    ]
  },
  {
    icon: <FaCalendarAlt className="text-3xl" />,
    title: "Conference & Workshop Benefits",
    description: "Discounted or free registration for national and international conferences, workshops, and CME programs.",
    features: [
      "50% discount on OSOO annual conference",
      "Free CME workshops",
      "International conference travel grants",
      "Hands-on training sessions"
    ]
  },
  {
    icon: <FaNetworkWired className="text-3xl" />,
    title: "Professional Networking",
    description: "Connect with leading surgical oncologists, researchers, and healthcare professionals across Odisha and India.",
    features: [
      "Members-only online forum",
      "Annual networking events",
      "Mentorship programs",
      "Collaborative research opportunities"
    ]
  },
  {
    icon: <FaGraduationCap className="text-3xl" />,
    title: "Continuing Medical Education",
    description: "Structured CME programs to help you stay updated with the latest advancements in surgical oncology.",
    features: [
      "Monthly webinars by experts",
      "Skill enhancement workshops",
      "Fellowship opportunities",
      "Certification programs"
    ]
  },
  {
    icon: <FaCertificate className="text-3xl" />,
    title: "Recognition & Awards",
    description: "Opportunities for professional recognition through awards, publications, and leadership roles.",
    features: [
      "Annual OSOO Excellence Awards",
      "Research publication support",
      "Leadership positions in committees",
      "National representation opportunities"
    ]
  },
  {
    icon: <FaHandshake className="text-3xl" />,
    title: "Career Advancement",
    description: "Support for career growth through job opportunities, collaborations, and professional development.",
    features: [
      "Job placement assistance",
      "Academic collaboration opportunities",
      "Professional reference letters",
      "Career counseling services"
    ]
  }
];

const membershipTypes = [
  {
    type: "Regular Member",
    price: "₹2,000/year",
    description: "For practicing surgical oncologists",
    features: [
      "All basic benefits",
      "Conference discounts",
      "Online resources access",
      "CME participation"
    ],
    bestFor: "Practicing Surgeons"
  },
  {
    type: "Life Member",
    price: "₹20,000",
    description: "One-time payment for lifetime membership",
    features: [
      "All regular member benefits",
      "Lifetime access",
      "Priority registration",
      "VIP conference seating",
      "Free publications"
    ],
    bestFor: "Senior Consultants",
    popular: true
  },
  {
    type: "Associate Member",
    price: "₹1,000/year",
    description: "For residents and fellows",
    features: [
      "Limited resource access",
      "Discounted workshops",
      "Mentorship programs",
      "Resident forums"
    ],
    bestFor: "Residents & Fellows"
  }
];

const faqs = [
  {
    question: "Who can become a member of OSOO?",
    answer: "Any qualified surgical oncologist, practicing surgeon with oncology specialization, or oncology resident/fellow from recognized institutions can apply for membership. International members are also welcome."
  },
  {
    question: "What documents are required for registration?",
    answer: "You need to provide your medical degree certificate, specialization certificate, valid medical registration, government ID proof, and a recent passport-size photograph."
  },
  {
    question: "How long does the approval process take?",
    answer: "Typically, the approval process takes 3-5 working days after submission of complete documents. You will receive an email notification once approved."
  },
  {
    question: "Can I upgrade my membership type later?",
    answer: "Yes, members can upgrade from Regular to Life membership at any time by paying the difference in fees. Associate members can upgrade after completing their specialization."
  },
  {
    question: "Is there a trial membership available?",
    answer: "We offer a 3-month trial membership for residents which provides limited access to resources. Contact our membership committee for trial membership details."
  },
  {
    question: "How do I access member benefits after approval?",
    answer: "Once approved, you will receive login credentials via email. All benefits can be accessed through the member portal on our website and mobile app."
  }
];

const registrationSteps = [
  {
    step: 1,
    title: "Complete Online Form",
    description: "Fill out the membership application form with your personal and professional details."
  },
  {
    step: 2,
    title: "Upload Documents",
    description: "Upload scanned copies of your qualifications, registration certificates, and ID proof."
  },
  {
    step: 3,
    title: "OTP Verification",
    description: "Verify your email address through OTP to ensure secure registration."
  },
  {
    step: 4,
    title: "Admin Review",
    description: "Our membership committee reviews your application and documents (3-5 working days)."
  },
  {
    step: 5,
    title: "Payment & Approval",
    description: "Make membership fee payment online and receive your approval confirmation."
  },
  {
    step: 6,
    title: "Access Benefits",
    description: "Receive your member credentials and start accessing all membership benefits."
  }
];

export default function BenefitsOfMembership() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedMembership, setSelectedMembership] = useState(1);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
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
        {/* Hero Section */}
        <header className="relative overflow-hidden">
          <div
            className="h-60 md:h-80 lg:h-96 bg-center bg-cover relative"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1600&q=60&fit=crop')",
            }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-[#326EAC]/90 to-blue-800/90"></div>
            
            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col items-center justify-start py-4 text-center">
              <div className="mb-6">
                <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                  <span className="text-white text-sm font-medium">Membership Benefits</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  Benefits of <span className="text-blue-200">OSOO</span> Membership
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                  Join Odisha's premier surgical oncology society and unlock exclusive professional advantages
                </p>
              </div>
              
              {/* Decorative elements */}
              {/* <div className="absolute -bottom-6 left-10 w-24 h-24 border-6 border-white/30 rounded-2xl hidden lg:block"></div> */}
              {/* <div className="absolute -top-6 right-10 w-20 h-20 border-6 border-r-0 border-white/30 rounded-2xl hidden lg:block"></div> */}
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
          {/* Decorative border elements */}
          {/* <div className='absolute top-10 right-10 w-32 h-24 border-6 rounded-2xl border-white shadow-2xl hidden lg:block'></div> */}
          {/* <div className='absolute bottom-10 left-10 w-28 h-20 border-6 border-r-0 rounded-2xl border-[#326EAC] hidden lg:block'></div> */}
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            
            {/* Introduction */}
            <section className="mb-16 md:mb-20 text-center">
              <div className="max-w-4xl mx-auto">
                <div className="inline-block px-6 py-2 bg-[#326EAC] text-white rounded-full mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold">Why Join OSOO?</h2>
                </div>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                  Becoming a member of the Odisha Society of Oncology opens doors to unparalleled professional growth, 
                  networking opportunities, and access to cutting-edge knowledge in surgical oncology.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                    <FaUsers className="text-[#326EAC]" />
                    <span className="font-medium">500+ Members</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                    <FaChartLine className="text-[#326EAC]" />
                    <span className="font-medium">Career Growth</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                    <FaUserMd className="text-[#326EAC]" />
                    <span className="font-medium">Expert Community</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Key Benefits Section */}
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-[#326EAC] mb-4">Exclusive Member Benefits</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Comprehensive advantages designed to enhance your professional journey in surgical oncology
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl hover:border-[#326EAC]/30 transition-all duration-300 group"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full bg-linear-to-r from-[#326EAC] to-blue-600 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                      {benefit.icon}
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 text-center mb-4">{benefit.title}</h4>
                    <p className="text-gray-600 text-center mb-6">{benefit.description}</p>
                    
                    <ul className="space-y-3">
                      {benefit.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="w-12 h-1 bg-linear-to-r from-[#326EAC] to-blue-600 rounded-full mx-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Membership Types Section */}
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-[#326EAC] mb-4">Membership Types</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Choose the membership category that best fits your professional needs
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {membershipTypes.map((type, index) => (
                  <div 
                    key={index}
                    className={`relative rounded-2xl p-8 border-2 transition-all duration-300 ${
                      type.popular 
                        ? 'bg-linear-to-br from-blue-50 to-white border-[#326EAC] shadow-2xl scale-105' 
                        : 'bg-white border-gray-200 hover:border-[#326EAC]/50 hover:shadow-xl'
                    }`}
                  >
                    {type.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="px-4 py-1 bg-[#326EAC] text-white text-sm font-bold rounded-full">
                          MOST POPULAR
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <h4 className="text-2xl font-bold text-gray-800 mb-2">{type.type}</h4>
                      <div className="text-3xl font-bold text-[#326EAC] mb-2">{type.price}</div>
                      <p className="text-gray-600 text-sm">{type.description}</p>
                    </div>
                    
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <FaStar className="text-yellow-500" />
                        <span className="font-medium text-gray-700">Best for: {type.bestFor}</span>
                      </div>
                      
                      <ul className="space-y-3">
                        {type.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <button
                      onClick={() => setSelectedMembership(index)}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                        selectedMembership === index
                          ? 'bg-[#326EAC] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-[#326EAC] hover:text-white'
                      }`}
                    >
                      {selectedMembership === index ? 'Selected' : 'Select Plan'}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Registration Process */}
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-[#326EAC] mb-4">How to Join OSOO</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Simple step-by-step process to become a member
                </p>
              </div>

              <div className="relative">
                {/* Timeline Line */}
                <div className="hidden lg:block absolute left-0 right-0 top-24 h-1 bg-linear-to-r from-[#326EAC] via-blue-500 to-[#326EAC]"></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {registrationSteps.map((step, index) => (
                    <div key={index} className="relative">
                      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
                        <div className="w-16 h-16 rounded-full bg-linear-to-r from-[#326EAC] to-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto relative">
                          {step.step}
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                            <FaUserPlus className="text-white text-sm" />
                          </div>
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 text-center mb-3">{step.title}</h4>
                        <p className="text-gray-600 text-center">{step.description}</p>
                      </div>
                      
                      {index < registrationSteps.length - 1 && (
                        <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                          <FaArrowRight className="text-gray-300 text-2xl" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center mt-12">
                <Link
                  to="/member/register"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-[#326EAC] to-blue-600 text-white font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg"
                >
                  Start Your Application Now
                  <FaArrowRight />
                </Link>
                <p className="text-gray-500 mt-4">Average approval time: 3-5 working days</p>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-[#326EAC] mb-4">What Our Members Say</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Hear from surgical oncologists who have benefited from OSOO membership
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    name: "Dr. Priyanka Das",
                    role: "Senior Surgical Oncologist",
                    hospital: "Apollo Hospitals, Bhubaneswar",
                    quote: "OSOO membership transformed my career. The networking opportunities and access to latest research have been invaluable.",
                    rating: 5
                  },
                  {
                    name: "Dr. Rajesh Mohanty",
                    role: "Consultant Oncologist",
                    hospital: "KIMS Hospital",
                    quote: "The CME programs and workshops keep me updated with the latest surgical techniques. Highly recommended!",
                    rating: 5
                  },
                  {
                    name: "Dr. Ananya Patnaik",
                    role: "Resident, Surgical Oncology",
                    hospital: "AIIMS, Bhubaneswar",
                    quote: "As a resident, the mentorship program and discounted conference fees have been extremely helpful for my growth.",
                    rating: 4
                  }
                ].map((testimonial, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-500" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-linear-to-r from-[#326EAC] to-blue-600 flex items-center justify-center text-white font-bold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-800">{testimonial.name}</h5>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                        <p className="text-xs text-gray-500">{testimonial.hospital}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-[#326EAC] mb-4">Frequently Asked Questions</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Find answers to common questions about OSOO membership
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-4">
                {faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-800">{faq.question}</span>
                      {expandedFaq === index ? (
                        <FaChevronUp className="text-[#326EAC]" />
                      ) : (
                        <FaChevronDown className="text-gray-400" />
                      )}
                    </button>
                    
                    {expandedFaq === index && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Final CTA Section */}
            <section>
              <div className="bg-linear-to-r from-[#326EAC] to-blue-900 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/10 rounded-full"></div>
                
                <div className="relative z-10 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <FaAward className="text-white text-3xl" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Ready to Advance Your Career in Surgical Oncology?
                  </h3>
                  <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                    Join 500+ surgical oncologists who have already benefited from OSOO membership. 
                    Start your journey towards professional excellence today.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/member/register"
                      className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-white text-[#326EAC] font-bold rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <FaUserPlus /> Apply for Membership
                    </Link>
                    <Link
                      to="/about-us"
                      className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300"
                    >
                      <FaFileAlt /> Learn More About OSOO
                    </Link>
                  </div>
                  
                  <p className="text-white/70 mt-6 text-sm">
                    Need assistance? Contact our membership team at{' '}
                    <a href="mailto:membership@osoo.org" className="text-white underline hover:no-underline">
                      membership@osoo.org
                    </a>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
