import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaChevronDown } from 'react-icons/fa'

const navItems = [
  {
    name: "Home",
    link: "/"
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
        link: "/member/onboarding-member"
      },
      {
        name: "Member Login",
        link: "/member/login"
      },
      {
        name: "Life Member",
        link: "/member?section=life-members"
      },
      {
        name: "Associate Members",
        link: "/member?section=accosiate-members"
      },
      {
        name: "Benefits of Membership",
        link: "/member?section=benifits"
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
  const location = useLocation()
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [activeNavItem, setActiveNavItem] = useState("/")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Set active nav item based on current location
  useEffect(() => {
    const currentPath = location.pathname
    const activeItem = navItems.find(item => 
      item.link === currentPath || 
      (item.dropdown && item.dropdown.some(subItem => subItem.link.startsWith(currentPath)))
    )
    setActiveNavItem(activeItem?.link || "/")
  }, [location])

  const handleMouseEnter = (itemName) => {
    if (navItems.find(item => item.name === itemName)?.dropdown) {
      setActiveDropdown(itemName)
    }
  }

  const handleMouseLeave = () => {
    setActiveDropdown(null)
  }

  const isActive = (item) => {
    if (item.link) {
      return activeNavItem === item.link || location.pathname === item.link
    }
    // For dropdown items, check if any sub-item is active
    if (item.dropdown) {
      return item.dropdown.some(subItem => 
        location.pathname.startsWith(subItem.link.split('?')[0]) ||
        location.pathname === subItem.link
      )
    }
    return false
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleNavItemClick = (item) => {
    if (item.link) {
      setActiveNavItem(item.link)
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <div className='w-full min-h-24 bg-white shadow-md p-1 px-4 md:px-8'>
      <div className='flex justify-between items-center h-full'>
        {/* Logo and Title */}
        <div className='flex items-center gap-2'>
          <img 
            src="/osoo_logo.jpg" 
            alt="osoo logo" 
            className='w-16 md:w-20 rounded-full'
          />
          <div>
            <h1 className='hidden sm:block font-libre font-bold text-lg md:text-2xl text-blue-900'>ODISHA SOCIETY OF ONCOLOGY</h1>
            {/* <p className='text-gray-600'>Registered under the Societies Registration Act (No XXI of 1860)</p> */}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className='md:hidden text-gray-700 text-2xl'
          onClick={toggleMobileMenu}
        >
          ☰
        </button>
        
        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center text-lg gap-6 lg:gap-8 relative'>
          {navItems.map((item, idx) => (
            <div 
              key={idx} 
              className='relative'
              onMouseEnter={() => handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
              {item.link ? (
                <Link 
                  to={item.link} 
                  onClick={() => handleNavItemClick(item)}
                  className={`flex items-center gap-1 font-medium transition-colors duration-200 ${
                    isActive(item) 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                  {item.dropdown && <FaChevronDown className="text-xs mt-1" />}
                </Link>
              ) : (
                <span className={`flex items-center gap-1 cursor-pointer font-medium ${
                  isActive(item)
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}>
                  {item.name}
                  {item.dropdown && <FaChevronDown className="text-xs mt-1" />}
                </span>
              )}
              
              {item.dropdown && activeDropdown === item.name && (
                <div 
                  className='absolute top-full left-1/2 transform -translate-x-1/2 w-64 bg-white shadow-lg py-2 z-50 rounded-sm border border-gray-100'
                  onMouseEnter={() => handleMouseEnter(item.name)}
                >
                  {item.dropdown.map((dropdownItem, dropdownIdx) => (
                    <Link
                      key={dropdownIdx}
                      to={dropdownItem.link}
                      onClick={() => {
                        handleNavItemClick(item)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`block px-4 py-2 transition-colors duration-200 ${
                        location.pathname === dropdownItem.link.split('?')[0]
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-blue-600 hover:text-white'
                      }`}
                    >
                      {dropdownItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <div className='flex items-center gap-3 lg:gap-4 ml-4'>
            <Link 
              to="/contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 lg:px-6 py-2 bg-[#083768] text-white rounded-lg hover:opacity-90 text-sm lg:text-base"
            >
              Contact
            </Link>
            <Link 
              to="/member/login" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 lg:px-6 py-2 bg-[#ff1605] text-white rounded-lg hover:opacity-90 text-sm lg:text-base"
            >
              Member Login
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className='md:hidden mt-4 pb-4 border-t pt-4'>
          {navItems.map((item, idx) => (
            <div key={idx} className='mb-2'>
              {item.link ? (
                <Link 
                  to={item.link}
                  onClick={() => handleNavItemClick(item)}
                  className={`block py-2 px-4 font-medium rounded ${
                    isActive(item)
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    {item.name}
                    {item.dropdown && <FaChevronDown className="text-xs" />}
                  </div>
                </Link>
              ) : (
                <div className='py-2 px-4 font-medium text-gray-700'>
                  <div className='flex items-center justify-between'>
                    {item.name}
                    {item.dropdown && <FaChevronDown className="text-xs" />}
                  </div>
                </div>
              )}
              
              {item.dropdown && (
                <div className='ml-6 mt-1 bg-gray-50 rounded'>
                  {item.dropdown.map((dropdownItem, dropdownIdx) => (
                    <Link
                      key={dropdownIdx}
                      to={dropdownItem.link}
                      onClick={() => {
                        handleNavItemClick(item)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`block py-2 px-4 text-sm rounded ${
                        location.pathname === dropdownItem.link.split('?')[0]
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {dropdownItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <div className='mt-4 flex flex-col gap-2'>
            <Link 
              to="/contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-4 bg-[#083768] text-white rounded-lg hover:opacity-90 text-center"
            >
              Contact
            </Link>
            <Link 
              to="/member/login" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-4 bg-[#ff1605] text-white rounded-lg hover:opacity-90 text-center"
            >
              Member Login
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar
