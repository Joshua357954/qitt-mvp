import { firestore } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function getSpaceId(spaceId) {
  const departmentRef = query(
    collection(firestore, "department-space"),
    where("id", "==", spaceId)
  );
  const departmentSnapshot = await getDocs(departmentRef);

  if (!departmentSnapshot.empty) {
    return departmentSnapshot.docs[0].id;
  } else {
    return false;
  }
}
