import React from "react";
import { Link } from "react-router-dom";

const events = [
  {
    id: 1,
    label: "5th Indo Oncology Summit – Bhubaneswar (Jan 17-18, 2026)",
    href: "https://indooncologysummit.com", // major oncology conference in Odisha :contentReference[oaicite:0]{index=0}
  },
  {
    id: 2,
    label: "6th I-OSICON Immuno-Oncology Conference – Bhubaneswar (Jan 31-Feb 2, 2025)",
    href: "https://immunooncologyindia.com", // Immuno-Oncology Society of India annual meeting :contentReference[oaicite:1]{index=1}
  },
  {
    id: 3,
    label: "9th Annual AROI Odisha Chapter Conference – Puri (Feb 22-23, 2025)",
    href: "https://www.aroi.org", // Radiation oncology state chapter meeting in Odisha :contentReference[oaicite:2]{index=2}
  },
  {
    id: 4,
    label: "IASO Midterm Annual Conference – Puri, Odisha (Feb 8-10, 2025)",
    href: "https://OSOO.in", // Association of Surgical Oncologists of Odisha event :contentReference[oaicite:3]{index=3}
  },
  {
    id: 5,
    label: "Conquer HPV & Cancer Conclave – Bhubaneswar (HPV & cervical cancer awareness)",
    href: "https://orissadiary.com", // public health conclave on HPV & cancer in Odisha :contentReference[oaicite:4]{index=4}
  }
];


export default function MarqueeEvents() {
  return (
    <div className="w-full bg-slate-50 py-2">
      <div className="relative overflow-hidden" role="region" aria-label="Event notifications">
        <div className="flex animate-marquee whitespace-nowrap">
          {/* First set */}
          <div className="flex gap-6 items-center">
            {events.map((ev) => (
              <Link
                key={`a-${ev.id}`}
                to={ev.href}
                className="inline-block px-3 py-2 rounded-md text-sm md:text-base lg:text-lg font-medium hover:underline focus:outline-none"
                tabIndex={0}
              >
                {ev.label}
              </Link>
            ))}
          </div>
          
          {/* Duplicate set for loop */}
          <div className="flex gap-6 items-center ml-6">
            {events.map((ev) => (
              <Link
                key={`b-${ev.id}`}
                to={ev.href}
                className="inline-block px-3 py-2 rounded-md text-sm md:text-base lg:text-lg font-medium hover:underline focus:outline-none"
                tabIndex={0}
              >
                {ev.label}
              </Link>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          .animate-marquee {
            animation: marquee 15s linear infinite;
          }
          
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </div>
  );
}
