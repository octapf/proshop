import { NextResponse, NextRequest } from 'next/server';
import path from 'path';
import { writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';

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

  const buffer = Buffer.from(await file.arrayBuffer());

  // SANITIZATION: Strict filename sanitization
  // 1. Get the original name
  const originalName = file.name;
  // 2. Get the extension
  const ext = path.extname(originalName);
  // 3. Get the base name without extension
  const name = path.basename(originalName, ext);
  // 4. Sanitize the base name (remove non-alphanumeric chars, replace spaces with underscores)
  const sanitizedName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  // 5. Add a timestamp to prevent overwrites and ensure uniqueness
  const timestamp = Date.now();
  const filename = `${sanitizedName}_${timestamp}${ext}`;

  // Ensure uploads directory exists in public folder so it's accessible
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  try {
    await writeFile(path.join(uploadDir, filename), buffer);
    // Return resource URL
    // NOTE: In Vercel usage, writing to filesystem at runtime doesn't persist forever (volatile).
    // For production, S3 or Cloudinary is recommended.
    // But for migration loyalty, this replicates local behavior.
    return NextResponse.json({
      message: 'Success',
      filePath: `/uploads/${filename}`,
    });
  } catch (error) {
    console.log('Error occured ', error);
    return NextResponse.json({ Message: 'Failed', status: 500 });
  }
}
