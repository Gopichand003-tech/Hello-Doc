import { NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: "No image" }, { status: 400 });
    }

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "hello-doc/profiles",
    });

    return NextResponse.json({
      url: uploadResponse.secure_url,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
