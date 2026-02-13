import mongoose, { Schema } from "mongoose";

const AvailabilitySchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    date: {
  type: String, // YYYY-MM-DD
  required: true,
},


    available: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/**
 * Prevent duplicate records:
 * One doctor + one date = one availability row
 */
AvailabilitySchema.index(
  { doctor: 1, date: 1 },
  { unique: true }
);

export default mongoose.models.Availability ||
  mongoose.model("Availability", AvailabilitySchema);
