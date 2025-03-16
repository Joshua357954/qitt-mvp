import { firestore } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const filters = {
    schoolId: searchParams.get("schoolId"),
    departmentId: searchParams.get("departmentId"),
    session: searchParams.get("session"),
    level: searchParams.get("level"),
    semester: searchParams.get("semester"),
  };
  if (!validateParams(filters))
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  try {
    const q = query(
      collection(firestore, "courses"),
      ...Object.entries(filters).map(([key, value]) => where(key, "==", value))
    );
    const snapshot = await getDocs(q);
    const courses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
