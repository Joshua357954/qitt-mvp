// ManageSpace.js
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/MainLayout";
import Members from "./members";
import Permissions from "./permissions";

export default function ManageSpace() {
  const [activeTab, setActiveTab] = useState("members");

  return (
    <MainLayout route={"Manage Department"}>
      <div className="w-full mx-autos px-6">
        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-blue-50">
            <TabsTrigger value="members" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-2">
              Members
            </TabsTrigger>
            <TabsTrigger value="roles" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-2">
              Roles & Permissions
            </TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <Members />
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value="roles" className="space-y-6">
            <Permissions />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
