// import { firestore } from "@/firebase";
// import {doc, deleteDoc} from 'firebase/firestore';
// import { NextResponse } from "next/server";

// // Delete Course
// export async function DELETE(req) {
//   const { searchParams } = new URL(req.url);
//   const courseId = searchParams.get('courseId');
//   if (!courseId) return NextResponse.json({ error: 'Missing courseId' }, { status: 400 });
//   try {
//       await deleteDoc(doc(firestore, 'courses', courseId));
//       return NextResponse.json({ message: 'Course deleted successfully' });
//   } catch (error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
