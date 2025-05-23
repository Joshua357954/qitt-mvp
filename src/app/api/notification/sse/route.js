import { NextResponse } from "next/server";
import { firestore } from "@/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

export async function GET(request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const spaceUID = url.searchParams.get("spaceUID");

  if (!userId || !spaceUID) {
    return NextResponse.json(
      { error: "Both userId and spaceUID are required" },
      { status: 400 }
    );
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const send = (data) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      let unsubUser = () => {};
      let unsubSpace = () => {};

      (async () => {
        // Listen to user notifications
        try {
          const userQuery = query(
            collection(firestore, "notifications"),
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
          );
          unsubUser = onSnapshot(userQuery, snapshot => {
            const added = snapshot.docChanges().filter(c => c.type === "added").map(c => ({ ...c.doc.data(), source: "user" }));
            if (added.length) send({ ...added });
          });
        } catch (e) {
          console.error("User notifications listener failed:", e);
        }

        // Listen to space notifications
        try {
          const spaceQuery = query(
            collection(firestore, "department-space", spaceUID, "departmentNotifications"),
            orderBy("createdAt", "desc")
          );
          unsubSpace = onSnapshot(spaceQuery, snapshot => {
            const added = snapshot.docChanges().filter(c => c.type === "added").map(c => ({...c.doc.data(), source: "space" }));
            if (added.length) send({ ...added });
          });
        } catch (e) {
          console.error("Space notifications listener failed:", e);
        }
      })();

      // Cleanup on client disconnect
      controller.signal.addEventListener("abort", () => {
        unsubUser();
        unsubSpace();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
