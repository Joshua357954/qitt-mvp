
'Creators Api'
Auth:
api/login    [email, pin, uid ] (POST)
api/register [name, email, schoolName, course, gender, dob, level, pin, phonenumber] (POST)

Assignment:
Creator:
api/assignment/add [assignment props]
api/assignment/delete

Normal:
api/assignment/get


Course:
Creator:
api/course/addCourse
api/course/addCourseOutline

Normal:
api/course/getCourses
api/course/getCourseOutline
Todo : Create Delete Course and CourseOutline

Resources:
Creator:
api/materials/add [ materials prop ]
api/materials/delete

Normal:
api/materials/get

Notification:
Creator:
api/notification/general  (add)
api/notification/user  (add)

Normal:
api/notification/general  (get)
api/notification/user  (get)


Timetable:
Creator:
api/timetable/add

Normal:
api/timetable/get
Todo: Create Delete Timetable data

User:
Creators:
api/user/addCarryOverCourses

Normal:
api/user/getCarryOverCourses
api/user/getCoursemates
api/user/getCarryOverTimetable
api/user/getUser/[slug]













'MVP Api'
Auth:
api/login    [email, pin, uid ] (POST)
api/register [name, email, schoolName, course, gender, dob, level, pin, phonenumber] (POST)

Assignment:
Creator:
api/assignment/add [use firebase storage to get url of media and add to props]
api/assignment/delete


Normal:
api/assignment/get


Course:
Creator:
api/course/addCourse
api/course/updateCourseOutline
api/deleteCourse

Normal:
api/course/getCourses


Resources:
Creator:
api/materials/add [ materials prop ]
api/materials/delete

Normal:
api/materials/get


Timetable:
Creator:
api/timetable/add
api/timetable/update (update timetable data)

Normal:
api/timetable/get

User:
Creators:
api/user/addCarryOverCourses

Normal:
api/user/getCarryOverCourses
api/user/getCoursemates
api/user/getCarryOverTimetable  (filter courses in timetable to keep only carryOverCourses data)
api/user/getUser/[slug]









