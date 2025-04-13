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

// Department Space Heading Component
function DepartmentSpaceHeading({
  spaceId = "QDS/U2022CSC/UPH",
  onRemove,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between pb-2 rounded-md">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-primary">
          Department Space
        </h1>
        <p className="text-sm text-muted-foreground">Space ID: {spaceId}</p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
          >
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="border-primary/20">
          <DropdownMenuItem
            onClick={onChange}
            className="cursor-pointer text-primary focus:bg-primary/10"
          >
            Change
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onRemove}
            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Main Page Component
export default function ProfilePage() {
  // Mock user data - replace with your actual data source
  // const userData = {
  //   name: "Alex Johnson",
  //   email: "alex.johnson@example.com",
  //   phone: "1234567890",
  //   imageURL: "",
  //   gender: "Male",
  //   dob: "15th May 1990",
  //   department: "Computer Science",
  //   level: "400",
  // };

  const { user: userData } = useAuthStore();

  const handleLogout = () => {
    const sure = confirm("Are you sure you want to logout?");
    if (!sure) return;
    console.log("Logging out...");
    // Implement your logout logic here
  };

  const handleChangeSpace = () => {
    console.log("Changing space...");
    // Implement space change logic
  };

  const handleRemoveSpace = () => {
    console.log("Removing space...");
    // Implement space removal logic
  };

  // Helper functions
  const formatPhone = (phone) => phone?.slice(6, 10) || "N/A";
  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("") || "";

  return (
    <MainLayout route={"Profile"}>
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-32 w-32 md:h-40 md:w-40 border-2 border-primary">
            <AvatarImage src={userData?.imageURL} alt="Profile Image" />
            <AvatarFallback className="text-3xl font-medium bg-primary/10">
              {getInitials(userData?.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              {userData?.name || "User Name"}
            </h1>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary">
              <Attachment className="h-4 w-4" />
              <span className="text-sm font-medium">
                {formatPhone(userData?.phone)}
              </span>
            </div>
            <p className="text-muted-foreground truncate">{userData?.email}</p>
          </div>
        </div>

        {/* Account Settings Section */}
        <Card className="border-primary/20">
          <CardHeader className="bg-blue-100 rounded-lg">
            <DepartmentSpaceHeading
              spaceId="QDS34233UPH"
              onChange={handleChangeSpace}
              onRemove={handleRemoveSpace}
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
                    {userData?.gender || "Not specified"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Date of Birth
                  </p>
                  <p className="font-medium">
                    {userData?.dob || "Not specified"}
                  </p>
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
                    {userData?.department || "Not specified"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Level
                  </p>
                  <p className="font-medium">
                    {userData?.level
                      ? `${userData.level} Level`
                      : "Not specified"}
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
      </div>
    </MainLayout>
  );
}
