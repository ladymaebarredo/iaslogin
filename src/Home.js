import React, { useState, useRef } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { database } from "./FirebaseConfig.js";
import { useNavigate } from "react-router-dom";
import "./StudentRegistration.css"; // Import CSS file for styling

function StudentRegistration() {
  const [accountCreated, setAccountCreated] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userName, setUserName] = useState(""); // State to store the user's name
  const formRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmitRegistration = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const fullName = e.target.fullName.value;

    if (!email || !password || !fullName) {
      alert("Please fill in all fields.");
      return;
    }

    createUserWithEmailAndPassword(database, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User created successfully:", user);
        setAccountCreated(true);
        resetForm();
        setTimeout(() => {
          setAccountCreated(false); // Hide notification after 3 seconds
        }, 3000);

        // Redirect to another page with the user's name
        navigate(`/welcome/${fullName}`);
      })
      .catch((err) => {
        alert(err.code);
      });
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    signInWithEmailAndPassword(database, email, password)
      .then((userCredential) => {
        // Login successful
        console.log("Login successful:", userCredential.user);
        setUserLoggedIn(true);
        setUserName(e.target.email.value.split("@")[0]); // Extracting the name from the email
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleSignOut = () => {
    signOut(database)
      .then(() => {
        setUserLoggedIn(false);
        // Redirect or perform any other action after sign out
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const resetForm = () => {
    formRef.current.reset();
  };

  const handleStudentLogin = () => {
    setShowLoginForm(true);
  };

  return (
    <div className="App">
      {!showLoginForm && !userLoggedIn && (
        <form ref={formRef} onSubmit={handleSubmitRegistration}>
          <div className="row">
            <h1>Student Registration</h1>
          </div>
          <br />
          <br />
          <input className="fullName" name="fullName" placeholder="Full Name" />
          <br />
          <input className="em" name="email" placeholder="Email" />
          <br />
          <input name="password" type="password" placeholder="Password" />
          <br />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
          />
          <br />
          <br />
          <button className="submit" type="submit">
            Register
          </button>
        </form>
      )}
      {accountCreated && (
        <div className="notification">
          <p>Account created successfully!</p>
        </div>
      )}
      {userLoggedIn && (
        <div>
          <h1>Welcome, {userName}</h1>
          <button className="sign-out-btn" onClick={handleSignOut}>
            <LogoutIcon />
          </button>
        </div>
      )}
      {!userLoggedIn && (
        <button className="student-login-btn" onClick={handleStudentLogin}>
          Student Login
        </button>
      )}
      {showLoginForm && !userLoggedIn && (
        <form ref={formRef} onSubmit={handleSubmitLogin}>
          <input className="em" name="email" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />
          <button className="submit" type="submit">
            Login
          </button>
        </form>
      )}
    </div>
  );
}

export default StudentRegistration;
