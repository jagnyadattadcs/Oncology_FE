import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaHeartbeat } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiPhone, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-[#0e1720] text-slate-300">
      <div className="w-full mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Branding */}
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-[#12375a] flex items-center justify-center text-white text-xl shadow-md">
                <img 
                  src="/osoo_logo.jpg" 
                  alt="osoo logo" 
                  className='w-16 md:w-18 rounded-full'
                />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">OSOO</h3>
                <p className="text-xs text-slate-400">Est. 2008</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-400 leading-6">
              Advancing surgical oncology excellence in Odisha through education, collaboration, and patient care.
            </p>

            <div className="mt-6 flex space-x-3 mb-5">
              <a href="#" className="w-8 h-8 rounded-full bg-[#102231] flex items-center justify-center border border-slate-700 hover:bg-[#153148] transition">
                <FaFacebookF />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#102231] flex items-center justify-center border border-slate-700 hover:bg-[#153148] transition">
                <FaTwitter />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#102231] flex items-center justify-center border border-slate-700 hover:bg-[#153148] transition">
                <FaLinkedinIn />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#102231] flex items-center justify-center border border-slate-700 hover:bg-[#153148] transition">
                <FaInstagram />
              </a>
            </div>

            <Link to="/admin" className="w-20 p-1 px-4 border border-gray-400 rounded flex items-center justify-center hover:bg-blue-800 transition-all duration-200">Admin</Link>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="hover:text-white transition block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/member/onboarding-member" className="hover:text-white transition block">
                  Become a Member
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition block">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/academic" className="hover:text-white transition block">
                  Academic
                </Link>
              </li>
              <li>
                <Link to="/events?eventType=gallery" className="hover:text-white transition block">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Membership */}
          <div>
            <h4 className="text-white font-semibold mb-4">Membership</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li>
                <Link to="/member?section=life-members" className="hover:text-white transition block">
                  Life Members
                </Link>
              </li>
              <li>
                <Link to="/member?section=accosiate-members" className="hover:text-white transition block">
                  Associate Members
                </Link>
              </li>
              <li>
                <Link to="/member?section=benifits" className="hover:text-white transition block">
                  Benefits
                </Link>
              </li>
              <li>
                <Link to="/member/login" className="hover:text-white transition block">
                  Member Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <div className="flex items-start gap-3 text-slate-400 text-sm">
              <div className="pt-1">
                <HiOutlineLocationMarker className="text-lg text-[#3aa2d6]" />
              </div>
              <div>
                <p className="text-sm">Acharya Harihar Regional Cancer Centre, Cuttack, Odisha 753007</p>
              </div>
            </div>

            <div className="flex items-start gap-3 mt-4 text-slate-400 text-sm">
              <div className="pt-1">
                <FiPhone className="text-lg text-[#3aa2d6]" />
              </div>
              <div>
                <p className="text-sm">+91 671 230 7471</p>
              </div>
            </div>

            <div className="flex items-start gap-3 mt-4 text-slate-400 text-sm">
              <div className="pt-1">
                <FiMail className="text-lg text-[#3aa2d6]" />
              </div>
              <div>
                <p className="text-sm">info@osoo.org.in</p>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-8 border-slate-700" />

        <div className="text-center text-slate-400 text-sm">
          © 2025 ODISHA SOCIETY OF ONCOLOGY. All rights reserved.
        </div>
      </div>
    </footer>
  );
}