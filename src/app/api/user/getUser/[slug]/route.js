import { firestore } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const userId = params.slug;
    if (!userId)
      return NextResponse.json({ error: "User ID required" }, { status: 400 });

    const userSnap = await getDpoc(doc(firestore, "users", userId));
    return userSnap.exists()
      ? NextResponse.json({ userId, ...userSnap.data() })
      : NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
