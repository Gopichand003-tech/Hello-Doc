"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Hospital,
  Stethoscope,
  XCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

type HistoryBooking = {
  _id: string;
  appointmentDate: string;
  tokenNumber?: number;
  status: string;
  doctor: {
    name: string;
    speciality: string;
  };
  hospital: {
    name: string;
  };
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/history")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data.history || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-32 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-slate-500 text-lg">Loading appointment history...</p>
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="flex flex-col items-center justify-center mt-32 gap-4 text-slate-500">
        <Calendar className="w-14 h-14 opacity-40" />
        <p className="text-xl font-medium">No Appointment History</p>
        <p className="text-sm opacity-70">
          Your past appointments will appear here
        </p>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-extrabold mb-14 bg-gradient-to-r from-blue-700 to-indigo-400 bg-clip-text text-transparent text-center">
        Appointment History
      </h1>

      <div className="space-y-8">
        {history.map((b, index) => {
          const isCancelled = b.status === "CANCELLED";

          return (
            <motion.div
              key={b._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className={`
                relative bg-white/80 backdrop-blur-lg
                rounded-3xl p-8
                border border-slate-200
                shadow-lg hover:shadow-2xl
                transition-all duration-300
              `}
            >
              {/* Left Accent Line */}
              <div
                className={`absolute left-0 top-0 h-full w-1 rounded-l-3xl ${
                  isCancelled ? "bg-rose-500" : "bg-emerald-500"
                }`}
              />

              <div className="flex flex-wrap justify-between gap-8">
                {/* Left Side */}
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-slate-800">
                    Dr. {b.doctor.name}
                  </h2>

                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-blue-500" />
                    {b.doctor.speciality}
                  </p>

                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <Hospital className="w-4 h-4 text-indigo-500" />
                    {b.hospital.name}
                  </p>
                </div>

                {/* Right Side */}
                <div className="text-right space-y-3">
                  <p className="text-sm text-slate-600 flex items-center justify-end gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    {new Date(b.appointmentDate).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full shadow-sm ${
                      isCancelled
                        ? "bg-rose-100 text-rose-600"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {isCancelled ? (
                      <>
                        <XCircle className="w-4 h-4" />
                        Cancelled
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Optional Token */}
              {b.tokenNumber && (
                <div className="mt-6 text-sm text-slate-500">
                  Token Number:
                  <span className="ml-2 font-semibold text-slate-700">
                    #{b.tokenNumber}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
