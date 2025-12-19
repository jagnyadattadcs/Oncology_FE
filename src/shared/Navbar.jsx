import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaChevronDown, FaBars, FaTimes } from 'react-icons/fa'
import { useMember } from '../context/MemberContext'

const navItems = [
  {
    name: "Home",
    link: "/",
    exact: true // Add exact match for home
  },
  {
    name: "About Us",
    link: "/about-us"
  },
  {
    name: "Membership",
    dropdown: [
      {
        name: "Become a Member",
        link: "/member/register"
      },
      {
        name: "Member Login",
        link: "/member/login"
      },
      {
        name: "Life Member",
        link: "/member/life-members"
      },
      {
        name: "Associate Members",
        link: "/member/accosiate-members"
      },
      {
        name: "Benefits of Membership",
        link: "/member/benifits"
      },
    ]
  },
  {
    name: "Events",
    dropdown: [
      {
        name: "Forthcoming Events",
        link: "/events?eventType=forth-coming-events"
      },
      {
        name: "Past Events",
        link: "/events?eventType=past-events"
      },
      {
        name: "Events Video",
        link: "/events?eventType=event-videos"
      },
      {
        name: "Image Gallery",
        link: "/events?eventType=gallery"
      }
    ]
  },
  {
    name: "Academic",
    link: "/academic"
  }
]

