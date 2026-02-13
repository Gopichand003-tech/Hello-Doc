import mongoose, { Schema } from "mongoose";

const HospitalSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    departments: {
      type: [String],           // ✅ ADD THIS
      default: [],
    },

    image: {
  type: String, // base64 or URL
},

    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Hospital ||
  mongoose.model("Hospital", HospitalSchema);
