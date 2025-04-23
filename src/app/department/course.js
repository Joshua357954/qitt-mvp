import { useEffect } from "react";
import {
  BookOpenIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react/dist/cjs/lucide-react";
import useDepartmentStore from "../store/departmentStore";

const CoursesTab = () => {
  const { courses, loading, error, fetchCourses } = useDepartmentStore();

  useEffect(() => {
    fetchCourses(); // Fetch courses when component mounts
  }, [fetchCourses]);

  // Show loading state only when loading is true and there are no courses yet
  if (loading && courses.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Current Courses</h2>
        <p className="text-gray-500">⏳ Loading courses...</p>
      </div>
    );
  }

  // Show error state if there's an error and no courses to display
  if (error && courses.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Current Courses</h2>
        <p className="text-red-500">❌ {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Current Courses</h2>

      {/* Show loading indicator only if we're loading more courses but already have some */}
      {loading && courses.length > 0 && (
        <p className="text-gray-500 mb-4">⏳ Loading more courses...</p>
      )}

      {/* Show error if there's an error but we have some courses to display */}
      {error && <p className="text-red-500 mb-4">❌ {error}</p>}

      <div className="space-y-4">
        {courses.length > 0
          ? courses.map((course) => (
              <div
                key={course.code}
                className="p-4 bg-white rounded-lg shadow mb-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-gray-800">
                        {course.code} - {course.title}
                      </h3>
                    </div>

                    <div className="mt-2 flex items-start gap-2">
                      <div className="text-sm text-gray-500 space-y-1">
                        {course.lecturers?.split(',')?.map((lecturer, index) => (
                          <div key={index} className="flex items-center">
                            <UserIcon className="h-3 w-3 mr-1 text-gray-400" />
                            <span>
                              {lecturer}
                              {/* {index !== course.lecturers.length - 1 && ","} */}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    {course.creditUnit} CR
                  </span>
                </div>
              </div>
            ))
          : !loading && <p className="text-gray-500">No courses found</p>}
      </div>
    </div>
  );
};

export default CoursesTab;
