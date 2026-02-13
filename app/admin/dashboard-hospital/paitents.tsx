"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Users, Loader2 } from "lucide-react";

export default function PatientsList() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const firstLoad = useRef(true);

  /* ================= DATE HELPERS ================= */
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  /* ================= FETCH ================= */
  const fetchPatients = async () => {
    try {
      if (!firstLoad.current) setRefreshing(true);

      const res = await fetch("/api/admin/patients");
      const data = await res.json();

      const todaysPatients = (data.patients || []).filter(
        (p: any) =>
          p.lastVisit &&
          new Date(p.lastVisit) >= startOfToday &&
          new Date(p.lastVisit) <= endOfToday
      );

      setPatients(todaysPatients);
    } catch (err) {
      console.error("Failed to fetch patients", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      firstLoad.current = false;
    }
  };

  /* ================= EFFECT ================= */
  useEffect(() => {
    fetchPatients();
    const interval = setInterval(fetchPatients, 8000);
    return () => clearInterval(interval);
  }, []);

  /* ================= UI ================= */
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-white p-8 shadow-xl relative"
    >
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Today’s Patients
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Showing patients who visited today
          </p>
        </div>

        <div className="flex items-center gap-3">
          {refreshing && (
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          )}
          <span className="text-xs text-slate-500">
            {patients.length} total
          </span>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && patients.length === 0 && (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <p className="text-slate-500">
            No patients visited today
          </p>
        </div>
      )}

      {/* LIST */}
      {!loading && patients.length > 0 && (
        <ul className="space-y-4">
          {patients.map((p) => (
            <li
              key={p._id}
              className="
                rounded-2xl border p-5
                transition hover:bg-slate-50
              "
            >
              <div className="flex items-center justify-between gap-6">
                {/* LEFT */}
                <div className="flex items-start gap-4">
                  {/* AVATAR */}
                  <div className="
                    flex h-12 w-12 items-center justify-center
                    rounded-full bg-emerald-100
                    text-emerald-700 font-semibold text-lg
                  ">
                    {p.name?.charAt(0).toUpperCase() || "U"}
                  </div>

                  {/* DETAILS */}
                  <div>
                    <p className="text-lg font-semibold text-slate-800">
                      {p.name || "Unknown Patient"}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Mail size={14} className="text-slate-400" />
                        {p.email}
                      </span>

                      {p.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={14} className="text-slate-400" />
                          {p.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <span className="
                    inline-block rounded-full bg-blue-50
                    px-3 py-1 text-sm font-medium text-blue-600
                  ">
                    Token #{p.tokenNumber ?? "—"}
                  </span>

                  <p className="mt-1 text-xs text-slate-500">
                    Visited today
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
