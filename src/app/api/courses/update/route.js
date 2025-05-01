import { NextResponse } from "next/server";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebase";

// 🛠️ Update course details
export async function PUT(req) {
  try {
    console.log("🛠️ Incoming request to update a course");

    const body = await req.json();
    const { courseId, updateData } = body;

    if (!courseId || !updateData) {
      console.log("⚠️ Missing courseId or updateData:", {
        courseId,
        updateData,
      });
      return NextResponse.json(
        { error: "Missing courseId or updateData" },
        { status: 400 }
      );
    }

    console.log("🔍 Updating course:", { courseId, updateData });

    const courseRef = doc(firestore, "courses", courseId);
    await updateDoc(courseRef, updateData);

    console.log("✅ Course updated successfully");
    return NextResponse.json(
      { message: "Course updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Update error:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}
