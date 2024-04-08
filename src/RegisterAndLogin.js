import React, { useState, useRef } from "react";
import { database } from "./FirebaseConfig";
import ReCAPTCHA from "react-google-recaptcha";
import "./RegisterAndLogin.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function RegisterAndLogin() {
  const [captchaValue, setCaptchaValue] = useState(null);
  const formRef = useRef(null);
  const captchaRef = useRef(null); // Reference for ReCAPTCHA component
  const history = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!captchaValue) {
      alert("Please complete the CAPTCHA.");
      return;
    }

    signInWithEmailAndPassword(database, email, password)
      .then((data) => {
        console.log(data, "authData");
        resetCaptcha(); // Reset CAPTCHA upon successful login
        history("/home");
      })
      .catch((err) => {
        alert(err.code);
      });
  };

  const resetForm = () => {
    formRef.current.reset();
    setCaptchaValue(null);
  };

  const resetCaptcha = () => {
    captchaRef.current.reset(); // Reset ReCAPTCHA
  };

  const handleReset = () => {
    history("/reset");
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  return (
    <div className="App">
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="row">
          <h1>ADMIN </h1>
        </div>
        <br />
        <br />

        <input className="em" name="email" placeholder="Email" />
        <br />
        <input name="password" type="password" placeholder="Password" />
        <br />

        <div className="forgotPassword">
          <p onClick={handleReset}>Forgot Password?</p>
        </div>
        <br />
        <ReCAPTCHA
          ref={captchaRef}
          sitekey="6LfhvJspAAAAAPUNrVEjwE6SAkxqAGpTaKlqHqg_"
          onChange={handleCaptchaChange}
        />
        <br />
        <button className="submit" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default RegisterAndLogin;
