// components/Admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaNewspaper, 
  FaImage, 
  FaVideo, 
  FaEnvelope,
  FaUserTie,
  FaSpinner,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { MdPeople, MdEvent } from 'react-icons/md';
import { GiHospital } from 'react-icons/gi';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const [stats, setStats] = useState({
    members: { total: 0, pending: 0, approved: 0, trend: 0 },
    events: { total: 0, upcoming: 0, past: 0, trend: 0 },
    gallery: { total: 0, trend: 0 },
    videos: { total: 0, trend: 0 },
    contacts: { total: 0, unread: 0, trend: 0 },
    council: { total: 0, trend: 0 },
    carousel: { total: 0, active: 0, trend: 0 }
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);

  // Fetch all statistics
  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      // Fetch member stats
      const membersRes = await axios.get(`${BASE_URL}/member/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch event stats
      const eventsRes = await axios.get(`${BASE_URL}/events/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch gallery stats
      const galleryRes = await axios.get(`${BASE_URL}/gallery/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch video stats
      const videosRes = await axios.get(`${BASE_URL}/videos/stats/summary`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch contact stats
      const contactsRes = await axios.get(`${BASE_URL}/contact/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch council member stats
      const councilRes = await axios.get(`${BASE_URL}/councilmember/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch carousel stats
      const carouselRes = await axios.get(`${BASE_URL}/carousel`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Process member data
      const allMembers = membersRes.data.data || [];
      const pendingMembers = allMembers.filter(m => m.status === 'pending');
      const approvedMembers = allMembers.filter(m => m.status === 'approved');
      
      // Process carousel data
      const carouselImages = carouselRes.data.data || [];
      const activeCarousel = carouselImages.filter(img => img.isActive);

      // Process contact data
      const allContacts = contactsRes.data.data || [];
      const unreadContacts = allContacts.filter(c => c.status === 'unread');

      setStats({
        members: {
          total: allMembers.length,
          pending: pendingMembers.length,
          approved: approvedMembers.length,
          trend: calculateTrend(allMembers)
        },
        events: {
          total: eventsRes.data?.totalEvents || 0,
          upcoming: eventsRes.data?.upcomingEvents || 0,
          past: eventsRes.data?.pastEvents || 0,
          trend: calculateTrend([]) // You might want to implement proper trend calculation
        },
        gallery: {
          total: galleryRes.data?.total || 0,
          trend: galleryRes.data?.trend || 0
        },
        videos: {
          total: videosRes.data?.total || 0,
          trend: videosRes.data?.trend || 0
        },
        contacts: {
          total: contactsRes.data?.total || allContacts.length,
          unread: contactsRes.data?.unread || unreadContacts.length,
          trend: calculateTrend(allContacts)
        },
        council: {
          total: councilRes.data?.total || 0,
          trend: councilRes.data?.trend || 0
        },
        carousel: {
          total: carouselRes.data?.total || carouselImages.length,
          active: carouselRes.data?.active || activeCarousel.length,
          trend: calculateTrend(carouselImages)
        }
      });

      // Fetch recent activity
      fetchRecentActivity(token);

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async (token) => {
    try {
      // Fetch recent members
      const recentMembersRes = await axios.get(`${BASE_URL}/members/admin/all?limit=5&sort=-createdAt`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Fetch recent events
      const recentEventsRes = await axios.get(`${BASE_URL}/events?limit=5&sort=-createdAt`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Fetch recent contacts
      const recentContactsRes = await axios.get(`${BASE_URL}/contact/admin/all?limit=5&sort=-createdAt`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const activities = [];

      // Add recent members
      if (recentMembersRes.data.data) {
        recentMembersRes.data.data.slice(0, 3).forEach(member => {
          activities.push({
            type: 'member',
            action: 'registered',
            title: `New member: ${member.name}`,
            description: `Registered as ${member.membershipType}`,
            time: new Date(member.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            status: member.status,
            color: member.status === 'approved' ? 'green' : member.status === 'pending' ? 'yellow' : 'gray'
          });
        });
      }

      // Add recent events
      if (recentEventsRes.data) {
        recentEventsRes.data.slice(0, 2).forEach(event => {
          activities.push({
            type: 'event',
            action: 'created',
            title: `New event: ${event.title}`,
            description: `Starts ${new Date(event.startDate).toLocaleDateString()}`,
            time: new Date(event.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            status: event.isCompleted ? 'completed' : 'upcoming',
            color: event.isCompleted ? 'blue' : 'purple'
          });
        });
      }

      // Add recent contacts
      if (recentContactsRes.data.data) {
        recentContactsRes.data.data.slice(0, 2).forEach(contact => {
          activities.push({
            type: 'contact',
            action: 'submitted',
            title: `New message from ${contact.name}`,
            description: contact.subject,
            time: new Date(contact.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            status: contact.status,
            color: contact.status === 'unread' ? 'red' : 'gray'
          });
        });
      }

      // Sort by time (most recent first)
      activities.sort((a, b) => new Date(b.time) - new Date(a.time));
      setRecentActivity(activities.slice(0, 5));

    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const calculateTrend = (data) => {
    // Simple trend calculation - in real app, compare with previous period
    if (data.length === 0) return 0;
    const today = new Date();
    const weekAgo = new Date(today.setDate(today.getDate() - 7));
    const recentData = data.filter(item => new Date(item.createdAt) > weekAgo);
    return recentData.length > 0 ? Math.round((recentData.length / data.length) * 100) : 0;
  };

  useEffect(() => {
    fetchStats();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchStats, 300000);
    
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, icon, color, trend, subValue, subLabel, link }) => (
    <div className="bg-white rounded-xl shadow border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
              {trend !== undefined && (
                <span className={`text-sm font-medium flex items-center gap-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend > 0 ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
                  {Math.abs(trend)}%
                </span>
              )}
            </div>
            {subValue && subLabel && (
              <p className="text-sm text-gray-500 mt-1">
                {subValue} {subLabel}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            {icon}
          </div>
        </div>
        {link && (
          <div className="pt-4 border-t border-gray-100">
            <Link 
              to={link}
              className="text-sm text-[#0b61a8] hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View details
              <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  const ActivityIcon = ({ type, color }) => {
    const icons = {
      member: <FaUsers />,
      event: <MdEvent />,
      contact: <FaEnvelope />,
      gallery: <FaImage />,
      video: <FaVideo />,
      council: <FaUserTie />
    };
    
    const iconColors = {
      green: 'text-green-500 bg-green-50',
      blue: 'text-blue-500 bg-blue-50',
      purple: 'text-purple-500 bg-purple-50',
      red: 'text-red-500 bg-red-50',
      yellow: 'text-yellow-500 bg-yellow-50',
      gray: 'text-gray-500 bg-gray-50'
    };

    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColors[color]}`}>
        {icons[type] || <FaNewspaper />}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center h-96">
          <FaSpinner className="animate-spin text-4xl text-[#0b61a8] mb-4" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your website.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Members"
          value={stats.members.total}
          icon={<FaUsers className="text-2xl text-white" />}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          trend={stats.members.trend}
          subValue={stats.members.pending}
          subLabel="pending approval"
          link="/admin/members"
        />

        <StatCard
          title="Council Members"
          value={stats.council.total}
          icon={<FaUserTie className="text-2xl text-white" />}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          trend={stats.council.trend}
          link="/admin/council"
        />

        <StatCard
          title="Events & Conferences"
          value={stats.events.total}
          icon={<FaCalendarAlt className="text-2xl text-white" />}
          color="bg-gradient-to-r from-green-500 to-green-600"
          trend={stats.events.trend}
          subValue={stats.events.upcoming}
          subLabel="upcoming"
          link="/admin/news"
        />

        <StatCard
          title="Contact Messages"
          value={stats.contacts.total}
          icon={<FaEnvelope className="text-2xl text-white" />}
          color="bg-gradient-to-r from-red-500 to-red-600"
          trend={stats.contacts.trend}
          subValue={stats.contacts.unread}
          subLabel="unread"
          link="/admin/contact"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Gallery Images"
          value={stats.gallery.total}
          icon={<FaImage className="text-2xl text-white" />}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          trend={stats.gallery.trend}
          link="/admin/gallery"
        />

        <StatCard
          title="Event Videos"
          value={stats.videos.total}
          icon={<FaVideo className="text-2xl text-white" />}
          color="bg-gradient-to-r from-pink-500 to-pink-600"
          trend={stats.videos.trend}
          link="/admin/videos"
        />

        <StatCard
          title="Carousel Images"
          value={stats.carousel.total}
          icon={<FaImage className="text-2xl text-white" />}
          color="bg-gradient-to-r from-teal-500 to-teal-600"
          trend={stats.carousel.trend}
          subValue={stats.carousel.active}
          subLabel="active"
          link="/admin/homecarousel"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Recent Activity</h3>
          <button 
            onClick={() => fetchStats()}
            className="text-sm text-[#0b61a8] hover:text-blue-700 font-medium"
          >
            Refresh
          </button>
        </div>
        
        {recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <ActivityIcon type={activity.type} color={activity.color} />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800">{activity.title}</p>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      activity.color === 'green' ? 'bg-green-100 text-green-800' :
                      activity.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                      activity.color === 'red' ? 'bg-red-100 text-red-800' :
                      activity.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </span>
                    <span className={`text-xs ${
                      activity.status === 'pending' || activity.status === 'unread' 
                        ? 'text-yellow-600 font-medium' 
                        : 'text-gray-500'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No recent activity found</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-linear-to-r from-[#0b61a8] to-blue-600 rounded-xl shadow p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/members"
            className="p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FaUsers className="text-xl" />
              <div>
                <p className="font-medium">Approve Members</p>
                <p className="text-sm text-white/80">{stats.members.pending} pending</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/contact"
            className="p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-xl" />
              <div>
                <p className="font-medium">View Messages</p>
                <p className="text-sm text-white/80">{stats.contacts.unread} unread</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/homecarousel"
            className="p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FaImage className="text-xl" />
              <div>
                <p className="font-medium">Manage Carousel</p>
                <p className="text-sm text-white/80">{stats.carousel.active} active</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/news"
            className="p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-xl" />
              <div>
                <p className="font-medium">Create Event</p>
                <p className="text-sm text-white/80">Add new</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
