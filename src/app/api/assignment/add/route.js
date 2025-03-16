// import {
//   collection,
//   addDoc,
//   doc,
//   setDoc,
//   arrayUnion,
// } from "firebase/firestore";
// import { firestore } from "@/firebase";




// // POST endpoint to add an assignment
// export async function POST(req) {
//   const {
//     schoolId,
//     departmentId,
//     session,
//     level,
//     semester,
//     courseId,
//     assignmentTitle,
//     dueDate,
//     details,
//     media,
//     postedBy
//   } = await req.json();
//   try {
//     let mediaUrl = "";
//     if (media) {
//       const mediaBuffer = Buffer.from(media, "base64");
//       const mediaRef = ref(storage, `assignments/${Date.now()}.jpg`);
//       await uploadBytes(mediaRef, mediaBuffer);
//       mediaUrl = await getDownloadURL(mediaRef);
//     }
//     await addDoc(collection(firestore, "assignments"), {
//       schoolId,
//       departmentId,
//       session,
//       level,
//       semester,
//       courseId,
//       assignmentTitle,
//       dueDate,
//       details,
//       postedBy,
//       mediaUrl,
//     });
//     return NextResponse.json({ message: "Assignment added successfully" });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }
// }


// // Function to add an assignment to a specific department and year
// const addAssignment = async (assignmentData) => {
//   try {
//     const assignmentsCollection = collection(firestore, "assignments");

//     const newAssignmentRef = await addDoc(
//       assignmentsCollection,
//       assignmentData
//     );

//     return { id: newAssignmentRef.id, ...assignmentData };
//   } catch (error) {
//     console.error("Error adding assignment:", error);
//     throw new Error("Internal Server Error");
//   }
// };

// // Example assignment data
// const assignmentData = {
//   subject: "CSC 280.1",
//   content:
//     "Write a Fortran program to calculate the area of a cylinder. " +
//     "You are to print it with your full name and Department written as a comment on the code.",
//   contentType: "text",
//   dateGiven: new Date("2024-03-15").toISOString(), 
//   postedBy: assignmentDetails?.postedBy ?? "Qitt", 
//   deadline: new Date("2024-03-19").toISOString(),
// };

// // Example call to add an assignment (if needed)
// // addAssignment('computer_science', '200', assignmentData);
