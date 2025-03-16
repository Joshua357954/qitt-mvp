import {
  collection,
  doc,
  update,
  setDoc,
  add,
  query,
  where,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "@/firebase";

// Get Assignments
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filters = [
      "schoolId",
      "departmentId",
      "session",
      "level",
      "semester",
      "courseId",
    ]
      .map((key) =>
        searchParams.get(key) ? where(key, "==", searchParams.get(key)) : null
      )
      .filter(Boolean);

    let assignmentsQuery = filters.length
      ? query(collection(firestore, "assignments"), ...filters)
      : collection(firestore, "assignments");
    const querySnapshot = await getDocs(assignmentsQuery);
    const assignmentsMap = new Map();

    querySnapshot.forEach((doc) => {
      const {
        courseId,
        assignmentTitle,
        dueDate,
        details,
        mediaUrl,
        dateGiven,
        postedBy
      } = doc.data();

      if (!assignmentsMap.has(courseId)) {
        assignmentsMap.set(courseId, {
          courseId,
          numberOfAssignments: 0,
          dates: new Set(),
          otherData: [],
        });
      }

      const courseAssignments = assignmentsMap.get(courseId);
      courseAssignments.numberOfAssignments++;
      courseAssignments.dates.add(
        new Date(dateGiven).toISOString().split("T")[0]
      );

      courseAssignments.otherData.push({
        dateGiven: new Date(dateGiven).toISOString(),
        deadline: new Date(dueDate).toISOString(),
        title: assignmentTitle,
        details,
        media: mediaUrl,
        postedBy,

      });
    });

    const result = Array.from(assignmentsMap.values()).map((course) => ({
      ...course,
      dates: Array.from(course.dates),
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
