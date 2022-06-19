import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cookie from "react-cookies";
import axios from "axios";
import { Backdrop, CircularProgress } from "@mui/material";

//this HOC is used to check that only logged in users proceed to page
const AuthGuard = (props) => {
  //hook to push user to pages
  const history = useNavigate();
  //set user auth
  const [auth, setAuth] = useState();
  //flag used to move user to page based on authentication status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //state for main loader so that  app can check for access token
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    //we set token in auth
    setAuth(cookie.load("access-token"));
    //we check if token is valid or token is present
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/users/isauth", {
          headers: {
            "Content-Type": "application/json",
            "access-token": cookie.load("access-token"),
          },
        });
        if (response.status === 200) {
          //user is logged in
          setIsLoggedIn(true);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  //check token
  return (
    <>
      {/* here we check if user is logged or not. If loading and logged in is false we push user to auth page else we let them proceed to desired page */}
      {loading && !isLoggedIn ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />{" "}
        </Backdrop>
      ) : isLoggedIn ? (
        // letting user proceed to page
        props.children
      ) : (
        // pushing user to auth page
        history("/auth")
      )}
    </>
  );
};

export default AuthGuard;
