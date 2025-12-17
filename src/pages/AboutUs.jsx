import React from "react";
import { FaBullseye, FaEye, FaRegCalendarAlt } from "react-icons/fa";
import { GiStethoscope } from "react-icons/gi";
import { RiGroupLine } from "react-icons/ri";
import { MdOutlineHistoryEdu, MdVerified } from "react-icons/md";

/**
 * AboutUs component
 *
 * Replace image URLs with your assets or local imports as needed.
 */
const councilMembers = [
  { id: 1, name: "Dr. Rajesh Kumar Panda", title: "President", sub: "MS, MCh (Surg. Onco.)", img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=800&q=60" },
  { id: 2, name: "Dr. Sanghamitra Mohanty", title: "Vice President", sub: "MS, MCh (Surg. Onco.)", img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=800&q=60" },
  { id: 3, name: "Dr. Pradeep Kumar Sahoo", title: "Secretary", sub: "MS, MCh (Surg. Onco.)", img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=800&q=60" },
  { id: 4, name: "Dr. Nandita Dash", title: "Treasurer", sub: "MS, MCh (Surg. Onco.)", img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=800&q=60" },
  { id: 5, name: "Dr. Ashok Kumar Mishra", title: "Executive Member", sub: "MS, MCh (Surg. Onco.)", img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=800&q=60" },
  { id: 6, name: "Dr. Swati Behera", title: "Executive Member", sub: "MS, MCh (Surg. Onco.)", img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=800&q=60" },
];

const timeline = [
  { year: "2008", title: "Foundation", text: "OSOO was established by a group of dedicated surgical oncologists with a vision to improve cancer care in Odisha." },
  { year: "2012", title: "First Annual Conference", text: "Launched our flagship annual conference, bringing together surgical oncologists from across the state and beyond." },
  { year: "2018", title: "Expansion of Programs", text: "Introduced specialized training workshops, research grants, and community outreach programs." },
  { year: "2023", title: "Digital Transformation", text: "Launched online platforms for member collaboration, webinars, and virtual conferences to enhance accessibility." },
];

export default function AboutUs() {
  return (
    <div className="text-slate-700">
      {/* Hero */}
      <header className="relative">
        <div
          className="h-56 md:h-72 lg:h-96 bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1580281657521-6b9a7b5d0a3b?w=1600&q=60&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-blue-800/75"></div>
          <div className="relative max-w-6xl mx-auto px-6 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl md:text-4xl font-semibold text-white">About OSOO</h1>
            <p className="mt-2 text-sm md:text-base text-white/80">Committed to excellence in surgical oncology since 2008</p>
          </div>
        </div>
      </header>

      {/* Who We Are */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 text-center">
          <h2 className="text-xl md:text-2xl text-[#0b61a8] font-semibold mb-3">Who We Are</h2>
          <p className="text-sm md:text-base text-slate-500 max-w-3xl mx-auto leading-7">
            The Odisha Society Of Oncology (OSOO) is a premier professional organization dedicated to advancing the practice of surgical oncology throughout the state of Odisha. Founded in 2008, we have grown into a vibrant community of surgeons, residents, and allied healthcare professionals.
          </p>
          <p className="text-sm md:text-base text-slate-500 max-w-3xl mx-auto leading-7 mt-4">
            Our members are at the forefront of cancer treatment, bringing world-class surgical expertise to patients across Odisha. Through education, research, and collaboration, we work tirelessly to improve outcomes for cancer patients and advance the field.
          </p>
        </div>
      </section>

      {/* Mission / Vision Cards */}
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-[#0b61a8] flex items-center justify-center text-white text-xl">
                <FaBullseye />
              </div>
              <div>
                <h3 className="text-[#0b61a8] font-semibold">Our Mission</h3>
                <p className="mt-2 text-sm text-slate-600">
                  To promote excellence in the practice of surgical oncology through continuing medical education, research, and professional development. We strive to create a collaborative platform where surgical oncologists can share knowledge and ultimately improve patient care across Odisha.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-[#0b61a8] flex items-center justify-center text-white text-xl">
                <FaEye />
              </div>
              <div>
                <h3 className="text-[#0b61a8] font-semibold">Our Vision</h3>
                <p className="mt-2 text-sm text-slate-600">
                  To be the leading professional body for surgical oncologists in Eastern India, recognized for clinical excellence, innovative research, and compassionate patient care. We envision a future where every cancer patient in Odisha has access to high quality surgical oncology services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h3 className="text-center text-[#0b61a8] text-xl font-semibold mb-8">Our Objectives</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="mx-auto w-14 h-14 rounded-full bg-[#0b61a8] flex items-center justify-center text-white text-lg mb-4">
                <GiStethoscope />
              </div>
              <h4 className="font-semibold mb-2">Professional Development</h4>
              <p className="text-sm text-slate-500">Provide continuous learning opportunities through workshops, conferences, and training programs for surgical oncologists.</p>
            </div>

            <div className="p-6">
              <div className="mx-auto w-14 h-14 rounded-full bg-[#0b61a8] flex items-center justify-center text-white text-lg mb-4">
                <RiGroupLine />
              </div>
              <h4 className="font-semibold mb-2">Research & Innovation</h4>
              <p className="text-sm text-slate-500">Encourage and facilitate research in surgical oncology to advance treatment methods and patient outcomes.</p>
            </div>

            <div className="p-6">
              <div className="mx-auto w-14 h-14 rounded-full bg-[#0b61a8] flex items-center justify-center text-white text-lg mb-4">
                <FaBullseye />
              </div>
              <h4 className="font-semibold mb-2">Patient Care Excellence</h4>
              <p className="text-sm text-slate-500">Promote best practices and quality standards in surgical oncology to ensure optimal patient care throughout Odisha.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Council Members */}
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h3 className="text-center text-[#0b61a8] text-xl font-semibold mb-2">Council Members</h3>
          <p className="text-center text-slate-500 text-sm mb-8">Leadership guiding OSOO towards excellence</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {councilMembers.map((m) => (
                <div class="max-w-xs mx-auto bg-white rounded-3xl shadow-md p-4">
                    <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2"
                        alt="Profile"
                        class="w-full h-52 object-cover rounded-2xl"
                    />

                    <div class="mt-4">
                        <div class="flex items-center gap-2">
                        <h2 class="text-lg font-semibold">Sophie Bennett</h2>
                        <MdVerified className="text-green-600"/>
                        </div>

                        <p class="text-sm text-gray-500 mt-1">
                        Product Designer who focuses on simplicity & usability.
                        </p>

                        <div class="flex items-center justify-center mt-4 text-gray-600 text-sm">
                        <button class="px-4 py-1 bg-gray-100 rounded-full font-medium text-sm">
                            See Profile
                        </button>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* History / Timeline */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h3 className="text-center text-[#0b61a8] text-xl font-semibold mb-8">Our History</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <ul className="space-y-8">
                {timeline.map((t, idx) => (
                  <li key={t.year} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-[#0b61a8] text-white flex items-center justify-center">{t.year}</div>
                      {idx !== timeline.length - 1 && <div className="w-px bg-slate-200 h-full mt-2"></div>}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{t.title}</h4>
                      <p className="text-xs text-slate-500 mt-2">{t.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col justify-center items-center text-center px-6">
              <MdOutlineHistoryEdu className="text-6xl text-[#0b61a8] mb-4" />
              <p className="text-sm text-slate-500 max-w-md">
                Over the years, OSOO has grown from a small group of committed surgeons into a strong professional body that advocates for excellence in surgical oncology across Odisha.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
