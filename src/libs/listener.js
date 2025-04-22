import { onSnapshot, collection, query, where } from "firebase/firestore";
import { firestore } from "@/firebase";
import useAuthStore from "@/app/store/authStore";

/**
 * Listens to the user's document by UID field inside `usersV1` collection.
 */
export async function listenToUserDepartmentSpace(uid) {
  const { updateUser, user } = useAuthStore.getState();

  // 🔍 Query for the user with this UID field
  const userQuery = query(
    collection(firestore, "usersV1"),
    where("uid", "==", uid)
  );

  // 🚀 Set up the listener
  const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const data = docSnap.data();

      console.log("📡 Listening Started for UID:", uid);

      if (
        data?.department_space?.status === "approved" &&
        user?.department_space?.status === "pending"
      ) {
        updateUser(data);
        console.log("✅ User department_space updated.");
      }
    }
  });

  return unsubscribe;
}
