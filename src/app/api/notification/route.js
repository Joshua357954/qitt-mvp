import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "firebase/firestore";
import { firestore } from "@/firebase";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const spaceUID = searchParams.get("spaceUID");

  if (!userId && !spaceUID) {
    return NextResponse.json(
      { message: "Either userId or spaceUID must be provided" },
      { status: 400 }
    );
  }

  try {
    let userNotifications = [];
    let departmentNotifications = [];
    let userUnreadCount = 0;
    let deptUnreadCount = 0;

    // Fetch user notifications
    if (userId) {
      try {
        const userQuery = query(
          collection(firestore, "notifications"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );

        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          userNotifications = userSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            source: "user"
          }));
          userUnreadCount = userNotifications.filter((n) => n.read === false).length;
        }
      } catch (error) {
        if (error.code === "failed-precondition") {
          console.warn("Missing index for user notifications. Skipping user notifications.");
        } else {
          throw error;
        }
      }
    }

    // Fetch department notifications
    if (spaceUID && userId) {
      try {
        const departmentRef = query(
          collection(firestore, "department-space"),
          where("id", "==", spaceUID)
        );

        const departmentSnapshot = await getDocs(departmentRef);

        if (!departmentSnapshot.empty) {
          const deptDocId = departmentSnapshot.docs[0].id;

          const deptQuery = query(
            collection(firestore, "department-space", deptDocId, "departmentNotifications"),
            orderBy("createdAt", "desc")
          );

          const deptSnapshot = await getDocs(deptQuery);

          if (!deptSnapshot.empty) {
            departmentNotifications = deptSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              source: "department"
            }));
            deptUnreadCount = departmentNotifications.filter(
              (n) => !n.readBy?.includes(userId)
            ).length;
          }
        }
      } catch (error) {
        if (error.code === "failed-precondition") {
          console.warn("Missing index for department notifications. Skipping department notifications.");
        } else {
          throw error;
        }
      }
    }

    const combined = [...userNotifications, ...departmentNotifications];

    return NextResponse.json({
      notifications: combined,
      unreadCount: userUnreadCount + deptUnreadCount
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
