import React, { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Upload,
  Camera,
  FileText,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
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
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
        setPageLoading(false);
      } catch (err) {
        setError("Failed to load profile");
        setPageLoading(false);
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
      const file = e.target.files[0];
      setPhotoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCvChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setCvFile(e.target.files[0]);
    }
  };

  const clearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    const input = document.getElementById("photo") as HTMLInputElement;
    if (input) input.value = "";
  };

  const clearCv = () => {
    setCvFile(null);
    const input = document.getElementById("cv") as HTMLInputElement;
    if (input) input.value = "";
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
      setPhotoFile(null);
      setPhotoPreview(null);
      setCvFile(null);

      // Refetch profile to update display
      const res = await api.get("/profile");
      setProfile(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="p-4 sm:p-6 pt-20 sm:pt-24 bg-gradient-to-br from-gray-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-[60vh]"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">Loading profile...</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 pt-20 sm:pt-24 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <motion.div
        className="max-w-7xl mx-auto space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
            <User size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
              Edit Profile
            </h1>
            <p className="text-gray-600 mt-1">
              Update your personal information and portfolio details
            </p>
          </div>
        </motion.div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
            >
              <AlertCircle size={20} />
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto p-1 hover:bg-red-100 rounded"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
            >
              <CheckCircle2 size={20} />
              <span>{successMsg}</span>
              <button
                onClick={() => setSuccessMsg(null)}
                className="ml-auto p-1 hover:bg-green-100 rounded"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {profile ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50 rounded-2xl overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 lg:p-12 space-y-10"
            >
              {/* Profile Photo Section */}
              <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 items-start xl:items-center">
                <div className="flex-shrink-0 mx-auto xl:mx-0">
                  <div className="relative">
                    <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden ring-4 ring-blue-100 shadow-xl bg-gradient-to-br from-gray-100 to-gray-200">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Photo preview"
                          className="w-full h-full object-cover"
                        />
                      ) : profile.photo_base64 ? (
                        <img
                          src={`data:image/png;base64,${profile.photo_base64}`}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <User size={64} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    {(photoPreview || photoFile) && (
                      <motion.button
                        type="button"
                        onClick={clearPhoto}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </motion.button>
                    )}
                  </div>
                </div>

                <div className="flex-1 text-center xl:text-left">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Profile Photo
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto xl:mx-0">
                    Upload a professional photo that represents you well. This
                    will be displayed across your portfolio.
                  </p>
                  <div className="flex justify-center xl:justify-start">
                    <input
                      id="photo"
                      name="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <motion.label
                      htmlFor="photo"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer font-medium transition-colors shadow-sm hover:shadow-md"
                    >
                      <Camera size={18} />
                      Choose Photo
                    </motion.label>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Name */}
                <div className="xl:col-span-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <User size={16} />
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-lg"
                  />
                </div>

                {/* Area of Interest */}
                <div className="xl:col-span-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <MapPin size={16} />
                    Areas of Interest
                  </label>
                  <input
                    id="area_of_interest"
                    name="area_of_interest"
                    value={form.area_of_interest}
                    onChange={handleChange}
                    placeholder="e.g. AI, Web Development, Data Science, Machine Learning"
                    className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Separate multiple interests with commas
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <Mail size={16} />
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <Phone size={16} />
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>

                {/* Social Links Header */}
                <div className="xl:col-span-1 xl:row-span-2 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User size={24} className="text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800">
                      Social Profiles
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Connect your professional profiles
                    </p>
                  </div>
                </div>

                {/* GitHub */}
                <div className="xl:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <Github size={16} />
                    GitHub Profile
                  </label>
                  <input
                    id="github"
                    name="github"
                    value={form.github}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                    className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>

                {/* LinkedIn */}
                <div className="xl:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <Linkedin size={16} />
                    LinkedIn Profile
                  </label>
                  <input
                    id="linkedin"
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* CV Upload Section */}
              <div className="pt-8 border-t border-gray-200">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                      <FileText size={24} className="text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Resume/CV
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Upload your latest resume or CV in PDF format. This will
                      be available for download by potential employers or
                      clients.
                    </p>
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <input
                        id="cv"
                        name="cv"
                        type="file"
                        accept="application/pdf"
                        onChange={handleCvChange}
                        className="hidden"
                      />
                      <motion.label
                        htmlFor="cv"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg cursor-pointer font-medium transition-colors shadow-sm hover:shadow-md"
                      >
                        <Upload size={18} />
                        Choose File
                      </motion.label>
                      {cvFile && (
                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border">
                          <FileText size={16} className="text-gray-500" />
                          <span className="text-sm text-gray-700 font-medium">
                            {cvFile.name}
                          </span>
                          <motion.button
                            type="button"
                            onClick={clearCv}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <X size={16} />
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-8 border-t border-gray-200 flex justify-center">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  className="flex items-center justify-center gap-3 px-12 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed text-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Updating Profile...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Update Profile
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50 p-12 rounded-2xl text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No profile found
            </h3>
            <p className="text-gray-500">Unable to load profile data</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;
