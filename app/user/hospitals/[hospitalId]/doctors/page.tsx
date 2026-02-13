"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  IndianRupee,
  Venus,
  Mars,
  Stethoscope,
  Heart,
  Brain,
  Bone,
  Eye,
  Baby,
  Pill,
  Activity,
  Ear,
  Droplets,
  Calendar,
  CalendarDays,
} from "lucide-react";

/* ---------------- ICON MAP ---------------- */
const specialityIcons: Record<string, any> = {
  Cardiology: Heart,
  Neurology: Brain,
  Orthopedics: Bone,
  Ophthalmology: Eye,
  Pediatrics: Baby,
  Dermatology: Pill,
  Pulmonology: Activity,
  ENT: Ear,
  Gynecology: Droplets,
  default: Stethoscope,
};

type Doctor = {
  _id: string;
  name: string;
  speciality: string;
  gender?: "male" | "female";
  fee: number;
  todayAvailable: boolean;
  tomorrowAvailable: boolean;
};

export default function HospitalDoctors({
  params,
}: {
  params: { hospitalId: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const speciality = searchParams.get("speciality");

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
 


  useEffect(() => {
    if (!speciality) return;

    const loadDoctors = async () => {
      setLoading(true);

      const res = await fetch(
        `/api/admin/doctor/by-hospital?hospitalId=${params.hospitalId}&speciality=${speciality}`
      );
      const data = await res.json();

      const today = new Date().toISOString().split("T")[0];
      const tmr = new Date();
      tmr.setDate(tmr.getDate() + 1);
      const tomorrow = tmr.toISOString().split("T")[0];

      const finalDoctors: Doctor[] = [];

      for (const doc of data.doctors || []) {
        const availRes = await fetch(
          `/api/admin/availability?doctorId=${doc._id}`
        );
        const availData = await availRes.json();

        const todayAvailable = availData.availability?.some(
          (a: any) => a.date === today && a.available
        );

        const tomorrowAvailable = availData.availability?.some(
          (a: any) => a.date === tomorrow && a.available
        );

        if (!todayAvailable && !tomorrowAvailable) continue;

        finalDoctors.push({
          ...doc,
          todayAvailable,
          tomorrowAvailable,
        });
      }

      setDoctors(finalDoctors);
      setLoading(false);
    };

    loadDoctors();
  }, [params.hospitalId, speciality]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 rounded-3xl bg-slate-200 animate-pulse" />
        ))}
      </section>
    );
  }

  /* ---------------- EMPTY ---------------- */
  if (!doctors.length) {
    return (
      <p className="text-center mt-24 text-slate-600">
        No doctors available for this speciality
      </p>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
    {/* HEADER */}
<div className="relative text-center mb-24">

  {/* Background Glow */}
  <div className="absolute inset-0 -z-10 flex justify-center">
    <div className="w-[500px] h-[200px] bg-emerald-200/40 blur-3xl rounded-full" />
  </div>

  {/* Badge */}
  <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold tracking-wide shadow-sm border border-emerald-200">
     Verified Specialists
  </div>

  {/* Main Title */}
  <h1 className="mt-6 text-5xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
    Available Doctors
  </h1>

  {/* Subtitle */}
  <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
    Browse experienced specialists and check their real-time availability
    for <span className="font-semibold text-slate-800">today & tomorrow</span>.
  </p>

  {/* Decorative Divider */}
  <div className="mt-10 flex justify-center">
    <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" />
  </div>
</div>


      {/* GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doc, index) => {
          const Icon =
            specialityIcons[doc.speciality] ||
            specialityIcons.default;

          const canBook =
            doc.todayAvailable || doc.tomorrowAvailable;

          return (
            <motion.div
  key={doc._id}
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.06 }}
  whileHover={{ y: -6 }}
  className="group relative rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
>
  {/* Top Accent Line */}
  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-600" />

  <div className="p-7">
    {/* HEADER */}
    <div className="flex justify-between items-start">
      <div className="flex gap-4 items-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center shadow-sm">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition">
            {doc.name}
          </h2>
          <p className="text-sm text-slate-500">
            {doc.speciality}
          </p>
        </div>
      </div>
    </div>

    {/* FEE */}
    <div className="mt-6 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <IndianRupee className="w-4 h-4 text-emerald-600" />
        <span className="font-semibold text-slate-800 text-base">
          ₹{doc.fee}
        </span>
        <span>Consultation</span>
      </div>

      {/* Availability Pill */}
      <span
        className={`text-xs px-3 py-1 rounded-full font-semibold ${
          canBook
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {canBook ? "Available" : "Fully Booked"}
      </span>
    </div>

    {/* Divider */}
    <div className="my-6 border-t border-slate-100" />

    {/* AVAILABILITY DETAIL */}
    <div className="flex justify-between text-sm">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-emerald-500" />
        <span className={doc.todayAvailable ? "text-emerald-700 font-medium" : "text-slate-400"}>
          Today
        </span>
      </div>

      <div className="flex items-center gap-2">
        <CalendarDays className="w-4 h-4 text-blue-500" />
        <span className={doc.tomorrowAvailable ? "text-blue-700 font-medium" : "text-slate-400"}>
          Tomorrow
        </span>
      </div>
    </div>
  </div>

  {/* CTA */}
  <div className="px-7 pb-7">
    <button
      disabled={!canBook}
      onClick={() => router.push(`/user/booking/${doc._id}`)}
      className={`w-full rounded-xl py-3 font-semibold transition-all duration-300 ${
        canBook
          ? "bg-gradient-to-r from-emerald-600 to-emerald-600 text-white hover:shadow-lg hover:scale-[1.02]"
          : "bg-slate-100 text-slate-400 cursor-not-allowed"
      }`}
    >
      Book Appointment
    </button>
  </div>
</motion.div>

          );
        })}
      </div>
    </section>
  );
}
