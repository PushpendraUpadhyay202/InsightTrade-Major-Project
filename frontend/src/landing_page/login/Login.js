import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;

      if (success) {
        handleSuccess(message);

        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);

        // ✅ React navigation (NO PAGE RELOAD)
        setTimeout(() => {
          window.location.replace("http://localhost:3001/");

        }, 1000);
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
      <div className="login-wrapper">
        <div className="login-card">
          <h1>Welcome Back</h1>
          <p className="subtitle">Login to your trading dashboard 📈</p>

          <form onSubmit={handleLogin}>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={loginInfo.email}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={loginInfo.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>

            <p className="switch">
              Don&apos;t have an account?{" "}
              <Link to="/signup">Signup</Link>
            </p>
          </form>
        </div>
      </div>

      <ToastContainer />

      {/* STYLES */}
      <style>{`
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #eef3ff, #ffffff);
        }

        .login-card {
          width: 420px;
          padding: 40px;
          background: rgba(255, 255, 255, 0.92);
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

        .login-card h1 {
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

        .login-btn {
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

        .login-btn:hover {
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
          .login-card {
            width: 90%;
            padding: 28px;
          }
        }
      `}</style>
    </>
  );
}

export default Login;
