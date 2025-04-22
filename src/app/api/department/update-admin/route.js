// app/api/roles/update/route.js
import { NextResponse } from "next/server";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { firestore } from "@/firebase";

export async function POST(request) {
  try {
    console.log("Received request to update permissions");
    const { email, schoolId, departmentId, spaceId, level, permissions } =
      await request.json();

    console.log("Input data:", {
      email,
      schoolId,
      departmentId,
      spaceId,
      level,
      permissions,
    });

    if (
      !email ||
      !schoolId ||
      !departmentId ||
      !spaceId ||
      !level ||
      !permissions
    ) {
      console.log("Validation failed: Missing required fields");
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Find user
    console.log("Searching for user...");
    const userQuery = query(
      collection(firestore, "usersV1"),
      where("email", "==", email),
      where("schoolId", "==", schoolId),
      where("departmentId", "==", departmentId),
      where("level", "==", Number(level))
    );
    const userQuerySnapshot = await getDocs(userQuery);

    if (userQuerySnapshot.empty) {
      console.log("User not found");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userSnapshot = userQuerySnapshot.docs[0];
    console.log("User found:", userSnapshot.id);

    // Find department-space
    console.log("Searching for space...");
    const spaceQuery = query(
      collection(firestore, "department-space"),
      where("schoolId", "==", schoolId),
      where("departmentId", "==", departmentId),
      where("level", "==", Number(level)),
      where("id", "==", spaceId.toLowerCase())
    );
    const spaceQuerySnapshot = await getDocs(spaceQuery);

    if (spaceQuerySnapshot.empty) {
      console.log("Space not found");
      return NextResponse.json({ message: "Space not found" }, { status: 404 });
    }

    const spaceSnapshot = spaceQuerySnapshot.docs[0];
    console.log("Space found:", spaceSnapshot.id);

    // Update space admin permissions
    const spaceRef = doc(firestore, "department-space", spaceSnapshot.id);
    const currentAdmin = (spaceSnapshot.data().admins || []).find(
      (a) => a.uid === userSnapshot.id
    );

    if (!currentAdmin) {
      console.log("User is not an admin of this space");
      return NextResponse.json(
        { message: "User not an admin" },
        { status: 400 }
      );
    }

    console.log("Updating space admin permissions...");
    await updateDoc(spaceRef, {
      admins: arrayRemove(currentAdmin),
      updatedAt: new Date().toISOString(),
    });

    await updateDoc(spaceRef, {
      admins: arrayUnion({ ...currentAdmin, permissions }),
      updatedAt: new Date().toISOString(),
    });

    // Update user permissions
    console.log("Updating user permissions...");
    const userRef = doc(firestore, "usersV1", userSnapshot.id);
    await updateDoc(userRef, {
      "department_space.permissions": permissions,
      "department_space.lastUpdated": new Date().toISOString(),
    });

    console.log("Permissions updated successfully");
    return NextResponse.json({
      success: true,
      message: "Permissions updated",
      userId: userSnapshot.id,
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
