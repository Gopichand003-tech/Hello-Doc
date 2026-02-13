"use client";

import SpecialtiesGrid from "./SpecialtiesGrid";
import Link from "next/link";
import {motion} from "framer-motion";

export default function DoctorsPage() {
  return (
    <section className="relative bg-gradient-to-b from-white to-slate-50 pt-32">
      <div className="max-w-7xl mx-auto px-6 pb-24">

 {/* HEADER */}
<div className="text-center mb-24">
  <span className="
    inline-flex items-center gap-2
    mb-6 px-5 py-2
    rounded-full
    bg-gradient-to-r from-blue-50 to-indigo-50
    text-blue-700 text-sm font-semibold
    border border-blue-100
  ">
    <span className="w-2 h-2 rounded-full bg-blue-500" />
    Medical Specialties
  </span>

  <h1 className="
    text-4xl md:text-6xl
    font-extrabold
    tracking-tight
    text-slate-900
  ">
    Find Care for{" "}
    <span className="bg-gradient-to-r from-blue-600 to-indigo-400 bg-clip-text text-transparent">
      Every Need
    </span>
  </h1>

  <p className="
    mt-8
    text-lg md:text-xl
    text-slate-600
    max-w-3xl
    mx-auto
    leading-relaxed
  ">
    Discover a wide range of medical specialties and connect with
    trusted doctors committed to your long-term health and wellbeing.
  </p>
</div>


        {/* GRID */}
        <SpecialtiesGrid />

        {/* ALL DOCTORS BUTTON */}
        <div className="mt-20 flex justify-center">
          <Link
            href="/extradoctors"
            className="
              inline-flex items-center gap-2
              bg-blue-600 hover:bg-blue-700
              text-white font-semibold
              px-10 py-4 rounded-full
              shadow-lg hover:shadow-blue-500/40
              transition
            "
          >
            View All Doctors
          </Link>
        </div>
      </div>
    </section>
  );
}
