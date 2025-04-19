import { firestore } from "@/firebase";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, adminId, decision } = body;

    if (!userId || !adminId || !["approved", "rejected"].includes(decision)) {
      console.log("Here : ", typeof( body.decision));
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );
    }

    console.log("🛡️ Admin Decision", { userId, adminId, decision });

    // Query user document where uid == userId
    const usersRef = collection(firestore, "usersV1");
    const q = query(usersRef, where("uid", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = querySnapshot.docs[0];
    const userRef = userDoc.ref;

    // Perform update
    if (decision === "approved") {
      await updateDoc(userRef, {
        "department_space.status": "approved",
      });
    } else {
      await updateDoc(userRef, {
        department_space: {},
      });
      console.log('Send User Rejection Notification')
    }

    console.log(
      `✅ User ${userId} marked as '${decision}' by admin ${adminId}`
    );

    return NextResponse.json(
      {
        message: `User ${userId} successfully ${decision} by admin ${adminId}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error processing decision:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
