// Permissions.js
import { useState } from "react";
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
import { Input } from "@/components/ui/input";

export default function Permissions() {
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [newRole, setNewRole] = useState({
    email: "",
    permissions: {
      moderate: false,
      managePosts: false,
      manageMembers: false,
    },
  });

  const roles = [
    {
      id: 1,
      name: "You",
      email: "admin@uni.edu",
      permissions: ["Full access"],
      isCurrentUser: true,
    },
    {
      id: 2,
      name: "Morgan",
      email: "morgan@uni.edu",
      permissions: ["Moderate content"],
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-blue-800">Admin Roles</h2>
        <Button
          onClick={() => setShowAddRoleModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          + Add Admin
        </Button>
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
                      {perm}
                    </Badge>
                  ))}
                </div>
              </div>
              {!role.isCurrentUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                >
                  Revoke
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Role Modal */}
      <Dialog open={showAddRoleModal} onOpenChange={setShowAddRoleModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-blue-800">Add New Admin</DialogTitle>
            <DialogDescription>
              Grant admin privileges to a community member
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-blue-800">Student Email</Label>
              <Input
                type="email"
                value={newRole.email}
                onChange={(e) =>
                  setNewRole({ ...newRole, email: e.target.value })
                }
                placeholder="Enter student email"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-blue-800">Permissions</Label>
              <div className="space-y-2 mt-2">
                {" "}
                <Checkbox
                  checked={newRole.permissions.moderate}
                  onChange={(e) =>
                    setNewRole({
                      ...newRole,
                      permissions: {
                        ...newRole.permissions,
                        moderate: e.target.checked,
                      },
                    })
                  }
                >
                  {" "}
                  Moderate content{" "}
                </Checkbox>{" "}
                <Checkbox
                  checked={newRole.permissions.managePosts}
                  onChange={(e) =>
                    setNewRole({
                      ...newRole,
                      permissions: {
                        ...newRole.permissions,
                        managePosts: e.target.checked,
                      },
                    })
                  }
                >
                  {" "}
                  Manage posts{" "}
                </Checkbox>{" "}
                <Checkbox
                  checked={newRole.permissions.manageMembers}
                  onChange={(e) =>
                    setNewRole({
                      ...newRole,
                      permissions: {
                        ...newRole.permissions,
                        manageMembers: e.target.checked,
                      },
                    })
                  }
                >
                  {" "}
                  Manage members{" "}
                </Checkbox>{" "}
              </div>{" "}
            </div>{" "}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowAddRoleModal(false)}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                console.log(`Adding role for ${newRole.email}`);
                setShowAddRoleModal(false);
              }}
              disabled={
                !newRole.email ||
                !Object.values(newRole.permissions).includes(true)
              }
            >
              Add Admin
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
