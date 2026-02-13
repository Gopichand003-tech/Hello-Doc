"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Clock, Loader2 } from "lucide-react";

type Slot = {
  _id: string;
  time: string;
};

export default function BookingPage() {
  const { doctorId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const today = new Date().toISOString().split("T")[0];
  const tmr = new Date();
  tmr.setDate(tmr.getDate() + 1);
  const tomorrow = tmr.toISOString().split("T")[0];

  const prefilledDate = searchParams.get("date");
  const initialDate =
    prefilledDate === today || prefilledDate === tomorrow
      ? prefilledDate
      : today;

  const [date, setDate] = useState(initialDate);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
   const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  /* ================= FETCH PERMANENT SLOTS ================= */
  useEffect(() => {
    if (!doctorId) return;

    setLoadingSlots(true);
    setSelectedSlot(null);
    setError(null);

    fetch(`/api/admin/slot?doctorId=${doctorId}`)
      .then((res) => res.json())
      .then((data) => {
        setSlots(data.slots || []);
        setLoadingSlots(false);
      })
      .catch(() => {
        setError("Failed to load slots");
        setLoadingSlots(false);
      });
  }, [doctorId]);

  /* ================= BOOK ================= */
  const handleBooking = async () => {
    if (!selectedSlot) return;

    setBooking(true);
    setError(null);

    const res = await fetch("/api/user/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId,
        date,
        slotTime: selectedSlot,
      }),
    });

    const data = await res.json();
    setBooking(false);

    if (data.booking) {
      setToast({
  type: "success",
  message: `Appointment Confirmed! Token No: ${data.booking.tokenNumber}`,
});

setTimeout(() => {
  router.push("/user/appointments");
}, 1500);

    } else {
      setError(data.error || "Failed to book slot");
    }
  };
  const isPastTime = (time: string) => {
  if (date !== today) return false;

  const now = new Date();

  const [timePart, modifier] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const slotDate = new Date();
  slotDate.setHours(hours, minutes, 0, 0);

  return slotDate < now;
};


  return (
   <section className="max-w-xl mx-auto px-6 py-24">
  <div className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border border-slate-200 p-8">

    <h1 className="text-4xl font-extrabold mb-10 bg-gradient-to-r from-emerald-800 to-green-500 bg-clip-text text-transparent">
      Confirm Appointment
    </h1>

    {/* DATE */}
    <label className="block mb-2 text-sm font-semibold text-slate-700">
      Select Date
    </label>

    <div className="grid grid-cols-2 gap-3 mb-8">
      {[today, tomorrow].map((d) => (
        <button
          key={d}
          onClick={() => setDate(d)}
          className={`rounded-xl py-3 text-sm font-medium transition ${
            date === d
              ? "bg-emerald-600 text-white shadow-md"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          {d === today ? "Today" : "Tomorrow"}
        </button>
      ))}
    </div>

    {/* SLOTS */}
    <p className="mb-4 text-sm font-semibold text-slate-700">
      Available Time Slots
    </p>

    {loadingSlots ? (
      <div className="flex items-center gap-2 text-slate-500 mb-6">
        <Loader2 className="animate-spin" size={16} />
        Loading slots…
      </div>
    ) : slots.length ? (
      <div className="flex flex-wrap gap-3 mb-8">
        {slots.map((slot) => {
          const expired = isPastTime(slot.time);

          return (
            <button
              key={slot._id}
              disabled={expired}
              onClick={() => !expired && setSelectedSlot(slot.time)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                expired
                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                  : selectedSlot === slot.time
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-emerald-50"
              }`}
            >
              <Clock size={14} />
              {slot.time}
            </button>
          );
        })}
      </div>
    ) : (
      <p className="text-sm text-rose-600 mb-6">
        No slots configured for this doctor
      </p>
    )}

    {error && (
      <p className="mb-6 text-sm text-rose-600">{error}</p>
    )}

    {/* CONFIRM */}
    <button
      onClick={handleBooking}
      disabled={!selectedSlot || booking}
      className={`w-full rounded-xl py-3 font-semibold transition-all duration-300 ${
        selectedSlot
          ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:shadow-lg hover:scale-[1.02]"
          : "bg-slate-200 text-slate-400 cursor-not-allowed"
      }`}
    >
      {booking ? "Booking…" : "Confirm Booking"}
    </button>
  </div>
</section>

  );
}
