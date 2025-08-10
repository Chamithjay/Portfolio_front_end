import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Github,
  Image as ImageIcon,
  Save,
  X,
  Upload,
  FolderOpen,
} from "lucide-react";
import { api } from "../api/api";

interface Project {
  title: string;
  description: string;
  image_base64?: string | null;
  live_link?: string | null;
  github_link?: string | null;
}

const ProjectPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Project>({
    title: "",
    description: "",
    image_base64: null,
    live_link: "",
    github_link: "",
  });

  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch projects");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      image_base64: null,
      live_link: "",
      github_link: "",
    });
    setEditingTitle(null);
    setIsFormVisible(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          image_base64: reader.result?.toString().split(",")[1] || null,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addProject = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      alert("Title and Description are required");
      return;
    }
    try {
      await api.post("/projects", form);
      fetchProjects();
      resetForm();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to add project");
    }
  };

  const updateProject = async () => {
    if (!editingTitle) return;
    try {
      await api.put(`/projects/${encodeURIComponent(editingTitle)}`, form);
      fetchProjects();
      resetForm();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to update project");
    }
  };

  const deleteProject = async (title: string) => {
    if (!window.confirm(`Delete project "${title}"?`)) return;
    try {
      await api.delete(`/projects/${encodeURIComponent(title)}`);
      fetchProjects();
      if (editingTitle === title) resetForm();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to delete project");
    }
  };

  const startEdit = (project: Project) => {
    setEditingTitle(project.title);
    setForm({
      title: project.title,
      description: project.description,
      image_base64: project.image_base64 || null,
      live_link: project.live_link || "",
      github_link: project.github_link || "",
    });
    setIsFormVisible(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      y: -4,
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  if (loading) {
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
              <p className="text-gray-600 font-medium">Loading projects...</p>
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
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <FolderOpen size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
                Manage Projects
              </h1>
              <p className="text-gray-600 mt-1">
                Create, edit, and organize your portfolio projects
              </p>
            </div>
          </div>

          <motion.button
            onClick={() => setIsFormVisible(!isFormVisible)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Plus size={18} />
            Add Project
          </motion.button>
        </motion.div>

        {/* Add/Edit Form */}
        <AnimatePresence>
          {isFormVisible && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50 p-6 sm:p-8 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    {editingTitle ? "Edit Project" : "Add New Project"}
                  </h2>
                  <motion.button
                    onClick={resetForm}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        placeholder="Enter project title"
                        value={form.title}
                        onChange={handleInputChange}
                        disabled={!!editingTitle}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        placeholder="Describe your project"
                        value={form.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Live Demo URL
                      </label>
                      <input
                        type="url"
                        name="live_link"
                        placeholder="https://your-project.com"
                        value={form.live_link || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub Repository
                      </label>
                      <input
                        type="url"
                        name="github_link"
                        placeholder="https://github.com/username/repo"
                        value={form.github_link || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Image
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center gap-2"
                        >
                          <Upload size={32} className="text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Click to upload image
                          </span>
                        </label>
                      </div>
                    </div>

                    {form.image_base64 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                      >
                        <img
                          src={`data:image/png;base64,${form.image_base64}`}
                          alt="Project preview"
                          className="w-full h-48 object-cover rounded-lg shadow-md"
                        />
                        <motion.button
                          onClick={() =>
                            setForm((prev) => ({ ...prev, image_base64: null }))
                          }
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                        >
                          <X size={14} />
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                  {editingTitle ? (
                    <>
                      <motion.button
                        onClick={updateProject}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <Save size={18} />
                        Update Project
                      </motion.button>
                      <motion.button
                        onClick={resetForm}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all duration-200"
                      >
                        <X size={18} />
                        Cancel
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      onClick={addProject}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <Plus size={18} />
                      Add Project
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Projects Grid */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
              <FolderOpen size={20} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Projects ({projects.length})
            </h2>
          </div>

          {projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50 p-12 rounded-2xl text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FolderOpen size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No projects yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first project to get started
              </p>
              <motion.button
                onClick={() => setIsFormVisible(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Add Project
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl border border-gray-200/50 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  {/* Project Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                    {project.image_base64 ? (
                      <img
                        src={`data:image/png;base64,${project.image_base64}`}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon size={48} className="text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Links */}
                    <div className="flex gap-2 mb-4">
                      {project.live_link && (
                        <motion.a
                          href={project.live_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs font-medium transition-colors"
                        >
                          <ExternalLink size={12} />
                          Live Demo
                        </motion.a>
                      )}
                      {project.github_link && (
                        <motion.a
                          href={project.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors"
                        >
                          <Github size={12} />
                          GitHub
                        </motion.a>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between pt-4 border-t border-gray-100">
                      <motion.button
                        onClick={() => startEdit(project)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Edit3 size={14} />
                        Edit
                      </motion.button>
                      <motion.button
                        onClick={() => deleteProject(project.title)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </motion.div>
    </div>
  );
};

export default ProjectPage;
