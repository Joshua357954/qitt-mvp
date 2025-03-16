"use client";
import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout.jsx";
import AssignmentCard from "@/components/AssignmentItem.js";
import useAssignmentStore from "../store/assignmentStore.js";
import useAuthStore from "../store/authStore.js";
import { MessageCircle, Sparkles, Send } from "lucide-react";

const AssignmentScreen = ({ className }) => {
  const { user: userData } = useAuthStore();
  const { assignments, isLoading, fetchAssignments } = useAssignmentStore();

  const department = userData?.department;
  const level = userData?.level;

  useEffect(() => {
    fetchAssignments("computer_science", 2);
  }, [department,level]);

  return (
    <MainLayout route="Assignment">
      <div className="w-full pt-3 min-h-full overflow-y-auto">
        {assignments?.length === 0 ? (
          <div className="w-full text-center mt-4 text-gray-600">
          <div className="flex justify-center items-center gap-2">
            <Sparkles className="text-yellow-500" />
            <span>Let us know if you have any questions or need assistance!</span>
          </div>
          <br />
          <div className="flex justify-center items-center gap-2">
            <MessageCircle className="text-green-500" />
            <span>We're here to help—just send us a message.</span>
          </div>
          <br />
          <a  
            href="https://api.whatsapp.com/send?phone=+2349034954069&text=I%20need%20assistance"  
            target="_blank"  
            className="text-blue-500 flex justify-center items-center gap-2"
          >
            <Send className="text-blue-500" />
            <span>Chat on WhatsApp</span>
          </a>  
        </div>
        ) : (
          assignments?.map((item, idx) => {
            // const color = data1[idx].color;
            return <AssignmentCard item={item} idx={idx} />;
          })
        )}
      </div>
    </MainLayout>
  );
};

export default AssignmentScreen;
