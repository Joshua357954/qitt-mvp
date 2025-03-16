import { firestore } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const userId = new URL(req.url).searchParams.get("userId");
    if (!userId)
      return NextResponse.json({ error: "User ID required" }, { status: 400 });

    const userSnap = await getDoc(doc(firestore, "users", userId));
    if (!userSnap.exists())
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      carryOverCourses: userSnap.data().carryOverCourses || [],
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
