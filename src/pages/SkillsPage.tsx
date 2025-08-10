import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Tag,
  Layers,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { api } from "../api/api";

interface Skill {
  name: string;
  icon_base64?: string | null;
}

interface SkillCategory {
  name: string;
  skills: Skill[];
}

const SkillPage: React.FC = () => {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSkillName, setNewSkillName] = useState("");
  const [selectedCategoryForSkill, setSelectedCategoryForSkill] =
    useState<string>("");
  const [editingSkill, setEditingSkill] = useState<{
    category: string;
    skill: Skill;
  } | null>(null);
  const [editSkillName, setEditSkillName] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchSkills = async () => {
    try {
      const res = await api.get("/skills");
      setCategories(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch skills");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const showSuccess = (message: string) => {
    setSuccessMsg(message);
    setError(null);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const showError = (message: string) => {
    setError(message);
    setSuccessMsg(null);
  };

  const addCategory = async () => {
    if (!newCategoryName.trim()) {
      showError("Category name is required");
      return;
    }
    setActionLoading(true);
    try {
      await api.post("/skills/category", { name: newCategoryName, skills: [] });
      setNewCategoryName("");
      showSuccess("Category added successfully!");
      fetchSkills();
    } catch (err: any) {
      showError(err.response?.data?.detail || "Error adding category");
    } finally {
      setActionLoading(false);
    }
  };

  const addSkill = async () => {
    if (!selectedCategoryForSkill || !newSkillName.trim()) {
      showError("Select category and enter skill name");
      return;
    }
    setActionLoading(true);
    try {
      await api.post(`/skills/${selectedCategoryForSkill}`, {
        name: newSkillName,
      });
      setNewSkillName("");
      showSuccess("Skill added successfully!");
      fetchSkills();
    } catch (err: any) {
      showError(err.response?.data?.detail || "Error adding skill");
    } finally {
      setActionLoading(false);
    }
  };

  const startEditSkill = (category: string, skill: Skill) => {
    setEditingSkill({ category, skill });
    setEditSkillName(skill.name);
  };

  const saveEditedSkill = async () => {
    if (!editingSkill || !editSkillName.trim()) return;
    setActionLoading(true);
    try {
      await api.put(
        `/skills/${editingSkill.category}/${editingSkill.skill.name}`,
        { name: editSkillName }
      );
      setEditingSkill(null);
      setEditSkillName("");
      showSuccess("Skill updated successfully!");
      fetchSkills();
    } catch (err: any) {
      showError(err.response?.data?.detail || "Error updating skill");
    } finally {
      setActionLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingSkill(null);
    setEditSkillName("");
  };

  const deleteSkill = async (category: string, skillName: string) => {
    if (!window.confirm(`Delete skill "${skillName}" from "${category}"?`))
      return;
    setActionLoading(true);
    try {
      await api.delete(`/skills/${category}/${skillName}`);
      showSuccess("Skill deleted successfully!");
      fetchSkills();
    } catch (err: any) {
      showError(err.response?.data?.detail || "Error deleting skill");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 pt-20 sm:pt-24 bg-gradient-to-br from-gray-50 to-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-[60vh]"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">Loading skills...</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 pt-20 sm:pt-24 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <motion.div
        className="max-w-6xl mx-auto space-y-8"
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
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
            <Code size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
              Manage Skills
            </h1>
            <p className="text-gray-600 mt-1">
              Organize your technical skills into categories
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

        {/* Add Category Section */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50 p-6 sm:p-8 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Layers size={20} className="text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Add New Category
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
            <input
              type="text"
              placeholder="e.g. Frontend, Backend, Tools"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-grow px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              onKeyPress={(e) => e.key === "Enter" && addCategory()}
            />
            <motion.button
              onClick={addCategory}
              disabled={actionLoading}
              whileHover={!actionLoading ? { scale: 1.02 } : {}}
              whileTap={!actionLoading ? { scale: 0.98 } : {}}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 disabled:cursor-not-allowed"
            >
              {actionLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Plus size={18} />
              )}
              Add Category
            </motion.button>
          </div>
        </motion.section>

        {/* Add Skill Section */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50 p-6 sm:p-8 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
              <Tag size={20} className="text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Add Skill to Category
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategoryForSkill}
                onChange={(e) => setSelectedCategoryForSkill(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Name
              </label>
              <input
                type="text"
                placeholder="e.g. React, Node.js, Python"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                onKeyPress={(e) => e.key === "Enter" && addSkill()}
              />
            </div>

            <motion.button
              onClick={addSkill}
              disabled={actionLoading}
              whileHover={!actionLoading ? { scale: 1.02 } : {}}
              whileTap={!actionLoading ? { scale: 0.98 } : {}}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 disabled:cursor-not-allowed"
            >
              {actionLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Plus size={18} />
              )}
              Add Skill
            </motion.button>
          </div>
        </motion.section>

        {/* Skills Categories */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
              <Code size={20} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Skill Categories ({categories.length})
            </h2>
          </div>

          {categories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50 p-12 rounded-2xl text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Code size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No categories yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first skill category to get started
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {categories.map((cat, index) => (
                <motion.div
                  key={cat.name}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl border border-gray-200/50 rounded-2xl p-6 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <Layers size={20} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {cat.name}
                    </h3>
                    <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {cat.skills.length} skills
                    </span>
                  </div>

                  {cat.skills.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">
                      No skills added yet.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((skill) =>
                        editingSkill &&
                        editingSkill.category === cat.name &&
                        editingSkill.skill.name === skill.name ? (
                          <motion.div
                            key={skill.name}
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
                          >
                            <input
                              type="text"
                              value={editSkillName}
                              onChange={(e) => setEditSkillName(e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 text-sm min-w-0 flex-shrink"
                              onKeyPress={(e) =>
                                e.key === "Enter" && saveEditedSkill()
                              }
                              autoFocus
                            />
                            <motion.button
                              onClick={saveEditedSkill}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            >
                              <Save size={12} />
                            </motion.button>
                            <motion.button
                              onClick={cancelEdit}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
                            >
                              <X size={12} />
                            </motion.button>
                          </motion.div>
                        ) : (
                          <motion.div
                            key={skill.name}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="group flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 border border-gray-200 hover:border-blue-300 px-3 py-2 rounded-lg transition-all duration-200"
                          >
                            {skill.icon_base64 && (
                              <img
                                src={`data:image/png;base64,${skill.icon_base64}`}
                                alt={skill.name}
                                className="w-5 h-5 object-contain"
                              />
                            )}
                            <span className="text-gray-700 text-sm font-medium">
                              {skill.name}
                            </span>
                            <div className="ml-auto flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <motion.button
                                onClick={() => startEditSkill(cat.name, skill)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                              >
                                <Edit3 size={12} />
                              </motion.button>
                              <motion.button
                                onClick={() =>
                                  deleteSkill(cat.name, skill.name)
                                }
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                              >
                                <Trash2 size={12} />
                              </motion.button>
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </motion.div>
    </div>
  );
};

export default SkillPage;
