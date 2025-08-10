import { motion } from "framer-motion";
import { ExternalLink, Github, Image as ImageIcon } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description?: string;
  imageBase64?: string;
  liveLink?: string;
  githubLink?: string;
}

const ProjectCard = ({
  title,
  description,
  imageBase64,
  liveLink,
  githubLink,
}: ProjectCardProps) => {
  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: { y: -8, scale: 1.02 },
  };

  const imageVariants = {
    hover: { scale: 1.05 },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      className="group relative w-full max-w-[22rem] flex flex-col rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl border border-gray-200/50 p-6 transition-all duration-300"
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-2xl pointer-events-none" />

      {/* Image Container */}
      <div className="relative overflow-hidden rounded-xl bg-gray-50">
        <motion.div
          variants={imageVariants}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative"
        >
          {imageBase64 ? (
            <img
              src={`data:image/png;base64,${imageBase64}`}
              alt={title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <ImageIcon size={32} className="opacity-60" />
                <span className="text-sm font-medium">No Image</span>
              </div>
            </div>
          )}

          {/* Image overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative flex flex-col flex-grow mt-5">
        {/* Title */}
        <motion.h2
          className="text-xl font-semibold text-gray-800 text-center mb-3 tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {title}
        </motion.h2>

        {/* Description */}
        {description && (
          <motion.p
            className="text-sm text-gray-600 leading-relaxed flex-grow text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {description}
          </motion.p>
        )}

        {/* Action Buttons */}
        <motion.div
          className="flex justify-center gap-3 mt-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {githubLink && (
            <motion.a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="group/btn relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Github
                size={16}
                className="transition-transform group-hover/btn:rotate-12"
              />
              <span>Code</span>

              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-600 rounded-lg" />
            </motion.a>
          )}

          {liveLink && (
            <motion.a
              href={liveLink}
              target="_blank"
              rel="noopener noreferrer"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="group/btn relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border border-blue-500 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <ExternalLink
                size={16}
                className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
              />
              <span>Live Demo</span>

              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-600 rounded-lg" />
            </motion.a>
          )}
        </motion.div>
      </div>

      {/* Card glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-blue-500/20 rounded-2xl blur-sm transition-all duration-300 -z-10" />
    </motion.div>
  );
};

export default ProjectCard;
