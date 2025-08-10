import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, LayoutDashboard, Code, FolderOpen, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminNavbarProps {
  className?: string;
}

const AdminNavbar = ({ className = "" }: AdminNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `group relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium ${
      isActive
        ? "bg-blue-50 text-blue-600 shadow-sm"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: 3 },
    active: { scale: 1.05, rotate: -1 },
  };

  const textVariants = {
    initial: { x: 0 },
    hover: { x: 2 },
  };

  const navLinks = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/skills", label: "Skills", icon: Code },
    { to: "/admin/projects", label: "Projects", icon: FolderOpen },
    { to: "/admin/profile", label: "Profile", icon: User },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 h-16 flex items-center px-6 justify-between z-50 ${className}`}
    >
      {/* Logo + Title */}
      <motion.div
        className="flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-gray-800 text-xl font-semibold tracking-tight select-none">
          Admin Portal
        </h1>
      </motion.div>

      {/* Desktop Nav Links */}
      <motion.div
        className="hidden md:flex items-center gap-2 ml-auto"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
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
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Icon size={16} />
                </motion.div>
                <motion.span
                  variants={textVariants}
                  initial="initial"
                  whileHover="hover"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {label}
                </motion.span>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-blue-50 rounded-lg -z-10"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </motion.div>

      {/* Mobile Menu Button */}
      <div className="md:hidden ml-auto">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              className="absolute top-16 right-4 w-56 bg-white/95 backdrop-blur-md shadow-xl border border-gray-200/50 rounded-xl md:hidden z-50 overflow-hidden"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="p-2">
                {navLinks.map(({ to, label, icon: Icon }, index) => (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-blue-50 text-blue-600 shadow-sm"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon size={16} />
                      <span className="font-medium text-sm">{label}</span>
                    </NavLink>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default AdminNavbar;
