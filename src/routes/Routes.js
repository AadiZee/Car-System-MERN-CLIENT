import { Router, Route, Routes } from "react-router-dom";

import React from "react";
import Home from "../pages/Home/Home";
import Auth from "../pages/Auth/Auth";
import AuthGuard from "../hoc/AuthGuard";

const RouteComponent = () => {
  return (
    <Routes>
      {/* Route for home page */}
      <Route path="/" element={<Home />}></Route>
      {/* Route for auth page */}
      <Route path="/auth" element={<Auth />}></Route>
    </Routes>
  );
};

export default RouteComponent;
