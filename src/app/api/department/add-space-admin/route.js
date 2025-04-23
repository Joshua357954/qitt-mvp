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

    console.log("Received request body:", {
      email,
      schoolId,
      departmentId,
      spaceId,
      level,
      permissions,
    });

    // Validate required fields
    if (
      !email ||
      !schoolId ||
      !departmentId ||
      !spaceId ||
      !level ||
      !permissions
    ) {
      console.warn("Missing required fields");
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Find user
    const userQuery = query(
      collection(firestore, "usersV1"),
      where("email", "==", email),
      where("schoolId", "==", schoolId),
      where("departmentId", "==", departmentId),
      where("level", "==", Number(level))
    );
    const userQuerySnapshot = await getDocs(userQuery);

    console.log("User query snapshot empty?", userQuerySnapshot.empty);

    if (userQuerySnapshot.empty) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const user = userQuerySnapshot.docs[0];
    console.log("User found:", user.id);

    // Find department-space
    const spaceQuery = query(
      collection(firestore, "department-space"),
      where("schoolId", "==", schoolId),
      where("departmentId", "==", departmentId),
      where("level", "==", Number(level)),
      where("id", "==", spaceId.toLowerCase())
    );
    const spaceQuerySnapshot = await getDocs(spaceQuery);

    console.log("Space query snapshot empty?", spaceQuerySnapshot.empty);

    if (spaceQuerySnapshot.empty) {
      return NextResponse.json({ message: "Space not found" }, { status: 404 });
    }
    const space = spaceQuerySnapshot.docs[0];
    console.log("Space found:", space.id);

    // Update space with new admin
    await updateDoc(doc(firestore, "department-space", space.id), {
      admins: arrayUnion({ uid: user.id, permissions }),
      updatedAt: new Date().toISOString(),
    });
    console.log("Updated space with new admin");

    // Check if user is in space
    if (user.data().department_space?.spaceId === spaceId) {
      // Update user permissions
      await updateDoc(doc(firestore, "usersV1", user.id), {
        "department_space.permissions": arrayUnion(...permissions),
        "department_space.lastUpdated": new Date().toISOString(),
      });
      console.log("Updated user permissions in space");
    } else {
      console.warn("User not in space");
      return NextResponse.json(
        { message: "User not in space" },
        { status: 500 }
      );
    }

    console.log("Admin added successfully");

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
