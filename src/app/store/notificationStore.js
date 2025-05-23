// store/notificationStore.js
import { create } from "zustand";
import axios from "axios";
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
import { AlertCircle, MessageCircle, Bell } from "lucide-react";
import { addNotification } from "@/libs/notification/addNotification";

const iconMap = {
  assignments: <AlertCircle className="text-yellow-500" size={20} />,
  system: <MessageCircle className="text-blue-500" size={20} />,
  message: <Bell className="text-green-500" size={20} />,
};

const toDate = (ts) =>
  ts?.seconds
    ? new Date(ts.seconds * 1000 + Math.floor(ts.nanoseconds / 1e6))
    : new Date();

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

const useNotificationStore = create((set) => ({
  loading: false,
  notifications: [], // Raw notification list
  grouped: {}, // Categorized notifications
  fetchNotifications: async (userId, spaceUID) => {
    set({ loading: true });

    try {
      const { data } = await axios.get("/api/notification", {
        params: { userId, spaceUID },
      });

      const notifications = data.notifications.map((n, i) => {
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

      const grouped = categorize(notifications);

      set({ notifications, grouped });
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      set({ notifications: [], grouped: {} });
    } finally {
      set({ loading: false });
    }
  },

  addNewNotification: (data) =>
    set((state) => ({ notifications: [...state.notifications, data] })),
}));

export default useNotificationStore;
