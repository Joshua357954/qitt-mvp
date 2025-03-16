import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId, carryOverCourses } = await req.json();

    if (
      !userId ||
      !Array.isArray(carryOverCourses) ||
      !carryOverCourses.length
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const userRef = doc(db, "users", userId);
    if (!(await getDoc(userRef)).exists())
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    await setDoc(userRef, { carryOverCourses }, { merge: true });
    return NextResponse.json({ message: "Carry-over courses added" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
