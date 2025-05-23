"use client";
import { useEffect } from "react";
import useAuthStore from "../store/authStore";
import useNotificationStore from "../store/notificationStore";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent } from "@/components/ui/card";

const NotificationSkeleton = () => (
  <div className="animate-pulse space-y-4 ">
    {[...Array(4)].map((_, i) => (
      <Card key={i} className="flex items-center gap-4 p-4 shadow-sm hover:shadow-md">
        <div className="h-6 w-6 rounded-full bg-gray-300" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-full rounded bg-gray-300" />
          <div className="h-3 w-2/3 rounded bg-gray-200" />
        </div>
      </Card>
    ))}
  </div>
);

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
  const { loading, grouped, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    if (user?.uid && user?.department_space?.spaceId) {
      fetchNotifications(user.uid, user.department_space.spaceId);
    }
  }, [user?.uid, user?.department_space?.spaceId]);

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
                <h2 className="text-sm font-medium text-gray-700 mb-2">{cat}</h2>
                <div className="space-y-4">
                  {grouped[cat].map(({ id, icon, message, formattedTime }) => (
                    <Card key={id} className="flex items-center gap-4 p-4 shadow-sm hover:shadow-md">
                      {icon}
                      <CardContent className="flex-1 p-0">
                        <p className="text-sm font-semibold text-gray-800">{message}</p>
                        <span className="text-xs text-gray-500">{formattedTime}</span>
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
