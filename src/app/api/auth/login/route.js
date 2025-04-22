import bcrypt from "bcryptjs";
import { collection, doc, query, where, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase";
import { NextResponse } from "next/server";

const saltRounds = 10;

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, pin, uid } = body;

    if (!email || !(uid || pin)) {
      console.log("🚫 Missing required fields (email, pin/uid)");
      return NextResponse.json(
        { error: "🚫 Missing required fields" },
        { status: 400 }
      );
    }

    // Check login type (Google or regular email)
    let userQuery;
    if (uid) {
      // Google login Check
      userQuery = query(
        collection(firestore, "usersV1"),
        where("email", "==", email)
      );
    } else if (pin) {
      // Regular login Check
      userQuery = query(
        collection(firestore, "usersV1"),
        where("email", "==", email)
      );
    }

    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      const existingUser = userSnapshot.docs[0].data();
      console.log("User found:", existingUser.email);

      if (pin) {
        // Compare the entered pin with the hashed pin stored in the database
        const isPinValid = await bcrypt.compare(pin, existingUser.pin);

        if (!isPinValid) {
          return NextResponse.json(
            { error: "🚫 Invalid pin" },
            { status: 401 }
          );
        }
      }

      delete existingUser.pin;

      return NextResponse.json(
        {
          login: true,
          message: `Welcome back ${existingUser.name || "User"} 😊`,
          user: { ...existingUser },
        },
        { status: 200 }
      );
    }

    // If no user is found ->
    console.log("No user found 😞");
    return NextResponse.json(
      { message: "😞 No user found, Try registering" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "❌ Internal server error ❌" },
      { status: 500 }
    );
  }
}
