"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Calendar, CalendarDays } from "lucide-react";

/* ================= TYPES ================= */
type Doctor = {
  _id: string;
  name: string;
  speciality: string;
};

type AvailabilityMap = {
  [date: string]: boolean;
};

/* ================= HELPERS ================= */
const getDateString = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
};

const TODAY = getDateString(0);
const TOMORROW = getDateString(1);

/* ================= COMPONENT ================= */
export default function AvailabilitySection() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/doctor/list")
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data.doctors || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-xl bg-slate-200"
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white shadow p-6"
    >
      <h2 className="mb-6 text-lg font-semibold text-slate-800">
        Doctor Availability
      </h2>

      <div className="space-y-4">
        {doctors.map((doc) => (
          <div
            key={doc._id}
            className="
              flex items-center justify-between
              rounded-xl border p-4
              hover:bg-slate-50 transition
            "
          >
            {/* Doctor Info */}
            <div>
              <p className="font-medium text-slate-800">{doc.name}</p>
              <p className="text-sm text-slate-500">{doc.speciality}</p>
            </div>

            {/* Availability Toggles */}
            <div className="flex items-center gap-8">
              <AvailabilityToggle
                doctorId={doc._id}
                date={TODAY}
                label="Today"
                icon={<Calendar size={14} />}
              />
              <AvailabilityToggle
                doctorId={doc._id}
                date={TOMORROW}
                label="Tomorrow"
                icon={<CalendarDays size={14} />}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ================= TOGGLE ================= */
function AvailabilityToggle({
  doctorId,
  date,
  label,
  icon,
}: {
  doctorId: string;
  date: string;
  label: string;
  icon: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState<boolean | null>(null);

  /* -------- FETCH CURRENT STATE -------- */
  useEffect(() => {
    fetch(`/api/admin/availability?doctorId=${doctorId}`)
      .then((res) => res.json())
      .then((data) => {
        const match = data.availability?.find(
          (a: any) => a.date === date
        );
        setEnabled(match?.available ?? false);
      });
  }, [doctorId, date]);

  const toggleAvailability = async () => {
    if (enabled === null) return;

    setLoading(true);

    const next = !enabled;
    setEnabled(next); // optimistic UI

    const res = await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId,
        date,
        available: next,
      }),
    });

    if (!res.ok) {
      // rollback if failed
      setEnabled(!next);
    }

    setLoading(false);
  };

  if (enabled === null) {
    return (
      <div className="w-11 h-6 rounded-full bg-slate-200 animate-pulse" />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1 text-xs text-slate-500">
        {icon}
        {label}
      </span>

      <button
        onClick={toggleAvailability}
        disabled={loading}
        className={`
          relative h-6 w-11 rounded-full transition
          ${enabled ? "bg-emerald-600" : "bg-slate-300"}
          ${loading ? "opacity-60" : ""}
        `}
      >
        <span
          className={`
            absolute top-0.5 h-5 w-5 rounded-full bg-white transition
            ${enabled ? "translate-x-5" : "translate-x-1"}
          `}
        />
        {loading && (
          <Loader2
            size={12}
            className="
              absolute left-1/2 top-1/2
              -translate-x-1/2 -translate-y-1/2
              animate-spin text-white
            "
          />
        )}
      </button>
    </div>
  );
}
