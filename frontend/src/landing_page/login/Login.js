import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError("Email and password are required");
    }

    try {
      const response = await fetch("http://localhost:3002/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();
      const { success, message, jwtToken, name, userId, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        localStorage.setItem("userId", userId); 

        setTimeout(() => {
          window.location.href = `http://localhost:3001/?userId=${userId}&userName=${name}`;
        }, 1000);
      } else if (error) {
        handleError(error?.details?.[0]?.message || message);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError("Server error. Is your backend running on port 3002?");
    }
  };

  return (
    <>
      <div className="login-wrapper">
        <div className="background-blobs">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>
        
        <div className="login-card">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p className="subtitle">Enter your credentials to access the terminal 📈</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="field">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="e.g. trader@market.com"
                value={loginInfo.email}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={loginInfo.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="login-btn">
              Sign In
            </button>

            <p className="switch">
              Don't have an account?{" "}
              <Link to="/signup" className="signup-link">Get Started</Link>
            </p>
          </form>
        </div>
      </div>

      <ToastContainer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8fafc;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Ambient Background Decorative Elements */
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
          opacity: 0.4;
        }
        .blob-1 {
          width: 400px;
          height: 400px;
          background: #387ed1;
          top: -100px;
          right: -100px;
        }
        .blob-2 {
          width: 300px;
          height: 300px;
          background: #60a5fa;
          bottom: -50px;
          left: -50px;
        }

        .login-card {
          width: 400px;
          padding: 48px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 28px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
          z-index: 1;
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-card h1 { 
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
          margin-bottom: 22px; 
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
          background: #fff;
        }

        .login-btn { 
          width: 100%; 
          margin-top: 8px; 
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

        .login-btn:hover { 
          background: #334155;
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .login-btn:active {
          transform: translateY(0);
        }

        .switch { 
          margin-top: 24px; 
          text-align: center; 
          font-size: 0.9rem; 
          color: #64748b;
          font-weight: 500;
        }

        .signup-link {
          color: #387ed1;
          text-decoration: none;
          font-weight: 700;
          margin-left: 4px;
        }

        .signup-link:hover {
          text-decoration: underline;
        }

        /* Success/Error Toast Customization logic remains via ToastContainer */
      `}</style>
    </>
  );
}

export default Login;