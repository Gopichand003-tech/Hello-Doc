"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, IndianRupee, Activity } from "lucide-react";
import SlotManager from "./SlotManager";

export default function DoctorList({ refreshKey }: any) {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const firstLoad = useRef(true);

  /* ================= FETCH ================= */
  const fetchDoctors = async () => {
    try {
      if (!firstLoad.current) setRefreshing(true);

      const res = await fetch("/api/admin/doctor/list");
      const data = await res.json();

      setDoctors(data.doctors || []);
    } catch (err) {
      console.error("Failed to fetch doctors", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      firstLoad.current = false;
    }
  };

  /* ================= EFFECT ================= */
  useEffect(() => {
    fetchDoctors();
  }, [refreshKey]);

  useEffect(() => {
    const interval = setInterval(fetchDoctors, 10000); // 🔁 real-time feel
    return () => clearInterval(interval);
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl bg-slate-200"
          />
        ))}
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (doctors.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-10 text-center">
        <p className="text-slate-600 font-medium">
          No doctors added yet
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Add your first doctor to start accepting bookings
        </p>
      </div>
    );
  }

  /* ================= LIST ================= */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Total Doctors:{" "}
          <span className="font-semibold text-slate-800">
            {doctors.length}
          </span>
        </p>

        <div className="flex items-center gap-2 text-xs text-emerald-600">
          <Activity className="w-3 h-3 animate-pulse" />
          Live
        </div>
      </div>

      <AnimatePresence>
        {doctors.map((doc) => (
          <motion.div
            key={doc._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className="
              rounded-3xl border bg-white
              p-6 shadow-sm hover:shadow-md
              transition
            "
          >
            {/* ===== TOP SECTION ===== */}
            <div className="flex items-center gap-5">
              {/* AVATAR */}
              <div className="
                flex h-14 w-14 items-center justify-center
                rounded-full bg-gradient-to-br
                from-emerald-500 to-cyan-500
                text-xl font-semibold text-white
              ">
                {doc.name?.charAt(0)?.toUpperCase()}
              </div>

              {/* INFO */}
              <div className="flex-1">
                <p className="text-lg font-semibold text-slate-800">
                  {doc.name}
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-5 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Stethoscope size={14} />
                    {doc.speciality}
                  </span>

                  <span className="flex items-center gap-1">
                    <IndianRupee size={14} />
                    {doc.fee}
                  </span>
                </div>
              </div>
            </div>

            {/* ===== DIVIDER ===== */}
            <div className="my-4 h-px bg-slate-100" />

            {/* ===== SLOT MANAGER ===== */}
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Availability Slots
                </p>

                {refreshing && (
                  <span className="text-xs text-slate-400">
                    Updating…
                  </span>
                )}
              </div>

              <SlotManager doctorId={doc._id} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
