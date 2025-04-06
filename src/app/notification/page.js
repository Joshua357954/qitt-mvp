"use client";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, MessageCircle, AlertCircle } from "lucide-react";
import {
  format,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  parseISO,
  subDays,
  subWeeks,
  subMonths,
  subYears,
} from "date-fns";

// Function to generate random dates in different time ranges
const generateRandomDates = (count) => {
  const now = new Date();
  const dates = [];

  // Generate dates in different time periods
  for (let i = 0; i < count; i++) {
    let date;
    const randomType = Math.floor(Math.random() * 8);

    switch (randomType) {
      case 0: // Today
        date = new Date(now);
        date.setHours(Math.floor(Math.random() * 24));
        date.setMinutes(Math.floor(Math.random() * 60));
        break;
      case 1: // Yesterday
        date = subDays(now, 1);
        date.setHours(Math.floor(Math.random() * 24));
        date.setMinutes(Math.floor(Math.random() * 60));
        break;
      case 2: // 2-6 days ago
        date = subDays(now, 2 + Math.floor(Math.random() * 5));
        break;
      case 3: // 1-3 weeks ago
        date = subWeeks(now, 1 + Math.floor(Math.random() * 3));
        break;
      case 4: // 1-5 months ago
        date = subMonths(now, 1 + Math.floor(Math.random() * 5));
        break;
      case 5: // 6-11 months ago
        date = subMonths(now, 6 + Math.floor(Math.random() * 6));
        break;
      case 6: // 1-2 years ago
        date = subYears(now, 1 + Math.floor(Math.random() * 2));
        break;
      default: // More than 2 years ago
        date = subYears(now, 3 + Math.floor(Math.random() * 5));
    }

    dates.push(date.toISOString());
  }

  return dates;
};

// Generate random dates
const randomDates = generateRandomDates(15);

const notificationTypes = [
  {
    type: "mention",
    icon: <MessageCircle className="text-blue-500" size={20} />,
    message: (name) => `${name} mentioned you in a comment.`,
  },
  {
    type: "system",
    icon: <AlertCircle className="text-yellow-500" size={20} />,
    message: () => {
      const messages = [
        "Your subscription will expire soon.",
        "New system update available.",
        "Maintenance scheduled for tomorrow.",
        "New feature released!",
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    },
  },
  {
    type: "message",
    icon: <Bell className="text-green-500" size={20} />,
    message: (name) => `You have a new message from ${name}.`,
  },
];

const names = [
  "John Doe",
  "Jane Smith",
  "Anna Johnson",
  "Mike Brown",
  "Sarah Wilson",
];

// Generate notifications with random data
const generateNotifications = () => {
  return randomDates.map((date, index) => {
    const notifType =
      notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    const name = names[Math.floor(Math.random() * names.length)];

    return {
      id: index + 1,
      type: notifType.type,
      icon: notifType.icon,
      message:
        typeof notifType.message === "function"
          ? notifType.message(name)
          : notifType.message,
      time: date,
    };
  });
};

const notifications = generateNotifications();

const categorizeNotifications = (notifications) => {
  return notifications.reduce((acc, notif) => {
    const notifDate = parseISO(notif.time);
    const now = new Date();

    const diffDays = differenceInDays(now, notifDate);
    const diffWeeks = differenceInWeeks(now, notifDate);
    const diffMonths = differenceInMonths(now, notifDate);
    const diffYears = differenceInYears(now, notifDate);

    let category;
    if (diffDays === 0) category = "Today";
    else if (diffDays === 1) category = "Yesterday";
    else if (diffDays < 7) category = "This Week";
    else if (diffWeeks === 1) category = "Last Week";
    else if (diffWeeks < 4) category = "This Month";
    else if (diffMonths === 1) category = "Last Month";
    else if (diffMonths < 12) category = "This Year";
    else category = "Older";

    if (!acc[category]) acc[category] = [];
    acc[category].push({
      ...notif,
      formattedTime: format(notifDate, "MMMM do, yyyy h:mm a"),
    });
    return acc;
  }, {});
};

const groupedNotifications = categorizeNotifications(notifications);

// Sort categories in chronological order
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

const sortedCategories = categoryOrder.filter(
  (cat) => groupedNotifications[cat]
);

export default function Notifications() {
  return (
    <MainLayout route={"Notification"}>
      <div className="sm:mx-auto mx-5">
        <div className="space-y-6 w-full h-full">
          {sortedCategories.map((category) => (
            <div key={category}>
              <h2 className="text-sm font-medium text-gray-700 mb-2">
                {category}
              </h2>
              <div className="space-y-4">
                {groupedNotifications[category].map((notif) => (
                  <Card
                    key={notif.id}
                    className="flex items-center gap-4 border rounded-lg shadow-sm hover:shadow-md transition p-4"
                  >
                    {notif.icon}
                    <CardContent className="flex-1 p-0">
                      <p className="text-sm text-gray-800 font-semibold">
                        {notif.message}
                      </p>
                      <span className="text-xs text-gray-500">
                        {notif.formattedTime}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
