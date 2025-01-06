import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import axios from "axios";
import "./css/userDetailForm.css";

function UserDetailForm() {
  const [user, setUser] = useState({
    userUserName: "",
    primaryImage: "",
    secondaryImage: "",
    userFullName: "",
    userEmail: "",
    userPhoneNumber: "",
    userGithub: "",
    userLinkedIn: "",
    userPassword: "",
    message: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, primaryImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    console.log(user);
    axios
      .post(`${process.env.REACT_APP_API_URL}/user`, user)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="user-detail-form-page">
      <div className="container">
        <h1>User Details Form</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              name="userFullName"
              className="form-control"
              onChange={handleInput}
              value={user.userFullName}
              placeholder="Enter your full name"
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="userEmail"
              className="form-control"
              onChange={handleInput}
              value={user.userEmail}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="phone"
              name="userPhoneNumber"
              className="form-control"
              onChange={handleInput}
              value={user.userPhoneNumber}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label>Username:</label>
              <input
                type="text"
                name="userUserName"
                className="form-control"
                onChange={handleInput}
                value={user.userUserName}
                placeholder="Enter username"
              />
            </div>
            <div className="form-group col-md-6">
              <label>Password:</label>
              <input
                type="password"
                name="userPassword"
                className="form-control"
                onChange={handleInput}
                value={user.userPassword}
                placeholder="Enter password"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Github:</label>
            <input
              type="url"
              name="userGithub"
              className="form-control"
              onChange={handleInput}
              value={user.userGithub}
              placeholder="Enter your GitHub profile"
            />
          </div>
          <div className="form-group">
            <label>LinkedIn:</label>
            <input
              type="url"
              name="userLinkedIn"
              className="form-control"
              onChange={handleInput}
              value={user.userLinkedIn}
              placeholder="Enter your LinkedIn profile"
            />
          </div>
          <div className="form-group">
            <label>User Primary Image:</label>
            <input
              type="file"
              name="primaryImage"
              className="form-control-file"
              onChange={handleFileChange}
              accept=".jpg, .jpeg, .png, .svg"
            />
          </div>
          <div className="form-group">
            <label>User Secondary Image:</label>
            <input
              type="file"
              name="secondaryImage"
              className="form-control-file"
              onChange={handleFileChange}
              accept=".jpg, .jpeg, .png, .svg"
            />
          </div>
          <div className="form-group">
            <label>Primary Message:</label>
            <textarea
              name="message"
              value={user.message}
              onChange={handleInput}
              placeholder="Write your message here..."
              className="form-control"
            ></textarea>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserDetailForm;
