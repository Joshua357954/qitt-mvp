"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/MainLayout";

export default function ManageSpace() {
  const [activeTab, setActiveTab] = useState("members");
  const [memberSubTab, setMemberSubTab] = useState("approved");
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeReason, setRemoveReason] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [newRole, setNewRole] = useState({
    email: "",
    permissions: {
      moderate: false,
      managePosts: false,
      manageMembers: false,
    },
  });

  // Sample data
  const approvedMembers = [
    { id: 1, name: "Alex Johnson", email: "alex@uni.edu", role: "Member" },
    { id: 2, name: "Sam Wilson", email: "sam@uni.edu", role: "Moderator" },
  ];

  const pendingMembers = [
    { id: 3, name: "Taylor Smith", email: "taylor@uni.edu" },
    { id: 4, name: "Jordan Lee", email: "jordan@uni.edu" },
  ];

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
    <MainLayout route={"Manage Department"}>
      <div className="w-full mx-autos px-6">
        <div className="flex items-center justify-between mb-8">
          {/* <h1 className="text-3xl font-bold text-black"></h1>
          <Badge variant="outline" className="border-blue-200 text-blue-600">
          Admin View
        </Badge> */}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-blue-50">
            <TabsTrigger
              value="members"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-2"
            >
              Members
            </TabsTrigger>
            <TabsTrigger
              value="roles"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-2"
            >
              Roles & Permissions
            </TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <Tabs
              value={memberSubTab}
              onValueChange={setMemberSubTab}
              className="w-full"
            >
              <TabsList className="flex justify-start gap-4 mb-6 w-fit bg-gray-100">
                <TabsTrigger
                  value="approved"
                  className="data-[state=active]:bg-gray-600 data-[state=active]:text-white"
                >
                  Approved ({approvedMembers.length})
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-gray-600 data-[state=active]:text-white"
                >
                  Pending ({pendingMembers.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="approved">
                <div className="space-y-4">
                  {approvedMembers.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      onRemove={() => {
                        setSelectedMember(member);
                        setShowRemoveModal(true);
                      }}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pending">
                <div className="space-y-4">
                  {pendingMembers.map((member) => (
                    <MemberCard key={member.id} member={member} pending />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value="roles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-blue-800">
                Admin Roles
              </h2>
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
                        <h3 className="font-medium text-blue-800">
                          {role.name}
                        </h3>
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
          </TabsContent>
        </Tabs>

        {/* Remove Member Modal */}
        <Dialog open={showRemoveModal} onOpenChange={setShowRemoveModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-blue-800">Remove Member</DialogTitle>
              <DialogDescription>
                Please specify reason for removing{" "}
                <span className="font-medium">{selectedMember?.name}</span>:
              </DialogDescription>
            </DialogHeader>
            <Textarea
              value={removeReason}
              onChange={(e) => setRemoveReason(e.target.value)}
              placeholder="Reason for removal..."
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowRemoveModal(false)}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  console.log(
                    `Removing ${selectedMember?.id} for: ${removeReason}`
                  );
                  setShowRemoveModal(false);
                }}
                disabled={!removeReason}
              >
                Confirm Remove
              </Button>
            </div>
          </DialogContent>
        </Dialog>

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
                <div className="space-y-3 mt-2">
                  {Object.entries(newRole.permissions).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-3">
                      <Checkbox
                        id={`perm-${key}`}
                        checked={value}
                        onCheckedChange={(checked) =>
                          setNewRole({
                            ...newRole,
                            permissions: {
                              ...newRole.permissions,
                              [key]: checked,
                            },
                          })
                        }
                        className="border-blue-300 data-[state=checked]:bg-blue-600"
                      />
                      <label
                        htmlFor={`perm-${key}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {key.split(/(?=[A-Z])/).join(" ")}
                      </label>
                    </div>
                  ))}
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
                  onClick={() => {
                    console.log("Adding new admin:", newRole);
                    setShowAddRoleModal(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add Admin
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}

function MemberCard({ member, pending, onRemove }) {
  return (
    <div className="border p-4 rounded-lg flex justify-between items-center bg-white hover:shadow-sm transition-shadow">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-blue-800">{member.name}</h3>
          {member.role && (
            <Badge variant="outline" className="border-blue-200 text-blue-600">
              {member.role}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{member.email}</p>
      </div>

      {pending ? (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 border-green-300 hover:bg-green-50"
          >
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            Decline
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:bg-red-50"
          onClick={onRemove}
        >
          Remove
        </Button>
      )}
    </div>
  );
}
