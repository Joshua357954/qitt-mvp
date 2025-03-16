// import { firestore } from ".@/firebase";
// import { doc, updateDoc } from "firebase/firestore";
// import { NextResponse } from "next/server";

// // Update Course Outline
// export async function PATCH(req) {
//   const { courseId, outline } = await req.json();
//   if (!courseId || !outline)
//     return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
//   try {
//     const courseRef = doc(db, "courses", courseId);
//     await updateDoc(courseRef, { outline });
//     return NextResponse.json({ message: "Course outline updated" });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
