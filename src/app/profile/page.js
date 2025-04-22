"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { ImAttachment as Attachment } from "react-icons/im";
import { CgLogOut } from "react-icons/cg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MainLayout from "@/components/MainLayout";
import useAuthStore from "../store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useState, useEffect } from "react";

function DepartmentSpaceHeading({
  spaceId = "QDS/U2022CSC/UPH",
  onRemove,
  isLoading,
  isAdmin = false,
}) {
  return (
    <div className="flex items-center justify-between pb-2 rounded-md">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-primary">
          Department Space
        </h1>
        <p className="text-sm text-muted-foreground">Space ID: {spaceId}</p>
        {isAdmin && (
          <p className="text-xs text-muted-foreground italic">(Space Admin)</p>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
            disabled={isLoading}
          >
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="border-primary/20">
          <DropdownMenuItem
            onClick={onRemove}
            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Leave Space"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, removeSelfFromSpace, loading } = useAuthStore();
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const isAdmin = user?.department_space?.permissions?.includes("full");

  const handleLogout = () => {
    const sure = confirm("Are you sure you want to logout?");
    if (!sure) return;
    logout();
    router.push("/login");
  };

  const handleLeaveSpaceClick = () => {
    if (isAdmin) {
      setIsAdminDialogOpen(true);
    } else {
      setIsLeaveDialogOpen(true);
    }
  };

  const confirmLeaveSpace = async () => {
    try {
      await removeSelfFromSpace("User chose to leave the space");
      toast.success("You have left the department space");
      setIsLeaveDialogOpen(false);
    } catch (error) {
      toast.error("Failed to leave space: " + error.message);
    }
  };

  const handleDialogClose = (type) => {
    if (type === "leave") {
      setIsLeaveDialogOpen(false);
    } else {
      setIsAdminDialogOpen(false);
    }
    // Ensure focus returns to the body
    document.body.style.pointerEvents = "auto";
  };

  const formatPhone = (phone) => phone?.slice(6, 10) || "N/A";
  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("") || "";

  if (!isMounted) return null;

  return (
    <MainLayout route={"Profile"}>
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-32 w-32 md:h-40 md:w-40 border-2 border-primary">
            <AvatarImage src={user?.imageURL} alt="Profile Image" />
            <AvatarFallback className="text-3xl font-medium bg-primary/10">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              {user?.name || "User Name"}
            </h1>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary">
              <Attachment className="h-4 w-4" />
              <span className="text-sm font-medium">
                {formatPhone(user?.phone)}
              </span>
            </div>
            <p className="text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>

        {/* Account Settings Section */}
        <Card className="border-primary/20">
          <CardHeader className="bg-blue-100 rounded-lg">
            <DepartmentSpaceHeading
              spaceId={user?.department_space?.spaceId || "No Space"}
              onRemove={handleLeaveSpaceClick}
              isLoading={loading}
              isAdmin={isAdmin}
            />
          </CardHeader>
          <Separator className="bg-primary/20" />

          <CardContent className="p-6 space-y-6">
            {/* Personal Info */}
            <section>
              <h3 className="text-lg font-semibold text-primary mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Gender
                  </p>
                  <p className="font-medium">
                    {user?.gender || "Not specified"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Date of Birth
                  </p>
                  <p className="font-medium">{user?.dob || "Not specified"}</p>
                </div>
              </div>
            </section>

            <Separator className="bg-primary/20" />

            {/* School Info */}
            <section>
              <h3 className="text-lg font-semibold text-primary mb-4">
                Academic Information
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Department
                  </p>
                  <p className="font-medium">
                    {user?.departmentId || "Not specified"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Level
                  </p>
                  <p className="font-medium">
                    {user?.level ? `${user.level} Level` : "Not specified"}
                  </p>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="text-destructive border-destructive hover:bg-destructive/10 gap-2"
            onClick={handleLogout}
          >
            <CgLogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>

        {/* Leave Space Dialog */}
        <AlertDialog
          open={isLeaveDialogOpen}
          onOpenChange={(open) => {
            if (!open) handleDialogClose("leave");
          }}
        >
          <AlertDialogContent
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Leave this space?</AlertDialogTitle>
              <AlertDialogDescription>
                You'll lose access to all space resources. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => handleDialogClose("leave")}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmLeaveSpace}
                className="bg-destructive hover:bg-destructive/90"
              >
                {loading ? "Leaving..." : "Leave Space"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Admin Restriction Dialog */}
        <AlertDialog
          open={isAdminDialogOpen}
          onOpenChange={(open) => {
            if (!open) handleDialogClose("admin");
          }}
        >
          <AlertDialogContent
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Admin Restrictions</AlertDialogTitle>
              <AlertDialogDescription>
                Space admins cannot leave the space. To join another space,
                please create a new account with a different email address.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => handleDialogClose("admin")}>
                Understood
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
