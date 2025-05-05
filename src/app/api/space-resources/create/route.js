import { NextResponse } from "next/server";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/firebase";

export async function POST(req) {
  try {
    const { resourceType, data } = await req.json();

    if (!resourceType || !data) {
      console.log(data)
      return NextResponse.json({ error: "Missing resourceType or data" }, { status: 400 });
    }

    const collectionRef = getCollectionRef(resourceType);
    if (!collectionRef) {
      return NextResponse.json({ error: "Invalid resource type" }, { status: 400 });
    }

    // Add timestamps here 👇
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ message: `${resourceType} created successfully`, id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error("🔥 Error creating document:", error);
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
  }
}

const getCollectionRef = (resourceType) => {
  const collections = {
    timetable: "timetables",
    resource: "resources",
    assignment: "assignments",
    notes: "notes",
    courses: "courses",
    announcements: "announcements"
  };
  return collections[resourceType] ? collection(firestore, collections[resourceType]) : null;
};
