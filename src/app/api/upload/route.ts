
import { NextResponse, NextRequest } from 'next/server';
import path from 'path';
import { writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename =  file.name.replaceAll(" ", "_");
    
    // Ensure uploads directory exists in public folder so it's accessible
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
    }

    try {
        await writeFile(
            path.join(uploadDir, filename),
            buffer
        );
        // Return resource URL
        // NOTE: In Vercel usage, writing to filesystem at runtime doesn't persist forever (volatile). 
        // For production, S3 or Cloudinary is recommended. 
        // But for migration loyalty, this replicates local behavior.
        return NextResponse.json({ 
            message: "Success", 
            filePath: `/uploads/${filename}`
        });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
}
