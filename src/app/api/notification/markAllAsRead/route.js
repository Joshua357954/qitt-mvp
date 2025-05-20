import {
    collection,
    query,
    where,
    getDocs,
    writeBatch,
    doc,
    arrayUnion,
  } from "firebase/firestore";
  import { firestore } from "@/firebase";
  

  /* Mark all notifications as read  */
  export async function markAllNotificationsRead(userId, departmentId) {
    const batch = writeBatch(firestore);
  
    // Query unread user notifications
    const userQuery = query(
      collection(firestore, "notifications"),
      where("userId", "==", userId),
      where("read", "==", false)
    );
    const userSnapshot = await getDocs(userQuery);
  
    // Mark each user notification as read
    userSnapshot.forEach(docSnap => {
      const notifRef = doc(firestore, "notifications", docSnap.id);
      batch.update(notifRef, { read: true });
    });
  
    // Get all department notifications for the department
    const deptNotifsRef = collection(firestore, "department-space", departmentId, "departmentNotifications");
    const deptSnapshot = await getDocs(deptNotifsRef);
  
    // Add userId to readBy array for each department notification
    deptSnapshot.forEach(docSnap => {
      const notifRef = doc(firestore, "department-space", departmentId, "departmentNotifications", docSnap.id);
      batch.update(notifRef, {
        readBy: arrayUnion(userId)
      });
    });
  
    await batch.commit();
  }
  