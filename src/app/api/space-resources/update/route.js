import { NextResponse } from "next/server";
import { collection, doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebase";

export async function POST(req) {
  try {
    const { resourceType, id, data } = await req.json();

    if (!resourceType || !id || !data) {
      return NextResponse.json(
        { error: "Missing resourceType, id, or data" },
        { status: 400 }
      );
    }

    const collectionRef = getCollectionRef(resourceType);
    if (!collectionRef) {
      return NextResponse.json(
        { error: "Invalid resource type" },
        { status: 400 }
      );
    }

    const docRef = doc(firestore, resourceType, id);
    await updateDoc(docRef, data);

    return NextResponse.json(
      { message: `${resourceType} updated successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 }
    );
  }
}

const getCollectionRef = (resourceType) => {
  const collections = {
    timetables: "timetables",
    resource: "resources",
    assignment: "assignments",
    notes: "notes",
    courses: "courses",
    announcements: "announcements",
  };
  return collections[resourceType]
    ? collection(firestore, collections[resourceType])
    : null;
};
