import { NextResponse } from "next/server";
import {
  collection,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "@/firebase";

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const { resourceType, id, data, newFiles } = await handleRequestBody(
      req,
      contentType
    );

    if (!resourceType || !id || !data) {
      return NextResponse.json(
        { error: "Missing resourceType, id, or data" },
        { status: 400 }
      );
    }

    const collectionRef = getCollectionRef(resourceType);

    let uploadedFiles = [];
    if (Array.isArray(newFiles) && newFiles.length) {
      const uploadPromises = newFiles.map((file) =>
        uploadToCloudinary(file, resourceType).then((result) => ({
          originalName: file.name,
          type: file.type,
          size: file.size,
          url: result.secure_url,
        }))
      );

      uploadedFiles = await Promise.all(uploadPromises);
    }

    data.files = Array.isArray(data.files)
      ? [...data.files, ...uploadedFiles]
      : uploadedFiles.length
      ? uploadedFiles
      : data.files;

    // Automatically add `updatedAt` timestamp
    data.updatedAt = serverTimestamp();

    const docRef = doc(collectionRef, id);
    await updateDoc(docRef, data);

    return NextResponse.json(
      { message: `${resourceType} updated successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Error updating document:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to update resource" },
      { status: 500 }
    );
  }
}

// Function to handle request body based on content type
const handleRequestBody = async (req, contentType) => {
  let resourceType = null;
  let data = {};
  let id = null;
  let newFiles = [];

  if (contentType.includes("application/json")) {
    const body = await req.json();
    id = body.id;
    resourceType = body.resourceType;
    data = body.data || {};
  } else if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    resourceType = formData.get("resourceType");
    id = formData.get("id");
    newFiles = formData.getAll("newFiles");

    try {
      data = JSON.parse(formData.get("data"));
    } catch (err) {
      console.error("❌ Invalid JSON in formData:", err);
      throw new Error("Invalid JSON format for 'data'");
    }

    
  }

  return { resourceType, id, data, newFiles };
};

const getCollectionRef = (resourceType) => {
  const collections = {
    timetables: "timetables",
    resources: "resources",
    assignments: "assignments",
    notes: "notes",
    courses: "courses",
    announcements: "announcements",
  };

  if (!collections[resourceType]) {
    throw new Error("Invalid resource type");
  }

  return collection(firestore, collections[resourceType]);
};
