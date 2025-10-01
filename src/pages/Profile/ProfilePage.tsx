'use client';

import React, { useState, useRef, useEffect } from "react";
import { Mail, Pencil, Image as ImageIcon, Trash, Globe, Building, Calendar, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { _update_admin_profile_api } from "@/DAL/authAPI";
import { useSnackbar } from "notistack";
import Spinner from "../../components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SearchableSelect from "@/components/ui/searchable-select";
import { industries, years } from "@/utils/lists";
// import { s3baseUrl } from "@/config/config";
import {
  deleteFileFunction,
  uploadFileFunction,
} from "@/utils/fileUploadRemoveFunctions";
import { useAppContext } from "@/contexts/AppContext";
import Button from "@/components/ui/custom-button";

const ProfilePage: React.FC = () => {
  const { user, setUser } = useAppContext();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    email: user?.email || "",
    image: user?.profile_image || "",
    previewImage: null as File | null,
    name: user?.name || "",
    bio: {
      description: user?.bio?.description || "",
      website: user?.bio?.website || "",
      industry: user?.bio?.industry || "",
      founded_year: user?.bio?.founded_year || 0,
    },
    social_links: {
      facebook: user?.social_links?.facebook || "",
      twitter: user?.social_links?.twitter || "",
      linkedin: user?.social_links?.linkedin || "",
      instagram: user?.social_links?.instagram || "",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setProfile({
        email: user.email || "",
        image: user.profile_image || "",
        previewImage: null,
        name: user.name || "",
        bio: {
          description: user.bio?.description || "",
          website: user.bio?.website || "",
          industry: user.bio?.industry || "",
          founded_year: user.bio?.founded_year || 0,
        },
        social_links: {
          facebook: user.social_links?.facebook || "",
          twitter: user.social_links?.twitter || "",
          linkedin: user.social_links?.linkedin || "",
          instagram: user.social_links?.instagram || "",
        },
      });
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      enqueueSnackbar("Image must be less than or equal to 1MB", {
        variant: "warning",
      });
      return;
    }

    setProfile((prev) => ({ ...prev, previewImage: file }));
  };

  const handleRemoveImage = () => {
    setProfile((prev) => ({ ...prev, image: "", previewImage: null }));
    if (fileInputRef.current) fileInputRef.current.value = ""; // reset input
  };

  const handleCancel = () => {
    setProfile({
      email: user?.email || "",
      image: user?.profile_image || "",
      previewImage: null,
      name: user?.name || "",
      bio: {
        description: user?.bio?.description || "",
        website: user?.bio?.website || "",
        industry: user?.bio?.industry || "",
        founded_year: user?.bio?.founded_year || 0,
      },
      social_links: {
        facebook: user?.social_links?.facebook || "",
        twitter: user?.social_links?.twitter || "",
        linkedin: user?.social_links?.linkedin || "",
        instagram: user?.social_links?.instagram || "",
      },
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    let uploaded_image = profile.image;

    if (profile.previewImage) {
      if (user?.profile_image) {
        const deleted = await deleteFileFunction(user.profile_image);
        if (!deleted) {
          enqueueSnackbar("Failed to delete old image", { variant: "error" });
          setLoading(false);
          return;
        }
      }
      const uploadedResult = await uploadFileFunction(profile.previewImage);
      uploaded_image = uploadedResult || profile.image;
    }

    const req_data = {
      email: profile.email,
      profile_image: uploaded_image || "",
      name: profile.name,
      bio: profile.bio,
      social_links: profile.social_links,
    };

    const result = await _update_admin_profile_api(req_data);

    if (result?.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });

      // Update profile state
      setProfile({
        email: profile.email, // Keep current email since it's not returned by API
        image: result.admin.profile_image || "",
        previewImage: null,
        name: result.admin.name || "",
        bio: result.admin.bio || profile.bio,
        social_links: result.admin.social_links || profile.social_links,
      });

      // Update context
      setUser((prev) => ({
        ...prev!,
        profile_image: result.admin.profile_image || "",
        name: result.admin.name || "",
        bio: result.admin.bio || prev?.bio,
        social_links: result.admin.social_links || prev?.social_links,
      }));

      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem("userData") || "{}");
      storedUser.profile_image = result.admin.profile_image || storedUser.profile_image;
      storedUser.name = result.admin.name || storedUser.name;
      storedUser.bio = result.admin.bio || storedUser.bio;
      storedUser.social_links = result.admin.social_links || storedUser.social_links;
      localStorage.setItem("userData", JSON.stringify(storedUser));

      setIsEditing(false);
    } else {
      enqueueSnackbar(result?.message || "Failed to update profile", {
        variant: "error",
      });
    }

    setLoading(false);
  };

  const isFormChanged =
    profile.name !== user?.name ||
    profile.bio.description !== user?.bio?.description ||
    profile.bio.website !== user?.bio?.website ||
    profile.bio.industry !== user?.bio?.industry ||
    profile.bio.founded_year !== user?.bio?.founded_year ||
    profile.social_links.facebook !== user?.social_links?.facebook ||
    profile.social_links.twitter !== user?.social_links?.twitter ||
    profile.social_links.linkedin !== user?.social_links?.linkedin ||
    profile.social_links.instagram !== user?.social_links?.instagram ||
    profile.previewImage !== null;

  return (
    <div className="space-y-8">
    {/* Header */}
    <div className="flex items-center space-x-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Update your personal information and profile details
        </p>
      </div>
    </div>
  
    {/* Main */}
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Image Left */}
        <div className="md:col-span-3 flex flex-col items-center">
          <div className="relative w-full aspect-square">
            <label
              className={`w-full h-full cursor-pointer ${
                !isEditing ? "pointer-events-none" : ""
              }`}
            >
              <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                {profile.previewImage ? (
                  <img
                    src={URL.createObjectURL(profile.previewImage)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : profile.image ? (
                  <img
                    // src={s3baseUrl + profile.image}
                    src={profile.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <ImageIcon className="w-10 h-10 mb-2" />
                    <span className="text-xs">No Photo</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={!isEditing}
              />
            </label>
  
            {(profile.previewImage || profile.image) && isEditing && (
              <span
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-md text-red-500 hover:text-red-600 transition cursor-pointer"
              >
                <Trash className="w-5 h-5" />
              </span>
            )}
          </div>
          <p className="text-gray-500 text-xs mt-2 text-center">
            Max image size up to 1MB
          </p>
        </div>
  
        {/* Right Side (Email, Name, Description) */}
        <div className="md:col-span-9 space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-300" />
              <Input
                type="email"
                value={profile.email}
                disabled
                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 cursor-not-allowed"
              />
            </div>
          </div>
  
          {/* Organization Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Organization Name
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-300" />
              <Input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 ${
                  isEditing ? "" : "opacity-70 cursor-not-allowed"
                }`}
                placeholder="Enter organization name"
              />
            </div>
          </div>
  
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <Textarea
              value={profile.bio.description}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  bio: { ...profile.bio, description: e.target.value },
                })
              }
              disabled={!isEditing}
              className={`${
                isEditing ? "" : "opacity-70 cursor-not-allowed"
              }`}
              placeholder="Describe your organization..."
              rows={3}
            />
          </div>
        </div>
  
        {/* Full Width Section */}
        <div className="md:col-span-12 space-y-6">
          {/* Website - Full Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-300" />
              <Input
                type="url"
                value={profile.bio.website}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    bio: { ...profile.bio, website: e.target.value },
                  })
                }
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 ${
                  isEditing ? "" : "opacity-70 cursor-not-allowed"
                }`}
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Founded Year and Industry Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Founded Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Founded Year
              </label>
              <SearchableSelect
                options={years}
                value={profile.bio.founded_year && profile.bio.founded_year > 0 ? profile.bio.founded_year.toString() : ""}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    bio: { ...profile.bio, founded_year: parseInt(value) || 0 },
                  })
                }
                placeholder="Select year"
                disabled={!isEditing}
                search={true}
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Industry
              </label>
              <SearchableSelect
                options={industries}
                value={profile.bio.industry}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    bio: { ...profile.bio, industry: value },
                  })
                }
                placeholder="Select industry"
                disabled={!isEditing}
                search={true}
              />
            </div>
          </div>
  
          {/* Social Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Social Media Links
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Facebook */}
              <div className="relative">
                <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-600" />
                <Input
                  type="url"
                  value={profile.social_links.facebook}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      social_links: { ...profile.social_links, facebook: e.target.value },
                    })
                  }
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 ${
                    isEditing ? "" : "opacity-70 cursor-not-allowed"
                  }`}
                  placeholder="Facebook URL"
                />
              </div>

              {/* Twitter */}
              <div className="relative">
                <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
                <Input
                  type="url"
                  value={profile.social_links.twitter}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      social_links: { ...profile.social_links, twitter: e.target.value },
                    })
                  }
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 ${
                    isEditing ? "" : "opacity-70 cursor-not-allowed"
                  }`}
                  placeholder="Twitter URL"
                />
              </div>

              {/* LinkedIn */}
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-700" />
                <Input
                  type="url"
                  value={profile.social_links.linkedin}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      social_links: { ...profile.social_links, linkedin: e.target.value },
                    })
                  }
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 ${
                    isEditing ? "" : "opacity-70 cursor-not-allowed"
                  }`}
                  placeholder="LinkedIn URL"
                />
              </div>

              {/* Instagram */}
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pink-600" />
                <Input
                  type="url"
                  value={profile.social_links.instagram}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      social_links: { ...profile.social_links, instagram: e.target.value },
                    })
                  }
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 ${
                    isEditing ? "" : "opacity-70 cursor-not-allowed"
                  }`}
                  placeholder="Instagram URL"
                />
              </div>
            </div>
          </div>
        </div>
  
        {/* Buttons */}
        <div className="md:col-span-12 mt-6 flex justify-end space-x-3">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="contained"
              color="primary"
            >
              <Pencil className="w-4 h-4 mr-2" />
              <span>Edit</span>
            </Button>
          ) : (
            <>
              <Button onClick={handleCancel} variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading || !isFormChanged}
                variant="contained"
                color="primary"
              >
                {loading && <Spinner size="sm" className="text-white mr-2" />}
                <span>Update Profile</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default ProfilePage;
