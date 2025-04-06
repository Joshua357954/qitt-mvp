"use client"
import MainLayout from "@/components/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, MessageCircle, AlertCircle } from "lucide-react";
import { format, formatDistanceToNow, differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears, parseISO } from "date-fns";

const notifications = [
  { id: 1, type: "mention", icon: <MessageCircle className="text-blue-500" size={20} />, message: "John Doe mentioned you in a comment.", time: "2024-03-29T14:30:00Z" },
  { id: 2, type: "system", icon: <AlertCircle className="text-yellow-500" size={20} />, message: "Your subscription will expire in 3 days.", time: "2024-03-28T10:15:00Z" },
  { id: 3, type: "message", icon: <Bell className="text-green-500" size={20} />, message: "You have a new message from Jane Smith.", time: "2024-03-27T08:45:00Z" },
  { id: 4, type: "mention", icon: <MessageCircle className="text-blue-500" size={20} />, message: "Anna replied to your post.", time: "2024-03-24T18:20:00Z" },
  { id: 5, type: "system", icon: <AlertCircle className="text-yellow-500" size={20} />, message: "New system update available.", time: "2024-03-20T22:10:00Z" },
];

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
    else if (diffDays < 7) category = `${diffDays} Days Ago`;
    else if (diffWeeks === 1) category = "Last Week";
    else if (diffWeeks < 4) category = `${diffWeeks} Weeks Ago`;
    else if (diffMonths === 1) category = "Last Month";
    else if (diffMonths < 6) category = `${diffMonths} Months Ago`;
    else if (diffYears === 0) category = "Earlier This Year";
    else category = `${diffYears} Years Ago`;

    if (!acc[category]) acc[category] = [];
    acc[category].push({
      ...notif,
      formattedTime: format(notifDate, "MMMM do, yyyy h:mm a"),
    });
    return acc;
  }, {});
};

const groupedNotifications = categorizeNotifications(notifications);

export default function Notifications() {
  return (
    <MainLayout route={'Notification'}>
      <div className="mx-auto">
        <div className="space-y-6 w-full h-full overflow-y-scroll">
          {Object.entries(groupedNotifications).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">{category}</h2>
              <div className="space-y-4">
                {items.map((notif) => (
                  <Card key={notif.id} className="flex items-center gap-4 border rounded-lg shadow-sm hover:shadow-md transition p-4">
                    {notif.icon}
                    <CardContent className="flex-1">
                      <p className="text-sm text-gray-800 font-semibold">{notif.message}</p>
                      <span className="text-xs text-gray-500">{notif.formattedTime}</span>
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
