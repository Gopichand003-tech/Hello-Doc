"use client";

import { useEffect, useState, useRef } from "react";
import {
  Stethoscope,
  CalendarCheck,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BookingsList() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const firstLoad = useRef(true);

  /* ================= DATE HELPERS ================= */
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  /* ================= FETCH ================= */
  const fetchBookings = async () => {
    try {
      if (!firstLoad.current) setRefreshing(true);

      const res = await fetch("/api/admin/booking");
      const data = await res.json();

      const todayBookings = (data.bookings || []).filter(
        (b: any) => {
          const d = new Date(b.appointmentDate);
          return (
            d >= startOfToday &&
            d <= endOfToday &&
            b.status === "BOOKED"
          );
        }
      );

      setBookings(todayBookings);
    } catch (err) {
      console.error("Booking fetch failed", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      firstLoad.current = false;
    }
  };

  /* ================= EFFECT ================= */
  useEffect(() => {
    fetchBookings();

    const interval = setInterval(fetchBookings, 8000);
    return () => clearInterval(interval);
  }, []);

  /* ================= UI ================= */
  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl relative">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-600" />
            Today’s Bookings
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Automatically updates • Past bookings hidden
          </p>
        </div>

        {refreshing && (
          <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-lg bg-slate-100"
            />
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && bookings.length === 0 && (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <p className="text-slate-500">
            No bookings scheduled for today
          </p>
        </div>
      )}

      {/* TABLE */}
      {!loading && bookings.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-slate-500">
              <tr>
                <th className="pb-3 text-left font-medium">Patient</th>
                <th className="pb-3 text-left font-medium">Doctor</th>
                <th className="pb-3 text-left font-medium">Time</th>
                <th className="pb-3 text-left font-medium">Status</th>
              </tr>
            </thead>

            <AnimatePresence>
              <tbody className="divide-y">
                {bookings.map((b) => (
                  <motion.tr
                    key={b._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-slate-50 transition"
                  >
                    {/* PATIENT */}
                    <td className="py-4">
                      <p className="font-medium text-slate-800">
                        {b.patient?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {b.patient?.email}
                      </p>
                    </td>

                    {/* DOCTOR */}
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Stethoscope
                          size={14}
                          className="text-slate-400"
                        />
                        <span>{b.doctor?.name || "—"}</span>
                      </div>
                    </td>

                    {/* TIME */}
                    <td className="py-4 text-slate-600">
                      {new Date(b.appointmentDate).toLocaleTimeString(
                        "en-IN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </td>

                    {/* STATUS */}
                    <td className="py-4">
                      <StatusBadge status={b.status} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </AnimatePresence>
          </table>
        </div>
      )}
    </div>
  );
}

/* ================= STATUS BADGE ================= */

function StatusBadge({ status }: { status: string }) {
  const map: any = {
    BOOKED:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    COMPLETED:
      "bg-blue-50 text-blue-700 border-blue-200",
    CANCELLED:
      "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium ${
        map[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}
