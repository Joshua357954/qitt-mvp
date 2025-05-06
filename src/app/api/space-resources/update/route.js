import { NextResponse } from "next/server";
import { collection, doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebase";

export async function POST(req) {
  try {
    const { resourceType, id, data } = await req.json();

    if (!resourceType || !id || !data) {
      return NextResponse.json(
        { error: "Missing resourceType, id, or data" },
        { status: 400 }
      );
    }

    const collectionRef = getCollectionRef(resourceType);
    if (!collectionRef) {
      return NextResponse.json(
        { error: "Invalid resource type" },
        { status: 400 }
      );
    }

    const docRef = doc(firestore, resourceType, id);
    await updateDoc(docRef, data);

    return NextResponse.json(
      { message: `${resourceType} updated successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 }
    );
  }
}

const getCollectionRef = (resourceType) => {
  const collections = {
    timetables: "timetables",
    resource: "resources",
    assignment: "assignments",
    notes: "notes",
    courses: "courses",
    announcements: "announcements",
  };
  return collections[resourceType]
    ? collection(firestore, collections[resourceType])
    : null;
};

//if resourceType is any of resoures , assignments and notes  will contain files


// import { NextResponse } from 'next/server';
// import { v2 as cloudinary } from 'cloudinary';

// // -----------------------------
// // ☁️ Cloudinary Configuration
// // -----------------------------
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // -----------------------------
// // 🔼 Upload a file to Cloudinary
// // -----------------------------
// async function uploadToCloudinary(file) {
//   const buffer = Buffer.from(await file.arrayBuffer());

//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: 'auto',
//         folder: 'assignments', // Optional: Save in the 'assignments' folder
//       },
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result);
//       }
//     );
//     stream.end(buffer);
//   });
// }

// // -----------------------------
// // 🚀 POST handler for batch upload
// // -----------------------------
// export async function POST(req) {
//   try {
//     // 1️⃣ Get formData from the incoming request
//     const formData = await req.formData();

//     // 2️⃣ Parse metadata JSON from 'data' field
//     const metadataJson = formData.get('data')?.toString() || '{}';
//     const metadata = JSON.parse(metadataJson);

//     // 3️⃣ Get all files uploaded
//     const files = formData.getAll('files');

//     if (!files.length) {
//       return NextResponse.json({ success: false, error: 'No files uploaded' }, { status: 400 });
//     }

//     // 4️⃣ Batch upload files to Cloudinary in parallel
//     const uploadPromises = files.map((file) =>
//       uploadToCloudinary(file).then((result) => ({
//         originalName: file.name,
//         type: file.type,
//         size: file.size,
//         url: result.secure_url,
//         public_id: result.public_id,
//         resource_type: result.resource_type,
//       }))
//     );

//     // Wait for all uploads to finish
//     const uploadedFiles = await Promise.all(uploadPromises);

//     // 5️⃣ Save metadata and file info to Firestore
//     const assignmentData = {
//       ...metadata, // Include metadata (title, description, etc.)
//       files: uploadedFiles, // Include file details (Cloudinary URLs, public IDs, etc.)
//       createdAt: new Date().toISOString(),
//     };

//     const docRef = await db.collection('assignments').add(assignmentData);

//     // ✅ Success response
//     return NextResponse.json({
//       success: true,
//       assignmentId: docRef.id,
//       files: uploadedFiles,
//     });
//   } catch (err) {
//     // ❌ Error handling
//     console.error(err);
//     return NextResponse.json({ success: false, error: err.message }, { status: 500 });
//   }
// }
