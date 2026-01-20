import { NextResponse, NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('image') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No files received.' }, { status: 400 });
  }

  // VALIDATION: Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Only JPEG, PNG and WebP are allowed.' },
      { status: 400 }
    );
  }

  // VALIDATION: Check file size (e.g., 5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: 'File size too large. Maximum size is 5MB.' },
      { status: 400 }
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'proshop' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      // Convert buffer to stream and pipe to cloudinary
      const stream = Readable.from(buffer);
      stream.pipe(uploadStream);
    });

    return NextResponse.json({
      message: 'Success',
      filePath: result.secure_url,
    });
  } catch (error: any) {
    console.log('Error occured ', error);
    return NextResponse.json({ message: 'Upload failed', error: error.message }, { status: 500 });
  }
}
