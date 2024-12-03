// src/pages/Login.jsx
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import bgpic from '../assets/Login-background.webp';

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
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      if (error.response.status === 400) {
        alert("No such user registered");
      }
    }
  }

  // const name=document.querySelector("rollno");
  // name.addEventListener('submit',e=>{
  //   if(e.target.value.length()!=10){
  //     e.preventDefault();
  //   }
  //   name.classList.add('was-validated');
  // })

  // function handleFocus() {
  //   document.getElementsByClassName("title")[0].innerHTML = "";
  //   document.querySelector(".login-container").style.float = "left";
  //   document.querySelector(".login-container").style.marginLeft = "200px";
  // }

  return (
    <div style={{backgroundImage:`url(${bgpic})`,
      backgroundSize:"cover",
      height:"100vh"
    }}>
      <div className="container">
        <div className="row">
          <div className="col-md-6" style={{backgroundColor:"wheat"}}>
            <div className="row my-5">
              <div className="col">
                <div className="title">
                    <h1 style={{fontFamily:"Bebas Neue"}}>Multilevel face recognition system</h1>
                </div>
              </div>
            <div className="row my-5">
                <h3>About</h3>
                <p style={{textShadow:"1px 1px white"
                }}>Welcome to our Multi-Level Face Recognition System, 
                  a state-of-the-art platform designed for secure and efficient authentication. 
                  Leveraging cutting-edge computer vision and deep learning technologies,
                   this system ensures seamless identity verification at both individual and group levels.</p>
            </div>
            </div>
          </div>
            <div className="col-md-4 offset-md-2 col-12 offset-0" style={{backgroundColor:"wheat",padding:"50px 25px 0px 25px"  }}>
              <div>
                <h2>Login</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form onSubmit={handleSubmit} noValidate>
                  <div className="form-floating  my-3 ">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Username"
                    id="name"
                    value={userName}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <label for="name" class="form-label">Name</label>
                  </div>
                  <div className="form-floating">
                  <input
                    className="form-control my-2"
                    id="rollno"
                    type="password"
                    placeholder="Rollnumber"
                    value={rollNumber}
                    onChange={(e) => setRollnumber(e.target.value)}
                    required
                  />
                  <label for="rollno" class="form-label">Rollnumber</label>
                  </div>
                 <button type="submit" name="Login" className="btn btn-primary">
                    Login . .
                  </button>
                  <br></br>
                  <button type="submit" name="register" className="btn btn-primary">
                    Register
                  </button>
                </form>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Login;

/*
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
*/
