import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  ExternalLink,
  Code,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchProfile(), fetchProjects(), fetchSkills()])
      .then(([profileRes, projectsRes, skillsRes]) => {
        setProfile(profileRes.data);
        setProjects(projectsRes.data);
        setSkills(skillsRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const scrollProjects = (direction: "left" | "right") => {
    const container = document.getElementById("projects-container");
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
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
      transition: { duration: 0.5, ease: ["easeOut"] },
    },
  };

  const sectionHeaderVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: ["easeOut"] },
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
              <p className="text-gray-600 font-medium">Loading dashboard...</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 pt-20 sm:pt-24 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <motion.div
        className="max-w-7xl mx-auto space-y-8 sm:space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Header */}
        <motion.div
          variants={itemVariants}
          className="text-center py-6 sm:py-8"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 sm:mb-4 tracking-tight">
            Welcome to Admin Portal
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            Manage your portfolio content, projects, and skills from this
            centralized dashboard.
          </p>
        </motion.div>

        {/* Profile Section */}
        <motion.section variants={itemVariants}>
          <motion.div
            variants={sectionHeaderVariants}
            className="flex items-center gap-3 mb-6 sm:mb-8"
          >
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <User size={20} className="text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
              Profile Overview
            </h2>
          </motion.div>

          {profile ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl border border-gray-200/50 p-6 sm:p-8 rounded-2xl transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center">
                {/* Profile Image - Made Bigger */}
                {profile.photo_base64 && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative mx-auto lg:mx-0 flex-shrink-0"
                  >
                    <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full overflow-hidden ring-4 ring-blue-100 shadow-xl">
                      <img
                        src={`data:image/png;base64,${profile.photo_base64}`}
                        alt={`${profile.name} profile`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white shadow-lg"></div>
                  </motion.div>
                )}

                {/* Profile Details */}
                <div className="flex-1 space-y-4 w-full">
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-2xl sm:text-3xl font-bold text-gray-800 text-center lg:text-left"
                  >
                    {profile.name}
                  </motion.h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-lg hover:bg-gray-100/80 transition-colors"
                    >
                      <Mail size={16} className="text-blue-600 flex-shrink-0" />
                      <span className="text-gray-700 text-sm truncate">
                        {profile.email}
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-lg hover:bg-gray-100/80 transition-colors"
                    >
                      <Phone
                        size={16}
                        className="text-green-600 flex-shrink-0"
                      />
                      <span className="text-gray-700 text-sm">
                        {profile.phone}
                      </span>
                    </motion.div>

                    <motion.a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-lg hover:bg-gray-100/80 transition-all duration-200 group cursor-pointer"
                    >
                      <Github
                        size={16}
                        className="text-gray-800 flex-shrink-0 group-hover:scale-110 transition-transform"
                      />
                      <span className="text-blue-600 text-sm truncate group-hover:text-blue-700">
                        GitHub
                      </span>
                      <ExternalLink
                        size={12}
                        className="text-gray-400 group-hover:text-gray-600 transition-colors"
                      />
                    </motion.a>

                    <motion.a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-lg hover:bg-gray-100/80 transition-all duration-200 group cursor-pointer"
                    >
                      <Linkedin
                        size={16}
                        className="text-blue-500 flex-shrink-0 group-hover:scale-110 transition-transform"
                      />
                      <span className="text-blue-600 text-sm truncate group-hover:text-blue-700">
                        LinkedIn
                      </span>
                      <ExternalLink
                        size={12}
                        className="text-gray-400 group-hover:text-gray-600 transition-colors"
                      />
                    </motion.a>
                  </div>

                  {/* Areas of Interest */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="pt-2"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin size={16} className="text-purple-600" />
                      <span className="font-medium text-gray-700">
                        Areas of Interest
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.area_of_interest?.map((interest, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.9 + index * 0.1,
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200/50 hover:shadow-sm transition-all duration-200"
                        >
                          {interest}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50 p-8 rounded-2xl text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500">No profile data available</p>
            </motion.div>
          )}
        </motion.section>

        {/* Projects Section - Horizontal Scrolling */}
        <motion.section variants={itemVariants}>
          <motion.div
            variants={sectionHeaderVariants}
            className="flex items-center justify-between mb-6 sm:mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
                <FolderOpen size={20} className="text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
                Projects Portfolio
              </h2>
            </div>

            {/* Navigation Buttons */}
            {projects.length > 4 && (
              <div className="hidden lg:flex items-center gap-2">
                <motion.button
                  onClick={() => scrollProjects("left")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <ChevronLeft size={20} className="text-gray-600" />
                </motion.button>
                <motion.button
                  onClick={() => scrollProjects("right")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <ChevronRight size={20} className="text-gray-600" />
                </motion.button>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {projects.length > 0 ? (
              <div
                id="projects-container"
                className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {projects.map((proj, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="flex-shrink-0 w-80 sm:w-[22rem] snap-start"
                  >
                    <ProjectCard
                      title={proj.title}
                      description={proj.description}
                      imageBase64={proj.image_base64}
                      liveLink={proj.live_link}
                      githubLink={proj.github_link}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50 p-8 rounded-2xl text-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FolderOpen size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500">No projects available</p>
              </motion.div>
            )}
          </motion.div>
        </motion.section>

        {/* Skills Section */}
        <motion.section variants={itemVariants}>
          <motion.div
            variants={sectionHeaderVariants}
            className="flex items-center gap-3 mb-6 sm:mb-8"
          >
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
              <Code size={20} className="text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
              Technical Skills
            </h2>
          </motion.div>

          <div className="space-y-6 sm:space-y-8">
            {skills.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + categoryIndex * 0.1 }}
                className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl border border-gray-200/50 p-6 sm:p-8 rounded-2xl transition-all duration-300"
              >
                <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-4 sm:mb-6 tracking-tight">
                  {category.name}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skillIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.5 + skillIndex * 0.05,
                      }}
                      className="group flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200/50 hover:border-gray-300/50 hover:shadow-md transition-all duration-300"
                    >
                      {skill.icon_base64 ? (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <img
                            src={`data:image/png;base64,${skill.icon_base64}`}
                            alt={skill.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <Code size={16} className="text-gray-500" />
                        </div>
                      )}
                      <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">
                        {skill.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {skills.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50 p-8 rounded-2xl text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Code size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500">No skills available</p>
            </motion.div>
          )}
        </motion.section>
      </motion.div>
    </div>
  );
};

export default AdminHome;
