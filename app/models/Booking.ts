import mongoose, { Schema } from "mongoose";

const BookingSchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    hospital: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },

    patient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    slotTime: {
      type: String, // "10:00 AM"
      required: true,
    },

    tokenNumber: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["BOOKED", "CANCELLED", "COMPLETED"],
      default: "BOOKED",
    },
  },
  { timestamps: true }
);

/* Prevent token duplication */
BookingSchema.index(
  { doctor: 1, appointmentDate: 1, tokenNumber: 1 },
  { unique: true }
);

/* Performance indexes */
BookingSchema.index({ hospital: 1, appointmentDate: 1 });
BookingSchema.index({ patient: 1, appointmentDate: -1 });

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);
