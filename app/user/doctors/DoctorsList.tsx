"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Building2,
  ArrowRight,
  Stethoscope,
} from "lucide-react";
import { motion } from "framer-motion";

/* ---------------- TYPES ---------------- */
type Hospital = {
  _id: string;
  name: string;
  email: string;
  location?: string;
  image?: string;        // ✅ hospital image
  doctorCount?: number;
};

export default function DoctorsList({
  speciality,
  location,
}: {
  speciality?: string;
  location?: string;
}) {
  const router = useRouter();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- GUARD ---------------- */
  if (!speciality) {
    return (
      <section className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <Stethoscope className="w-14 h-14 text-blue-500 mb-4" />
        <p className="text-xl font-semibold text-slate-700">
          Please select a specialty to continue
        </p>
      </section>
    );
  }

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams();
    params.append("speciality", speciality);
    if (location) params.append("location", location);

    fetch(`/api/hospital/search?${params.toString()}`)
      .then((res) => res.json())
      .then((res) => {
        setHospitals(res.hospitals || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [speciality, location]);

  /* ---------------- SKELETON ---------------- */
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[340px] rounded-3xl bg-slate-200 animate-pulse"
          />
        ))}
      </section>
    );
  }

  /* ---------------- EMPTY ---------------- */
  if (!hospitals.length) {
    return (
      <section className="text-center py-32">
        <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-700">
          No hospitals found
        </h2>
        <p className="text-slate-500 mt-2">
          We couldn’t find any hospitals for <b>{speciality}</b>
          {location && ` in ${location}`}
        </p>
      </section>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      {/* ---------- HEADER ---------- */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
       <h1 className="
  text-4xl md:text-6xl font-extrabold
  tracking-tight
  text-slate-900
">
  Hospitals for{" "}
  <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
    {speciality}
  </span>
</h1>


        {location && (
          <p className="mt-4 text-slate-500 flex justify-center items-center gap-2">
            <MapPin className="w-4 h-4" />
            {location}
          </p>
        )}
      </motion.div>

      {/* ---------- GRID ---------- */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {hospitals.map((hospital, index) => (
          <motion.div
            key={hospital._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -8 }}
            className="
              group relative overflow-hidden
              rounded-3xl bg-white/90 backdrop-blur
              border border-slate-200
              shadow-lg hover:shadow-2xl
              transition
            "
          >
            {/* ---------- IMAGE ---------- */}
            <div className="relative h-40 overflow-hidden bg-slate-100">
              <img
                src={hospital.image || "/hospital-placeholder.png"}
                alt={hospital.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* ---------- CONTENT ---------- */}
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-900">
                {hospital.name}
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {hospital.email}
              </p>

              {hospital.location && (
                <p className="mt-3 inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-green-200 text-black-600">
                  <MapPin className="w-3 h-3" />
                  {hospital.location}
                </p>
              )}

              {/* ---------- STATS ---------- */}
              <div className="mt-5 flex items-center gap-2 text-slate-700">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">
                  {hospital.doctorCount ?? 0}
                </span>
                <span className="text-sm text-slate-500">
                  Doctors available
                </span>
              </div>

              {/* ---------- CTA ---------- */}
              <button
                onClick={() =>
                  router.push(
                    `/user/hospitals/${hospital._id}/doctors?speciality=${encodeURIComponent(
                      speciality
                    )}`
                  )
                }
                className="
                  mt-6 w-full flex items-center justify-center gap-2
                  rounded-xl bg-blue-600 text-white
                  py-3 font-semibold
                  hover:bg-blue-700 transition
                "
              >
                View Doctors
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
