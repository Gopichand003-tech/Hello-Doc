"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

export const CTASection = () => {
  const router = useRouter();

  return (
    <section className="py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 shadow-2xl"
        >
          {/* Soft Glow Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-white rounded-full blur-[150px]" />
            <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-white rounded-full blur-[150px]" />
          </div>

          <div className="relative z-10 px-8 py-20 md:px-16 md:py-24 text-center text-white">
            
            <span className="inline-block px-6 py-2 rounded-full bg-white/20 text-sm font-semibold tracking-wide mb-6">
              START YOUR HEALTH JOURNEY
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold max-w-3xl mx-auto leading-tight">
              Ready to Book Your Appointment?
            </h2>

            <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
              Experience fast booking, instant token confirmation,
              and seamless healthcare management with Hello Doc.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
              
              {/* Primary */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/extradoctors")}
                className="flex items-center gap-3 bg-white text-emerald-700 font-semibold rounded-full px-10 py-4 shadow-lg hover:shadow-2xl transition-all"
              >
                <Calendar className="w-5 h-5" />
                Book Appointment
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              {/* Secondary */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("#")}
                className="flex items-center gap-3 border border-white/40 rounded-full px-10 py-4 font-semibold backdrop-blur-md hover:bg-white/10 transition-all"
              >
                <Phone className="w-5 h-5" />
                Contact Us
              </motion.button>
            </div>

            {/* Trust Line */}
            <div className="mt-10 text-white/70 text-sm flex flex-wrap justify-center gap-4">
              <span>✔ Instant Confirmation</span>
              <span>✔ Secure Booking</span>
              <span>✔ Trusted Doctors</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
