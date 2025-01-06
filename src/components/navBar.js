import "./css/Navbar.css"; // Assuming your CSS is in a separate file

const Navbar = () => {
  return (
    <>
      {/* Desktop Navigation */}
      <nav id="desktop-nav">
        <div>
          <ul className="nav-links">
            <li>
              <a href="#experience">Experience</a>
            </li>
            <li>
              <a href="#projects">Projects</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
