// import multer from "multer";
// import { storage } from "@/firebase";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { firestore } from "@/firebase";
// import { collection, addDoc } from "firebase/firestore";

// // Set up Multer to use memory storage
// const upload = multer({
//   storage: multer.memoryStorage(),
// });

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function POST(req, res) {
//   upload.single("file")(req, res, async (err) => {
//     if (err) {
//       return res.status(500).json({ error: "Failed to upload file" });
//     }

//     try {
//       const { file } = req;
//       const {
//         postedBy,
//         description,
//         course,
//         category,
//         department,
//         level,
//         tags,
//         filetype,
//         likeCount,
//         dislikeCount,
//         comments
//       } = req.json();

//       // Upload file to Firebase Storage
//       const fileRef = ref(
//         storage,
//         `resources/${Date.now()}_${file.originalname}`
//       );
//       const uploadResult = await uploadBytes(fileRef, file.buffer);
//       const downloadURL = await getDownloadURL(uploadResult.ref);

//       // Save metadata to Firestore
//       const resourceData = {
//         postedBy,
//         department,
//         level,
//         datetime: new Date().toISOString(),
//         fileLink: downloadURL,
//         text: file.originalname,
//         description,
//         course,
//         category,
//         tags: JSON.parse(tags || "[]"),
//         filetype,
//         likeCount,
//         dislikeCount,
//         comments: JSON.parse(comments || "[]"),
//       };

//       const docRef = await addDoc(
//         collection(firestore, "resources"),
//         resourceData
//       );

//       return res.status(201).json({
//         id: docRef.id,
//         message: "Resource uploaded successfully",
//         resource: resourceData,
//       });
//     } catch (error) {
//       console.error("Error uploading resource:", error);
//       return res.status(500).json({ error: "Failed to upload resource" });
//     }
//   });
// }

// export default handler;

import { firestore } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export const uploadFileToFirebase = async (file, folder) => {
  const fileRef = ref(storage, `${folder}/${file.name}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const requiredFields = [
      "schoolId",
      "departmentId",
      "session",
      "level",
      "semester",
      "courseId",
      "resourceType",
      "postedBy",
    ];
    if (requiredFields.some((field) => !formData.get(field)))
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const mediaFiles = formData.getAll("media");
    const mediaUrls = await Promise.all(
      mediaFiles.map((file) => uploadFileToFirebase(file, "materials"))
    );

    const docRef = await addDoc(collection(firestore, "resources"), {
      ...Object.fromEntries(formData),
      mediaUrls,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Material added", id: docRef.id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
