// app/api/courses/route.js
import { NextResponse } from "next/server";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firestore } from "@/firebase";

// 📥 Add a new course
export async function POST(req) {
  try {
    console.log("📥 Incoming request to add course");

    const body = await req.json();
    console.log("🧾 Request body:", body);

    const {
      code,
      title,
      creditUnit,
      outline,
      lecturers,
      postedBy,
      schoolId,
      departmentId,
      level,
      spaceId,
    } = body;

    // ✅ Basic validation
    if (
      !code ||
      !title ||
      !postedBy ||
      !schoolId ||
      !departmentId ||
      !level ||
      !spaceId
    ) {
      console.warn("⚠️ Missing required fields");
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    console.log("🔎 Checking for existing course...");
    const courseCollection = collection(firestore, "courses");

    const q = query(
      courseCollection,
      where("code", "==", code),
      where("schoolId", "==", schoolId),
      where("departmentId", "==", departmentId),
      where("spaceId", "==", spaceId),
      where("level", "==", level)
    );

    const existing = await getDocs(q);

    if (!existing.empty) {
      console.info("❌ Course already exists:", code);
      return NextResponse.json(
        { error: "Course already exists" },
        { status: 409 }
      );
    }

    console.log("✅ Adding new course to Firestore...");
    await addDoc(courseCollection, {
      code,
      title,
      creditUnit,
      outline,
      lecturers,
      postedBy,
      schoolId,
      departmentId,
      level,
      spaceId,
      createdAt: serverTimestamp(),
    });

    console.log("🎉 Course added successfully:", code);
    return NextResponse.json(
      { message: "Course added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("🔥 Upload error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

 