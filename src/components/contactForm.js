import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/contactForm.css';

function ContactForm() {
  const [user, setUser] = useState([null]);
  const [isVisible, setIsVisible] = useState(false);



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
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 } // Trigger when 20% of the section is visible
    );

    const section = document.querySelector('.contact-section');
    if (section) {
      observer.observe(section);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const [contact, setContact] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setContact({ ...contact, [name]: value });
  };

  function handleSubmit(e) {
    e.preventDefault();
    console.log(contact);
    axios.post(`${process.env.REACT_APP_API_URL}/contact`, contact)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <section
      id="contact"
      className={`contact-section ${isVisible ? 'appear' : 'fade-in'}`}
    >
      <div className="contact-card">
        <h1 className="text-center contact-header">Contact</h1>
        <div className="row">
          <div className="col-md-6">
            <div className="container">
              <div id="Form">
                <form onSubmit={handleSubmit} className="container">
                  <div className="mb-3">
                    <label className="form-label">Name:</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      onChange={handleInput}
                      value={contact.name}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      onChange={handleInput}
                      value={contact.email}
                      placeholder="Eg:abc@lk.com"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Subject:</label>
                    <input
                      type="text"
                      name="subject"
                      className="form-control"
                      onChange={handleInput}
                      value={contact.subject}
                      placeholder="Enter the subject"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Send your inquiry:</label>
                    <textarea
                      id="message"
                      name="message"
                      value={contact.message}
                      onChange={handleInput}
                      placeholder="Write your message here..."
                      className="form-control"
                    ></textarea>
                  </div>
                  <div>
                    <button type="submit" className="btn btn-primary custom-button">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <div className="col-md-6 d-flex justify-content-center align-items-center flex-column">
              <img
                src={user.primaryImage}
                className="profile-img rounded-circle mb-3"
                alt="User"
              />
              <ul className="list-unstyled contact-info text-start">
                <li>Email: {user.userEmail}</li>
                <li>Phone: {user.userPhoneNumber}</li>
                <li>LinkedIn: {user.userLinkedIn}</li>
                <li>GitHub: {user.userGithub}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactForm;
