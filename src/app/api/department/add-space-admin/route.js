// app/api/roles/add/route.js

import { NextResponse } from "next/server";
import {
  getFirestore,
  doc,
  setDoc,
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
    // Destructure expected fields from request body
    const body = await request.json();
    console.log(body); // for debugging

    const { email, schoolId, departmentId, spaceId, level, permissions } = body;

    // Validate all required fields are present
    if (
      !email ||
      !schoolId ||
      !departmentId ||
      !spaceId ||
      !level ||
      !permissions
    ) {
      console.log(
        email,
        schoolId,
        departmentId,
        spaceId,
        level,
        permissions,
        "All fields (email, schoolId, departmentId, spaceId, level, permissions) are required"
      );
      return NextResponse.json(
        {
          message:
            "All fields (email, schoolId, departmentId, spaceId, level, permissions) are required",
        },
        { status: 400 }
      );
    }

    // Step 1: Find the user in the userV1 collection
    const userQuerySnapshot = await getDocs(
      query(
        collection(firestore, "usersV1"),
        where("email", "==", email),
        where("schoolId", "==", schoolId),
        where("departmentId", "==", departmentId),
        where("level", "==", Number(level))
      )
    );

    const userDocSnapshot = userQuerySnapshot.docs[0];

    console.log("User Snapshot ID:", userDocSnapshot?.id);
    console.log("User Snapshot Data:", userDocSnapshot?.data());

    // If user not found, return 404
    if (!userDocSnapshot) {
      return NextResponse.json(
        { message: "No user found matching the specified criteria" },
        { status: 404 }
      );
    }

    // Step 2: Check if the specified department-space exists
    const departmentSpaceQuery = query(
      collection(firestore, "department-space"),
      where("schoolId", "==", schoolId),
      where("departmentId", "==", departmentId),
      where("level", "==", Number(level)),
      where("id", "==", spaceId.toLowerCase())
    );

    const departmentSpaceSnap = await getDocs(departmentSpaceQuery);

    console.log("Department Space Docs Found:", departmentSpaceSnap.size);

    departmentSpaceSnap.forEach((doc, index) => {
      console.log(`Doc ${index + 1} ID:`, doc.id);
      console.log(`Doc ${index + 1} Data:`, doc.data());
    });

    // If department-space not found, return 404
    if (departmentSpaceSnap.empty) {
      return NextResponse.json(
        {
          message: "No department space found matching the specified criteria",
        },
        { status: 404 }
      );
    }

    // Step 3: Update the department-space by adding user to 'admins' array
    const departmentSpaceDoc = departmentSpaceSnap.docs[0];
    const departmentSpaceRef = doc(
      firestore,
      "department-space",
      departmentSpaceDoc.id
    );

    const userId = userDocSnapshot.id; // Get user ID from snapshot

    await updateDoc(departmentSpaceRef, {
      admins: arrayUnion({ uid: userId, permissions }), // Add new admin with permissions
      updatedAt: new Date().toISOString(),
    });

    // Step 4: Update user's document to reflect new department-space permissions
    await updateDoc(doc(firestore, "usersV1", userDocSnapshot.id), {
      "department_space.permissions": arrayUnion(...permissions), // Merge new permissions
      "department_space.lastUpdated": new Date().toISOString(),
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: "User added to department-space admins successfully",
      userId,
      spaceId,
      permissions,
    });
  } catch (error) {
    // Log and return error details
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
