import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* We wrap our app component with browser router so that we can use react router dom */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
