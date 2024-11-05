// src/pages/Login.jsx
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const [userName, setUsername] = useState("");
  const [rollNumber, setRollnumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const action = e.nativeEvent.submitter.name;
    let response;
    try {
      if (action === "register") {
        response = await axios.post("http://localhost:5555/register", {
          userName,
          rollNumber,
        });
      }
    } catch (error) {
      if (error.response.status === 409) {
        alert("User already exists");
      }
    }

    try {
      if (action === "Login") {
        response = await axios.post("http://localhost:5555/login", {
          userName,
          rollNumber,
        });
      }
      if (response.data.message === "Exists") {
        navigate("/dashboard");
      }
    } catch (error) {
      if(error.response.status===400){
        alert("No such user registered");
      }
    }
  }

  function handleFocus() {
    document.getElementsByClassName("title")[0].innerHTML = "";
    document.querySelector(".login-container").style.float = "left";
    document.querySelector(".login-container").style.marginLeft = "200px";
  }

  return (
    <div className="login-page">
      <div className="title">
        <h1>Multilevel face recognition system</h1>
      </div>
      <div className="login-container">
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={handleFocus}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Rollnumber"
            value={rollNumber}
            onChange={(e) => setRollnumber(e.target.value)}
            onFocus={handleFocus}
            required
          />
          <button type="submit" name="Login">
            Login
          </button>
          <button type="submit" name="register">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
