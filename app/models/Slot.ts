import mongoose, { Schema } from "mongoose";

const SlotSchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },


    time: {
      type: String, // "10:00 AM"
      required: true,
    },

  },
  { timestamps: true }
);

/* Prevent duplicate slots */
SlotSchema.index(
  { doctor: 1, time: 1 },
  { unique: true }
);

export default mongoose.models.Slot ||
  mongoose.model("Slot", SlotSchema);
