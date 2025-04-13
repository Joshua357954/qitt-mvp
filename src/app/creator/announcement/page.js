"use client";
import { useState } from "react";
import CreatorLayout from "@/components/CreatorLayout";
import { AiOutlineNotification as Announce } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dropdown } from "@/components/Dropdown";

export default function Announcement() {
  const [course, setCourse] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      course,
      title,
      message,
      priority,
      tags
    });
    // Add your form submission logic here
  };

  return (
    <CreatorLayout
      screenName="Announcement"
      Button={
        <Button onClick={handleSubmit} className="hidden sm:flex gap-2">
          <Announce size={15} /> 
          Announce
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
              label=""
              dropdownItems={["High", "Medium", "Low"]}
              value={priority}
              onChange={setPriority}
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
              <Button
                type="button"
                onClick={handleAddTag}
                variant="secondary"
              >
                Add Tag
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
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
            <Button type="submit" className="w-full gap-2">
              <Announce size={15} />
              Post Announcement
            </Button>
          </div>
        </form>
      </div>
    </CreatorLayout>
  );
}