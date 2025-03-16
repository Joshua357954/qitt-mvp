// import { firestore } from "@/lib/firebase";
// import { collection, addDoc} from "firebase/firestore";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { schoolId, departmentId, session, level, semester, timetableData } =
//       body;

//     if (
//       !schoolId ||
//       !departmentId ||
//       !session ||
//       !level ||
//       !semester ||
//       !timetableData ||
//       !Array.isArray(timetableData) ||
//       timetableData.length === 0
//     ) {
//       return NextResponse.json(
//         {
//           error:
//             "All fields are required and timetableData must be a non-empty array",
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

//     const docRef = await addDoc(collection(firestore, "timetables"), body);
//     return NextResponse.json(
//       {
//         message: "Timetable added successfully",
//         timetableId: docRef.id,
//         ...body,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
