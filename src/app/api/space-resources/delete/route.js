import { NextResponse } from "next/server";
import { doc, deleteDoc, collection } from "firebase/firestore";
import { firestore } from "@/firebase";

export async function POST(req) {
  try {
    const { resourceType, id } = await req.json();

    if (!resourceType || !id) {
      return NextResponse.json(
        { error: "Missing resourceType or id" },
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
    await deleteDoc(docRef);

    return NextResponse.json(
      { message: `${resourceType} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 }
    );
  }
}

const getCollectionRef = (resourceType) => {
  const collections = {
    timetable: "timetables",
    resources: "resources",
    assignments: "assignments",
    notes: "notes",
    courses: "courses",
    announcements: "announcements",
  };
  return collections[resourceType]
    ? collection(firestore, collections[resourceType])
    : null;
};
