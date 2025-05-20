import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firestore } from "@/firebase";
import axios from "axios";

/* Generates the notification metadata (title and message). */
const generateNotificationMeta = (
  resourceType,
  action,
  course,
  announcement
) => {
  const actionMessages = {
    create: "added",
    update: "updated",
    delete: "removed",
  };

  const actionText = actionMessages[action.toLowerCase()] || "performed";

  const noCourseTypes = ["timetables", "announcements"];
  const isNoCourseResource = noCourseTypes.includes(resourceType.toLowerCase());

  const title = isNoCourseResource
    ? `${resourceType} ${
        actionText.charAt(0).toUpperCase() + actionText.slice(1)
      }`
    : `${resourceType} ${actionText} for ${course}`;

  const message = announcement
    ? announcement
    : isNoCourseResource
    ? `The ${resourceType.toLowerCase()} has been ${actionText}. Please check it out!`
    : `The ${resourceType.toLowerCase()} for ${course} has been ${actionText}. Don't miss it!`;

  return { title, message };
};

/* Adds a notification to a user or department. */
export async function addNotification({
  userId,
  spaceId,
  type,
  course,
  announcement,
  resourcesContentType,
  resourceType,
  action,
  data = {},
  sentVia = ["in-app", "push"],
}) {
  if (!type || !resourceType || !action) {
    throw new Error("type, resourceType, and action are required");
  }

  const finalResourceType = resourcesContentType || resourceType;
  const { title, message } = generateNotificationMeta(
    finalResourceType,
    action,
    course,
    announcement
  );

  const notificationData = {
    type,
    resourceType: finalResourceType,
    title,
    message,
    data,
    sentVia,
    createdAt: serverTimestamp(),
  };

  try {
    if (spaceId) {
      // Find the corresponding department space ID
      const departmentRef = query(
        collection(firestore, "department-space"),
        where("id", "==", spaceId)
      );
      const departmentSnapshot = await getDocs(departmentRef);

      if (!departmentSnapshot.empty) {
        const found = departmentSnapshot.docs[0].id;

        // Add Notification Data To DB
        const notifRef = await addDoc(
          collection(
            firestore,
            "department-space",
            found,
            "departmentNotifications"
          ),
          notificationData
        );
        return notifRef.id;
      } else {
        throw new Error("Space ID not found in department-space");
      }
    } else if (userId) {
      notificationData.userId = userId;
      notificationData.read = false;
      const notifRef = await addDoc(
        collection(firestore, "notifications"),
        notificationData
      );
      return notifRef.id;
    } else {
      throw new Error("Either userId or spaceId must be provided");
    }
  } catch (error) {
    console.error("Error adding notification:", error.message);
    throw new Error("Failed to add notification");
  }
}
