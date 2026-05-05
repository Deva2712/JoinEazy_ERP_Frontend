import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./assets/css/output.css";
import "typeface-roboto";
import "typeface-montserrat";

if (import.meta.env.MODE === "production") {
  console.error = () => {};
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
