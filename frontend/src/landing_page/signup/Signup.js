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
      handleError("Server error. Check if your backend is running.");
    }
  };

  return (
    <>
      <div className="signup-wrapper">
        <div className="background-blobs">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>

        <div className="signup-card">
          <div className="signup-header">
            <h1>Create Account</h1>
            <p className="subtitle">Join the elite trading simulation network 🚀</p>
          </div>

          <form onSubmit={handleSignup}>
            <div className="field">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Rahul Sharma"
                value={signupInfo.name}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={signupInfo.email}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={signupInfo.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="signup-btn">
              Create Account
            </button>

            <p className="switch">
              Already have an account?{" "}
              <Link to="/login" className="login-link">Login Here</Link>
            </p>
          </form>
        </div>
      </div>

      <ToastContainer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .signup-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8fafc;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Ambient Background Blobs matching the Login theme */
        .background-blobs {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 0;
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
        }
        .blob-1 {
          width: 450px;
          height: 450px;
          background: #387ed1;
          top: -150px;
          left: -100px;
        }
        .blob-2 {
          width: 350px;
          height: 350px;
          background: #60a5fa;
          bottom: -80px;
          right: -50px;
        }

        .signup-card {
          width: 420px;
          padding: 48px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 28px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
          z-index: 1;
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .signup-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .signup-card h1 { 
          margin: 0;
          font-size: 1.85rem; 
          font-weight: 800; 
          color: #1e293b;
          letter-spacing: -0.025em;
        }

        .subtitle { 
          color: #64748b; 
          font-size: 0.95rem;
          margin-top: 10px;
          line-height: 1.5;
        }

        .field { 
          display: flex; 
          flex-direction: column; 
          margin-bottom: 20px; 
        }

        .field label { 
          font-size: 0.85rem; 
          font-weight: 600; 
          margin-bottom: 8px; 
          color: #475569; 
        }

        .field input { 
          padding: 14px 16px; 
          border-radius: 12px; 
          border: 1.5px solid #e2e8f0; 
          outline: none; 
          font-size: 0.95rem;
          transition: all 0.2s ease;
          background: white;
        }

        .field input:focus { 
          border-color: #387ed1; 
          box-shadow: 0 0 0 4px rgba(56, 126, 209, 0.1);
        }

        .signup-btn { 
          width: 100%; 
          margin-top: 10px; 
          padding: 14px; 
          border: none; 
          border-radius: 12px; 
          background: #1e293b; 
          color: white; 
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer; 
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .signup-btn:hover { 
          background: #334155;
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .switch { 
          margin-top: 24px; 
          text-align: center; 
          font-size: 0.9rem; 
          color: #64748b;
          font-weight: 500;
        }

        .login-link {
          color: #387ed1;
          text-decoration: none;
          font-weight: 700;
          margin-left: 4px;
        }

        .login-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .signup-card { width: 90%; padding: 32px; }
        }
      `}</style>
    </>
  );
}

export default Signup;