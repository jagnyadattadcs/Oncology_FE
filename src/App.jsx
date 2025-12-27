import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./shared/Navbar";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Footer from "./shared/Footer";
import AboutUs from "./pages/AboutUs";
import AdminPage from "./components/Admin/AdminPage";
import { Slide, ToastContainer } from "react-toastify";
import MemberLogin from "./pages/MemberLogin";
import ChangePassword from "./pages/ChangePassword";
import MemberDashboard from "./pages/MemberDashboard";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import MemberRegister from "./pages/MemberRegister";
import ContactForm from "./pages/ContactForm";
import BenefitsOfMembership from "./pages/BenefitsOfMembership";
import UpcomingEvents from "./pages/UpcomingEvents";
import PastEvents from "./pages/PastEvents";
import EventVideos from "./pages/EventVideos";
import ImageGallery from "./pages/ImageGallery";
import Academic from "./pages/Academic";
import PageNotFound from "./pages/PageNotFound";
import { DataProvider } from "./context/DataContext";
import Research from "./pages/Research";
import LifeMembers from "./pages/LifeMembers";

function App() {
  const location = useLocation();

  // Check if current path is an admin path
  const isAdminPath = location.pathname.startsWith("/admin");

  // Show loading spinner while checking auth state
  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0b61a8]"></div>
  //     </div>
  //   );
  // }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
      {/* Show public layout for non-admin paths */}
      {!isAdminPath ? (
        <DataProvider>
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/academic" element={<Academic />} />
              <Route path="/research" element={<Research />} />
              <Route path="/contact" element={<ContactForm />} />
              <Route
                path="/member/benifits"
                element={<BenefitsOfMembership />}
              />
              <Route
                path="/member/life-members"
                element={<LifeMembers />}
              />
              <Route path="/member/register" element={<MemberRegister />} />
              <Route path="/member/login" element={<MemberLogin />} />
              <Route
                path="/member/change-password"
                element={<ChangePassword />}
              />
              <Route path="/member/dashboard" element={<MemberDashboard />} />
              <Route
                path="/registration-success"
                element={<RegistrationSuccess />}
              />
              <Route
                path="/events/upcoming-events"
                element={<UpcomingEvents />}
              />
              <Route path="/events/past-events" element={<PastEvents />} />
              <Route path="/events/event-videos" element={<EventVideos />} />
              <Route path="/events/gallery" element={<ImageGallery />} />
              {/* Add redirect to admin login */}
              {/* <Route path="/admin" element={<Navigate to="/admin/login" replace />} /> */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
            <Footer />
          </>
        </DataProvider>
      ) : (
        /* Show admin layout for admin paths */
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      )}
    </>
  );
}

export default App;
