'use client';

import MainLayout from '@/components/MainLayout';
import { useState } from 'react';

const GPAApp = () => {
  const [courses, setCourses] = useState([{ name: '', grade: '', credits: '' }]);

  const gradePoints = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
    E: 1,
    F: 0,
  };

  const addCourse = () => {
    setCourses([...courses, { name: '', grade: '', credits: '' }]);
  };

  const removeCourse = (index) => {
    if (courses.length > 1) {
      const newCourses = [...courses];
      newCourses.splice(index, 1);
      setCourses(newCourses);
    }
  };

  const updateCourse = (index, field, value) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(({ grade, credits }) => {
      if (gradePoints[grade] !== undefined && credits) {
        totalPoints += gradePoints[grade] * parseFloat(credits);
        totalCredits += parseFloat(credits);
      }
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  return (
    <MainLayout route={'CGPA Calculator'}>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <p className="text-gray-600 mb-6">
          Calculate your Grade Point Average by adding your courses, selecting grades, and entering credit hours.
          Your GPA will update automatically as you make changes.
        </p>

        <div className="space-y-4 mb-6">
          {courses.map((course, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Course Name"
                value={course.name}
                onChange={(e) => updateCourse(index, 'name', e.target.value)}
                className="flex-1 p-2 border  border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <select
                value={course.grade}
                onChange={(e) => updateCourse(index, 'grade', e.target.value)}
                className=" p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Grade</option>
                <option value="A">A (5 points)</option>
                <option value="B">B (4 points)</option>
                <option value="C">C (3 points)</option>
                <option value="D">D (2 points)</option>
                <option value="E">E (1 point)</option>
                <option value="F">F (0 points)</option>
              </select>
              <input
                type="number"
                placeholder="Credits"
                min="1"
                value={course.credits}
                onChange={(e) => updateCourse(index, 'credits', e.target.value)}
                className="w-20 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {courses.length > 1 && (
                <button
                  onClick={() => removeCourse(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                  aria-label="Remove course"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={addCourse}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Course
          </button>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Your GPA Result</h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Calculated GPA:</span>
            <span className="text-3xl font-bold text-blue-600">{calculateGPA()}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Based on {courses.filter(c => c.grade && c.credits).length} completed courses
          </p>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p><strong>Note:</strong> This calculator uses a 5-point grading scale (A=5, B=4, etc.).</p>
          <p className="mt-1">Make sure to enter all your courses for an accurate GPA calculation.</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default GPAApp;