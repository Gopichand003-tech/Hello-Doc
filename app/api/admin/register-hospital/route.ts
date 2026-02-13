import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/app/lib/dbConnect";
import Hospital from "@/app/models/Hospital"; // ✅ FIXED
import User from "@/app/models/user";
import { upload } from "@/app/lib/multer";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const {
      hospitalName,
      email,
      password,
      address,
      phone,
      hospitalImage,
    } = await req.json();

    if (!hospitalName || !email || !password || !address || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = await User.create({
      email,
      password: hashedPassword,
      role: "HOSPITAL_ADMIN",
      provider: "credentials",
      hospital_id: null,
    });

    const hospital = await Hospital.create({
      name: hospitalName,
      email,
      admin: adminUser._id,
      phone,
      location: address,
      image: req.file?.path, // ✅ optional
    });

    adminUser.hospital_id = hospital._id;
    await adminUser.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("REGISTER HOSPITAL ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
