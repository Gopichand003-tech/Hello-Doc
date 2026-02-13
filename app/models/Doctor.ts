import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  name: String,
  speciality: String,
  fee: Number,
  hospital_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true,
  },
});

export default mongoose.models.Doctor ||
  mongoose.model("Doctor", DoctorSchema);
