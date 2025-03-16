// import { firestore } from "@/firebase"; // Firebase initialization
// import { collection, query, where, getDocs } from "firebase/firestore";

// const handler = async (req, res) => {
//   const {
//     query: { department, level },
//     method,
//   } = req;

//   if (method !== "GET") {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }

//   if (!department || !level) {
//     return res.status(400).json({ error: "Department and Level are required" });
//   }

//   try {
//     // Reference to the 'resources' collection
//     const resourcesRef = collection(firestore, "resources");

//     // Create a query to filter by department and level
//     const q = query(
//       resourcesRef,
//       where("department", "==", department),
//       where("level", "==", level)
//     );

//     // Execute the query
//     const querySnapshot = await getDocs(q);

//     if (querySnapshot.empty) {
//       return res.status(404).json({ message: "No resources found" });
//     }

//     // Map through the documents and return them
//     const resources = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     return res.status(200).json({ resources });
//   } catch (error) {
//     console.error("Error fetching resources:", error);
//     return res.status(500).json({ error: "Failed to fetch resources" });
//   }
// };

// export default handler;

import { firestore} from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const requiredParams = [
      "schoolId",
      "departmentId",
      "session",
      "level",
      "semester",
      "courseId",
    ];
    if (requiredParams.some((param) => !searchParams.get(param)))
      return NextResponse.json(
        { error: "Missing query parameters" },
        { status: 400 }
      );

    const q = query(
      collection(firestore, "resources"),
      ...requiredParams.map((param) =>
        where(param, "==", searchParams.get(param))
      )
    );
    const snapshot = await getDocs(q);
    return NextResponse.json(
      snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
