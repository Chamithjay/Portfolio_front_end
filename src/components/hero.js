import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/hero.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Github from '../assets/github.png';
import LinkedIn from '../assets/linkedin.png';

function Hero() {
  const [user, setUser] = useState([null]);

  useEffect(() => {
    // Fetch user data
    axios.get('http://localhost:5000/user')
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    // Intersection Observer for fade-in effect
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            observer.unobserve(entry.target); // Stop observing once appeared
          }
        });
      },
      { threshold: 0.2 } // Trigger when 20% of the element is visible
    );

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    return () => {
      // Cleanup observer
      observer.disconnect();
    };
  }, []);

  return (
    <section id="profile">
      <div className="section__pic-container fade-in">
        <img src={user.primaryImage} alt="Profile" />
      </div>
      <div className="section__text fade-in">
        <p className="section__text__p1">Hello, I'm</p>
        <h1 className="title">{user.userFullName}</h1>
        <p className="section__text__p2">{user.message}</p>
        <div className="btn-container fade-in">
          <button
            className="btn btn-color-1"
            onClick={() => (window.location.href = './#contact')}
          >
            Contact Info
          </button>
        </div>
        <div id="socials-container" className="fade-in">
          <img
            src={LinkedIn}
            alt="My LinkedIn profile"
            className="icon"
            onClick={() => (window.location.href = 'https://www.linkedin.com/in/chamitha-thambiliyagoda/')}
          />
          <img
            src={Github}
            alt="My Github profile"
            className="icon"
            onClick={() => (window.location.href = 'https://github.com/Chamithjay')}
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
