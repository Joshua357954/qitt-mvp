// import { firestore } from "@/lib/firebase";
// import { collection, Firestore, getDocs, query, where } from "firebase/firestore";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     const params = new URL(req.url).searchParams;
//     const filters = ["schoolId", "departmentId", "session", "level"].map(
//       (key) => params.get(key)
//     );
//     if (filters.includes(null))
//       return NextResponse.json(
//         { error: "Missing required parameters" },
//         { status: 400 }
//       );

//     const q = query(
//       collection(firestore, "users"),
//       ...filters.map((val, i) =>
//         where(["schoolId", "departmentId", "session", "level"][i], "==", val)
//       )
//     );
//     const coursemates = (await getDocs(q)).docs.map((doc) => ({
//       userId: doc.id,
//       ...doc.data(),
//     }));

//     return NextResponse.json(
//       coursemates.length ? coursemates : { message: "No coursemates found" }
//     );
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
