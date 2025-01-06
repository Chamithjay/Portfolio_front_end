import Projects from "./projects";
import ContactForm from "./contactForm";
import Skills from "./skills";
import Hero from "./hero";
import Navbar from "./navBar";
import "./css/home.css";

function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <Hero />
      <Projects />
      <Skills />
      <ContactForm />
    </div>
  );
}

export default Home;
