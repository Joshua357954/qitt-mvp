import { NextResponse } from "next/server";
import { firestore } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";

function generateShortId(schoolId, departmentId, level) {
  const clean = (str) =>
    str.toString()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 3);

  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `${clean(schoolId)}${clean(departmentId)}${clean(
    level
  )}${suffix}`.slice(0, 10);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      bio,
      visibility,
      schoolId,
      departmentId,
      level,
      isClassRep,
      uid,
    } = body;

    console.log(body);

    if (
      !name?.trim() ||
      !schoolId ||
      !departmentId ||
      !level ||
      !uid ||
      typeof isClassRep !== "boolean"
    ) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid required fields." },
        { status: 400 }
      );
    }

    if (!isClassRep) {
      return NextResponse.json(
        {
          success: false,
          message: "Only class representatives can create a space.",
        },
        { status: 403 }
      );
    }

    const existingQuery = query(
      collection(firestore, "department-space"),
      where("schoolId", "==", schoolId),
      where("departmentId", "==", departmentId),
      where("level", "==", level),
      where("name", "==", name)
    );

    const existingSnapshot = await getDocs(existingQuery);

    if (!existingSnapshot.empty) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A space for this department, school, and level already exists.",
        },
        { status: 409 }
      );
    }

    const spaceId = generateShortId(schoolId, departmentId, level);

    // Create the space
    const docRef = await addDoc(collection(firestore, "department-space"), {
      name: name.trim(),
      bio: bio || "",
      visibility: visibility || "private",
      schoolId,
      departmentId,
      level,
      id: spaceId,
      createdAt: serverTimestamp(),
      admins: [
        {
          uid,
          permission: ["full"],
        },
      ],
    });

    // Now, find the user with the provided uid and update their record
    const userRef = doc(firestore, "usersV1", uid);
    await updateDoc(userRef, {
      department_space: {spaceId, name:name.trim()}
    });

    return NextResponse.json(
      {
        success: true,
        message: "Space created and user updated successfully",
        id: docRef.id,
        spaceId,
        name
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating space:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
