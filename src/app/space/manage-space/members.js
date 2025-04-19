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

// Inline MemberCard Component
const MemberCard = ({
  loading,
  member,
  pending,
  makeJoinDecision,
  onRemove,
  user,
}) => {
  return (
    <div className="flex items-center justify-between border rounded-lg p-4 shadow-sm bg-white">
      <div>
        <h4 className="text-lg font-medium">{member.name}</h4>
        <p className="text-sm text-gray-600">{member.email}</p>
        {member.role && !pending && (
          <Badge className="mt-1">{member.role}</Badge>
        )}
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
        user?.department_space?.status !== "admin" && (
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
  } = useManageSpaceStore(); // Get from main store
  const { user } = useAuthStore(); // Get user from auth store

  useEffect(() => {
    if (user) {
      // Call the fetchMembers function if user is authenticated
      fetchMembers();
    }
  }, [user, fetchMembers]);

  //   const approvedUsers = [
  //     { id: 1, name: "Alex Johnson", email: "alex@uni.edu", role: "Member" },
  //     { id: 2, name: "Sam Wilson", email: "sam@uni.edu", role: "Moderator" },
  //   ];

  //   const pendingUsers = [
  //     { id: 3, name: "Taylor Smith", email: "taylor@uni.edu" },
  //     { id: 4, name: "Jordan Lee", email: "jordan@uni.edu" },
  //   ];

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
              {approvedUsers.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  user={user}
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
              {pendingUsers.map((member) => (
                <MemberCard
                  key={member.id}
                  loading={loading}
                  member={member}
                  makeJoinDecision={makeJoinDecision}
                  pending
                />
              ))}
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
              onClick={() => setShowRemoveModal(false)}
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
