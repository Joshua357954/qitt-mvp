"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateSpace() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    isClassRep: false,
    bio: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (formData.name.length > 30)
      newErrors.name = "Name must be 30 characters or less";
    if (formData.bio.length > 200)
      newErrors.bio = "Bio must be 200 characters or less";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (error) {
      console.error("Creation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center p-6 font-aeonik">
        <div className="relative">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Space Created!</h2>
          <p className="text-muted-foreground">
            Your new space "{formData.name}" is ready to use.
          </p>
        </div>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-6 max-w-md mx-auto font-aeonik">
      <Button asChild variant="ghost" className="mb-6 -ml-2 self-start">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>

      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Create a Space</h1>
        <p className="text-muted-foreground">
          Set up your new collaborative environment
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Space Name *
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Class of 2024"
            className="h-12"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isClassRep"
            name="isClassRep"
            checked={formData.isClassRep}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label htmlFor="isClassRep" className="text-sm font-medium">
            Are you the class representative?
          </label>
        </div>

        <div className="space-y-2">
          <label htmlFor="bio" className="block text-sm font-medium">
            Bio
          </label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about this space..."
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            {formData.bio.length}/200 characters
          </p>
          {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-blue-600 hover:bg-blue-700"
          disabled={loading || !formData.name.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Space"
          )}
        </Button>
      </form>
    </div>
  );
}
