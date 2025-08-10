import React, { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { api } from "../api/api";

interface Profile {
  name: string;
  area_of_interest: string[];
  github?: string;
  linkedin?: string;
  email?: string;
  phone?: string;
  photo_base64?: string;
  cv_base64?: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({
    name: "",
    area_of_interest: "",
    github: "",
    linkedin: "",
    email: "",
    phone: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/profile");
        setProfile(res.data);
        setForm({
          name: res.data.name || "",
          area_of_interest: (res.data.area_of_interest || []).join(", "),
          github: res.data.github || "",
          linkedin: res.data.linkedin || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
        });
      } catch (err) {
        setError("Failed to load profile");
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleCvChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      form.area_of_interest
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((interest) => formData.append("area_of_interest", interest));
      if (form.github) formData.append("github", form.github);
      if (form.linkedin) formData.append("linkedin", form.linkedin);
      if (form.email) formData.append("email", form.email);
      if (form.phone) formData.append("phone", form.phone);
      if (photoFile) formData.append("photo", photoFile);
      if (cvFile) formData.append("cv", cvFile);

      await api.patch("/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMsg("Profile updated successfully!");
      // Refetch profile to update display
      const res = await api.get("/profile");
      setProfile(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-20">
        <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

        {error && <p className="mb-4 text-red-600">{error}</p>}
        {successMsg && <p className="mb-4 text-green-600">{successMsg}</p>}

        {profile ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display current photo */}
            {profile.photo_base64 && (
              <div>
                <img
                  src={`data:image/png;base64,${profile.photo_base64}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover mb-2"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold mb-1" htmlFor="name">
                Name <span className="text-red-600">*</span>
              </label>
              <input
                id="name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label
                className="block font-semibold mb-1"
                htmlFor="area_of_interest"
              >
                Area of Interest (comma separated)
              </label>
              <input
                id="area_of_interest"
                name="area_of_interest"
                value={form.area_of_interest}
                onChange={handleChange}
                placeholder="e.g. AI, Web Development, Data Science"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="github">
                GitHub URL
              </label>
              <input
                id="github"
                name="github"
                value={form.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="linkedin">
                LinkedIn URL
              </label>
              <input
                id="linkedin"
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+123456789"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="photo">
                Upload New Photo
              </label>
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="cv">
                Upload New CV (PDF)
              </label>
              <input
                id="cv"
                name="cv"
                type="file"
                accept="application/pdf"
                onChange={handleCvChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