const Navbar = () => {
  const { member } = useMember();
  const location = useLocation()
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const mobileMenuRef = useRef(null)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMouseEnter = (itemName) => {
    if (navItems.find(item => item.name === itemName)?.dropdown) {
      setActiveDropdown(itemName)
    }
  }

  const handleMouseLeave = () => {
    setActiveDropdown(null)
  }

  // Improved isActive function
  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.link
    }
    
    if (item.link) {
      return location.pathname.startsWith(item.link)
    }
    
    // For dropdown items, check if any sub-item is active
    if (item.dropdown) {
      return item.dropdown.some(subItem => {
        const basePath = subItem.link.split('?')[0]
        return location.pathname === basePath || location.pathname.startsWith(basePath)
      })
    }
    
    return false
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className={`w-full bg-white shadow-md sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'py-1' : 'py-2'
    }`}>
      <div className='mx-auto px-4 md:px-6 lg:px-8'>
        <div className='flex justify-between items-center'>
          {/* Logo and Title */}
          <Link to="/" className='flex items-center gap-3 md:gap-4'>
            <img 
              src="/osoo_logo.jpg" 
              alt="osoo logo" 
              className='w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full object-cover border-2 border-blue-100'
            />
            <div className='hidden sm:block'>
              <h1 className='font-bold text-lg md:text-xl lg:text-2xl text-[#326EAC] leading-tight'>
                ODISHA SOCIETY OF ONCOLOGY
              </h1>
              <p className='text-gray-600 text-xs md:text-sm mt-0.5'>
                Registered under the Societies Registration Act (No XXI of 1860)
              </p>
            </div>
            <div className='sm:hidden'>
              <h1 className='font-bold text-lg text-[#326EAC]'>OSOO</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden lg:flex items-center text-lg gap-6 xl:gap-8 relative'>
            {navItems.map((item, idx) => (
              <div 
                key={idx} 
                className='relative group'
                onMouseEnter={() => handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
              >
                {item.link ? (
                  <Link 
                    to={item.link} 
                    className={`flex items-center gap-1 font-medium transition-all duration-200 relative pb-1 ${
                      isActive(item) 
                        ? 'text-[#326EAC] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#326EAC]' 
                        : 'text-gray-700 hover:text-[#326EAC] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-[#326EAC]'
                    }`}
                  >
                    {item.name}
                    {item.dropdown && <FaChevronDown className="text-xs mt-0.5 ml-1" />}
                  </Link>
                ) : (
                  <div className={`flex items-center gap-1 cursor-pointer font-medium transition-all duration-200 relative pb-1 ${
                    isActive(item)
                      ? 'text-[#326EAC] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#326EAC]'
                      : 'text-gray-700 hover:text-[#326EAC] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-[#326EAC]'
                  }`}>
                    {item.name}
                    {item.dropdown && <FaChevronDown className="text-xs mt-0.5 ml-1" />}
                  </div>
                )}
                
                {/* Desktop Dropdown */}
                {item.dropdown && (
                  <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-56 bg-white shadow-xl py-2 z-50 rounded-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-2 transition-all duration-200 ${
                    activeDropdown === item.name ? 'block' : 'hidden'
                  }`}>
                    {item.dropdown.map((dropdownItem, dropdownIdx) => (
                      <Link
                        key={dropdownIdx}
                        to={dropdownItem.link}
                        onClick={closeMobileMenu}
                        className={`block px-4 py-3 transition-all duration-200 mx-2 rounded ${
                          location.pathname === dropdownItem.link.split('?')[0] ||
                          location.pathname.startsWith(dropdownItem.link.split('?')[0])
                            ? 'bg-blue-50 text-[#326EAC] font-semibold'
                            : 'text-gray-700 hover:bg-blue-50 hover:text-[#326EAC]'
                        }`}
                      >
                        {dropdownItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons & Mobile Menu */}
          <div className='flex items-center gap-3 lg:gap-4'>
            {/* Contact Button - Hidden on mobile */}
            <Link 
              to="/contact" 
              className="hidden md:block px-5 py-2.5 bg-[#083768] text-white rounded-lg hover:bg-[#0a4a8a] transition-all duration-200 font-medium text-sm"
            >
              Contact
            </Link>
            
            {/* Member Login/Profile */}
            {member ? (
              <Link 
                to="/member/dashboard" 
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-all duration-200"
              >
                <div className='w-9 h-9 rounded-full bg-[#326EAC] flex items-center justify-center text-white font-bold text-lg'>
                  {member.name?.charAt(0).toUpperCase()}
                </div>
                <span className='hidden md:block text-[#326EAC] font-medium'>
                  Dashboard
                </span>
              </Link>
            ) : (
              <Link 
                to="/member/login" 
                className="px-5 py-2.5 bg-[#ff1605] text-white rounded-lg hover:bg-[#ff3010] transition-all duration-200 font-medium text-sm hidden md:block"
              >
                Member Login
              </Link>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              className='lg:hidden text-gray-700 text-2xl p-2 hover:bg-gray-100 rounded-lg transition-all duration-200'
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        ref={mobileMenuRef}
        className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className='container mx-auto px-4 py-4'>
          {/* Mobile Navigation Items */}
          <div className='space-y-1'>
            {navItems.map((item, idx) => (
              <div key={idx}>
                {item.link ? (
                  <Link 
                    to={item.link}
                    onClick={closeMobileMenu}
                    className={`flex items-center justify-between py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                      isActive(item)
                        ? 'bg-blue-50 text-[#326EAC]'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                    {item.dropdown && <FaChevronDown className="text-xs" />}
                  </Link>
                ) : (
                  <div className='flex items-center justify-between py-3 px-4 rounded-lg font-medium text-gray-700'>
                    {item.name}
                    {item.dropdown && <FaChevronDown className="text-xs" />}
                  </div>
                )}
                
                {/* Mobile Dropdown Items */}
                {item.dropdown && (
                  <div className='ml-4 pl-4 border-l-2 border-gray-200 space-y-1'>
                    {item.dropdown.map((dropdownItem, dropdownIdx) => (
                      <Link
                        key={dropdownIdx}
                        to={dropdownItem.link}
                        onClick={closeMobileMenu}
                        className={`block py-2.5 px-4 rounded-lg text-sm transition-all duration-200 ${
                          location.pathname === dropdownItem.link.split('?')[0] ||
                          location.pathname.startsWith(dropdownItem.link.split('?')[0])
                            ? 'bg-blue-50 text-[#326EAC] font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {dropdownItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Action Buttons */}
          <div className='mt-6 pt-4 border-t border-gray-200 space-y-3'>
            <Link 
              to="/contact" 
              onClick={closeMobileMenu}
              className="block w-full py-3 px-4 bg-[#083768] text-white rounded-lg hover:bg-[#0a4a8a] text-center font-medium transition-all duration-200"
            >
              Contact Us
            </Link>
            
            {member ? (
              <Link 
                to="/member/dashboard" 
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-3 py-3 px-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
              >
                <div className='w-10 h-10 rounded-full bg-[#326EAC] flex items-center justify-center text-white font-bold text-lg'>
                  {member.name?.charAt(0).toUpperCase()}
                </div>
                <div className='text-left'>
                  <p className='text-[#326EAC] font-medium'>Welcome back</p>
                  <p className='text-sm text-gray-600'>{member.name}</p>
                </div>
              </Link>
            ) : (
              <Link 
                to="/login" 
                onClick={closeMobileMenu}
                className="block w-full py-3 px-4 bg-[#ff1605] text-white rounded-lg hover:bg-[#ff3010] text-center font-medium transition-all duration-200"
              >
                Member Login
              </Link>
            )}
            
            <Link 
              to="/register" 
              onClick={closeMobileMenu}
              className="block w-full py-3 px-4 border-2 border-[#326EAC] text-[#326EAC] rounded-lg hover:bg-[#326EAC] hover:text-white text-center font-medium transition-all duration-200"
            >
              Become a Member
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
