import { firestore } from "@/firebase";
import {
  doc,
  getDoc,
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
    const { uid, schoolId, departmentId, level, code } = body;

    // Validate required fields
    if (!uid || !schoolId || !departmentId || !level || !code) {
      console.log(body);
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const trimmedCode = code.trim().toLowerCase();

    // Query for department space using the provided code
    const spaceQuery = query(
      collection(firestore, "department-space"),
      where("id", "==", trimmedCode.toUpperCase())
    );

    const spaceSnap = await getDocs(spaceQuery);

    if (spaceSnap.empty) {
      console.log("Incorrect Code");
      return NextResponse.json(
        { message: "Incorrect Code ❌" },
        { status: 404 }
      );
    }

    const spaceData = spaceSnap.docs[0].data();

    // Update user's department_space field
    const userRef = doc(firestore, "usersV1", uid);
    await updateDoc(userRef, {
      department_space: {
        spaceId: trimmedCode,
        name: spaceData.name || "Unnamed Space",
        status: "pending",
      },
    });

    return NextResponse.json(
      {
        message: "Joined space successfully ✅",
        spaceId: trimmedCode,
        name: spaceData.name,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Join Space Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
}
