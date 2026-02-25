import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/app/lib/dbConnect";
import Hospital from "@/app/models/Hospital";
import User from "@/app/models/user";
import cloudinary from "@/app/lib/cloudinary";

console.log("CLOUD NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API KEY:", process.env.CLOUDINARY_API_KEY);
console.log("API SECRET:", process.env.CLOUDINARY_API_SECRET);

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    const adminName = formData.get("name") as string;
    const hospitalName = formData.get("hospitalName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const file = formData.get("hospitalImage") as File | null;

    if (!adminName || !hospitalName || !email || !password || !address || !phone) {
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
      name: adminName,
      email,
      password: hashedPassword,
      role: "HOSPITAL_ADMIN",
      provider: "credentials",
      hospital_id: null,
    });

    let imageUrl: string | null = null;

if (file && file.size > 0) {
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image files allowed" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

  const uploadResult = await cloudinary.uploader.upload(base64Image, {
    folder: "hello-doc/profiles",
  });

  imageUrl = uploadResult.secure_url;
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
