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

    if (!userId || !reason) {
      console.log("🚫 Missing required params:", { userId, reason });
      return NextResponse.json(
        { error: "Missing userId or reason" },
        { status: 400 }
      );
    }

    const usersRef = collection(firestore, "usersV1");

    // ✅ Optional: If adminId is provided, verify it's a real user
    if (adminId) {
      const adminQuery = query(usersRef, where("uid", "==", adminId));
      const adminSnapshot = await getDocs(adminQuery);

      if (adminSnapshot.empty) {
        console.log("🚫 Invalid adminId, no such user:", adminId);
        return NextResponse.json(
          { error: "Invalid adminId: no such user found" },
          { status: 403 }
        );
      }
    }

    // ✅ Fetch user being removed
    const userQuery = query(usersRef, where("uid", "==", userId));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      console.log("❌ User not found:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = userSnapshot.docs[0];
    const userRef = userDoc.ref;

    // ✅ Clear department_space field
    await updateDoc(userRef, {
      department_space: {},
    });

    // ✅ Log the removal reason and who removed
    if (adminId) {
      console.log(`✅ Admin (${adminId}) removed user (${userId}) from department for reason:`, reason);
    } else {
      console.log(`✅ User (${userId}) removed themselves from department for reason:`, reason);
    }

    return NextResponse.json(
      {
        message: `User ${userId} removed from department space`,
        removedBy: adminId ? "admin" : "self",
        reason,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
