import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  Download,
  MapPin,
  Code,
  User,
  ChevronRight,
  Star,
} from "lucide-react";
import { api } from "../api/api";
import ProjectCard from "../components/ProjectCard";

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

const Home: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data...");

        const [profileRes, projectsRes, skillsRes] = await Promise.all([
          api.get("/profile"),
          api.get("/projects"),
          api.get("/skills"),
        ]);

        console.log("Profile data:", profileRes.data);
        console.log("Projects data:", projectsRes.data);
        console.log("Skills data:", skillsRes.data);

        // Debug each project individually
        projectsRes.data.forEach((project: Project, index: number) => {
          console.log(`Project ${index + 1}:`, {
            title: project.title,
            live_link: project.live_link,
            github_link: project.github_link,
            hasLiveLink: !!project.live_link,
            hasGithubLink: !!project.github_link,
          });
        });

        setProfile(profileRes.data);
        setProjects(projectsRes.data);
        setSkills(skillsRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const downloadCV = () => {
    if (profile?.cv_base64) {
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${profile.cv_base64}`;
      link.download = `${profile.name}_CV.pdf`;
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-white font-medium">Loading portfolio...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-blue-800/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-32 pb-16 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
          >
            {/* Profile Image */}
            {profile?.photo_base64 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden ring-4 ring-purple-400/30 shadow-2xl bg-gradient-to-br from-purple-400 to-blue-500 p-1">
                  <img
                    src={`data:image/png;base64,${profile.photo_base64}`}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-green-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                </div>
              </motion.div>
            )}

            {/* Hero Content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Hi, I'm{" "}
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {profile?.name || "Developer"}
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-8"
              >
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                  <MapPin size={20} className="text-purple-400" />
                  <span className="text-xl text-gray-300">
                    Passionate about
                  </span>
                </div>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  {profile?.area_of_interest?.map((interest, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      {interest}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Contact Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                {profile?.email && (
                  <motion.a
                    href={`mailto:${profile.email}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Mail size={20} />
                    Get In Touch
                  </motion.a>
                )}

                {profile?.cv_base64 && (
                  <motion.button
                    onClick={downloadCV}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Download size={20} />
                    Download CV
                  </motion.button>
                )}
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="flex gap-4 justify-center lg:justify-start mt-8"
              >
                {profile?.github && (
                  <motion.a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Github size={24} className="text-white" />
                  </motion.a>
                )}
                {profile?.linkedin && (
                  <motion.a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Linkedin size={24} className="text-white" />
                  </motion.a>
                )}
                {profile?.phone && (
                  <motion.a
                    href={`tel:${profile.phone}`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Phone size={24} className="text-white" />
                  </motion.a>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 sm:py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                <Code size={24} className="text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Technical Skills
              </h2>
            </div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Technologies and tools I work with to bring ideas to life
            </p>
          </motion.div>

          <div className="space-y-8">
            {skills.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sm:p-8"
              >
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Star className="text-yellow-400" size={24} />
                  {category.name}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skillIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{
                        duration: 0.3,
                        delay: skillIndex * 0.05,
                      }}
                      viewport={{ once: true }}
                      className="group flex flex-col items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {skill.icon_base64 ? (
                        <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <img
                            src={`data:image/png;base64,${skill.icon_base64}`}
                            alt={skill.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <Code size={20} className="text-white" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-white text-center leading-tight">
                        {skill.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
                <User size={24} className="text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Featured Projects
              </h2>
            </div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              A showcase of my recent work and personal projects
            </p>
          </motion.div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <ProjectCard key={index} project={project} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Code size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-400">No projects available yet</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Let's Work Together
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Have a project in mind? Let's discuss how we can bring your ideas
              to life.
            </p>
            {profile?.email && (
              <motion.a
                href={`mailto:${profile.email}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Mail size={20} />
                Start a Conversation
                <ChevronRight size={20} />
              </motion.a>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
