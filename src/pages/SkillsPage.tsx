import React, { useEffect, useState } from "react";
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
  const [selectedCategoryForSkill, setSelectedCategoryForSkill] = useState<string>("");
  const [editingSkill, setEditingSkill] = useState<{ category: string; skill: Skill } | null>(null);
  const [editSkillName, setEditSkillName] = useState("");

  const fetchSkills = async () => {
    try {
      const res = await api.get("/skills");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch skills");
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const addCategory = async () => {
    if (!newCategoryName.trim()) return alert("Category name is required");
    try {
      await api.post("/skills/category", { name: newCategoryName, skills: [] });
      setNewCategoryName("");
      fetchSkills();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Error adding category");
    }
  };

  const addSkill = async () => {
    if (!selectedCategoryForSkill || !newSkillName.trim())
      return alert("Select category and enter skill name");
    try {
      await api.post(`/skills/${selectedCategoryForSkill}`, { name: newSkillName });
      setNewSkillName("");
      fetchSkills();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Error adding skill");
    }
  };

  const startEditSkill = (category: string, skill: Skill) => {
    setEditingSkill({ category, skill });
    setEditSkillName(skill.name);
  };

  const saveEditedSkill = async () => {
    if (!editingSkill || !editSkillName.trim()) return;
    try {
      await api.put(
        `/skills/${editingSkill.category}/${editingSkill.skill.name}`,
        { name: editSkillName }
      );
      setEditingSkill(null);
      setEditSkillName("");
      fetchSkills();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Error updating skill");
    }
  };

  const cancelEdit = () => {
    setEditingSkill(null);
    setEditSkillName("");
  };

  const deleteSkill = async (category: string, skillName: string) => {
    if (!window.confirm(`Delete skill "${skillName}" from "${category}"?`)) return;
    try {
      await api.delete(`/skills/${category}/${skillName}`);
      fetchSkills();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Error deleting skill");
    }
  };

  return (
    <>
      <main className="p-6 pt-24 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Manage Skills</h1>

        {/* Add Category */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Add New Category</h2>
          <div className="flex gap-3 max-w-sm">
            <input
              type="text"
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-grow rounded border border-gray-300 px-3 py-2"
            />
            <button
              onClick={addCategory}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        </section>

        {/* Add Skill */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Add Skill to Category</h2>
          <div className="flex gap-3 max-w-md items-center">
            <select
              value={selectedCategoryForSkill}
              onChange={(e) => setSelectedCategoryForSkill(e.target.value)}
              className="rounded border border-gray-300 px-3 py-2"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Skill Name"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="flex-grow rounded border border-gray-300 px-3 py-2"
            />
            <button
              onClick={addSkill}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Add Skill
            </button>
          </div>
        </section>

        {/* Categories and Skills */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Skill Categories</h2>
          {categories.length === 0 && <p>No categories found.</p>}

          <div className="space-y-6">
            {categories.map((cat) => (
              <div key={cat.name} className="bg-white rounded-lg p-4 shadow">
                <h3 className="text-lg font-bold mb-3">{cat.name}</h3>
                <div className="flex flex-wrap gap-3">
                  {cat.skills.length === 0 && <p className="text-gray-500">No skills added yet.</p>}

                  {cat.skills.map((skill) =>
                    editingSkill &&
                    editingSkill.category === cat.name &&
                    editingSkill.skill.name === skill.name ? (
                      <div key={skill.name} className="flex items-center gap-2 bg-gray-100 rounded px-3 py-1">
                        <input
                          type="text"
                          value={editSkillName}
                          onChange={(e) => setEditSkillName(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1"
                        />
                        <button
                          onClick={saveEditedSkill}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div
                        key={skill.name}
                        className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded"
                      >
                        {skill.icon_base64 && (
                          <img
                            src={`data:image/png;base64,${skill.icon_base64}`}
                            alt={skill.name}
                            className="w-6 h-6 object-contain"
                          />
                        )}
                        <span className="text-gray-700">{skill.name}</span>
                        <button
                          onClick={() => startEditSkill(cat.name, skill)}
                          className="ml-2 text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteSkill(cat.name, skill.name)}
                          className="ml-2 text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default SkillPage;
