"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import {
  format,
  parseISO,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  subWeeks,
  subMonths,
  isAfter,
} from "date-fns";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, MessageCircle, Bell } from "lucide-react";

const NotificationSkeleton = () => (
  <div className="animate-pulse space-y-4 ">
    {[...Array(4)].map((_, i) => (
      <Card
        key={i}
        className="flex items-center gap-4 p-4 shadow-sm hover:shadow-md"
      >
        <div className="h-6 w-6 rounded-full bg-gray-300" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-full rounded bg-gray-300" />
          <div className="h-3 w-2/3 rounded bg-gray-200" />
        </div>
      </Card>
    ))} 
  </div>
);

const iconMap = {
  assignments: <AlertCircle className="text-yellow-500" size={20} />,
  system: <MessageCircle className="text-blue-500" size={20} />,
  message: <Bell className="text-green-500" size={20} />,
};

const toDate = (ts) =>
  ts?.seconds
    ? new Date(ts.seconds * 1000 + Math.floor(ts.nanoseconds / 1e6))
    : new Date();

const fetchNotifications = async (userId, spaceUID) => {
  try {
    const { data } = await axios.get("/api/notification", {
      params: { userId, spaceUID },
    });

    console.log("Fetched notifications:", data.notifications);

    return data.notifications.map((n, i) => {
      const createdDate = toDate(n.createdAt);
      return {
        id: n.id ?? `api-${i}`,
        icon: iconMap[n.resourceType] || (
          <AlertCircle className="text-gray-500" size={20} />
        ),
        message: n.message || "No message available.",
        time: createdDate.toISOString(),
        formattedTime: format(createdDate, "MMMM do, yyyy h:mm a"),
      };
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

// ✅ Updated categorize function using date-fns helpers
const categorize = (list) => {
  const now = new Date();
  const lastWeek = subWeeks(now, 1);
  const lastMonth = subMonths(now, 1);

  return list.reduce((acc, n) => {
    const date = parseISO(n.time);
    let category = "Older";

    if (isToday(date)) category = "Today";
    else if (isYesterday(date)) category = "Yesterday";
    else if (isThisWeek(date)) category = "This Week";
    else if (isAfter(date, lastWeek)) category = "Last Week";
    else if (isThisMonth(date)) category = "This Month";
    else if (isAfter(date, lastMonth)) category = "Last Month";
    else if (isThisYear(date)) category = "This Year";

    (acc[category] ||= []).push(n);
    return acc;
  }, {});
};

const categoryOrder = [
  "Today",
  "Yesterday",
  "This Week",
  "Last Week",
  "This Month",
  "Last Month",
  "This Year",
  "Older",
];

export default function Notifications() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      console.log("Fetching notifications for user:", user.uid);
      const notes = await fetchNotifications(
        user.uid,
        user.department_space.spaceId
      );
      const categorized = categorize(notes);
      console.log("Categorized notifications:", categorized);
      setGrouped(categorized);
      setLoading(false);
    };
    load();
  }, [user?.uid, user?.department_space.spaceId]);

  return (
    <MainLayout route="Notification">
      <div className="sm:mx-auto px-5 sm:px-24 space-y-6 w-full">
        {loading ? (
          <NotificationSkeleton />
        ) : (
          categoryOrder
            .filter((cat) => grouped[cat])
            .map((cat) => (
              <div key={cat}>
                <h2 className="text-sm font-medium text-gray-700 mb-2">
                  {cat}
                </h2>
                <div className="space-y-4">
                  {grouped[cat].map(({ id, icon, message, formattedTime }) => (
                    <Card
                      key={id}
                      className="flex items-center gap-4 p-4 shadow-sm hover:shadow-md"
                    >
                      {icon}
                      <CardContent className="flex-1 p-0">
                        <p className="text-sm font-semibold text-gray-800">
                          {message}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formattedTime}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
        )}
        {!loading && Object.keys(grouped).length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            🚫 No notifications available.
          </div>
        )}
      </div>
    </MainLayout>
  );
}
