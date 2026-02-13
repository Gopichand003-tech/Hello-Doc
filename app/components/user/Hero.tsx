"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  MapPin,
  Stethoscope,
  Loader2,
  Crosshair,
} from "lucide-react";
import { LOCATIONS ,SPECIALITIES } from "@/app/data/locations";

export default function HeroHospital() {
  const [speciality, setSpeciality] = useState("");
  const [location, setLocation] = useState("");
  const [showLoc, setShowLoc] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [showSpec, setShowSpec] = useState(false);
const specRef = useRef<HTMLDivElement>(null);


  const locationRef = useRef<HTMLDivElement>(null);

  /* ---------------- Close dropdown on outside click ---------------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        locationRef.current &&
        !locationRef.current.contains(e.target as Node)
      ) {
        setShowLoc(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- Auto detect location ---------------- */
  const detectLocation = () => {
    if (!navigator.geolocation) return;

    setDetecting(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();

          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.country;

          if (city) setLocation(city);
        } catch (err) {
          console.error("Location detection failed");
        } finally {
          setDetecting(false);
        }
      },
      () => setDetecting(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  /* ---------------- Search handler ---------------- */
  const handleSearch = () => {
    if (!speciality || !location ) return;

    window.location.href = `/user/doctors?speciality=${encodeURIComponent(
      speciality
    )}&location=${encodeURIComponent(location)}`;
  };

  return (
    <section className="relative min-h-[90vh] overflow-hidden">

  {/* Background */}
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('/hero.png')" }}
  />

  {/* Content wrapper */}
  <div className="relative z-10 flex items-end min-h-[150vh] pb-16 sm:pb-20">
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">

      {/* Glass Card */}
      <div
        className="
          bg-gradient-to-b from-blue-200/80 via-white/95 to-blue-300/80
          backdrop-blur-md
          rounded-3xl
          p-5 sm:p-7
          border border-blue-200/60
          shadow-[0_15px_40px_rgba(59,130,246,0.25)]
        "
      >
        {/* SEARCH ROW */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">

         {/* SPECIALITY */}
<div ref={specRef} className="relative flex-1 -translate-y-3">
  <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-slate-200">
    <Stethoscope className="w-5 h-5 text-cyan-600 shrink-0" />
    <input
      value={speciality}
      onChange={(e) => {
        setSpeciality(e.target.value);
        setShowSpec(true);
      }}
      onFocus={() => setShowSpec(true)}
      placeholder="Speciality, doctor or hospital"
      className="w-full outline-none bg-transparent text-slate-700 placeholder:text-slate-400 text-sm sm:text-base"
    />
  </div>

  {showSpec && (
    <ul className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-lg border max-h-56 overflow-y-auto">
      {SPECIALITIES.filter((s) =>
        s.toLowerCase().includes(speciality.toLowerCase())
      ).map((s) => (
        <li
          key={s}
          className="px-4 py-2 hover:bg-cyan-50 cursor-pointer text-sm"
          onClick={() => {
            setSpeciality(s);
            setShowSpec(false);
          }}
        >
          {s}
        </li>
      ))}
    </ul>
  )}
</div>


          {/* LOCATION */}
          <div ref={locationRef} className="relative flex-1">
            <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-slate-200">
              <MapPin className="w-5 h-5 text-cyan-600 shrink-0" />
              <input
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setShowLoc(true);
                }}
                onFocus={() => setShowLoc(true)}
                placeholder="City or area"
                className="w-full outline-none bg-transparent text-slate-700 placeholder:text-slate-400 text-sm sm:text-base"
              />
            </div>

            {showLoc && (
              <ul className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-lg border max-h-56 overflow-y-auto">
                {LOCATIONS.filter((l) =>
                  l.toLowerCase().includes(location.toLowerCase())
                ).map((l) => (
                  <li
                    key={l}
                    className="px-4 py-2 hover:bg-cyan-50 cursor-pointer text-sm"
                    onClick={() => {
                      setLocation(l);
                      setShowLoc(false);
                    }}
                  >
                    {l}
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={detectLocation}
              className="mt-2 text-xs sm:text-sm text-orange-500 font-medium flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-orange-400 rounded-full" />
              Use my location
            </button>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSearch}
            className="
              w-full lg:w-auto
              bg-yellow-400 hover:bg-yellow-500
              text-black font-semibold
              px-8 py-3 rounded-full
              flex items-center justify-center gap-2
              shadow-[0_10px_20px_rgba(250,204,21,0.6)]
              transition -translate-y-4
            "
          >
            <Search className="w-5 h-5" />
            Find Doctors
          </button>
        </div>

        {/* POPULAR */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-slate-500">
            <span className="w-2 h-2 bg-orange-400 rounded-full" />
            POPULAR
          </div>

          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:gap-3">
            {[
              "Cardiology",
              "Orthopedics",
              "Neurology",
              "Pediatrics",
              "Dermatology",
              "ENT",
            ].map((item) => (
              <button
                key={item}
                onClick={() => setSpeciality(item)}
                className="
                  px-4 py-1.5 rounded-full
                  bg-white text-slate-700
                  border border-slate-200
                  shadow-sm
                  hover:bg-blue-50 hover:text-blue-600
                  text-xs sm:text-sm
                  transition
                "
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

  );
}
