import useAuthStore from "@/app/store/authStore";
import useNotificationStore from "@/app/store/notificationStore";
import { useEffect, useRef } from "react";

export function useNotificationsSSE() {
  const eventSourceRef = useRef(null);
  const addNewNotification = useNotificationStore(state => state.addNewNotification);
  const user = useAuthStore(state => state.user);

  const userId = user?.id;
  const spaceUID = user?.department_space?.spaceId;

  useEffect(() => {
    if (!userId || !spaceUID) return;

    const url = `/api/notification/sse?userId=${userId}&spaceUID=${spaceUID}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && typeof data === "object") {
          addNewNotification(data);
        }
      } catch (error) {
        console.error("Failed to parse SSE data:", error);
      }
    };

    es.onerror = (error) => {
      console.error("SSE error:", error);
      es.close();
    };

    return () => {
      es.close();
    };
  }, [userId, spaceUID, addNewNotification]);
}
