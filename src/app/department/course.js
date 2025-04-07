import { courses } from "@/utils/utils";
import { BookOpenIcon, UserIcon, UsersIcon } from "lucide-react/dist/cjs/lucide-react";

const CoursesTab = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Current Courses</h2>
      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.code}
            className="p-4 bg-white rounded-lg shadow mb-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {/* <BookOpenIcon className="h-5 w-5 text-blue-500" /> */}
                  <h3 className="font-bold text-lg text-gray-800">
                    {course.code} - {course.title}
                  </h3>
                </div>

                <div className="mt-2 flex items-start gap-2">
                  {/* <UsersIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" /> */}
                  <div className="text-sm text-gray-500 space-y-1">
                    {course.lecturers.map((lecturer, index) => (
                      <div key={index} className="flex items-center">
                        <UserIcon className="h-3 w-3 mr-1 text-gray-400" />
                        <span>
                          {lecturer}
                          {index !== course.lecturers.length - 1 && ","}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                {course.credits} CR
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesTab;
