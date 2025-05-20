import { NextResponse } from "next/server";
import { firestore } from "@/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

export async function GET(request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const departmentId = url.searchParams.get("departmentId");

  if (!userId && !departmentId) {
    return NextResponse.json({ error: "userId or departmentId required" }, { status: 400 });
  }

  // Create a ReadableStream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Helper to send SSE formatted messages
      function sendEvent(data) {
        const formatted = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(new TextEncoder().encode(formatted));
      }

      // Firestore unsubscribe functions
      let unsubUser = () => {};
      let unsubDept = () => {};

      // Setup listeners on Firestore (async)
      (async () => {
        if (userId) {
          const userNotifsQuery = query(
            collection(firestore, "notifications"),
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
          );

          unsubUser = onSnapshot(userNotifsQuery, (snapshot) => {
            const newNotifications = [];
            snapshot.docChanges().forEach(change => {
              if (change.type === "added") {
                newNotifications.push({ id: change.doc.id, ...change.doc.data(), source: "user" });
              }
            });

            if (newNotifications.length > 0) {
              sendEvent({ type: "userNotifications", notifications: newNotifications });
            }
          });
        }

        if (departmentId) {
          const deptNotifsQuery = query(
            collection(firestore, "department-space", departmentId, "departmentNotifications"),
            orderBy("createdAt", "desc")
          );

          unsubDept = onSnapshot(deptNotifsQuery, (snapshot) => {
            const newNotifications = [];
            snapshot.docChanges().forEach(change => {
              if (change.type === "added") {
                newNotifications.push({ id: change.doc.id, ...change.doc.data(), source: "department" });
              }
            });

            if (newNotifications.length > 0) {
              sendEvent({ type: "departmentNotifications", notifications: newNotifications });
            }
          });
        }
      })();

      // Cleanup on stream cancel
      controller.signal.addEventListener("abort", () => {
        unsubUser();
        unsubDept();
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
