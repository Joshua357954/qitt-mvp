import { NextResponse } from "next/server";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  arrayUnion,
} from "firebase/firestore";
import { firestore } from "@/firebase";

export async function POST(request) {
  try {
    const {
      email,
      schoolId,
      departmentId,
      spaceId,
      level,
      permissions = [],
    } = await request.json();

    // Validate required fields
    if (
      !email ||
      !schoolId ||
      !departmentId ||
      !spaceId ||
      !level ||
      !permissions
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Find user
    const userQuerySnapshot = await getDocs(
      query(
        collection(firestore, "usersV1"),
        where("email", "==", email),
        where("schoolId", "==", schoolId),
        where("departmentId", "==", departmentId),
        where("level", "==", Number(level))
      )
    );

    if (userQuerySnapshot.empty) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const user = userQuerySnapshot.docs[0];

    // Find department-space
    const spaceQuerySnapshot = await getDocs(
      query(
        collection(firestore, "department-space"),
        where("schoolId", "==", schoolId),
        where("departmentId", "==", departmentId),
        where("level", "==", Number(level)),
        where("id", "==", spaceId.toLowerCase())
      )
    );

    if (spaceQuerySnapshot.empty) {
      return NextResponse.json({ message: "Space not found" }, { status: 404 });
    }
    const space = spaceQuerySnapshot.docs[0];

    // Update space with new admin
    await updateDoc(doc(firestore, "department-space", space.id), {
      admins: arrayUnion({ uid: user.id, permissions }),
      updatedAt: new Date().toISOString(),
    });

    // Check if user is in space
    if (user.department_space && user.department_space.spaceId === spaceId) {
      // Update user permissions
      await updateDoc(doc(firestore, "usersV1", user.id), {
        "department_space.permissions": arrayUnion(...permissions),
        "department_space.lastUpdated": new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { message: "User not in space" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin added successfully",
      userId: user.id,
      spaceId,
      permissions,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
