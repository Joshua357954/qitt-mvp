import { firestore } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

// Remove user from department-space
export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, adminId, reason } = body;

    if (!userId || !adminId || !reason) {
      console.log("🚫 Missing params:", { userId, adminId, reason });
      return NextResponse.json(
        { error: "Missing userId, adminId or reason" },
        { status: 400 }
      );
    }

    // Query user document where uid == userId
    const usersRef = collection(firestore, "usersV1");
    const q = query(usersRef, where("uid", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("❌ User not found:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = querySnapshot.docs[0];
    const userRef = userDoc.ref;

    // Log reason
    console.log("📣 Send Notification: User was removed because:", reason);

    // Remove department space data
    await updateDoc(userRef, {
      department_space: {},
    });

    console.log(`✅ User ${userId} removed from department by ${adminId}`);

    return NextResponse.json(
      {
        message: `User ${userId} removed from department space`,
        reason,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
