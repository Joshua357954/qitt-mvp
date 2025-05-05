// GET space-resources endpoint

import { NextResponse } from "next/server";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase";

// Handles GET requests to retrieve space resources based on filters
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const resourceType = searchParams.get("resourceType");
    const spaceId = searchParams.get("spaceId");
    const schoolId = searchParams.get("schoolId");
    const departmentId = searchParams.get("departmentId");
    const levelParam = searchParams.get("level");
    const level = levelParam ? Number(levelParam) : NaN;

    console.log("🔍 Incoming GET request with query parameters:", {
      resourceType,
      spaceId,
      schoolId,
      departmentId,
      level,
    });

    // Basic type checks
    if (
      !resourceType ||
      !spaceId ||
      !schoolId ||
      !departmentId ||
      isNaN(level)
    ) {
      console.warn("⚠️ Missing or invalid query parameters");
      return NextResponse.json(
        { error: "Missing or invalid query parameters" },
        { status: 400 }
      );
    }

    const collectionRef = getCollectionRef(resourceType);
    if (!collectionRef) {
      console.warn("⚠️ Invalid resource type provided:", resourceType);
      return NextResponse.json(
        { error: "Invalid resource type" },
        { status: 400 }
      );
    }

    console.log("📚 Querying Firestore collection for:", resourceType);

    const q = query(
      collectionRef,
      where("spaceId", "==", spaceId),
      where("schoolId", "==", schoolId),
      where("departmentId", "==", departmentId),
      where("level", "==", Number(level))
    );

    const querySnapshot = await getDocs(q);
    console.log(`✅ Retrieved ${querySnapshot.size} data from Firestore`);

    const resources = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json([ ...resources ], { status: 200 });
  } catch (error) {
    console.error("🔥 Error fetching space resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

// Helper function to map resource types to Firestore collection names
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
    ? collection(firestore,resourceType)
    : null;
};
