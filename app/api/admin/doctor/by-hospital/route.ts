import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/dbConnect";
import Doctor from "@/app/models/Doctor";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const hospitalId = searchParams.get("hospitalId");
    const speciality = searchParams.get("speciality");

    if (!hospitalId || !speciality) {
      return NextResponse.json({ doctors: [] });
    }

    const doctors = await Doctor.find({
      hospital_id: hospitalId,
      speciality: { $regex: new RegExp(`^${speciality}$`, "i") },
    }).lean();

    return NextResponse.json({ doctors });
  } catch (error) {
    console.error("Doctor fetch error:", error);
    return NextResponse.json(
      { doctors: [], error: "Server error" },
      { status: 500 }
    );
  }
}
