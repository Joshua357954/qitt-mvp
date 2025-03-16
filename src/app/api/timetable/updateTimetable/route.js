// import { db } from "@/lib/firebase";
// import { doc, updateDoc, getDoc } from "firebase/firestore";
// import { NextResponse } from "next/server";

// export async function PUT(req) {
//   try {
//     const { timetableId, timetableData } = await req.json();

//     if (
//       !timetableId ||
//       !timetableData ||
//       !Array.isArray(timetableData) ||
//       timetableData.length === 0
//     ) {
//       return NextResponse.json(
//         {
//           error: "timetableId and a non-empty timetableData array are required",
//         },
//         { status: 400 }
//       );
//     }

//     for (const entry of timetableData) {
//       if (
//         !entry.courseId ||
//         !entry.day ||
//         !entry.time ||
//         !entry.venue ||
//         !entry.lecturer
//       ) {
//         return NextResponse.json(
//           {
//             error:
//               "Each timetable entry must contain courseId, day, time, venue, and lecturer",
//           },
//           { status: 400 }
//         );
//       }
//     }

//     const docRef = doc(db, "timetables", timetableId);
//     const timetable = await getDoc(docRef);

//     if (!timetable.exists()) {
//       return NextResponse.json(
//         { error: "Timetable not found" },
//         { status: 404 }
//       );
//     }

//     await updateDoc(docRef, { timetableData });
//     return NextResponse.json({ message: "Timetable updated successfully" });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
