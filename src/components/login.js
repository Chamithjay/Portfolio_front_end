import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the correct request payload
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/login`,
        { userName, userPassword: password }
      );

      if (response.data.success) {
        const token = response.data.token;

        // Set token in localStorage with expiry
        const expiryTime = new Date().getTime() + 30 * 60 * 1000; // 30 minutes from now
        localStorage.setItem("token", JSON.stringify({ token, expiryTime }));

        // Navigate to admin page
        navigate("/admin");
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      console.error("Login error:", err.response); // Log full error response
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "24rem" }}>
        <h1 className="text-center mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username:
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Enter your Username"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
          {error && <p className="text-danger mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
