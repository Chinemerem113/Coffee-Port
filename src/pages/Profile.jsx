import React, { useState, useEffect } from "react";
import {
  Coffee,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  LogOut,
  Shield,
} from "lucide-react";
import { ref, get, set } from "firebase/database";
import { updateProfile, updatePassword } from "firebase/auth";
import { db, auth } from "../firebase/config";
import { signOut } from "firebase/auth";

const Profile = ({ setPage, user, username }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const [profileData, setProfileData] = useState({
    username: username || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    bio: "",
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const userRef = ref(db, `users/${user.uid}`);
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            const data = snapshot.val();
            setProfileData({
              username: data.username || username || "",
              email: user.email || "",
              phone: data.phone || "",
              address: data.address || "",
              city: data.city || "",
              bio: data.bio || "",
            });
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      }
    };

    fetchProfile();
  }, [user, username]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
    setError("");
    setSuccess("");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    setError("");
    setSuccess("");
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Update display name in Firebase Auth
      if (profileData.username !== user.displayName) {
        await updateProfile(user, { displayName: profileData.username });
      }

      // Get existing data first to preserve it
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
      const existingData = snapshot.exists() ? snapshot.val() : {};

      // Update user data in Realtime Database - merging with existing data
      await set(userRef, {
        ...existingData,
        uid: user.uid,
        username: profileData.username,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
        city: profileData.city,
        bio: profileData.bio,
        updatedAt: new Date().toISOString(),
      });

      console.log("Profile saved successfully:", profileData); // Debug log

      setSuccess("Profile updated successfully!");
      setIsEditing(false);

      // Don't reload, just update the display
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updatePassword(user, passwordData.newPassword);
      setSuccess("Password changed successfully!");
      setShowPasswordChange(false);
      setPasswordData({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      if (err.code === "auth/requires-recent-login") {
        setError(
          "Please log out and log back in before changing your password"
        );
      } else {
        setError(err.message || "Failed to change password");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setPage("empty");
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPage("home")}
              className="text-gray-600 hover:text-amber-900 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <Coffee className="h-8 w-8 text-amber-900" />
            <span className="text-2xl font-bold text-gray-900">My Profile</span>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-amber-900 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Alert Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-8 mb-6 border border-amber-200">
          <div className="flex items-center gap-6">
            <div className="bg-amber-900 w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {profileData.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profileData.username}
              </h1>
              <p className="text-gray-700 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {profileData.email}
              </p>
              <p className="text-gray-600 text-sm mt-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Member since {formatDate(user?.metadata?.creationTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Profile Information
          </h2>

          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              {isEditing ? (
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                    placeholder="Enter your username"
                  />
                </div>
              ) : (
                <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  {profileData.username || "Not set"}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                    placeholder="+234 xxx xxx xxxx"
                  />
                </div>
              ) : (
                <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  {profileData.phone || "Not set"}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              {isEditing ? (
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                    placeholder="Enter your address"
                  />
                </div>
              ) : (
                <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  {profileData.address || "Not set"}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={profileData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                  placeholder="Enter your city"
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  {profileData.city || "Not set"}
                </p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  {profileData.bio || "No bio yet"}
                </p>
              )}
            </div>
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="flex-1 bg-amber-900 text-white py-3 rounded-lg hover:bg-amber-800 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="h-5 w-5" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setError("");
                  setSuccess("");
                }}
                className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <X className="h-5 w-5" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Shield className="h-6 w-6 text-amber-900" />
            Security
          </h2>

          {!showPasswordChange ? (
            <button
              onClick={() => setShowPasswordChange(true)}
              className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:border-amber-900 hover:text-amber-900 transition-colors font-semibold"
            >
              Change Password
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="flex-1 bg-amber-900 text-white py-3 rounded-lg hover:bg-amber-800 transition-colors font-semibold disabled:opacity-50"
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>
                <button
                  onClick={() => {
                    setShowPasswordChange(false);
                    setPasswordData({ newPassword: "", confirmPassword: "" });
                    setError("");
                  }}
                  className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Logout Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
