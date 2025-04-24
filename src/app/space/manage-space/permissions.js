import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useManageSpaceStore from "@/app/store/manageSpaceStore";
import useAuthStore from "@/app/store/authStore";
import { RULES } from "@/utils/useHasAccess";
import toast from "react-hot-toast";

export default function Permissions() {
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [newRole, setNewRole] = useState({
    email: "",
    permissions: {},
  });
  const [userToRevoke, setUserToRevoke] = useState(null);

  const { error, approvedUsers, addSpaceAdmin, updateSpaceAdmin } =
    useManageSpaceStore();
  const { user } = useAuthStore();

  const permissionsList = useMemo(() => Object.keys(RULES), []);

  const currentUserPermissions = useMemo(() => {
    if (!user || !approvedUsers) return [];
    const currentUser = approvedUsers.find((u) => u.uid === user.uid);
    return currentUser?.department_space?.permissions || [];
  }, [user, approvedUsers]);

  const isCurrentUserAdmin = useMemo(
    () => currentUserPermissions.includes("full"),
    [currentUserPermissions]
  );

  // Get users without permissions
  const usersWithoutPermissions = useMemo(() => {
    if (!approvedUsers) return [];
    return approvedUsers.filter(
      (u) =>
        !u?.department_space?.permissions ||
        u.department_space.permissions.length === 0
    );
  }, [approvedUsers]);

  const roles = useMemo(() => {
    if (!user || !approvedUsers) return [];

    return approvedUsers
      .map((u, index) => ({
        id: index + 1,
        name: u.name || "Unknown",
        email: u.email || "N/A",
        permissions: u?.department_space?.permissions || [],
        isCurrentUser: user?.uid === u.uid,
        hasPermissions: (u?.department_space?.permissions?.length || 0) > 0,
      }))
      .filter((role) => role.hasPermissions);
  }, [user, approvedUsers]);

  const handlePermissionChange = useCallback((permission, checked) => {
    setNewRole((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked,
      },
    }));
  }, []);

  const handleRevokePermissionChange = useCallback((permission, checked) => {
    setUserToRevoke((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        updatedPermissions: {
          ...prev.updatedPermissions,
          [permission]: checked,
        },
      };
    });
  }, []);

  const prepareRevokeModal = useCallback(
    (role) => {
      const initialPermissions = permissionsList.reduce((acc, permission) => {
        acc[permission] = role.permissions.includes(permission);
        return acc;
      }, {});

      setUserToRevoke({
        email: role.email,
        name: role.name,
        currentPermissions: role.permissions,
        updatedPermissions: initialPermissions,
      });
      setShowRevokeModal(true);
    },
    [permissionsList]
  );

  useEffect(() => {
    if (!newRole.email && isCurrentUserAdmin) {
      const updatedPermissions = permissionsList.reduce((acc, permission) => {
        acc[permission] = currentUserPermissions.includes(permission);
        return acc;
      }, {});

      setNewRole((prev) => ({
        ...prev,
        permissions: updatedPermissions,
      }));
    }
  }, [
    isCurrentUserAdmin,
    currentUserPermissions,
    permissionsList,
    newRole.email,
  ]);

  // Add New Admin Zustand
  const handleAddRole = useCallback(async () => {
    if (!newRole.email || !Object.values(newRole.permissions).some(Boolean)) {
      console.log("Requirements Not Satisfied !!");
      return;
    }
    const permissionKeys = Object.entries(newRole.permissions)
      .filter(([key, value]) => value)
      .map(([key]) => key);

    toast.loading("Adding a new Admin");
    try {
      await addSpaceAdmin({
        email: newRole.email,
        permissions: permissionKeys,
      });

      toast.dismiss();
      if (error) toast.error("User Error!");
      else toast.success("Added User as Admin");

      setShowAddRoleModal(false);
      setNewRole({ email: "", permissions: {} });
    } catch (error) {
      toast.dismiss();
      toast.error("An error Occured 😕");
      console.error("Error adding role:", error);
    }
  }, [newRole]);

  // Revoke Admin Zustand
  const handleUpdatePermissions = useCallback(async () => {
    if (!userToRevoke) return;

    const updatedPermissionKeys = Object.entries(
      userToRevoke.updatedPermissions
    )
      .filter(([key, value]) => value)
      .map(([key]) => key);

    toast.loading("Updating permissions...");
    try {
      await updateSpaceAdmin({
        email: userToRevoke.email,
        permissions: updatedPermissionKeys,
      });

      toast.dismiss();
      if (error) {
        toast.error("Failed to update permissions");
      } else {
        toast.success("Permissions updated successfully");
      }
      setShowRevokeModal(false);
      setUserToRevoke(null);
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred while updating permissions");
      console.error("Error updating permissions:", error);
    }
  }, [userToRevoke, updateSpaceAdmin]);

  const hasValidPermissions = useMemo(
    () => Object.values(newRole.permissions).some(Boolean),
    [newRole.permissions]
  );

  const shouldShowAddButton =
    isCurrentUserAdmin && usersWithoutPermissions.length > 0;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-800">Admin Roles</h2>
        {shouldShowAddButton && (
          <Button
            onClick={() => setShowAddRoleModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            + Add Admin
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-blue-800">{role.name}</h3>
                  {role.isCurrentUser && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-600"
                    >
                      You
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {role.email}
                </p>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {role.permissions.map((perm) => (
                    <Badge
                      key={perm}
                      variant="outline"
                      className="border-blue-200 text-blue-600"
                    >
                      {RULES[perm] || perm}
                    </Badge>
                  ))}
                </div>
              </div>
              {!role.isCurrentUser && isCurrentUserAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => prepareRevokeModal(role)}
                >
                  Revoke/Edit
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Admin Modal */}
      {isCurrentUserAdmin && (
        <Dialog open={showAddRoleModal} onOpenChange={setShowAddRoleModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-blue-800">Add New Admin</DialogTitle>
              <DialogDescription>
                Grant admin privileges to a Department member
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label className="text-blue-800">Select Student</Label>
                <Select
                  onValueChange={(value) => {
                    const selectedUser = usersWithoutPermissions.find(
                      (u) => u.email === value
                    );
                    setNewRole({
                      email: value,
                      name: selectedUser?.name || "",
                      permissions: {},
                    });
                  }}
                  value={newRole.email}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {usersWithoutPermissions.map((user) => (
                      <SelectItem key={user.uid} value={user.email}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-blue-800">Permissions</Label>
                <div className="space-y-2 mt-2">
                  {permissionsList.map((permission) => (
                    <div
                      key={permission}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`permission-${permission}`}
                        checked={newRole.permissions[permission] || false}
                        onCheckedChange={(checked) =>
                          handlePermissionChange(permission, checked)
                        }
                      />
                      <Label
                        htmlFor={`permission-${permission}`}
                        className="text-blue-800 capitalize"
                      >
                        {RULES[permission]}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddRoleModal(false)}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleAddRole}
                disabled={!newRole.email || !hasValidPermissions}
              >
                Add Admin
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Revoke/Edit Permissions Modal */}
      {isCurrentUserAdmin && userToRevoke && (
        <Dialog open={showRevokeModal} onOpenChange={setShowRevokeModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-blue-800">
                Edit Permissions for {userToRevoke.name}
              </DialogTitle>
              <DialogDescription>
                Update or revoke admin privileges
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label className="text-blue-800">Current Permissions</Label>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {userToRevoke.currentPermissions.map((perm) => (
                    <Badge
                      key={perm}
                      variant="outline"
                      className="border-blue-200 text-blue-600"
                    >
                      {RULES[perm] || perm}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-blue-800">Update Permissions</Label>
                <div className="space-y-2 mt-2">
                  {permissionsList.map((permission) => (
                    <div
                      key={permission}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`revoke-permission-${permission}`}
                        checked={
                          userToRevoke.updatedPermissions[permission] || false
                        }
                        onCheckedChange={(checked) =>
                          handleRevokePermissionChange(permission, checked)
                        }
                      />
                      <Label
                        htmlFor={`revoke-permission-${permission}`}
                        className="text-blue-800 capitalize"
                      >
                        {RULES[permission]}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowRevokeModal(false)}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Cancel
              </Button>
              <Button variant="default" onClick={handleUpdatePermissions}>
                Update Permissions
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
