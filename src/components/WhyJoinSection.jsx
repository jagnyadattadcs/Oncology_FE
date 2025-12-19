import React from 'react'
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const WhyJoinSection = () => {
    const cards = [
    {
      id: 1,
      title: "Patient-Centric Care",
      description: "We promote compassionate, ethical, and patient-focused cancer care across Odisha.",
      image: "https://img.freepik.com/free-photo/handsome-bearded-guy-posing-against-white-wall_273609-20597.jpg?t=st=1766048410~exp=1766052010~hmac=8f317fcf6ea25c2d3d5d8294880f994eebee7b249b93184772b4a9bf26429ebc&w=1060"
    },
    {
      id: 2,
      title: "Professional Growth & Network",
      description: "Connect with leading oncologists, attend conferences, and grow through knowledge sharing.",
      image: "https://img.freepik.com/free-photo/handsome-bearded-guy-posing-against-white-wall_273609-20597.jpg?t=st=1766048410~exp=1766052010~hmac=8f317fcf6ea25c2d3d5d8294880f994eebee7b249b93184772b4a9bf26429ebc&w=1060"
    },
    {
      id: 3,
      title: "Community Impact & Awareness",
      description: "Be part of cancer awareness drives, screening camps, and public health initiatives.",
      image: "https://img.freepik.com/free-photo/handsome-bearded-guy-posing-against-white-wall_273609-20597.jpg?t=st=1766048410~exp=1766052010~hmac=8f317fcf6ea25c2d3d5d8294880f994eebee7b249b93184772b4a9bf26429ebc&w=1060"
    }
  ];
  return (
    <div className="bg-linear-to-b from-slate-50 to-slate-100 py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-3xl font-bold text-[#326EAC] mb-4 sm:mb-6">
            Why Join OSOO?
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed px-4">
            Become part of a prestigious community of surgical oncologists committed to excellence in cancer care and treatment.
          </p>
        </motion.div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image Container */}
              <div className="h-48 sm:h-56 w-full overflow-hidden bg-gray-200">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content Container */}
              <div className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {card.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <Link
            className="text-lg font-semibold p-3 px-8 border rounded-lg shadow-md shadow-[#326EAC] text-[#326EAC] hover:bg-[#326EAC] hover:text-white transition-all duration-300 cursor-pointer"
          >
            Join Now
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default WhyJoinSection
