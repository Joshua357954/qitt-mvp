import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useManageSpaceStore from "@/app/store/manageSpaceStore";
import useAuthStore from "@/app/store/authStore";
import { RULES } from "@/utils/useHasAccess";

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {Array(3)
      .fill(null)
      .map((_, i) => (
        <div
          key={i}
          className="h-20 w-full bg-gray-200 animate-pulse rounded-lg"
        ></div>
      ))}
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
    <strong className="font-semibold">Oops! </strong>
    {message || "Something went wrong. Please try again."}
  </div>
);

// Inline MemberCard Component with permission badges
const MemberCard = ({
  loading,
  member,
  pending,
  makeJoinDecision,
  onRemove,
  user,
}) => {
  const isCurrentUser = member.uid === user?.uid;
  const isAdmin = member.department_space.status === "admin";
  const isModerator = member?.department_space?.permissions?.some(
    (permission) => Object.values(RULES).includes(permission)
  );

  return (
    <div className="flex items-center justify-between border rounded-lg p-4 shadow-sm bg-white">
      <div>
        <div className="flex items-center gap-2">
          <h4 className="text-lg font-medium">
            {member.name}
            {isCurrentUser && (
              <span className="ml-2 text-sm text-gray-500">(You)</span>
            )}
          </h4>
        </div>
        <p className="text-sm text-gray-600">{member.email}</p>
        <div className="flex gap-2 mt-1">
          {isAdmin && (
            <Badge variant="destructive" className="bg-red-500">
              Admin
            </Badge>
          )}
          {isModerator && (
            <Badge variant="secondary" className="bg-blue-500 text-white">
              Moderator
            </Badge>
          )}
          {member.role === "member" && !pending && (
            <Badge className="bg-gray-500 text-white">Member</Badge>
          )}
        </div>
      </div>

      {pending ? (
        <div className="space-x-2">
          <Button
            disabled={loading}
            onClick={() => makeJoinDecision(member.uid, "approved")}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Approve
          </Button>
          <Button
            disabled={loading}
            onClick={() => makeJoinDecision(member.uid, "rejected")}
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50"
          >
            Reject
          </Button>
        </div>
      ) : (
        // Only show remove button if:
        // 1. Not the current user
        // 2. Current user is admin
        // 3. The member is not an admin (admins can't be removed)
        !isCurrentUser &&
        user?.department_space?.status === "admin" &&
        !isAdmin && (
          <Button
            variant="outline"
            onClick={onRemove}
            className="border-red-500 text-red-600 hover:bg-red-50"
          >
            Remove
          </Button>
        )
      )}
    </div>
  );
};

// Helper function to sort members by role (admin -> moderator -> member)
const sortMembersByRole = (members) => {
  return [...members].sort((a, b) => {
    // Check if admin
    const aIsAdmin = a.department_space?.status === "admin";
    const bIsAdmin = b.department_space?.status === "admin";
    if (aIsAdmin && !bIsAdmin) return -1;
    if (!aIsAdmin && bIsAdmin) return 1;

    // Check if moderator
    const aIsModerator = a?.department_space?.permissions?.some((permission) =>
      Object.values(RULES).includes(permission)
    );
    const bIsModerator = b?.department_space?.permissions?.some((permission) =>
      Object.values(RULES).includes(permission)
    );
    if (aIsModerator && !bIsModerator) return -1;
    if (!aIsModerator && bIsModerator) return 1;

    // If same role, sort alphabetically
    return a.name.localeCompare(b.name);
  });
};

// Main Members Component
export default function Members() {
  const [memberSubTab, setMemberSubTab] = useState("approved");
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeReason, setRemoveReason] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  const {
    approvedUsers,
    pendingUsers,
    loading,
    error,
    fetchMembers,
    makeJoinDecision,
    removeUserFromSpace,
  } = useManageSpaceStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user && approvedUsers.length === 0) {
      // Only fetch if there's no data
      fetchMembers();
    }
  }, [user, approvedUsers.length, fetchMembers]);

  // Sort approved users by role
  const sortedApprovedUsers = sortMembersByRole(approvedUsers);
  // Sort pending users by request date (assuming there's a createdAt field)
  const sortedPendingUsers = [...pendingUsers].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  return (
    <>
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <Tabs
          value={memberSubTab}
          onValueChange={setMemberSubTab}
          className="w-full"
        >
          <TabsList className="flex justify-start gap-4 mb-6 mt-4 py-2 w-fit bg-gray-100">
            <TabsTrigger
              value="approved"
              className="data-[state=active]:bg-gray-600 data-[state=active]:text-white"
            >
              Approved ({approvedUsers.length})
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-gray-600 data-[state=active]:text-white"
            >
              Pending ({pendingUsers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="approved">
            <div className="space-y-4">
              {sortedApprovedUsers.length > 0 ? (
                sortedApprovedUsers.map((member) => (
                  <MemberCard
                    key={member.uid}
                    member={member}
                    user={user}
                    onRemove={() => {
                      setSelectedMember(member);
                      setShowRemoveModal(true);
                    }}
                  />
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No approved members yet
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="space-y-4">
              {sortedPendingUsers.length > 0 ? (
                sortedPendingUsers.map((member) => (
                  <MemberCard
                    key={member.uid}
                    loading={loading}
                    member={member}
                    makeJoinDecision={makeJoinDecision}
                    pending
                  />
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No pending requests
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}

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
          {removeReason.length > 0 && removeReason.length <= 30 && (
            <div className="text-red-500 text-sm pt-1">
              Reason must be more than 30 characters.
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowRemoveModal(false);
                setRemoveReason("");
              }}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                removeUserFromSpace(selectedMember.uid, removeReason);
                setShowRemoveModal(false);
                setRemoveReason("");
              }}
              disabled={removeReason.length <= 30}
            >
              Confirm Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
