"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Hash,
  Hospital,
  Stethoscope,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------- TYPES ---------------- */
type Booking = {
  _id: string;
  appointmentDate: string;
  slotTime: string;
  tokenNumber: number;
  status: string;
  doctor: {
    name: string;
    speciality: string;
  };
  hospital: {
    name: string;
  };
};

export default function AppointmentsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    fetch("/api/user/appointments", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setBookings(data.bookings || []);
        setLoading(false);
      });
  }, []);

  /* ---------------- AUTO REFRESH TIMER ---------------- */
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((n) => n + 1);
    }, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  /* ---------------- HELPERS ---------------- */

  const getAppointmentDateTime = (date: string, time: string) => {
    const appointment = new Date(date);

    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    appointment.setHours(hours, minutes, 0, 0);
    return appointment;
  };

  const canCancel = (date: string, time: string) => {
    const appointment = getAppointmentDateTime(date, time);
    const deadline = new Date(appointment.getTime() - 60 * 60 * 1000);
    return new Date() < deadline;
  };

  const remainingTime = (date: string, time: string) => {
    const appointment = getAppointmentDateTime(date, time);
    const diff = appointment.getTime() - 60 * 60 * 1000 - Date.now();
    if (diff <= 0) return null;
    const mins = Math.floor(diff / 60000);
    return `${mins} mins left to cancel`;
  };

  /* ---------------- FILTER (HIDE PAST DAYS) ---------------- */
  const today = new Date().setHours(0, 0, 0, 0);
  const visibleBookings = bookings.filter((b) => {
    const day = new Date(b.appointmentDate).setHours(0, 0, 0, 0);
    return day >= today;
  });

  /* ---------------- CANCEL ---------------- */
  const confirmCancel = async () => {
    if (!cancelId) return;
    setProcessing(true);

    await fetch("/api/user/appointments/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: cancelId }),
    });

    setBookings((prev) => prev.filter((b) => b._id !== cancelId));
    setToast("Appointment cancelled successfully");
    setCancelId(null);
    setProcessing(false);

    setTimeout(() => setToast(null), 2500);
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-24 space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 rounded-3xl bg-slate-200 animate-pulse"
          />
        ))}
      </section>
    );
  }

  /* ---------------- EMPTY ---------------- */
  if (!visibleBookings.length) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mb-16">
          My Appointments
        </h1>
        <div className="bg-white rounded-3xl p-12 shadow-xl border">
          <Calendar className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-900">
            No appointments booked
          </h2>
          <p className="mt-3 text-slate-500">
            You don’t have any upcoming appointments.
          </p>
        </div>
      </section>
    );
  }

  /* ---------------- MAIN ---------------- */
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <motion.h1
        initial={{ y: 0 }}
        animate={{ y: -40 }}
        transition={{ duration: 0.5 }}
        className="text-center text-5xl font-extrabold mb-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text"
      >
        My Appointments
      </motion.h1>

      <div className="space-y-8">
        <AnimatePresence>
          {visibleBookings.map((b) => {
            const cancellable = canCancel(
              b.appointmentDate,
              b.slotTime
            );

            return (
              <motion.div
                key={b._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -5 }}
                className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 shadow-md hover:shadow-2xl transition-all"
              >
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />

                <div className="flex justify-between flex-wrap gap-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      Dr. {b.doctor.name}
                    </h2>

                    <p className="text-slate-500 flex items-center gap-2 mt-2">
                      <Stethoscope className="w-4 h-4 text-blue-600" />
                      {b.doctor.speciality}
                    </p>

                    <p className="text-slate-500 flex items-center gap-2 mt-1">
                      <Hospital className="w-4 h-4 text-indigo-600" />
                      {b.hospital.name}
                    </p>
                  </div>

                  <div className="text-right space-y-3">
                    <p className="flex items-center justify-end gap-2 text-slate-600">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      {new Date(b.appointmentDate).toDateString()}
                    </p>

                    <p className="font-semibold text-lg text-blue-600 flex items-center justify-end gap-2">
                      <Hash className="w-4 h-4" />
                      Token #{b.tokenNumber}
                    </p>

                    {cancellable ? (
                      <>
                        <p className="text-xs text-slate-500">
                          {remainingTime(
                            b.appointmentDate,
                            b.slotTime
                          )}
                        </p>

                       <button
  onClick={() => setCancelId(b._id)}
  className="
    inline-flex items-center justify-center gap-2
    px-5 py-2.5
    rounded-xl
    text-sm font-semibold
    bg-gradient-to-r from-rose-500 to-red-400
    text-white
    shadow-md
    hover:shadow-lg
    hover:scale-[1.03]
    active:scale-95
    transition-all duration-200
  "
>
  <XCircle className="w-4 h-4" />
  Cancel Appointment
</button>

                      </>
                    ) : (
                      <span className="text-xs text-slate-400">
                        Cancellation closed
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* CONFIRM CANCEL MODAL */}
      <AnimatePresence>
        {cancelId && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">
                Confirm cancellation?
              </h3>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setCancelId(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100"
                >
                  No
                </button>
                <button
                  onClick={confirmCancel}
                  disabled={processing}
                  className="px-4 py-2 rounded-lg bg-rose-600 text-white"
                >
                  {processing ? "Cancelling..." : "Yes, Cancel"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg"
          >
            <CheckCircle className="w-5 h-5 inline mr-2" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
