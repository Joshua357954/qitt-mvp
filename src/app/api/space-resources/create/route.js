import { NextResponse } from "next/server";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/firebase";
import { uploadToCloudinary } from "@/utils/cloudinary"
import { addNotification } from "@/libs/notification/addNotification";

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // Check if resourceType is valid early to avoid unnecessary processing
    const { resourceType, data, files } = await handleRequestBody(
      req,
      contentType
    );

    // If no valid resourceType, return an error immediately
    if (!resourceType) {
      return NextResponse.json(
        { error: "Invalid resource type" },
        { status: 400 }
      );
    }

    // Get the Firestore collection reference based on the resourceType
    const collectionRef = getCollectionRef(resourceType);
    if (!collectionRef) {
      console.log("Invalid resource type")
      return NextResponse.json(
        { error: "Invalid resource type" },
        { status: 400 }
      );
    }

    // Handle file uploads if files are present in the formData
    if (files && files.length) {
      // Upload files to Cloudinary
      const uploadPromises = files.map((file) =>
        uploadToCloudinary(file, resourceType).then((result) => ({
          originalName: file.name,
          type: file.type,
          size: file.size,
          url: result.secure_url,
        }))
      );

      // Wait for all uploads to finish
      const uploadedFiles = await Promise.all(uploadPromises);
      console.log(uploadedFiles)
      data.files = uploadedFiles; // Attach uploaded file URLs to the data
    }

    // Prepare the data to be saved in Firestore with timestamps
    const resourceData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Add data to Firestore
    const docRef = await addDoc(collectionRef, resourceData);

    // Send Notification To Department 
    addNotification({
        userId:undefined,
        spaceId:data.spaceId,
        type:'DEPARTMENT',
        resourceType,
        data: {},
        announcement: resourceType === 'announcements' ? data.message : false,
        course: data.course,
        resourcesContentType: resourceType === 'resources' ? data.type : false,
        action:'CREATE',
        sentVia:['in-app','push']
      });
    

    // Success response
    return NextResponse.json({
      success: true,
      message: `${resourceType} created successfully`,
      id: docRef.id,
      files: data.files || [], // Attach file info (if any)
    });
  } catch (err) {
    console.error("🔥 Error processing request:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// Function to handle request body based on content type
const handleRequestBody = async (req, contentType) => {
  let resourceType = null;
  let data = {};
  let files = [];

  if (contentType.includes("application/json")) {
    // Parse JSON body
    const body = await req.json();
    resourceType = body.resourceType;
    data = body.data || {};
  } else if (contentType.includes("multipart/form-data")) {
    // Parse form-data
    const formData = await req.formData();
    resourceType = formData.get("resourceType");
    data = data = JSON.parse(formData.get("data")); // Convert form data to an object
    files = formData.getAll("files");

    // console.log(resourceType,data,files.length)
  }

  return { resourceType, data, files };
};

// Function to get Firestore collection reference based on resourceType
const getCollectionRef = (resourceType) => {
  const collections = {
    timetables: "timetables",
    resources: "resources",
    assignments: "assignments",
    notes: "notes",
    courses: "courses",
    announcements: "announcements",
  };

  return collections[resourceType]
    ? collection(firestore, collections[resourceType])
    : null;
};
