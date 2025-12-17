// components/Admin/Dashboard.jsx
import React from 'react';
import { FaUsers, FaCalendarAlt, FaNewspaper } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaUsers className="text-2xl text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Total Members</h3>
              <p className="text-3xl font-bold text-[#0b61a8]">154</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">+12 this month</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaCalendarAlt className="text-2xl text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Active Conferences</h3>
              <p className="text-3xl font-bold text-[#0b61a8]">3</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">2 upcoming events</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaNewspaper className="text-2xl text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Recent News</h3>
              <p className="text-3xl font-bold text-[#0b61a8]">12</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">+3 this week</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-gray-700">New member registered: Dr. Rajesh Kumar</p>
            <span className="text-sm text-gray-500 ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-gray-700">Conference "Annual Meet 2024" created</p>
            <span className="text-sm text-gray-500 ml-auto">1 day ago</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <p className="text-gray-700">Carousel image updated</p>
            <span className="text-sm text-gray-500 ml-auto">2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
