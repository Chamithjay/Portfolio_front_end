import React, { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard"; 
import { fetchProfile, fetchProjects, fetchSkills } from "../api/api";

interface Profile {
  name: string;
  area_of_interest: string[];
  github: string;
  linkedin: string;
  email: string;
  phone: string;
  photo_base64: string;
}

interface Project {
  title: string;
  description: string;
  image_base64?: string;
  live_link?: string;
  github_link?: string;
}

interface Skill {
  name: string;
  icon_base64?: string | null;
}

interface SkillCategory {
  name: string;
  skills: Skill[];
}

const AdminHome: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<SkillCategory[]>([]);

  useEffect(() => {
    Promise.all([fetchProfile(), fetchProjects(), fetchSkills()])
      .then(([profileRes, projectsRes, skillsRes]) => {
        setProfile(profileRes.data);
        setProjects(projectsRes.data);
        setSkills(skillsRes.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <div className="p-6 pt-24 bg-gray-50 min-h-screen">
        {/* Profile Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">Profile</h2>
          {profile ? (
            <div className="bg-white shadow-md p-6 rounded-lg flex gap-6 items-center">
              {profile.photo_base64 && (
                <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={`data:image/png;base64,${profile.photo_base64}`}
                    alt={`${profile.name} profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="space-y-1 text-gray-700">
                <p>
                  <strong>Name:</strong> {profile.name}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>
                  <strong>Phone:</strong> {profile.phone}
                </p>
                <p>
                  <strong>Area of Interest:</strong>{" "}
                  {profile.area_of_interest?.join(", ")}
                </p>
                <p>
                  <strong>GitHub:</strong>{" "}
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline break-all"
                  >
                    {profile.github}
                  </a>
                </p>
                <p>
                  <strong>LinkedIn:</strong>{" "}
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline break-all"
                  >
                    {profile.linkedin}
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </section>

        {/* Projects Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((proj, index) => (
              <ProjectCard
                key={index}
                title={proj.title}
                description={proj.description}
                imageBase64={proj.image_base64}
                liveLink={proj.live_link}
                githubLink={proj.github_link}
              />
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">Skills</h2>
          {skills.map((category, index) => (
            <div key={index} className="mb-6">
              <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
              <div className="flex gap-3 flex-wrap items-center">
                {category.skills.map((skill, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-lg"
                  >
                    {skill.icon_base64 && (
                      <img
                        src={`data:image/png;base64,${skill.icon_base64}`}
                        alt={skill.name}
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <span className="text-gray-700">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
};

export default AdminHome;
