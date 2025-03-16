// import { firestore } from "@/firebase";
// import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
// import { NextResponse } from "next/server";

// const validateParams = (params) =>
//   Object.values(params).every((param) => param);

// // Add Course
// export async function POST(req) {
//   const {
//     schoolId,
//     departmentId,
//     session,
//     level,
//     semester,
//     courseId,
//     courseName,
//     outline,
//   } = await req.json();
//   if (
//     !validateParams({
//       schoolId,
//       departmentId,
//       session,
//       level,
//       semester,
//       courseId,
//       courseName,
//     })
//   ) {
//     return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
//   }
//   try {
//     await addDoc(collection(firestore, "courses"), {
//       schoolId,
//       departmentId,
//       session,
//       level,
//       semester,
//       courseId,
//       courseName,
//       outline: outline || [],
//     });
//     return NextResponse.json({ message: "Course added successfully" });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
