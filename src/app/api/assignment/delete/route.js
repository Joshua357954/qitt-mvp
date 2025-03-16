// import { collection, doc, deleteDoc } from "firebase/firestore";
// import { firestore } from "@/firebase";

// // DELETE endpoint to remove an assignment
// export async function DELETE(req) {
//   const { assignmentId } = await req.json();
//   try {
//     await deleteDoc(doc(firestore, "assignments", assignmentId));
//     return NextResponse.json({ message: "Assignment deleted successfully" });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }
// }
