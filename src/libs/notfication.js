import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/firebase";
import axios from "axios";

// OneSignal REST API config (available if you want to send push notifications)
const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;




/* Sends a push notification via OneSignal. */
export async function sendPushNotification({
  playerIds,
  title,
  message,
  data = {},
}) {
  if (!playerIds || playerIds.length === 0) {
    throw new Error("No OneSignal player IDs provided");
  }

  const payload = {
    app_id: "df39a7e2-d8e8-4054-b353-feb386bebdfc",
    include_player_ids: playerIds,
    headings: { en: title },
    contents: { en: message },
    data,
  };

  try {
    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      payload,
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Basic ${ONESIGNAL_API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("OneSignal push notification error:", error);
    throw error;
  }
}

/* Adds a notification and optionally sends a push notification. */
export async function notifyAndPush({
  userId,
  departmentId,
  type,
  title,
  message,
  data = {},
  sentVia = ["in-app", "push"],
}) {
  const notificationId = await addNotification({
    userId,
    departmentId,
    type,
    title,
    message,
    data,
    sentVia,
  });

  let playerIds = [];

  if (type === "department-space" && departmentId) {
    const usersRef = collection(firestore, "usersV1");
    const q = query(
      usersRef,
      where("department_space.spaceId", "==", departmentId.toLowerCase())
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.playerId) {
        playerIds.push(userData.playerId);
      }
    });
  } else if (userId) {
    const userDoc = await getDoc(doc(firestore, "usersV1", userId));
    if (userDoc.exists() && userDoc.data().playerId) {
      playerIds.push(userDoc.data().playerId);
    }
  }

  if (sentVia.includes("push") && playerIds.length > 0) {
    await sendPushNotification({
      playerIds,
      title,
      message,
      data,
    });
  }

  return notificationId;
}
