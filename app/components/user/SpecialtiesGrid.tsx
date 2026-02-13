"use client";

import { useRouter } from "next/navigation";
import {
  Heart,
  Brain,
  Bone,
  Eye,
  Baby,
  Stethoscope,
  Pill,
  Activity,
} from "lucide-react";

const specialties = [
  { name: "Cardiology", icon: Heart, color: "text-red-500", bg: "bg-red-50" },
  { name: "Neurology", icon: Brain, color: "text-purple-500", bg: "bg-purple-50" },
  { name: "Orthopedics", icon: Bone, color: "text-orange-500", bg: "bg-orange-50" },
  { name: "Ophthalmology", icon: Eye, color: "text-blue-500", bg: "bg-blue-50" },
  { name: "Pediatrics", icon: Baby, color: "text-pink-500", bg: "bg-pink-50" },
  { name: "General", icon: Stethoscope, color: "text-teal-500", bg: "bg-teal-50" },
  { name: "Dermatology", icon: Pill, color: "text-yellow-500", bg: "bg-yellow-50" },
  { name: "Pulmonology", icon: Activity, color: "text-green-500", bg: "bg-green-50" },
];

export default function SpecialtiesGrid() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {specialties.map((item) => (
        <div
          key={item.name}
          onClick={() =>
            router.push(`/user/doctors?speciality=${encodeURIComponent(item.name)}`)
          }
          className="
            group relative cursor-pointer
            rounded-3xl bg-white/80 backdrop-blur-md
            p-7 border border-slate-200/60
            shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)]
            hover:shadow-[0_25px_60px_-15px_rgba(59,130,246,0.35)]
            transition-all duration-300 hover:-translate-y-2
          "
        >
          <div
            className={`
              w-14 h-14 rounded-2xl flex items-center justify-center
              ${item.bg} group-hover:scale-110 transition
            `}
          >
            <item.icon className={item.color} size={26} />
          </div>

          <h3 className="mt-6 text-lg font-semibold text-slate-900">
            {item.name}
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Find doctors near you
          </p>

          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-blue-50/40 via-transparent to-violet-50/40" />
        </div>
      ))}
    </div>
  );
}
