import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/dbConnect";
import Doctor from "@/app/models/Doctor";
import "@/app/models/Hospital"; // ✅ REQUIRED

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const speciality = searchParams.get("speciality");
    const location = searchParams.get("location");

    if (!speciality) {
      return NextResponse.json({ hospitals: [] });
    }

    const doctors = await Doctor.find({
      speciality: { $regex: new RegExp(`^${speciality}$`, "i") },
    })
      .populate("hospital_id")
      .lean();

    const hospitalMap = new Map<string, any>();

    for (const doc of doctors) {
      const hospital = doc.hospital_id as any;
      if (!hospital) continue;

      // 📍 Location filter
      if (
        location &&
        hospital.location?.toLowerCase() !== location.toLowerCase()
      ) {
        continue;
      }

      const hospitalId = hospital._id.toString();

      // ➕ First time hospital
      if (!hospitalMap.has(hospitalId)) {
        hospitalMap.set(hospitalId, {
          _id: hospital._id,
          name: hospital.name,
          email: hospital.email,
          location: hospital.location,
          doctorCount: 1, // 👈 INITIAL COUNT
        });
      } else {
        // ➕ Increment count
        hospitalMap.get(hospitalId).doctorCount += 1;
      }
    }

    return NextResponse.json({
      hospitals: Array.from(hospitalMap.values()),
    });
  } catch (error) {
    console.error("Hospital search error:", error);
    return NextResponse.json(
      { hospitals: [], error: "Server error" },
      { status: 500 }
    );
  }
}
