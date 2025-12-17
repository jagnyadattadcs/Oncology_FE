// components/Admin/AdminDashboard.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FaHome,
  FaUser,
  FaImages,
  FaNewspaper,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaImage
} from 'react-icons/fa';
import Dashboard from './Dashboard';
import HomeCarousel from './HomeCarousel';
import Gallery from './Gallery';
import Members from './Members';
import NewsEvents from './NewsEvents';
import Conferences from './Conferences';
import Settings from './Settings';

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaHome />, component: <Dashboard /> },
    { id: 'homecarousel', label: 'Home Carousel', icon: <FaImages />, component: <HomeCarousel /> },
    { id: 'gallery', label: 'Gallery', icon: <FaImage />, component: <Gallery /> },
    { id: 'members', label: 'Members', icon: <FaUser />, component: <Members /> },
    { id: 'news', label: 'News & Events', icon: <FaNewspaper />, component: <NewsEvents /> },
    { id: 'conferences', label: 'Conferences', icon: <FaCalendarAlt />, component: <Conferences /> },
    { id: 'settings', label: 'Settings', icon: <FaCog />, component: <Settings /> },
  ];

  const renderContent = () => {
    const activeMenuItem = menuItems.find(item => item.id === activeTab);
    return activeMenuItem ? activeMenuItem.component : <Dashboard />;
  };

  return (
    <div className="min-h-screen bg-gray-50 sticky">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow p-4 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600"
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <h1 className="text-xl font-bold text-[#0b61a8]">OSOO Admin</h1>
        <div className="w-8"></div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 h-screen bg-white shadow-xl transition-transform duration-300 overflow-y-auto`}
        >
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-[#0b61a8]">OSOO Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Administration Panel</p>
          </div>

          <div className="p-4">
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Logged in as:</p>
              <p className="font-medium text-gray-800 truncate">{admin?.email}</p>
              <p className="text-xs text-gray-500 mt-1">Admin ID: {admin?.adminId}</p>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === item.id
                      ? 'bg-[#0b61a8] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 mt-8 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 lg:hidden z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          <div className="p-4 lg:p-8">
            {/* <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome back, {admin?.name}
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your OSOO website content and members
              </p>
            </div> */}

            <div className="bg-white rounded-xl shadow">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
