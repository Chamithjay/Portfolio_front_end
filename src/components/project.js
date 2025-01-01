import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './css/project.css';

function Project() {
  const [projects, setProjects] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    // Fetch projects data
    axios.get('http://localhost:5000/projects')
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    // Intersection Observer for fade-in effect
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            observer.unobserve(entry.target); // Stop observing after fade-in
          }
        });
      },
      { threshold: 0.2 } // Trigger when 20% of the element is visible
    );

    // Observe specific elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    return () => {
      // Cleanup observer
      observer.disconnect();
    };
  }, []);

  const handleToggle = () => {
    setShowMore(!showMore);
  };

  return (
    <section id="projects">
      <p className="section__text__p1 fade-in">Browse My Recent</p>
      <h1 className="title fade-in">Projects</h1>
      <br />
      <br />
      <div className="project-cards fade-in">
        {projects.slice(0, showMore ? projects.length : 3).map((project) => (
          <div key={project._id} className="color-container">
            <img
              src={project.projectImage}
              alt={project.projectName}
              className="project-img"
            />
            <h2 className="project-title">{project.projectName}</h2>
            <div className="btn-container">
              <button
                className="btn btn-color-2 project-btn"
                onClick={() => window.open(project.projectLink, '_blank')}
              >
                Github
              </button>
            </div>
          </div>
        ))}
      </div>
      {projects.length > 3 && (
        <div className="more-button-container">
          <button className="btn more-button" onClick={handleToggle}>
            {showMore ? 'Less...' : 'More...'}
          </button>
        </div>
      )}
    </section>
  );
}

export default Project;
