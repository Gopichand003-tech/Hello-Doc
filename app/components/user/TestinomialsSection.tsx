"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sushmita",
    role: "Regular Patient",
    content:
      "Hello Doc made finding a specialist so easy! I booked an appointment within minutes and the entire process felt smooth and professional.",
    rating: 5,
  },
  {
    id: 2,
    name: "Rohit Sharma",
    role: "First-time User",
    content:
      "I received consultation without stress. The booking system and token confirmation are extremely efficient.",
    rating: 5,
  },
  {
    id: 3,
    name: "Kalpana",
    role: "Parent",
    content:
      "As a busy mom, Hello Doc has been a lifesaver. I can manage appointments for my entire family in one place.",
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="relative py-28 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 overflow-hidden">
      
      {/* Soft Glow Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-20 w-60 h-60 bg-white rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-white rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-6 py-2 rounded-full bg-white/20 text-white text-sm font-semibold tracking-wide">
            PATIENT STORIES
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-extrabold text-white">
            Trusted by Thousands
          </h2>

          <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
            Real experiences from patients who rely on Hello Doc
            for seamless appointment booking and quality healthcare.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -10 }}
              className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/40"
            >
              {/* Quote Icon */}
              <div className="absolute -top-6 left-6 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                <Quote className="w-5 h-5 text-white" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-5 mt-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-slate-600 leading-relaxed mb-8 text-sm">
                “{testimonial.content}”
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold flex items-center justify-center shadow-md">
                  {testimonial.name.charAt(0)}
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
