import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import ReactTooltip from "react-tooltip";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PreventAuthRoute from "../../hoc/PreventAuth";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

const Auth = () => {
  //state to help manage login/register in a single component
  const [register, setRegister] = useState(false);
  //state for showing loader in case of login/registering.
  const [loader, setLoader] = useState(false);

  //states for input field handling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); //this will only be used in the login functionality

  //states for error handling of input fields
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  //state for button disabled
  const [buttonDisable, setButtonDisable] = useState(true);

  //to push user to main page after successful login
  const history = useNavigate();

  //refs for handling browser autofill for auth forms
  const emailRef = useRef();
  const passwordRef = useRef();

  // a let variable to store the regular expression to validate email address at the time of form submission or on input change
  let emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  //useEffect to check if user has saved password in browser and if saved then to enable button
  useEffect(() => {
    //interval to check if user already has saved values and set them to our form fields
    let interval = setInterval(() => {
      //check if we are rendering register form or login form
      if (register) {
        //use ref to assign saved email value to state
        if (emailRef.current) {
          setEmail(emailRef.current.value);
          setEmailError(false);
          setButtonDisable(false);
        }
      }
      //check if we are on login page
      if (!register) {
        //use ref to assign saved email value to state
        if (emailRef.current) {
          setEmail(emailRef.current.value);
          setEmailError(false);
          setButtonDisable(false);
        }
        //use ref to assign saved password value to state
        if (passwordRef.current) {
          setPassword(passwordRef.current.value);
          setEmailError(false);
          setButtonDisable(false);
        }
      }
      //clearing the interval after first interval
      clearInterval(interval);
    }, 100);
  }, []);

  //function to handle userRegistration form states
  const registerUser = async () => {
    //set loader on button and disable button
    setLoader(true);
    //check if email is empty
    if (!email || email?.trim() === "") {
      setEmailError(true);
      setButtonDisable(true);
      setLoader(false);
      return toast.error("Email is invalid");
    }
    //putting api calls in try to catch exceptions
    try {
      //we wait for user registration api response.
      //we send user email in body
      //password is auto generated for users on registration
      const response = await axios.post("/api/users/register", {
        email: email,
      });
      //showing success notification and disabling loaders if user added successfully
      if (response.status === 200) {
        toast.success(response.data.message);
        setRegister(false);
        setLoader(false);
        return;
      } else {
        //showing error notification and disabling loaders
        setLoader(false);
        toast.error(response.message);
      }
    } catch (error) {
      //catching any exceptions from api and showing error message as notification
      setLoader(false);
      toast.error(error.response.data.message);
    }
  };

  //function to handle userLogin form states
  const loginUser = async () => {
    setLoader(true);
    //checking if email is empty or not and showing notification
    if (!email || email?.trim() === "") {
      setEmailError(true);
      setButtonDisable(true);
      setLoader(false);
      return toast.error("Email is invalid");
    }
    //checking if password is empty or not and showing notification
    if (!password || password?.trim() === "") {
      setPasswordError(true);
      setButtonDisable(true);
      setLoader(false);
      return toast.error("Password is invalid");
    }
    //putting api call in try to catch exceptions
    try {
      //sending user email and password in body to login user
      const response = await axios.post("/api/users/login", {
        email: email,
        password: password,
      });
      //if response is successful we show notification
      if (response.status === 200) {
        //to show notification
        toast.success("Logged in successfully");
        //to push user to dashboard after successful login
        history("/");
      } // if response is error we show error notification
      else if (response.status === 404) {
        return toast.error("User not found!");
      }
    } catch (error) {
      //we catch exceptions thrown by api and show error message from api
      setButtonDisable(false);
      setLoader(false);

      return toast.error(error.response.data.message);
    }
  };

  //to handle form change from register to login and vice versa
  const handleChange = () => {
    setRegister(!register);
  };

  //to disable fields if fields are empty or invalid for registration form
  const buttonDisabled = () => {
    //check if we are in registration form
    if (register) {
      //check if email is empty
      if (emailError || email === "") {
        //disable button
        return setButtonDisable(true);
      } else {
        //otherwise button enable
        return setButtonDisable(false);
      }
    }
    //to disable fields if fields are empty or invalid for login form
    else if (!register) {
      //check if email or password any one is empty
      if (emailError || email === "" || passwordError || password === "") {
        //disabling button
        return setButtonDisable(true);
      } else {
        //otherwise enabling button
        return setButtonDisable(false);
      }
    }
  };

  return (
    // We have a prevent auth route HOC that checks if user already is logged in
    //if user is logged in he is pushed directly to dashboard
    <PreventAuthRoute>
      {/* to show notifications. Current limit is 1 notification */}
      <ToastContainer limit={1} />

      <section className="h-screen">
        <div className="px-6 h-full text-gray-800">
          <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
            <div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
              {/* we check register state here and show image on left side based on if register is true or false */}
              {register ? (
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                  className="w-full"
                  alt="Register Cover"
                />
              ) : (
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                  className="w-full"
                  alt="Login Cover"
                />
              )}
            </div>

            <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
              <form
                // to prevent page refresh on submit
                onSubmit={(e) => {
                  e.preventDefault();
                  //if register form we go for registration function
                  if (register) {
                    //register user function
                    registerUser();
                  } else {
                    //if logged in form we login user
                    loginUser();
                  }
                }}
              >
                <div className="flex flex-row items-center justify-center text-center m-2">
                  {/* show form headings dynamically based on form */}
                  {register ? (
                    <h1 className="text-4xl">Register</h1>
                  ) : (
                    <h1 className="text-4xl">Login</h1>
                  )}
                </div>

                {/* Email input */}
                <div className="mb-6">
                  <label className="form-label mb-2 ml-2 text-md font-normal text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    ref={emailRef}
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                    placeholder="example@example.com"
                    style={{ border: "1px solid red" }}
                    value={email}
                    onChange={(e) => {
                      // we check email against regular expression
                      setEmailError(!emailRegEx.test(e.target.value));
                      setEmail(e.target.value);
                      buttonDisabled();
                    }}
                  />
                  {/* this text is shown if email is invalid */}
                  {emailError && (
                    <small className="text-red-500">Email is not valid</small>
                  )}
                </div>
                {/* Password input */}
                {!register && (
                  <div className="mb-6">
                    <label className="form-label mb-2 ml-2 text-md font-normal text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      ref={passwordRef}
                      className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      placeholder="******"
                      value={password}
                      onChange={(e) => {
                        setPasswordError(false);
                        setPassword(e.target.value);
                        buttonDisabled();
                      }}
                    />
                    {/* this is shown if password is invalid */}
                    {passwordError && (
                      <small className="text-red-500">
                        Password is not valid
                      </small>
                    )}
                  </div>
                )}

                <div className="text-center lg:text-left">
                  {/* we show loader in button if api call is made */}
                  {loader ? (
                    <button
                      className="inline-block px-10 py-2 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out disabled:bg-gray-600 active:disabled:bg-gray-600 focus:disabled:bg-gray-600"
                      disabled={loader}
                    >
                      <svg
                        role="status"
                        class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out disabled:bg-gray-600 active:disabled:bg-gray-600 focus:disabled:bg-gray-600"
                      disabled={buttonDisable}
                    >
                      {/* we use one button to handle both register and login */}
                      {register ? "Register" : "Login"}
                    </button>
                  )}
                  {/* this is used so that user can easily switch between login and register forms */}
                  <p className="text-sm font-semibold mt-2 pt-1 mb-0">
                    Don't have an account?
                    <span
                      className="text-red-600 hover:text-red-700 focus:text-red-700 transition duration-200 ease-in-out"
                      onClick={() => handleChange()}
                    >
                      {register ? "Login" : "Register"}
                    </span>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PreventAuthRoute>
  );
};

export default Auth;
