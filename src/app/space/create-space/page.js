"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check } from "lucide-react";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import useSpaceStore from "../../store/spaceStore"
export default function CreateSpace() {
  const {
    name,
    bio,
    visibility,
    isClassRep,
    loading,
    success,
    error,
    setField,
    createSpace,
  } = useSpaceStore();

  const [localErrors, setLocalErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Name is required.";
    if (name.length > 30) errors.name = "Name must be 30 characters or less.";
    if (bio.length > 200) errors.bio = "Bio must be 200 characters or less.";
    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!isClassRep) return; // Ensure user is a class rep before submitting
    await createSpace();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setField(name, type === "checkbox" ? checked : value);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center p-6 font-aeonik w-full">
        <div className="relative">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Space Created!</h2>
          <p className="text-muted-foreground">
            Your new space "{name}" is ready to use.
          </p>
        </div>
        <Button asChild>
          <Link href="/department">Back to Dept.</Link>
        </Button>
      </div>
    );
  }

  return (
    <MainLayout route={"Create Dept. Space"}>

      <div className="flex flex-col min-h-screen p-6 max-w-md mx-auto font-aeonik">
        <div className="space-y-2 mb-8">
            {error && <p className="text-red-500">{error}</p>}
          <p className="text-muted-foreground">
            Set up your new department's collaborative environment
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
              value={name}
              onChange={handleChange}
              placeholder="e.g. Class of 2024"
              className="h-12"
            />
            {localErrors.name && (
              <p className="text-sm text-red-500">{localErrors.name}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isClassRep"
              name="isClassRep"
              checked={isClassRep}
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
              value={bio}
              onChange={handleChange}
              placeholder="Tell us about this space..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              {bio.length}/200 characters
            </p>
            {localErrors.bio && (
              <p className="text-sm text-red-500">{localErrors.bio}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700"
            disabled={loading || !name.trim()}
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
    </MainLayout>
  );
}
