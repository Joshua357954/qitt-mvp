import useAuthStore from "@/app/store/authStore";

/**
 * Checks if a user has access to a particular action based on status and permissions.
 *
 * Rules:
 * - 'admin' status or 'full' permission grants access to everything
 * - 'can-post' checks if any permission starts with 'post-'
 * - 'post-*' requires exact match in permissions
 * - Other actions require an exact match
 *
 * @param {Object} departmentSpace - The user's department space object
 * @param {string} action - The action/resource to check permission for
 * @returns {boolean} - True if access is granted, false otherwise
 */
export const RULES = {
  VIEW_MANAGE_SPACE: "view-manage-space",
  POST_NOTE: "post-note",
  POST_ANNOUNCEMENT: "post-announcement",
  POST_ASSIGNMENT: "post-assignment",
  POST_TIMETABLE: "post-timetable",
  POST_RESOURCES: "post-resources",
  POST_COURSES: "post-courses",
  CAN_POST: "can-post", // special case handled in hasAccess
};

export function hasAccess(action) {
  const { user } = useAuthStore();

  const departmentSpace = user?.department_space;

  if (!departmentSpace || !action) return false;

  const { status, permissions } = departmentSpace;

  const isAdmin = status === "admin" || permissions?.includes("full");
  if (isAdmin) return true;

  if (action === "can-post") {
    return permissions?.some((p) => p.startsWith("post-"));
  }

  if (action.startsWith("post-")) {
    return permissions?.includes(action);
  }

  return permissions?.includes(action);
}
