
// usersSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  timetable: [],
  coursemates: [],
  assignments: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addTimetable: (state, action) => {
      state.timetable = action.payload;
    },
    addCoursemates: (state, action) => {
      state.coursemates = action.payload;
    },
    addAssignments: (state, action) => {
      state.assignments = action.payload;
    },
    // You can add more reducers if needed
  },
});

export const { addTimetable, addCoursemates, addAssignments } = usersSlice.actions;

export default usersSlice.reducer;
