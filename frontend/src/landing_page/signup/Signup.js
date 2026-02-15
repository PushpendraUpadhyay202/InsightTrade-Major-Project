import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo({ ...signupInfo, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;

    if (!name || !email || !password) {
      return handleError("All fields are required");
    }

    try {
      const url = "http://localhost:3002/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupInfo),
      });

      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => navigate("/login"), 1000);
      } else if (error) {
        handleError(error?.details?.[0]?.message || message);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError("Server error");
    }
  };

  return (
    <>
      <div className="signup-wrapper">
        <div className="signup-card">
          <h1>Create Account</h1>
          <p className="subtitle">Start your stock simulation journey 🚀</p>

          <form onSubmit={handleSignup}>
            <div className="field">
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={signupInfo.name}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={signupInfo.email}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={signupInfo.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="signup-btn">
              Sign Up
            </button>

            <p className="switch">
              Already have an account?{" "}
              <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>

      <ToastContainer />

      {/* 🌈 STYLES */}
      <style>{`
        .signup-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #eef3ff, #ffffff);
        }

        .signup-card {
          width: 420px;
          padding: 40px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          animation: fadeIn 0.6s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .signup-card h1 {
          text-align: center;
          margin-bottom: 6px;
          font-size: 1.8rem;
        }

        .subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 24px;
        }

        .field {
          display: flex;
          flex-direction: column;
          margin-bottom: 18px;
        }

        .field label {
          font-size: 0.9rem;
          margin-bottom: 6px;
          color: #555;
        }

        .field input {
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid #ddd;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .field input:focus {
          border-color: #387ed1;
          box-shadow: 0 0 0 3px rgba(56, 126, 209, 0.15);
        }

        .signup-btn {
          width: 100%;
          margin-top: 10px;
          padding: 12px;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 500;
          background: linear-gradient(135deg, #387ed1, #5fa2ff);
          color: white;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .signup-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(56, 126, 209, 0.3);
        }

        .switch {
          margin-top: 16px;
          text-align: center;
          font-size: 0.9rem;
          color: #555;
        }

        .switch a {
          color: #387ed1;
          text-decoration: none;
          font-weight: 500;
        }

        .switch a:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .signup-card {
            width: 90%;
            padding: 28px;
          }
        }
      `}</style>
    </>
  );
}

export default Signup;
