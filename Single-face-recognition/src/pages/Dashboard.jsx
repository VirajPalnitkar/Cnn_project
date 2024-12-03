import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import individual from "../assets/Individual.webp";
import group from "../assets/Group.webp";
import yolo from "../assets/Yolo.webp";

export default function Dashboard() {
  const navigate = useNavigate();
  function handleRegisterClick() {
    navigate("/dashboard/register");
  }
  function handleMarkClick() {
    navigate("/dashboard/mark");
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="/dashboard">
            Dashboard
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#top">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>


      <div className="container-fluid bg-light text-center py-5" id="top">
        <h1 className="display-5">
          Welcome to Multi-level-face-recognition-system
        </h1>
        <p className="lead">•Attendence   •Group verification    •Crowd analysis</p>
        <a href="#about" className="btn btn-primary btn-lg">
          Learn More
        </a>
      </div>

      <div className="container m-5 " id="about">
        <div className="row">
          <div className="col">
            <h3 className="text-secondary">
              Welcome to our Multi-Level Face Recognition System, an innovative
              solution for secure identity verification and attendance tracking.
              {/* Designed to meet modern authentication needs, this system combines
              advanced deep learning techniques with the robust MERN stack for
              exceptional accuracy and scalability. */}
            </h3>
            <h5 className="m-4">Key highlights</h5>
            <ol>
              <li className="list">
                <p>
                  Individual Face Recognition Capture multiple images to create
                  precise face embeddings using CNN models, ensuring reliable
                  recognition under various conditions like lighting and
                  expressions.
                </p>
              </li>
              <li>
                <p>
                  Group Authentication Authenticate multiple individuals
                  simultaneously with MTCNN for face detection and models like
                  FaceNet or ArcFace for feature extraction. Perfect for large
                  gatherings and event management
                </p>
              </li>
              <li>
                <p>
                  Scalable for Crowds Handle high-density scenarios with YOLO
                  for real-time face detection and MCNN for crowd counting,
                  making it ideal for events and public spaces
                </p>
              </li>
              <li>
                <p>
                  Technology at Its Core Powered by React, Flask, and Express.js,
                  with MongoDB for scalable data storage, this system offers a
                  seamless and user-friendly experience. Whether you’re managing
                  secure access to a facility, verifying identities at events,
                  or optimizing attendance systems, our Multi-Level Face
                  Recognition System ensures trust, efficiency, and scalability.
                </p>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="container-fluid bg-light">
        <div className="row my-5 py-5 g-5">
          <div className="col-md-4" id="first">
            <div className="card">
              <img src={individual} className="card-img-top" alt="..."></img>
              <div className="card-body">
                <h5 className="card-title">Individual face recognition</h5>
                <p className="card-text">
                  Register Your Face And Mark attendence
                </p>
                <div className="row my-2">
                  <a className="btn btn-primary" onClick={handleRegisterClick}>
                    Register
                  </a>
                </div>
                <div className="row">
                  <a className="btn btn-primary" onClick={handleMarkClick}>
                    Mark
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4" id="second">
            <div className="card">
              <img src={group} className="card-img-top" alt="..."></img>
              <div className="card-body">
                <h5 className="card-title">Multiple face recognition</h5>
                <p className="card-text">
                  Identify individuals in a group photo by matching their faces
                  with pre-registered users in the existing database
                </p>
                <div className="row">
                  <a
                    className="btn btn-primary"
                    onClick={() => {
                      navigate("/dashboard/multiple");
                    }}
                  >
                    Identify
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4" id="third">
            <div className="card">
              <img src={yolo} className="card-img-top" alt="..."></img>
              <div className="card-body">
                <h5 className="card-title">Group counting</h5>
                <p className="card-text">
                  Get the headcount of number of people in an image to aid in
                  crowd analysis and better management purpose
                </p>
                <div className="row">
                  <a 
                    className="btn btn-primary"
                    onClick={()=>{
                      navigate('/dashboard/yolo')
                    }}>
                    Get Headcount
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div style={{ backgroundColor: "wheat", paddingBottom: "300px" }}>
        <h2>
          <b>Dashboard</b>
        </h2>
        <div className="dashboard">
          <div className="Choice">
            <h1>Individual face recognition</h1>
            <button onClick={handleRegisterClick}>Register</button>
            <button onClick={handleMarkClick}>Mark Attendance</button>
          </div>
          <div className="Choice">
            <h1>Multiple face recognition</h1>
            <button
              onClick={() => {
                navigate("/dashboard/multiple");
              }}
            >
              Identify individuals in groups
            </button>
          </div>
          <div className="Choice">
            <h1>Crowd detection</h1>
          </div>
        </div>
      </div> */}
      <footer className="bg-light text-center py-5 my-0" id="contact">
        <p>© 2024 PROJECT SCHOOL KMIT</p>
        <p>Viraj Palnitkar</p>
        <p>Contact number:- 6301391259</p>
        <p>Email:- virajpalnitkar@gmail.com</p>
      </footer>
    </>
  );
}
