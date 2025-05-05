"use client";
import { useEffect, useState } from "react";
import CreatorLayout from "@/components/CreatorLayout";
import { AiOutlineNotification as Announce } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dropdown } from "@/components/Dropdown";
import toast from "react-hot-toast";
import useAnnouncementStore from "@/app/store/creator/announcementStore";
import { useRouter, useSearchParams } from "next/navigation"; // Assuming you're using Next.js
import useDepartmentStore from "@/app/store/departmentStore";

export default function Announcement() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tags, setTags] = useState([]); // Tags for the announcement
  const [newTag, setNewTag] = useState("");
  const [announcement, setAnnouncement] = useState(null); // State for the announcement object

  const { postAnnouncement, isLoading } = useAnnouncementStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const isEditMode = Boolean(editId);

  const { announcements, fetchAnnouncements, getItem, updateItem, loading } =
    useDepartmentStore();

  // Fetch announcement by ID
  async function fetchAnnouncementById(id) {
    if (announcements.length === 0) await fetchAnnouncements();
    const foundAnnouncement = announcements.find((ann) => ann.id === id);
    if (foundAnnouncement) {
      setAnnouncement(foundAnnouncement); // Set fetched announcement to state
    }
  }

  // Reset form values
  function reset() {
    setTitle("");
    setMessage("");
    setPriority("medium");
    setTags([]);
    setNewTag("");
  }

  // Fetch announcement data when in edit mode
  useEffect(() => {
    (async () => {
      if (isEditMode && editId) {
        try {
          const newItem = await getItem("announcements", editId);
          console.log("@Fetch Fk", newItem);
          setAnnouncement(newItem);
        } catch (error) {
          console.error("Error fetching announcement:", error);
        }
      }
    })();
  }, [isEditMode, editId, announcements]);

  // Update form fields when announcement is set
  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setMessage(announcement.message);
      setPriority(announcement.priority);
      setTags(announcement.tags || []);
    }
  }, [announcement]); // Runs when announcement state changes

  // Handle add/remove tags
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !message) {
      toast.error("Title and message are required.");
      return;
    }

    const formData = {
      title,
      message,
      priority: priority.toLowerCase(),
      tags,
    };

    // If in edit mode, check for changes
    if (isEditMode && announcement) {
      const hasChanges = Object.keys(formData).some(
        (key) =>
          JSON.stringify(formData[key]) !== JSON.stringify(announcement[key])
      );

      if (!hasChanges) {
        toast("No changes made. Posting as new announcement instead.");
        return;
      }
    }

    await postAnnouncement({
      ...formData,
      editId: isEditMode ? editId : undefined,
    });

    if (isEditMode) {
      router.back(); // if updating
    } else {
      reset(); // If normal posting
    }
  };

  return (
    <CreatorLayout
      screenName="Announcement"
      Button={
        <Button
          onClick={handleSubmit}
          className="hidden sm:flex gap-2"
          disabled={isLoading}
        >
          <Announce size={15} />
          {isLoading
            ? "Posting..."
            : isEditMode
            ? "Update Announcement"
            : "Post Announcement"}
        </Button>
      }
    >
      <div className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Message Textarea */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          {/* Priority Dropdown */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <Dropdown
              dropdownItems={["High", "Medium", "Low"]} // Pass an array of strings
              value={priority}
              onChange={setPriority} // On change, update priority
            />
          </div>

          {/* Tags Input */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="flex-1"
              />
              <Button type="button" onClick={handleAddTag} variant="secondary">
                Add Tag
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="px-3 py-1 text-sm bg-blue-200 text-blue-600"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-muted-foreground hover:text-foreground text-blue-600"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button (mobile) */}
          <div className="sm:hidden">
            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              <Announce size={15} />
              {isLoading
                ? "Posting..."
                : isEditMode
                ? "Update Announcement"
                : "Post Announcement"}
            </Button>
          </div>
        </form>
      </div>
    </CreatorLayout>
  );
}
