import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cookie from "react-cookies";
import axios from "axios";
import { Backdrop, CircularProgress } from "@mui/material";

// This is used to prevent users from going to auth page if they are logged in
const PreventAuthRoute = (props) => {
  // hook from react router for pushing users to different pages
  const history = useNavigate();
  //setting auth state
  const [auth, setAuth] = useState();
  //this flag is used to push user to proper page
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //state for main loader so that  app can check for access token
  const [loading, setLoading] = useState(false);

  //this is used on component mount to confirm if user is authenticated or not
  useEffect(() => {
    setLoading(true);

    setAuth(cookie.load("access-token"));
    //we check user auth
    const checkAuth = async () => {
      try {
        //we use api to get user auth response
        const response = await axios.get("/api/users/isauth", {
          headers: {
            "Content-Type": "application/json",
            "access-token": cookie.load("access-token"),
          },
        });
        //if response is ok we set user to logged in
        if (response.status === 200) {
          setIsLoggedIn(true);
          setLoading(false);
        }
      } catch (error) {
        //to catch any errors
        console.log(error);
        setLoading(false);
      }
    };
    //we call the checkauth function defined above
    checkAuth();
  }, []);

  //check token
  return (
    <>
      {/* here we check if user is logged in or not. If loading and logged in is false we show spinner else we push user to proper page */}
      {loading && !isLoggedIn ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />{" "}
        </Backdrop>
      ) : isLoggedIn ? (
        // logged in is true we push to dashboard
        history("/")
      ) : (
        //logged in is false we let user go to auth page
        props.children
      )}
    </>
  );
};

export default PreventAuthRoute;
