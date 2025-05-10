"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, Bell } from "lucide-react";
import useDepartmentStore from "../store/departmentStore";
import { useEffect, useState } from "react";
import { fbTime } from "@/utils/utils";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full w-full">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const AnnouncementMessage = ({ title, message, updatedAt, priority = "normal", tags = [] }) => {
  const priorityIcons = {
    high: <AlertTriangle className="w-4 h-4 text-red-500" />,
    medium: <Bell className="w-4 h-4 text-yellow-500" />,
    normal: <Info className="w-4 h-4 text-blue-500" />,
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <div className="flex items-center gap-2">
            {priorityIcons[priority]}
            <span className="text-sm text-gray-500">
              {updatedAt ? new Date(fbTime(updatedAt)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A"}
            </span>
          </div>
        </div>
        <p className="text-gray-700 mb-3">{message}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const AnnouncementSection = () => {
  const { announcements, fetchAnnouncements } = useDepartmentStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🌟 Enhanced fetch logic with debugging
  useEffect(() => {
    (async () => {
      try {
        setError(null);
        console.log("Fetching announcements...");
        await fetchAnnouncements();
        console.log("Announcements fetched:", announcements);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch announcements. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchAnnouncements]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full h-full">
      <h2 className="text-md sm:text-lg font-medium mb-2">Today</h2>
      {announcements.length === 0 ? (
        <p className="text-gray-500">No announcements available.</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement, idx) => (
            <AnnouncementMessage key={idx} {...announcement} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementSection;
