import { firestore } from "@/firebase";
import bcrypt from "bcryptjs"; // Import bcrypt for hashing

// Firestore
import { collection, addDoc, getDocs, query, where, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

// Register User (User MetaData)
export async function POST(request) {
  try {
    console.log("🔍 Incoming request to register user");
    const body = await request.json();
    console.log("📩 Received body:", body);

    const {
      name,
      email,
      school,
      nickname,
      department,
      level,
      pin,
      phone,
      imageURL,
      uid,
    } = body;

    // Validate required fields
    if (
      !name ||
      !nickname ||
      !email ||
      !school ||
      !department ||
      !level ||
      !pin ||
      !phone ||
      !imageURL||
      !uid
    ) {
      console.log("🚨 Missing required fields");
      return NextResponse.json(
        { error: "🚫 Missing required fields" },
        { status: 400 }
      );
    }

    console.log("🔎 Checking if user already exists with phone number:", phone);
    const usersCollectionRef = collection(firestore, "usersV1");
    const userQuery = query(usersCollectionRef, where("phone", "==", phone));
    const existingUsers = await getDocs(userQuery);

    if (!existingUsers.empty) {
      console.log("⚠️ User Already Exists, prompting login");
      return NextResponse.json(
        { error: "🚫 User Already Exists, Login" },
        { status: 409 }
      );
    }

    // Hash the pin using bcrypt
    console.log("🔑 Hashing user PIN");
    const saltRounds = 10;
    const hashedPin = await bcrypt.hash(pin, saltRounds);
    console.log("✅ PIN hashed successfully");

    // Add new user to Firestore
    console.log("📝 Adding new user to Firestore");
    const newUser = {
      uid,
      name,
      nickname,
      email,
      schoolId:school,
      departmentId:department,
      level,
      pin: hashedPin, // Store the hashed pin
      phone,
      imageURL,
      createdAt: serverTimestamp(), // Firestore-generated 
    };

    const userDocRef = doc(usersCollectionRef, uid); // Specify custom ID
    await setDoc(userDocRef, newUser);
    console.log("✅ User added successfully with ID:", userDocRef.id);

    // Exclude sensitive fields before responding
    delete newUser.pin;

    return NextResponse.json(
      {
        message: "✅ Registration Successful",
        user: { id: userDocRef.id, ...newUser },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in Registration", error);
    return NextResponse.json(
      { error: "❌ Internal server error" },
      { status: 500 }
    );
  }
}
