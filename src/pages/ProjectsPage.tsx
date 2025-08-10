import React, { useEffect, useState } from "react";
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

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch projects");
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
  };

  return (
    <>

      <main className="p-6 pt-24 bg-gray-50 min-h-screen max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Projects</h1>

        <section className="mb-8 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            {editingTitle ? "Edit Project" : "Add New Project"}
          </h2>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="title"
              placeholder="Project Title"
              value={form.title}
              onChange={handleInputChange}
              disabled={!!editingTitle} // prevent title change when editing
              className="border border-gray-300 rounded px-3 py-2"
            />

            <textarea
              name="description"
              placeholder="Project Description"
              value={form.description}
              onChange={handleInputChange}
              rows={4}
              className="border border-gray-300 rounded px-3 py-2 resize-none"
            />

            <input type="file" accept="image/*" onChange={handleImageChange} />

            {form.image_base64 && (
              <img
                src={`data:image/png;base64,${form.image_base64}`}
                alt="Project preview"
                className="w-48 h-32 object-cover rounded"
              />
            )}

            <input
              type="text"
              name="live_link"
              placeholder="Live Link (optional)"
              value={form.live_link || ""}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
            />

            <input
              type="text"
              name="github_link"
              placeholder="GitHub Link (optional)"
              value={form.github_link || ""}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
            />

            <div className="flex gap-3">
              {editingTitle ? (
                <>
                  <button
                    onClick={updateProject}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    Update Project
                  </button>
                  <button
                    onClick={resetForm}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={addProject}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Add Project
                </button>
              )}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Existing Projects</h2>

          {projects.length === 0 && <p>No projects found.</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div
                key={project.title}
                className="bg-white p-4 rounded shadow flex flex-col"
              >
                {project.image_base64 && (
                  <img
                    src={`data:image/png;base64,${project.image_base64}`}
                    alt={project.title}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}
                <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
                <p className="mb-3 text-gray-600 flex-grow">
                  {project.description}
                </p>
                <div className="flex gap-2 mb-3">
                  {project.live_link && (
                    <a
                      href={project.live_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm bg-green-600 px-3 py-1 rounded text-white hover:bg-green-700"
                    >
                      Live Demo
                    </a>
                  )}
                  {project.github_link && (
                    <a
                      href={project.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm bg-gray-800 px-3 py-1 rounded text-white hover:bg-gray-900"
                    >
                      GitHub
                    </a>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => startEdit(project)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProject(project.title)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default ProjectPage;
