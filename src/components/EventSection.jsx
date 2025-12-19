import React, { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import { Link } from "react-router-dom";

const eventsData = [
  {
    id: 1,
    title: "Research Symposium",
    date: "26 Dec 2025",
    location: "Bhubaneswar, Odisha",
    desc: "Presentation of latest research findings in surgical oncology. Presentation of latest research findings in surgical oncology. Presentation of latest research findings in surgical oncology. Presentation of latest research findings in surgical oncology.",
    img: "https://res.cloudinary.com/dxvovx7s2/image/upload/v1766039688/Screenshot_2025-12-18_120310_zso4hd.png",
  },
  {
    id: 2,
    title: "Research Symposium",
    date: "30 Dec 2025",
    location: "Bhubaneswar, Odisha",
    desc: "Presentation of latest research findings in surgical oncology. Presentation of latest research findings in surgical oncology. Presentation of latest research findings in surgical oncology. Presentation of latest research findings in surgical oncology.",
    img: "https://res.cloudinary.com/dxvovx7s2/image/upload/v1766039687/Screenshot_2025-12-18_120415_vk4qgg.png",
  },
  {
    id: 3,
    title: "Research Symposium",
    date: "01 Jan 2025",
    location: "Bhubaneswar, Odisha",
    desc: "Presentation of latest research findings in surgical oncology. Presentation of latest research findings in surgical oncology. Presentation of latest research findings in surgical oncology. Presentation of latest research findings in surgical oncology.",
    img: "https://res.cloudinary.com/dxvovx7s2/image/upload/v1766039687/Screenshot_2025-12-18_120428_tepinv.png",
  },
  {
    id: 4,
    title: "Research Symposium",
    date: "12 Jan 2025",
    location: "Bhubaneswar, Odisha",
    desc: "Presentation of latest research findings in surgical oncology. Presentation of latest research findings in surgical oncology. Presentation of latest research findings in surgical oncology. Presentation of latest research findings in surgical oncology.",
    img: "https://res.cloudinary.com/dxvovx7s2/image/upload/v1766039687/Screenshot_2025-12-18_120158_zgfkqf.png",
  }
];

export default function EventSection() {
  const [upEvt, setUpEvt] = useState(eventsData);
  return (
    <div className="py-12 px-10 bg-gray-50">
      <h2 className="font-bold text-3xl text-[#326EAC]">Upcoming Events</h2>
      <p className="text-lg text-[#255280] font-semibold">Join us in our upcoming initiatives and events</p>
      <div className="flex gap-5 mt-4">
        <div className="w-1/2 h-120 px-4">
          <img src={upEvt[0].img} alt="Upcoming event-1" className="py-2 w-full h-3/4 rounded-2xl shadow-lg shadow-[#87b7e7]" />
          <div className="flex items-center justify-between mt-3">
            <div>
              <h3 className="text-[#326EAC] font-bold text-xl">{upEvt[0].title}</h3>
              <p className="flex items-center text-sm text-gray-600"><FaLocationDot className="text-[#326EAC]" /> {upEvt[0].location}</p>
            </div>
            <div className="flex items-center justify-center gap-1 border-l-4 border-[#326EAC] bg-[#93d0db] font-semibold text-[#245d97] rounded-sm px-2">
              <SlCalender /> {upEvt[0].date}
            </div>
          </div>
          <p className="mt-3 text-justify">{upEvt[0].desc}</p>
        </div>
        <div className="w-1/2 flex flex-col gap-5 px-4 py-2">
          <div className="w-full flex gap-5">
            <img src={upEvt[1].img} alt={upEvt[1].title} className="max-w-50 h-35 rounded-lg shadow-lg shadow-[#87b7e7]"/>
            <div>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <h3 className="text-[#326EAC] font-bold text-xl">{upEvt[1].title}</h3>
                  <p className="flex items-center text-sm text-gray-600"><FaLocationDot className="text-[#326EAC]" /> {upEvt[1].location}</p>
                </div>
                <div className="flex items-center justify-center gap-1 border-l-4 border-[#326EAC] bg-[#93d0db] font-semibold text-[#245d97] text-sm rounded-sm px-2">
                  <SlCalender /> {upEvt[1].date}
                </div>
              </div>
              <p className="text-xs text-justify mt-2">{upEvt[1].desc}</p>
            </div>
          </div>
          <div className="w-full flex gap-5">
            <img src={upEvt[2].img} alt={upEvt[2].title} className="max-w-50 h-35 rounded-lg shadow-lg shadow-[#87b7e7]"/>
            <div>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <h3 className="text-[#326EAC] font-bold text-xl">{upEvt[2].title}</h3>
                  <p className="flex items-center text-sm text-gray-600"><FaLocationDot className="text-[#326EAC]" /> {upEvt[2].location}</p>
                </div>
                <div className="flex items-center justify-center gap-1 border-l-4 border-[#326EAC] bg-[#93d0db] font-semibold text-[#245d97] text-sm rounded-sm px-2">
                  <SlCalender /> {upEvt[2].date}
                </div>
              </div>
              <p className="text-xs text-justify mt-2">{upEvt[2].desc}</p>
            </div>
          </div>
          <div className="w-full flex gap-5">
            <img src={upEvt[3].img} alt={upEvt[3].title} className="max-w-50 h-35 rounded-lg shadow-lg shadow-[#87b7e7]"/>
            <div>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <h3 className="text-[#326EAC] font-bold text-xl">{upEvt[3].title}</h3>
                  <p className="flex items-center text-sm text-gray-600"><FaLocationDot className="text-[#326EAC]" /> {upEvt[3].location}</p>
                </div>
                <div className="flex items-center justify-center gap-1 border-l-4 border-[#326EAC] bg-[#93d0db] font-semibold text-[#245d97] text-sm rounded-sm px-2">
                  <SlCalender /> {upEvt[3].date}
                </div>
              </div>
              <p className="text-xs text-justify mt-2">{upEvt[3].desc}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full text-center mt-15 mb-5">
        <Link className='text-lg font-semibold p-3 px-8 border rounded-lg shadow-md shadow-[#326EAC] text-[#326EAC] hover:bg-[#326EAC] hover:text-white transition-all duration-300 cursor-pointer'>Show More</Link>
      </div>
    </div>
  );
}
