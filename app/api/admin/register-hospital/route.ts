import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/app/lib/dbConnect";
import Hospital from "@/app/models/Hospital"; // ✅ FIXED
import User from "@/app/models/user";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    const hospitalName = formData.get("hospitalName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const file = formData.get("hospitalImage") as File | null;

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

    let imageUrl = null;

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 🔥 Upload to Cloudinary here
      // Example:
      // const result = await cloudinary.uploader.upload_stream(...)
      // imageUrl = result.secure_url;
    }

    const hospital = await Hospital.create({
      name: hospitalName,
      email,
      admin: adminUser._id,
      phone,
      location: address,
      image: imageUrl,
    });

    adminUser.hospital_id = hospital._id;
    await adminUser.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("REGISTER HOSPITAL ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
