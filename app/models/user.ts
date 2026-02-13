import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    /* ---------------- BASIC INFO ---------------- */

    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, "Phone number must be 10 digits"],
      default: null,
    },

    image: {
      type: String,
      default: null,
    },

    /* ---------------- AUTH ---------------- */

    password: {
      type: String,
      select: false, // 🔐 never return password by default
      required: function (this: any) {
        return this.provider === "credentials";
      },
    },

    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },

    /* ---------------- ROLES ---------------- */

    role: {
      type: String,
      enum: [
        "PATIENT",
        "DOCTOR",
        "HOSPITAL_ADMIN",
        "SUPER_ADMIN",
      ],
      default: "PATIENT",
    },

    /* ---------------- RELATIONS ---------------- */

    hospital_id: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      default: null,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

export default models.User || mongoose.model("User", UserSchema);
