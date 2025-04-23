import { NextResponse } from "next/server";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase";

// 📤 Get courses by school, department, and level
export async function GET(req) {
  try {
    console.log("📤 Incoming request to fetch courses");

    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    const departmentId = searchParams.get("departmentId");
    const spaceId = searchParams.get("spaceId");
    const level = searchParams.get("level");

    if (!schoolId || !departmentId || !level || !spaceId) {
      console.log("⚠️ Missing required query parameters:", {
        schoolId,
        departmentId,
        level,
        spaceId,
      });
      return NextResponse.json(
        { error: "Missing schoolId, departmentId or level" },
        { status: 400 }
      );
    }

    console.log("🔎 Fetching courses for:", {
      schoolId,
      departmentId,
      level,
      spaceId: spaceId || "Not provided",
    });

    const courseCollection = collection(firestore, "courses");
    const q = query(
      courseCollection,
      where("schoolId", "==", schoolId),
      where("departmentId", "==", departmentId),
      where("spaceId", "==", spaceId),
      where("level", "==", Number(level))
    );

    console.log("⚙️ Query built:", q);

    const querySnapshot = await getDocs(q);
    const courses = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`📚 Found ${courses.length} course(s)`);
    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    console.error("🔥 Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
