// import { firestore } from "@/lib/firebase";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const requiredFields = ["schoolId", "departmentId", "session", "level", "semester"];
//     const filters = [];

//     for (const field of requiredFields) {
//       const value = searchParams.get(field);
//       if (!value) return NextResponse.json({ error: `${field} is required` }, { status: 400 });
//       filters.push(where(field, "==", value));
//     }

//     const q = query(collection(firestore, "timetables"), ...filters);
//     const querySnapshot = await getDocs(q);

//     if (querySnapshot.empty) {
//       return NextResponse.json({ message: "No timetable found" }, { status: 404 });
//     }

//     const timetables = querySnapshot.docs.map(doc => ({ timetableId: doc.id, ...doc.data() }));
//     return NextResponse.json(timetables);
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
