// export const baseUrl =
//   process.env.NODE_ENV === "production"
//     ? "https://qitt-1-be.onrender.com"
//     : "http://localhost:4000";

import { NextResponse } from "next/server";

import { toast } from "react-hot-toast";

export const baseUrl = "https://qitt-1-be.onrender.com";

export function Respond(json, status = 400) {
  return (
    NextResponse.json(json),
    {
      status,
    }
  );
}

export function getSessionInfo(level) {
  const currentYear = new Date().getFullYear(); // Get the current year
  const currentSession = `${currentYear - 1}/${currentYear}`; // Format current session

  // Calculate the student's starting session based on their level
  const studentSession = `${currentYear - level}/${currentYear - level + 1}`;

  return { currentSession, studentSession };
}

// const Classes = [

//   {
//     time: "9:00am - 11:00am",
//     color: "bg-green-400",
//     course: "GES 101",
//     venue: "MBA 1",
//     current: true,
//   },
//   {
//     time: "11:00am - 1:30pm",
//     color: "bg-orange-400",
//     course: "Physcis 103",
//     venue: "Physics Lab",
//   },
//   {
//     time: "12:00pm - 1:00pm",
//     color: "bg-yellow-400",
//     course: "STA 160",
//     venue: "Maths Hall",
//   },
//   {
//     time: "3:00pm - 4:00pm",
//     color: "bg-red-400",
//     course: "CSC 183",
//     venue: "Maths Hall",
//   },
// ];

export function handleStoreError(set, msg, shouldThrow = true) {
  toast.error(msg);
  set({ error: msg });
  if (shouldThrow) throw new Error(msg);
}

export function handleStoreSuccess(set, message) {
  toast.success(message);
}

import axios from "axios";

// Helper function for API requests
export const apiFetch = async (url, params, resourceType) => {
  try {
    const { data } = await axios.get(url, { params });
    if (data) {
      return { success: true, data };
    } else {
      throw new Error("Unknown error while fetching data.");
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
};

// Helper function to check if user data is valid
export const validateUserData = (userData) => {
  const { schoolId, departmentId, level } = userData || {};
  if (!schoolId || !departmentId || !level) {
    return {
      valid: false,
      message: "Missing user data: schoolId, departmentId, or level.",
    };
  }
  return { valid: true };
};

export const formatCode = (code) =>
  code.replace(/([a-zA-Z]+)([0-9.]+)/, "$1 $2").toUpperCase();

export function formatTime(inputString) {
  const matches = /(\d+)-(\d+)([a-zA-Z]+)/.exec(inputString);

  if (matches) {
    const startTime = matches[1];
    const endTime = matches[2];
    const letters = matches[3];

    const formattedStartTime = parseInt(startTime, 10) + ":00";
    const formattedEndTime = parseInt(endTime, 10) + ":00";

    return `${formattedStartTime} - ${formattedEndTime}${letters}`;
  } else {
    return null;
  }
}

export const formatTimetableEntry = (timeRange) => {
  const [start, end] = timeRange.split("-");
  const formatTime = (time) => {
    const [hour, minute] = time.trim().split(":");
    const period = parseInt(hour, 10) >= 12 ? "pm" : "am";
    const formattedHour = (parseInt(hour, 10) % 12 || 12).toString();
    return `${formattedHour}:${minute || "00"}${period}`;
  };
  return `${formatTime(start)} - ${formatTime(end)}`;
};

// 2024-06-06T12:00:00
export function fbTime(data) {
  return new Date(data?.seconds * 1000);
}

export const fDate = (date) =>
  date.toLocaleDateString("en-US", { month: "long", day: "numeric" });

export function getDay(day) {
  const suffix =
    day >= 11 && day <= 13 ? "th" : ["th", "st", "nd", "rd"][day % 10] || "th";
  return day + suffix;
}

export function convertToTime(deadlineObject) {
  const { totalSeconds, nanoseconds } = deadlineObject;

  const deadlineDate = new Date(totalSeconds * 1000);

  deadlineDate.setMilliseconds(
    deadlineDate.getMilliseconds() + nanoseconds / 1e6
  );

  const formattedDeadline = deadlineDate.toLocaleString();

  return formattedDeadline;
}

// Helper to check if we're in a browser environment
const isBrowser = () => typeof window !== "undefined";

// Function to add an item to localStorage
export function addItem(key, value) {
  if (isBrowser()) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving key "${key}" to localStorage:`, error);
    }
  }
}

// Function to get an item from localStorage
export function getItem(key) {
  if (isBrowser()) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error retrieving key "${key}" from localStorage:`, error);
      return null;
    }
  }
  return null; // Default value for SSR
}

