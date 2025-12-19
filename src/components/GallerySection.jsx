import React from 'react'
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, MapPin, Users } from 'lucide-react';

const galleryItems = [
    {
      id: 1,
      image: "https://res.cloudinary.com/dxvovx7s2/image/upload/v1766039688/Screenshot_2025-12-18_120310_zso4hd.png",
      title: 'Annual Conference 2024',
      description: 'Main auditorium with distinguished speakers',
      date: '28 Nov - 1 Dec 2024',
      location: 'Mangalore',
      attendees: '1200+',
      category: 'Conference'
    },
    {
      id: 2,
      image: "https://res.cloudinary.com/dxvovx7s2/image/upload/v1766039688/Screenshot_2025-12-18_120310_zso4hd.png",
      title: 'Award Ceremony',
      description: 'The 44th AROICON 2024',
      date: '28 Nov - 1 Dec 2024',
      location: 'Mangalore',
      attendees: '1200+',
      category: 'Awards'
    },
    {
      id: 3,
      image: "https://res.cloudinary.com/dxvovx7s2/image/upload/v1766039688/Screenshot_2025-12-18_120310_zso4hd.png",
      title: 'Group Photo Session',
      description: 'The 44th AROICON 2024',
      date: '28 Nov - 1 Dec 2024',
      location: 'Mangalore',
      attendees: '1200+',
      category: 'Event'
    },
    {
      id: 4,
      image: "https://res.cloudinary.com/dxvovx7s2/image/upload/v1766039688/Screenshot_2025-12-18_120310_zso4hd.png",
      title: 'Cancer Awareness Camp',
      description: 'Community health awareness and screening event',
      date: '15 Oct 2024',
      location: 'Bhubaneswar',
      attendees: '800+',
      category: 'Awareness'
    }
  ];

const GallerySection = () => {
  return (
    <div 
        className="bg-linear-to-br relative from-slate-50 via-blue-50 to-slate-50 py-16 sm:py-20 px-4"
        // style={{
        //     backgroundImage: `url("https://res.cloudinary.com/dxvovx7s2/image/upload/v1765972142/blob-scene-haikei_qidc0k.svg")`,
        //     backgroundRepeat: "no-repeat",
        //     backgroundSize: "cover",
        //     backgroundPosition: "center"
        // }}
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto mb-12 text-center"
      >
        <span className="text-[#326EAC] font-bold text-3xl tracking-wide uppercase mb-4 block">
          Our Gallery
        </span>
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          Highlights from our events and activities
        </h1>
      </motion.div>

      {/* Gallery Grid - 4 Smaller Images */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
            >
              <div className="relative h-[250px] sm:h-[280px] overflow-hidden">
                {/* Image */}
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/20 group-hover:from-black/90 transition-all duration-300"></div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-[#326EAC] backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {item.category}
                  </span>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-white/90 text-xs">
                    <MapPin className="w-3 h-3" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show More Button - Redirects to Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <Link to="/gallery">
            <motion.button
              className="text-lg flex group items-center justify-center font-semibold p-3 px-8 border rounded-lg shadow-md shadow-[#326EAC] text-[#326EAC] hover:bg-[#326EAC] hover:text-white transition-all duration-300 cursor-pointer"
            >
              Show More
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default GallerySection
