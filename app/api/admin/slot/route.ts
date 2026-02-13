import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/dbConnect";
import Slot from "@/app/models/Slot";

/* ===============================
   GET → FETCH PERMANENT SLOTS
================================ */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const doctorId = req.nextUrl.searchParams.get("doctorId");

    if (!doctorId) {
      return NextResponse.json(
        { error: "doctorId is required" },
        { status: 400 }
      );
    }

    const slots = await Slot.find({
      doctor: doctorId,
    }).sort({ time: 1 });

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("FETCH SLOT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch slots" },
      { status: 500 }
    );
  }
}

/* ===============================
   POST → CREATE PERMANENT SLOT
================================ */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { doctorId, time } = await req.json();

    if (!doctorId || !time) {
      return NextResponse.json(
        { error: "doctorId and time are required" },
        { status: 400 }
      );
    }

    const slot = await Slot.findOneAndUpdate(
      { doctor: doctorId, time },
      {
        doctor: doctorId,
        time,
        isBooked: false,
        booking: null,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ slot });
  } catch (error) {
    console.error("CREATE SLOT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create slot" },
      { status: 500 }
    );
  }
}

/* ===============================
   DELETE → REMOVE SLOT
================================ */
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "slot id required" },
        { status: 400 }
      );
    }

    await Slot.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE SLOT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete slot" },
      { status: 500 }
    );
  }
}
