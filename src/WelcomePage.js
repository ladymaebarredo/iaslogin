import React from "react";
import { useParams } from "react-router-dom";

function WelcomePage() {
  const { name } = useParams();
  return <h1>Welcome {name}!</h1>;
}

export default WelcomePage;
