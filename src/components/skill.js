import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "./css/skills.css";
import CheckMarkIcon from "../assets/checkmark.png";

function Skill() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    // Fetch skills data
    axios
      .get(`${process.env.REACT_APP_API_URL}/skills`)
      .then((response) => {
        setSkills(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    // Intersection Observer for fade-in effect
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("appear");
            observer.unobserve(entry.target); // Stop observing once animated
          }
        });
      },
      { threshold: 0.2 } // Trigger when 20% of the element is visible
    );

    // Observe specific elements
    const fadeElements = document.querySelectorAll(".fade-in");
    fadeElements.forEach((el) => observer.observe(el));

    return () => {
      // Cleanup observer
      observer.disconnect();
    };
  }, []);

  return (
    <section id="experience" className="experience-section">
      <div className="header">
        <p className="section__text__p1 fade-in">Explore My</p>
        <h1 className="title fade-in">Experience</h1>
      </div>
      <div className="card fade-in">
        <div className="article-container">
          {skills.map((skill) => (
            <article key={skill.skillName} className="skill-card">
              <div className="skill-content">
                <img
                  src={CheckMarkIcon}
                  alt="Experience icon"
                  className="icon"
                />
                <div>
                  <h3>{skill.skillName}</h3>
                  <p>{skill.skillExperience}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skill;
