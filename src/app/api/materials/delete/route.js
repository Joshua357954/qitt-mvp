import { firestore } from "@/lib/firebase";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { deleteFromFirebase } from "@/utils/firebaseUtils";
import { NextResponse } from "next/server";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";

export const deleteFromFirebase = async (url) => {
  try {
    await deleteObject(ref(storage, url));
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const materialId = searchParams.get("materialId");
    if (!materialId)
      return NextResponse.json(
        { error: "Missing materialId" },
        { status: 400 }
      );

    const docRef = doc(firestore, "resources", materialId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists())
      return NextResponse.json(
        { error: "Material not found" },
        { status: 404 }
      );

    await Promise.all(docSnap.data().mediaUrls?.map(deleteFromFirebase) || []);
    await deleteDoc(docRef);
    return NextResponse.json({ message: "Material deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
