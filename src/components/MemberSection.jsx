import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MemberSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const members = [
    {
      id: 1,
      name: 'Dr Sushil Kumar Giri',
      role: 'President',
      image: "https://img.freepik.com/free-photo/waist-up-portrait-handsome-serious-unshaven-male-keeps-hands-together-dressed-dark-blue-shirt-has-talk-with-interlocutor-stands-against-white-wall-self-confident-man-freelancer_273609-16320.jpg?t=st=1766048346~exp=1766051946~hmac=439ad35794b13f635f0a394cce85aa008e90fd914920620678fe452c0752064e&w=1060",
    },
    {
      id: 2,
      name: 'Dr Laltendu Sarangi',
      role: 'Past President',
      image: "https://img.freepik.com/free-photo/handsome-bearded-guy-posing-against-white-wall_273609-20597.jpg?t=st=1766048410~exp=1766052010~hmac=8f317fcf6ea25c2d3d5d8294880f994eebee7b249b93184772b4a9bf26429ebc&w=1060",
    },
    {
      id: 3,
      name: 'Dr. Sanjib kumar Mishar',
      role: 'Vice President',
      image:"https://img.freepik.com/free-photo/handsome-bearded-businessman-rubbing-hands-having-deal_176420-18778.jpg?t=st=1766048448~exp=1766052048~hmac=298726abc817a53b221c7751298cf0f341a3f779f7811608b8052893117c133a&w=1060",
    },
    {
      id: 4,
      name: 'Member Three',
      role: 'Secretary',
      image: "https://img.freepik.com/free-photo/happy-joyful-female-woman-with-tablet-posing-indoors_74855-2896.jpg?t=st=1766048514~exp=1766052114~hmac=cbfdeebb59065c42b493fdb3fa835dc59ab18e0f33535309ab2d4c3d8f37703d&w=1060",
    },
    {
      id: 5,
      name: 'Member Four',
      role: 'Past Secretary',
      image: "https://img.freepik.com/free-photo/happy-confident-male-entrepreneur-with-postive-smile-has-beard-mustache-keeps-arms-folded-being-high-spirit-after-successful-meeting-with-partners-poses-against-white-wall-dressed-casually_273609-16228.jpg?t=st=1766048550~exp=1766052150~hmac=a684c41a10c445edc460ed17dc0ce2889314fafccaa5813f36f8a621626a696a&w=1060",
    },
  ];

  // Mobile & Tablet Grid View
  const renderMobileTabletGrid = () => (
    <div className="md:hidden lg:hidden">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {members.map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative h-48 sm:h-56">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-8 bg-[#326EAC] rounded"></div>
                  <div>
                    <p className="text-white font-bold text-sm">{member.name}</p>
                    <p className="text-gray-200 text-xs">{member.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Desktop Carousel View (original)
  const renderDesktopCarousel = () => (
    <div className="hidden lg:block">
      <div className="mb-8 sm:mb-12 flex justify-center">
        <div className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-3 sm:pb-4 items-end justify-center w-full">
          {members.map((member, index) => {
            let cardWidth = 200;
            
            if (expandedIndex === index) {
              cardWidth = 340;
            }
            if (expandedIndex === null && index === 0) {
              cardWidth = 340;
            }

            return (
              <motion.div
                key={member.id}
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
                className="shrink-0 cursor-pointer group transition-all duration-300 rounded-2xl overflow-hidden border-2 border-white shadow-lg hover:shadow-2xl"
                style={{
                  backgroundImage: `url(${member.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "400px",
                }}
                animate={{
                  width: cardWidth,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                <motion.div className="w-full h-full overflow-hidden relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Role Text - Rotates from vertical to horizontal */}
                  <motion.div
                    className="absolute bottom-15 left-10 text-white font-bold origin-bottom-left whitespace-nowrap"
                    animate={{
                      rotate:
                        expandedIndex === index ||
                        (expandedIndex === null && index === 0)
                          ? 0
                          : -90,
                      fontSize:
                        expandedIndex === index ||
                        (expandedIndex === null && index === 0)
                          ? "1.875rem"
                          : "1rem",
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                  >
                    {member.role}
                  </motion.div>

                  {/* Horizontal Text Section - Shows on expand OR always on first card */}
                  <motion.div
                    className="absolute bottom-6 left-6 right-6 text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity:
                        expandedIndex === index ||
                        (expandedIndex === null && index === 0)
                          ? 1
                          : 0,
                      y:
                        expandedIndex === index ||
                        (expandedIndex === null && index === 0)
                          ? 0
                          : 10,
                    }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-1 h-19 bg-[#326EAC] rounded shrink-0"></div>
                      <div className="flex flex-col pt-10">
                        <motion.div
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{
                            scaleX:
                              expandedIndex === index ||
                              (expandedIndex === null && index === 0)
                                ? 1
                                : 0,
                            opacity:
                              expandedIndex === index ||
                              (expandedIndex === null && index === 0)
                                ? 1
                                : 0,
                          }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          style={{ originX: 0 }}
                          className="bg-white text-black px-3 py-2 rounded inline-block max-w-xs shadow-md"
                        >
                          <p className="font-semibold text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                            {member.name}
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Tablet View (Modified Carousel)
  const renderTabletView = () => (
    <div className="hidden md:block lg:hidden">
      <div className="mb-8 flex justify-center">
        <div className="flex flex-wrap gap-3  pb-4 items-end justify-center w-full px-4">
          {members.map((member, index) => {
            let cardWidth = 180;
            
            if (expandedIndex === index) {
              cardWidth = 280;
            }
            if (expandedIndex === null && index === 0) {
              cardWidth = 280;
            }

            return (
              <motion.div
                key={member.id}
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
                className="shrink-0 cursor-pointer group transition-all duration-300 rounded-2xl overflow-hidden border-2 border-white shadow-lg hover:shadow-2xl"
                style={{
                  backgroundImage: `url(${member.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "350px",
                }}
                animate={{
                  width: cardWidth,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                <motion.div className="w-full h-full overflow-hidden relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                  <motion.div
                    className="absolute bottom-12 left-6 text-white font-bold origin-bottom-left whitespace-nowrap"
                    animate={{
                      rotate:
                        expandedIndex === index ||
                        (expandedIndex === null && index === 0)
                          ? 0
                          : -90,
                      fontSize:
                        expandedIndex === index ||
                        (expandedIndex === null && index === 0)
                          ? "1.5rem"
                          : "0.875rem",
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                  >
                    {member.role}
                  </motion.div>

                  <motion.div
                    className="absolute bottom-4 left-4 right-4 text-xs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity:
                        expandedIndex === index ||
                        (expandedIndex === null && index === 0)
                          ? 1
                          : 0,
                      y:
                        expandedIndex === index ||
                        (expandedIndex === null && index === 0)
                          ? 0
                          : 10,
                    }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-14 bg-[#326EAC] rounded shrink-0"></div>
                      <div className="flex flex-col pt-6">
                        <motion.div
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{
                            scaleX:
                              expandedIndex === index ||
                              (expandedIndex === null && index === 0)
                                ? 1
                                : 0,
                            opacity:
                              expandedIndex === index ||
                              (expandedIndex === null && index === 0)
                                ? 1
                                : 0,
                          }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          style={{ originX: 0 }}
                          className="bg-white text-black px-2 py-1.5 rounded inline-block max-w-xs shadow-md"
                        >
                          <p className="font-semibold text-xs leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                            {member.name}
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 w-full max-w-8xl mx-auto mb-10">
        <div className="pt-8 sm:pt-12 md:pt-16 px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="mb-8 sm:mb-12 md:mb-10">
            <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-[#336EAA]">
              Our Coucil Members
            </h2>
            <p className="text-center text-sm sm:text-base lg:text-lg text-black mt-2 max-w-3xl mx-auto px-4">
              Dedicated leaders working together for growth and impactful change in our community
            </p>
          </div>
        </div>

        <div className="relative bg-white rounded-xl shadow-xl mx-4 sm:mx-6 md:mx-8 lg:mx-10 p-4 sm:p-6 md:p-8 lg:p-10 min-h-[400px]">
          <div className="relative z-20">
            {/* Mobile Grid View */}
            {renderMobileTabletGrid()}
            
            {/* Tablet View */}
            {renderTabletView()}
            
            {/* Desktop Carousel View */}
            {renderDesktopCarousel()}

            {/* Show More Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center mt-8 sm:mt-10 md:mt-12 lg:mt-12"
            >
              <Link
                to="/members"
                className="text-sm sm:text-base lg:text-lg font-semibold p-2 sm:p-3 px-6 sm:px-8 border rounded-lg shadow-md shadow-[#326EAC] text-[#326EAC] hover:bg-[#326EAC] hover:text-white transition-all duration-300 cursor-pointer"
              >
                View All Members
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberSection;
