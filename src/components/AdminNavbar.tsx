import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  Briefcase,
  UserCircle,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminNavbarProps {
  className?: string;
}

const AdminNavbar = ({ className = "" }: AdminNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `group relative flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-300 ${
      isActive
        ? "bg-gray-900 text-white shadow-lg scale-105"
        : "text-gray-300 hover:bg-white/5 hover:text-white"
    }`;

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { scale: 1.2, rotate: 5 },
    active: { scale: 1.1, rotate: -2 },
  };

  const textVariants = {
    initial: { x: 0 },
    hover: { x: 2 },
  };

  const navLinks = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/skills", label: "Skills", icon: Sparkles },
    { to: "/admin/projects", label: "Projects", icon: Briefcase },
    { to: "/admin/profile", label: "Profile", icon: UserCircle },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-gray-800 h-16 flex items-center px-6 shadow-lg border-b border-gray-700 justify-between z-50 ${className}`}
    >
      {/* Logo + Title */}
      <motion.div
        className="flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="ml-3 text-white text-xl font-bold tracking-wide select-none">
          Admin Portal
        </h1>
      </motion.div>

      {/* Desktop Nav Links */}
      <motion.div
        className="hidden md:flex gap-4 ml-auto"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClasses} end>
            {({ isActive }) => (
              <>
                <motion.div
                  variants={iconVariants}
                  initial="initial"
                  whileHover="hover"
                  animate={isActive ? "active" : "initial"}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Icon size={20} />
                </motion.div>
                <motion.span
                  variants={textVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  {label}
                </motion.span>
              </>
            )}
          </NavLink>
        ))}
      </motion.div>

      {/* Mobile Menu Button */}
      <div className="md:hidden ml-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-16 right-4 w-48 bg-gray-800 shadow-lg border border-gray-700 rounded-md md:hidden z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default AdminNavbar;
