// import { firestore } from "@/lib/firebase";
// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   doc,
//   getDoc,
// } from "firebase/firestore";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     const userId = new URL(req.url).searchParams.get("userId");
//     if (!userId)
//       return NextResponse.json({ error: "User ID required" }, { status: 400 });

//     const userSnap = await getDoc(doc(firestore, "users", userId));
//     if (!userSnap.exists())
//       return NextResponse.json({ error: "User not found" }, { status: 404 });

//     const {
//       carryOverCourses,
//       schoolId,
//       departmentId,
//       session,
//       level,
//       semester,
//     } = userSnap.data();
//     if (!carryOverCourses?.length)
//       return NextResponse.json({ message: "No carry-over courses found" });

//     const q = query(
//       collection(firestore, "timetables"),
//       where("schoolId", "==", schoolId),
//       where("departmentId", "==", departmentId),
//       where("session", "==", session),
//       where("level", "==", level),
//       where("semester", "==", semester)
//     );
//     const timetables = (await getDocs(q)).docs
//       .map((doc) => ({
//         ...doc.data(),
//         timetableData: doc
//           .data()
//           .timetableData.filter((entry) =>
//             carryOverCourses.includes(entry.courseId)
//           ),
//       }))
//       .filter((t) => t.timetableData.length);

//     return NextResponse.json(
//       timetables.length ? timetables : { message: "No timetable found" }
//     );
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
