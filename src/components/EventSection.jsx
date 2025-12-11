import React, { useEffect, useRef, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";

const eventsData = [
  {
    id: 1,
    title: "Research Symposium",
    date: "June 20, 2025",
    location: "SCB Medical College, Cuttack",
    desc: "Presentation of latest research findings in surgical oncology.",
    img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=60",
  },
  {
    id: 2,
    title: "Annual ASOO Conference 2025",
    date: "March 15-17, 2025",
    location: "Hotel Mayfair, Bhubaneswar",
    desc: "Join us for our flagship annual conference featuring keynote speakers and workshops.",
    img: "https://images.unsplash.com/photo-1515165562835-c6d64f1b81b5?w=1200&q=60",
  },
  {
    id: 3,
    title: "Minimally Invasive Surgery Workshop",
    date: "April 10, 2025",
    location: "AHRCC, Cuttack",
    desc: "Hands-on training in the latest minimally invasive surgical techniques.",
    img: "https://images.unsplash.com/photo-1581091012184-7b2f3b5b8b93?w=1200&q=60",
  },
  {
    id: 4,
    title: "Cancer Registry Training",
    date: "July 04, 2025",
    location: "Cuttack Medical Institute",
    desc: "Training on best practices for tumor registry and data collection.",
    img: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&q=60",
  },
  {
    id: 5,
    title: "Community Outreach Program",
    date: "August 22, 2025",
    location: "Various Locations, Odisha",
    desc: "Screening and awareness camps across the state.",
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=60",
  },
];

export default function EventSection() {
  // index represents the "page" of slides (0 .. maxIndex)
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoRef = useRef(null);

  // Visible cards count depends on width: we'll treat md+ as 3, <md as 1
  const [visibleCount, setVisibleCount] = useState(getVisibleCount());

  function getVisibleCount() {
    // match Tailwind breakpoints default: md ~ 768px
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768 ? 3 : 1;
    }
    return 3;
  }

  useEffect(() => {
    const onResize = () => {
      setVisibleCount(getVisibleCount());
      // reset index to avoid out-of-range when changing visibleCount
      setIndex(0);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const totalPages = Math.ceil(eventsData.length / visibleCount);
  const slideDuration = 5000; // 5s

  // Auto slide with pause-on-hover
  useEffect(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    if (!isHovered) {
      autoRef.current = setInterval(() => {
        setIndex((prev) => {
          const next = prev + 1;
          return next >= totalPages ? 0 : next;
        });
      }, slideDuration);
    }
    return () => clearInterval(autoRef.current);
  }, [isHovered, totalPages, visibleCount]);

  // manual navigation
  const prev = () => {
    setIndex((prevIdx) => {
      const next = prevIdx - 1;
      return next < 0 ? totalPages - 1 : next;
    });
  };
  const next = () => {
    setIndex((prevIdx) => {
      const next = prevIdx + 1;
      return next >= totalPages ? 0 : next;
    });
  };

  // calculate translate percent: each page moves by 100% of the container width
  const translatePercent = -(index * 100);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0b61a8]">Upcoming Events</h2>
          <p className="text-sm text-gray-500 mt-2">Join us for our latest conferences, workshops, and educational programs</p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Arrow Left (only visible on md and up as in the image) */}
          <button
            onClick={prev}
            aria-label="Previous"
            className="hidden md:flex items-center justify-center absolute left-[-18px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md z-10 hover:bg-gray-100 transition"
          >
            <HiChevronLeft className="text-lg text-gray-600" />
          </button>

          {/* Arrow Right */}
          <button
            onClick={next}
            aria-label="Next"
            className="hidden md:flex items-center justify-center absolute right-[-18px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md z-10 hover:bg-gray-100 transition"
          >
            <HiChevronRight className="text-lg text-gray-600" />
          </button>

          {/* Slider viewport */}
          <div className="overflow-hidden">
            {/* Slider track */}
            <div
              className="flex gap-6 transition-transform duration-700 ease-in-out"
              style={{
                width: `${(eventsData.length / visibleCount) * 100}%`,
                transform: `translateX(${translatePercent}%)`,
              }}
            >
              {/* Each page group must be the size of visibleCount cards width. We'll render each card at width = (100 / visibleCount / totalPages)% of track, but simpler: set flex-basis for card */}
              {eventsData.map((evt) => (
                <div
                  key={evt.id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden shrink-0`}
                  style={{
                    // card width: viewport / visibleCount
                    width: `${100 / visibleCount}%`,
                  }}
                >
                  <div className="h-40 md:h-44 overflow-hidden">
                    <img
                      src={evt.img}
                      alt={evt.title}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="text-blue-600 font-medium text-lg">{evt.title}</h3>

                    <div className="mt-3 text-sm text-gray-500 space-y-2">
                      <div className="flex items-center gap-2">
                        <FaRegCalendarAlt className="text-[16px]" />
                        <span>{evt.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <HiOutlineLocationMarker className="text-[18px]" />
                        <span>{evt.location}</span>
                      </div>

                      <p className="mt-3 text-gray-600 text-sm">{evt.desc}</p>
                    </div>

                    <div className="mt-4">
                      <a
                        href="#"
                        className="text-blue-600 inline-flex items-center gap-2 text-sm font-medium"
                      >
                        Learn More
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Small-screen arrows (overlayed on sides) */}
          <div className="md:hidden absolute inset-0 flex items-center justify-between px-2">
            <button
              onClick={prev}
              className="p-2 bg-white rounded-full shadow-md"
              aria-label="prev mobile"
            >
              <HiChevronLeft className="text-lg text-gray-600" />
            </button>
            <button
              onClick={next}
              className="p-2 bg-white rounded-full shadow-md"
              aria-label="next mobile"
            >
              <HiChevronRight className="text-lg text-gray-600" />
            </button>
          </div>
        </div>

        {/* pagination dots */}
        <div className="flex items-center justify-center gap-3 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full ${i === index ? "bg-blue-600" : "bg-gray-300"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
