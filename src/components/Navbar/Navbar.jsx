import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import cookie from "react-cookies";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  // this flag is used to switch top button between Register/Login or Logout
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //hook to push user to different pages
  const history = useNavigate();

  useEffect(() => {
    // to check user auth
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/users/isauth", {
          headers: {
            "Content-Type": "application/json",
            // getting cookie from cookies in browser
            "access-token": cookie.load("access-token"),
          },
        });
        // if response is okay we set logged in flag to true
        if (response.status === 200) {
          setIsLoggedIn(true);
        } else if (response.status === 401) {
          // we set logged in flag to false
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
        console.log(error);
      }
    };
    //calling the above defined auth function
    checkAuth();
    //we define an interval here so that the navbar keeps checking if user is auth
    //because nav is separate from all components and does not rerender on any other component/page change
    const interval = setInterval(() => checkAuth(), 3000);
    return () => {
      // to clear interval if the component unmounts
      clearInterval(interval);
    };
  }, []);

  // to logout user
  const handleLogout = () => {
    //we remove token from browser cookie storage
    cookie.remove("access-token");
    //we show warning notification for successful logout
    toast.warning("You have logged out!");
    //we push user to auth page after 500ms so that they can see notification
    setTimeout(() => {
      history("/auth");
    }, 500);
  };

  return (
    <>
      {/* Toast container for showing notification. currently limit is 1 so 1 notification will be shown at a time */}
      <ToastContainer limit={1} />

      {/* just a simple navbar created using basic tailwind classes */}
      <nav className="flex items-center justify-between flex-wrap bg-gray-900 p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          {/* react router dom link to handle page changes on nav click */}
          {/* react router link doesn't reload page */}
          <Link
            className="font-semibold text-xl tracking-tight cursor-pointer text-white no-underline"
            to="/"
          >
            Car System
          </Link>
        </div>
        <div className="block">
          {/* button shown based on auth flag */}
          {isLoggedIn ? (
            <button
              className="flex items-center px-3 py-2 border-2 border-gray-300 rounded-none hover:rounded-lg text-white  hover:border-4 hover:text-white hover:border-white no-underline"
              onClick={() => handleLogout()}
            >
              Logout
            </button>
          ) : (
            <Link
              className="flex items-center px-3 py-2 border-2 border-gray-300 rounded-none hover:rounded-lg text-white  hover:border-4 hover:text-white hover:border-white no-underline"
              to="/auth"
            >
              Register/Login
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
