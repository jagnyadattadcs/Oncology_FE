import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMember } from '../context/MemberContext';
import { FaUser, FaSignOutAlt, FaHistory, FaIdCard, FaCalendar, FaFileAlt, FaCheckCircle } from 'react-icons/fa';

const MemberDashboard = () => {
  const { member, logout } = useMember();
  const navigate = useNavigate();

  useEffect(() => {
    if (!member) {
      navigate('/login');
    }
  }, [member, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!member) {
    return null; // or loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#326EAC] text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">OSOO Member Dashboard</h1>
              <p className="text-white/80">Welcome back, {member.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-white/80">ID: {member.uniqueId}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-[#326EAC] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {member.name?.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.email}</p>
                <div className="mt-2">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Active Member
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition">
                  <FaUser className="text-gray-400" />
                  <span>My Profile</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition">
                  <FaIdCard className="text-gray-400" />
                  <span>Member Card</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition">
                  <FaCalendar className="text-gray-400" />
                  <span>Events & Conferences</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition">
                  <FaFileAlt className="text-gray-400" />
                  <span>Documents & Resources</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition">
                  <FaHistory className="text-gray-400" />
                  <span>Activity History</span>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Membership Status</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member ID:</span>
                  <span className="font-medium">{member.uniqueId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Joined:</span>
                  <span className="font-medium">
                    {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">Approved</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Verification:</span>
                  <span className="font-medium text-green-600">Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Welcome Card */}
            <div className="bg-linear-to-r from-[#326EAC] to-blue-600 rounded-xl shadow-lg p-6 text-white mb-6">
              <h2 className="text-2xl font-bold mb-2">Welcome to OSOO Member Portal</h2>
              <p className="text-white/90">
                Access exclusive resources, connect with fellow oncologists, and stay updated with the latest in cancer care.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FaCalendar className="text-xl text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Upcoming Events</h4>
                <p className="text-gray-600 text-sm mb-4">Check upcoming conferences and workshops</p>
                <button className="text-[#326EAC] hover:text-[#2a5c8f] text-sm font-medium">
                  View Calendar →
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <FaFileAlt className="text-xl text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Resources</h4>
                <p className="text-gray-600 text-sm mb-4">Access research papers and guidelines</p>
                <button className="text-[#326EAC] hover:text-[#2a5c8f] text-sm font-medium">
                  Browse Library →
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <FaIdCard className="text-xl text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Digital ID Card</h4>
                <p className="text-gray-600 text-sm mb-4">Download your digital member card</p>
                <button className="text-[#326EAC] hover:text-[#2a5c8f] text-sm font-medium">
                  Download Card →
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
                <button className="text-sm text-[#326EAC] hover:text-[#2a5c8f] font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Membership Approved</p>
                    <p className="text-sm text-gray-600">Your membership was approved by admin</p>
                  </div>
                  <div className="ml-auto text-sm text-gray-500">
                    {member.adminReviewedAt ? new Date(member.adminReviewedAt).toLocaleDateString() : 'Recent'}
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Profile Created</p>
                    <p className="text-sm text-gray-600">Your member profile was created successfully</p>
                  </div>
                  <div className="ml-auto text-sm text-gray-500">
                    {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'Recent'}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4">Need Help?</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Contact our support team for any assistance with your membership.
                </p>
                <div className="flex gap-3">
                  <a
                    href="mailto:support@osoo.org"
                    className="px-4 py-2 bg-[#326EAC] text-white rounded-lg hover:bg-[#2a5c8f] transition text-sm"
                  >
                    Email Support
                  </a>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm">
                    FAQ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
