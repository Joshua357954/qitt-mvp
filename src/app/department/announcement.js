"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, Info, Bell } from "lucide-react";


const AnnouncementMessage = ({ 
  title, 
  message, 
  timestamp, 
  priority = "normal", 
  tags = [] 
}) => {
  const priorityIcons = {
    high: <AlertTriangle className="w-4 h-4 text-red-500" />,
    medium: <Bell className="w-4 h-4 text-yellow-500" />,
    normal: <Info className="w-4 h-4 text-blue-500" />
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <div className="flex items-center gap-2">
            {priorityIcons[priority]}
            <span className="text-sm text-gray-500 flex items-center gap-1">
              {/* <Clock className="w-3 h-3" /> */}
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        
        <p className="text-gray-700 mb-3">{message}</p>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="text-xs px-2 py-1"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Announcement section with dummy data
const AnnouncementSection = () => {
  const announcements = [
    {
      id: 1,
      title: "Exam Schedule Update",
      message: "The final exams for CSC 101 have been rescheduled to next week Monday. Please check the portal for the new timetable.",
      timestamp: "2023-11-15T09:30:00",
      priority: "high",
      tags: ["exam", "important"]
    },
    {
      id: 2,
      title: "Departmental Meeting",
      message: "There will be a mandatory meeting for all computer science students on Friday at 2pm in LT3.",
      timestamp: "2023-11-14T14:15:00",
      priority: "medium",
      tags: ["meeting", "department"]
    },
    {
      id: 3,
      title: "Assignment Submission",
      message: "The deadline for Data Structures assignment has been extended by 48 hours. Late submissions will still attract penalty.",
      timestamp: "2023-11-13T16:45:00",
      tags: ["assignment", "deadline"]
    },
    {
      id: 4,
      title: "Guest Lecture Announcement",
      message: "We're hosting a guest lecture on AI in Healthcare by Dr. Ngozi from Google. Venue: Faculty Auditorium, Time: 10am tomorrow.",
      timestamp: "2023-11-12T11:20:00",
      priority: "medium",
      tags: ["lecture", "event"]
    }
  ];

  return (
    <div className="w-full h-full">
      <h2 className="text-md sm:text-lg font-medium mb-2 flex items-center gap-2">
        Today
      </h2>
      
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <AnnouncementMessage
            key={announcement.id}
            title={announcement.title}
            message={announcement.message}
            timestamp={announcement.timestamp}
            priority={announcement.priority}
            tags={announcement.tags}
          />
        ))}
      </div>
    </div>
  );
};

export default AnnouncementSection;