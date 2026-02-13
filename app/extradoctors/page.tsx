"use client";

import {
   Heart,
  Brain,
  Bone,
  Eye,
  Baby,
  Stethoscope,
  Pill,
  Activity,
  Ear,
  Droplets,
  ShieldPlus,
  Syringe,
  Smile,
  Flame,
  Scan,
  Dna,
  HeartPulse,
  Bandage,
  Microscope,
  FlaskConical,
  ArrowLeft,
  ArrowRight,

} from "lucide-react";
import { useRouter } from "next/navigation";

const specialties = [
  { name: "Cardiology", doctors: 45, icon: Heart, color: "text-red-500", bg: "bg-red-50" },
  { name: "Neurology", doctors: 32, icon: Brain, color: "text-purple-500", bg: "bg-purple-50" },
  { name: "Orthopedics", doctors: 28, icon: Bone, color: "text-orange-500", bg: "bg-orange-50" },
  { name: "Ophthalmology", doctors: 24, icon: Eye, color: "text-blue-500", bg: "bg-blue-50" },
  { name: "Pediatrics", doctors: 38, icon: Baby, color: "text-pink-500", bg: "bg-pink-50" },
  { name: "General Medicine", doctors: 65, icon: Stethoscope, color: "text-teal-500", bg: "bg-teal-50" },
  { name: "Dermatology", doctors: 22, icon: Pill, color: "text-yellow-500", bg: "bg-yellow-50" },
  { name: "Pulmonology", doctors: 18, icon: Activity, color: "text-green-500", bg: "bg-green-50" },
  { name: "ENT", doctors: 20, icon: Ear, color: "text-indigo-500", bg: "bg-indigo-50" },
  { name: "Gynecology", doctors: 27, icon: Droplets, color: "text-rose-500", bg: "bg-rose-50" },
  { name: "Immunology", doctors: 14, icon: ShieldPlus, color: "text-emerald-500", bg: "bg-emerald-50" },
  { name: "Anesthesiology", doctors: 12, icon: Syringe, color: "text-sky-500", bg: "bg-sky-50" },

  // 🔹 Newly added
  { name: "Dentistry", doctors: 30, icon: Smile, color: "text-cyan-500", bg: "bg-cyan-50" },
  { name: "Gastroenterology", doctors: 19, icon: Flame, color: "text-amber-500", bg: "bg-amber-50" },
  { name: "Radiology", doctors: 16, icon: Scan, color: "text-violet-500", bg: "bg-violet-50" },
  { name: "Genetics", doctors: 8, icon: Dna, color: "text-fuchsia-500", bg: "bg-fuchsia-50" },
  { name: "Emergency Medicine", doctors: 26, icon: HeartPulse, color: "text-rose-600", bg: "bg-rose-100" },
  { name: "Plastic Surgery", doctors: 11, icon: Bandage, color: "text-neutral-600", bg: "bg-blue-100" },
  { name: "Pathology", doctors: 10, icon: Microscope, color: "text-stone-600", bg: "bg-green-100" },
  { name: "Endocrinology", doctors: 17, icon: FlaskConical, color: "text-lime-600", bg: "bg-lime-100" },
];

export default function DoctorsPage() {
  const router = useRouter();

  return (
<section className="relative min-h-screen bg-[#f8fafc] pt-28 pb-32">
  {/* BACKDROP */}
  <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-white to-slate-100 pointer-events-none" />

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6">

    {/* BACK */}
    <div className="mb-10">
      <button
        onClick={() => router.back()}
        className="
          inline-flex items-center gap-2
          text-sm font-medium
          text-white hover:text-slate-900
          bg-blue-500
          px-4 py-2 rounded-full
          border border-slate-200
          shadow-sm
          transition-all
          hover:gap-3
        "
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
    </div>

    {/* HEADER */}
    <div className="max-w-3xl mx-auto text-center mb-24 -translate-y-10">
      <span className="
        inline-flex items-center gap-2
        px-5 py-2 mb-6
        text-sm font-semibold
        rounded-full
        bg-blue-100 text-blue-700
        border border-blue-200
      ">
        🩺 Medical Specialties
      </span>

      <h1 className="
        text-3xl sm:text-4xl md:text-5xl
        font-extrabold
        text-slate-900
        tracking-tight
      ">
        Choose the Right Care
      </h1>

      <p className="
        mt-6
        text-base sm:text-lg
        text-slate-600
        leading-relaxed
      ">
        Select a specialty to explore hospitals and doctors
        dedicated to your health and long-term wellbeing.
      </p>
    </div>

    {/* GRID */}
    <div className="
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-4
      gap-x-6 gap-y-10 -translate-y-12
    ">
      {specialties.map((item) => (
        <div
          key={item.name}
          onClick={() =>
            router.push(
              `/user/doctors?speciality=${encodeURIComponent(item.name)}`
            )
          }
          className="
            group cursor-pointer
            rounded-3xl
            bg-white
            border border-slate-200
            p-6
            shadow-[0_12px_30px_-15px_rgba(0,0,0,0.15)]
            transition-all duration-300
            hover:-translate-y-2
            hover:shadow-[0_30px_70px_-20px_rgba(59,130,246,0.35)]
          "
        >
          {/* ICON */}
          <div className="
            w-14 h-14
            rounded-2xl
            flex items-center justify-center
            mb-5
            bg-slate-50
            ring-1 ring-slate-200
            transition-transform
            group-hover:scale-110
          ">
            <item.icon
              className={`${item.color}`}
              size={34}
            />
          </div>

          {/* NAME */}
          <h3 className="text-lg font-semibold text-slate-900">
            {item.name}
          </h3>

          {/* META */}
          <p className="mt-2 text-sm text-slate-500">
            Doctors available
          </p>

          {/* CTA */}
          <div className="
            mt-6
            text-sm font-medium
            text-blue-600
            flex items-center gap-1
            opacity-0
            group-hover:opacity-100
            transition
          ">
            View hospitals
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

  );
}
