import { firestore } from "@/firebase";
import { NextResponse } from "next/server";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  const spaceId = searchParams.get("spaceId");
  const schoolId = searchParams.get("schoolId");
  const departmentId = searchParams.get("departmentId");
  const level = searchParams.get("level");

  if (!spaceId || !schoolId || !departmentId || !level) {
    console.log("[ERROR] Missing parameters", {
      spaceId,
      schoolId,
      departmentId,
      level,
    });
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  console.log("[INFO] Query Params:", {
    uid,
    spaceId,
    schoolId,
    departmentId,
    level,
  });

  try {
    const usersRef = collection(firestore, "usersV1");

    const q = query(
      usersRef,
      where("department_space.spaceId", "==", spaceId.toLocaleLowerCase()),
      where("schoolId", "==", schoolId),
      where("departmentId", "==", departmentId),
      where("level", "==", Number(level))
    );

    console.log("[INFO] Running Firestore query...");

    const querySnapshot = await getDocs(q);
    console.log(`[INFO] Query returned ${querySnapshot.size} documents.`);

    const approved_users = [];
    const pending_users = [];

    querySnapshot.forEach((doc) => {
      const user = { id: doc.id, ...doc.data() };
      const status = user?.department_space?.status;

      console.log("[DEBUG] User:", user);
      console.log("[DEBUG] Status:", status);

      if (status === "approved" || status === "admin") {
        approved_users.push(user);
      } else if (status === "pending") {
        pending_users.push(user);
      }
    });

    console.log("[RESULT] Approved Users:", approved_users.length);
    console.log("[RESULT] Pending Users:", pending_users.length);

    return NextResponse.json(
      { approved_users, pending_users },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ERROR] Error fetching members:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
