import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Copy, Share2, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useManageSpaceStore from "../store/manageSpaceStore";

// Temporary skeleton replacement
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-muted rounded-md ${className}`} />
);

const NameInitial = ({ name }) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <Avatar className="h-11 w-11">
      <AvatarFallback className="bg-blue-600 text-white text-base font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

const UserBadge = ({ user }) => {
  if (user.department_space?.status === "admin") {
    return (
      <Badge
        variant="default"
        className="bg-blue-600 hover:bg-blue-700 ml-2 text-xs"
      >
        <Crown className="h-3 w-3 mr-1" />
        Admin
      </Badge>
    );
  }

  if (user.department_space?.permissions?.length > 0) {
    return (
      <Badge variant="secondary" className="ml-2 text-xs">
        <Shield className="h-3 w-3 mr-1" />
        Moderator
      </Badge>
    );
  }

  return null;
};

const sortUsersByRole = (users) => {
  return [...users].sort((a, b) => {
    if (a.department_space?.status === "admin") return -1;
    if (b.department_space?.status === "admin") return 1;

    const aIsMod = a.department_space?.permissions?.length > 0;
    const bIsMod = b.department_space?.permissions?.length > 0;

    if (aIsMod && !bIsMod) return -1;
    if (!aIsMod && bIsMod) return 1;

    return a.name.localeCompare(b.name);
  });
};

const ClassTab = () => {
  const { approvedUsers, fetchMembers, loading, error } = useManageSpaceStore();

  useEffect(() => {
    if (approvedUsers.length === 0) {
      fetchMembers();
    }
  }, [approvedUsers.length, fetchMembers]);

  const sortedUsers = sortUsersByRole(approvedUsers);

  return (
    <div className="mx-auto h-full">
      <h2 className="text-md sm:text-lg font-medium mb-5 text-gray-800">
        Classmates
      </h2>

      {loading && approvedUsers.length === 0 ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-4 shadow-xs">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-11 w-11 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[180px]" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error loading classmates</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : sortedUsers.length > 0 ? (
        <div className="space-y-3">
          {sortedUsers.map((user) => (
            <Card
              key={user.id}
              className="p-4 hover:bg-blue-50 transition-colors shadow-xs border"
            >
              <div className="flex items-center gap-4">
                {user.imageURL ? (
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={user.imageURL} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <NameInitial name={user.name} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">
                      {user.name}
                    </span>
                    <UserBadge user={user} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>No classmates found</AlertTitle>
          <AlertDescription>
            You don't have any classmates in this space yet.
          </AlertDescription>
        </Alert>
      )}
 
    </div>
  );
};

export default ClassTab;