// Function to remove an item from localStorage
export function removeItem(key) {
  if (isBrowser()) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing key "${key}" from localStorage:`, error);
    }
  }
}

// Function to update an item in localStorage
export function updateItem(key, updates) {
  if (isBrowser()) {
    try {
      const existingItem = getItem(key);
      const updatedItem = existingItem
        ? { ...existingItem, ...updates }
        : updates;
      addItem(key, updatedItem);
      return updatedItem;
    } catch (error) {
      console.error(`Error updating key "${key}" in localStorage:`, error);
      return updates; // Fallback to saving the updates as new
    }
  }
  return updates; // Default behavior for SSR
}

export const levels = [
  { label: "100", value: 100 },
  { label: "200", value: 200 },
  { label: "300", value: 300 },
  { label: "400", value: 400 },
  { label: "500", value: 500 },
];

export const schoolNames = [
  { value: "university_of_portharcourt", label: "University of Port Harcourt", abbr: "UNIPORT" },
  { value: "rivers_state_university", label: "Rivers State University", abbr: "RSU" },
  { value: "ignatius_ajuru_university", label: "Ignatius Ajuru University", abbr: "IAUE" },
  { value: "captain_elechi_amadi_polytechnic", label: "Captain Elechi Amadi Polytechnic", abbr: "CEAPOLY" },
  { value: "kenule_beeson_saro_wiwa_polytechnic", label: "Ken Saro-Wiwa Polytechnic", abbr: "KENPOLY" },
  { value: "rivers_state_college_of_health_science_and_technology", label: "Rivers State College of Health", abbr: "RSCHST" },
];

export function getCurrentDay() {
  const daysOfWeek = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  const currentDayIndex = new Date().getDay();
  return daysOfWeek[currentDayIndex].toLowerCase();
}

export function isDateInPast(dateString) {
  const [month, day] = dateString.split(" ");
  const currentYear = new Date().getFullYear();
  const providedDate = new Date(`${month} ${day}, ${currentYear}`);
  return providedDate < new Date();
}

export const googleTrackingId = "G-NW5HFZ63JV";

export const faculties = [
  { value: "agriculture", label: "Faculty of Agriculture" },
  { value: "computing", label: "Faculty of Computing" },
  { value: "dentistry", label: "Faculty of Dentistry" },
  { value: "education", label: "Faculty of Education" },
  { value: "engineering", label: "Faculty of Engineering" },
  { value: "health_sciences", label: "College of Health Sciences" },
  { value: "humanities", label: "Faculty of Humanities" },
  { value: "law", label: "Faculty of Law" },
  { value: "management_sciences", label: "Faculty of Management Sciences" },
  {
    value: "pharmaceutical_sciences",
    label: "Faculty of Pharmaceutical Sciences",
  },
  { value: "science", label: "Faculty of Science" },
  {
    value: "science_lab_technology",
    label: "School of Science Laboratory Technology",
  },
  { value: "social_sciences", label: "Faculty of Social Sciences" },
];

export const departments = [
  { value: "accounting", label: "Accounting" },
  {
    value: "adult_non_formal_education",
    label: "Adult & Non-Formal Education",
  },
  { value: "adult_education", label: "Adult Education" },
  { value: "agric_economics_extension", label: "Agric-Economics & Extension" },
  { value: "agriculture", label: "Agriculture" },
  { value: "anatomy", label: "Anatomy" },
  {
    value: "animal_environmental_biology",
    label: "Animal & Environmental Biology",
  },
  { value: "animal_science", label: "Animal Science" },
  { value: "banking_finance", label: "Banking & Finance" },
  { value: "biochemistry", label: "Biochemistry" },
  { value: "botany", label: "Botany" },
  { value: "business_education", label: "Business Education" },
  { value: "business_management", label: "Business Management" },
  { value: "chemical_engineering", label: "Chemical Engineering" },
  { value: "chemistry", label: "Chemistry" },
  { value: "civil_engineering", label: "Civil Engineering" },
  { value: "civil_law", label: "Civil Law" },
  { value: "computer_science", label: "Computer Science" },
  {
    value: "computer_science_mathematics",
    label: "Computer Science & Mathematics",
  },
  { value: "computer_with_statistics", label: "Computer with Statistics" },
  { value: "creative_arts", label: "Creative Arts" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "dentistry_dental_surgery", label: "Dentistry & Dental Surgery" },
  {
    value: "drama_dramatic_performing_arts",
    label: "Drama/Dramatic/Performing Arts",
  },
  { value: "early_childhood_education", label: "Early Childhood Education" },
  { value: "economics", label: "Economics" },
  { value: "education_accounting", label: "Education & Accounting" },
  { value: "education_biology", label: "Education & Biology" },
  { value: "education_chemistry", label: "Education & Chemistry" },
  {
    value: "education_computer_science",
    label: "Education & Computer Science",
  },
  { value: "education_economics", label: "Education & Economics" },
  {
    value: "education_english_language",
    label: "Education & English Language",
  },
  { value: "education_french", label: "Education & French" },
  { value: "education_geography", label: "Education & Geography" },
  { value: "education_history", label: "Education & History" },
  { value: "education_mathematics", label: "Education & Mathematics" },
  { value: "education_physics", label: "Education & Physics" },
  {
    value: "education_political_science",
    label: "Education & Political Science",
  },
  {
    value: "education_religious_studies",
    label: "Education & Religious Studies",
  },
  { value: "education_social_science", label: "Education & Social Science" },
  { value: "education_social_studies", label: "Education and Social Studies" },
  { value: "education_arts", label: "Education Arts" },
  { value: "education_fine_art", label: "Education Fine Art" },
  {
    value: "education_foundations_management",
    label: "Education Foundations and Management",
  },
  {
    value: "educational_psychology_guidance_counselling",
    label: "Educational/Psychology Guidance & Counselling",
  },
  {
    value: "electrical_electronics_engineering",
    label: "Electrical/Electronics Engineering",
  },
  { value: "electrical_engineering", label: "Electrical Engineering" },
  { value: "electronics_engineering", label: "Electronics Engineering" },
  { value: "english_language", label: "English Language" },
  { value: "environmental_education", label: "Environmental Education" },
  { value: "environmental_engineering", label: "Environmental Engineering" },
  { value: "environmental_technology", label: "Environmental Technology" },
  { value: "fine_arts_design", label: "Fine Arts & Design" },
  { value: "fisheries", label: "Fisheries" },
  { value: "food_science_technology", label: "Food Science & Technology" },
  { value: "forestry_wildlife", label: "Forestry & Wildlife" },
  { value: "french", label: "French" },
  {
    value: "geography_environmental_management",
    label: "Geography & Environmental Management",
  },
  { value: "geology", label: "Geology" },
  { value: "history", label: "History" },
  { value: "home_science", label: "Home Science" },
  {
    value: "hospitality_tourism_management",
    label: "Hospitality & Tourism Management",
  },
  {
    value: "human_kinetics_health_education",
    label: "Human Kinetics & Health Education",
  },
  { value: "industrial_chemistry", label: "Industrial Chemistry" },
  { value: "information_technology", label: "Information Technology" },
  {
    value: "library_information_science",
    label: "Library & Information Science",
  },
  {
    value: "linguistics_communication_studies",
    label: "Linguistics & Communication Studies",
  },
  {
    value: "linguistics_nigeria_language",
    label: "Linguistics & Nigeria Language",
  },
  { value: "marketing", label: "Marketing" },
  { value: "mathematics", label: "Mathematics" },
  { value: "mathematics_statistics", label: "Mathematics & Statistics" },
  {
    value: "mathematics_computer_science",
    label: "Mathematics with Computer Science",
  },
  { value: "mechanical_engineering", label: "Mechanical Engineering" },
  { value: "mechatronics_engineering", label: "Mechatronics Engineering" },
  { value: "medicine_surgery", label: "Medicine & Surgery" },
  { value: "microbiology", label: "Microbiology" },
  { value: "music", label: "Music" },
  { value: "natural_gas_engineering", label: "Natural Gas Engineering" },
  { value: "nursing_nursing_science", label: "Nursing/Nursing Science" },
  { value: "petroleum_gas_engineering", label: "Petroleum & Gas Engineering" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "philosophy", label: "Philosophy" },
  { value: "physical_education", label: "Physical Education" },
  { value: "physics", label: "Physics" },
  { value: "physics_electronics", label: "Physics with Electronics" },
  { value: "physiology", label: "Physiology" },
  {
    value: "plant_science_biotechnology",
    label: "Plant Science & Biotechnology",
  },
  {
    value: "political_administrative_studies",
    label: "Political & Administrative Studies",
  },
  { value: "primary_education", label: "Primary Education" },
  { value: "public_administration", label: "Public Administration" },
  { value: "pure_applied_mathematics", label: "Pure & Applied Mathematics" },
  { value: "pure_industrial_chemistry", label: "Pure & Industrial Chemistry" },
  {
    value: "religious_cultural_studies",
    label: "Religious & Cultural Studies",
  },
  { value: "science_education", label: "Science Education" },
  {
    value: "science_laboratory_technology",
    label: "Science Laboratory Technology",
  },
  { value: "social_work", label: "Social Work" },
  { value: "sociology", label: "Sociology" },
  { value: "teacher_education_science", label: "Teacher Education Science" },
  { value: "theatre_film_studies", label: "Theatre & Film Studies" },
  { value: "zoology", label: "Zoology" },
];

export const coursemates = [
  {
    id: 1,
    name: "Adebayo Ogunlesi",
    profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
    email: "adebayo.ogunlesi@example.com",
  },
  {
    id: 2,
    name: "Chioma Eze",
    profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
    email: "chioma.eze@example.com",
  },
  {
    id: 3,
    name: "Emeka Okonkwo",
    profilePic: "https://randomuser.me/api/portraits/men/75.jpg",
    email: "emeka.okonkwo@example.com",
  },
  {
    id: 4,
    name: "Amina Mohammed",
    profilePic: "https://randomuser.me/api/portraits/women/63.jpg",
    email: "amina.mohammed@example.com",
  },
  {
    id: 5,
    name: "Oluwaseun Adebayo",
    profilePic: "https://randomuser.me/api/portraits/men/55.jpg",
    email: "oluwaseun.adebayo@example.com",
  },
  {
    id: 6,
    name: "Ngozi Chukwu",
    profilePic: "https://randomuser.me/api/portraits/women/82.jpg",
    email: "ngozi.chukwu@example.com",
  },
  {
    id: 7,
    name: "Ibrahim Musa",
    profilePic: "https://randomuser.me/api/portraits/men/28.jpg",
    email: "ibrahim.musa@example.com",
  },
  {
    id: 8,
    name: "Folake Adeleke",
    profilePic: "https://randomuser.me/api/portraits/women/90.jpg",
    email: "folake.adeleke@example.com",
  },
  {
    id: 9,
    name: "Chinedu Nwachukwu",
    profilePic: "https://randomuser.me/api/portraits/men/67.jpg",
    email: "chinedu.nwachukwu@example.com",
  },
  {
    id: 10,
    name: "Aisha Bello",
    profilePic: "https://randomuser.me/api/portraits/women/58.jpg",
    email: "aisha.bello@example.com",
  },
  {
    id: 11,
    name: "Obinna Eze",
    profilePic: "https://randomuser.me/api/portraits/men/49.jpg",
    email: "obinna.eze@example.com",
  },
  {
    id: 12,
    name: "Yewande Johnson",
    profilePic: "https://randomuser.me/api/portraits/women/71.jpg",
    email: "yewande.johnson@example.com",
  },
];

export const courses = [
  {
    code: "MTH270.1",
    title: "Numerical Analysis",
    lecturers: ["Prof. Adebayo Ojo", "Dr. Fatima Bello"],
    credits: 3,
  },
  {
    code: "MTH210.1",
    title: "Linear Algebra",
    lecturers: ["Dr. Funmi Adeleke", "Prof. Chukwuma Eze"],
    credits: 3,
  },
  {
    code: "STA260.1",
    title: "Introduction to Probability and Statistics",
    lecturers: ["Prof. Ibrahim Musa", "Dr. Amina Yusuf"],
    credits: 3,
  },
  {
    code: "CSC280.1",
    title: "Introduction to Computer Programming (Fortran)",
    lecturers: ["Dr. Chinedu Okonkwo", "Prof. Ngozi Ibe"],
    credits: 4,
  },
  {
    code: "CSC281.1",
    title: "Computer System Fundamentals",
    lecturers: ["Prof. Amina Mohammed", "Dr. Olumide Adekunle"],
    credits: 3,
  },
  {
    code: "CSC283.1",
    title: "Introduction to Information Systems and File Structures",
    lecturers: ["Dr. Olumide Adewale", "Prof. Yusuf Bello"],
    credits: 3,
  },
  {
    code: "CSC284.1",
    title: "Introduction to Logic Design",
    lecturers: ["Prof. Yusuf Bello", "Dr. Chioma Nwachukwu"],
    credits: 4,
  },
  {
    code: "CSC288.1",
    title: "Structured Programming",
    lecturers: ["Dr. Ngozi Eze", "Prof. Ahmed Lawal"],
    credits: 4,
  },
];

// export const courses = [
//   { name: "MTH270.1", description: "Numerical analysis" },
//   { name: "MTH210.1", description: "Linear Algebra" },
//   {
//     name: "STA260.1",
//     description: "Introduction to probability and statistics",
//   },
//   {
//     name: "CSC280.1",
//     description: "Introduction to Computer programming (Fortran)",
//   },
//   { name: "CSC281.1", description: "Computer system fundamentals" },
//   {
//     name: "CSC283.1",
//     description: "Introduction to information systems and File structures",
//   },
//   { name: "CSC284.1", description: "Introduction to Logic Design" },
//   { name: "CSC288.1", description: "Structured programming" },
// ]; //
// : dept === "mechanical_engineering"
// ? [
//     {
//       name: "MEC101.1",
//       description: "Introduction to Mechanical Engineering",
//     },
//     { name: "MEC201.1", description: "Engineering Thermodynamics I" },
//     { name: "MEC202.1", description: "Strength of Materials" },
//     { name: "MEC203.1", description: "Fluid Mechanics I" },
//     { name: "MEC204.1", description: "Engineering Mechanics" },
//     { name: "MEC205.1", description: "Mechanical Engineering Drawing" },
//     { name: "MEC301.1", description: "Manufacturing Processes I" },
//     { name: "MEC302.1", description: "Machine Design I" },
//   ]
// : [];
