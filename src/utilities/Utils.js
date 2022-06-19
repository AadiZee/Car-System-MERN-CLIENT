//to use cookies with react
import cookie from "react-cookies";

//to get token from cookies
export const getTokenCookie = () => cookie.load("access-token");

//to remove token from cookies
export const removeTokenCookie = () =>
  cookie.remove("access-token", { path: "/" });

//for header
export const getAuthHeader = () => {
  return { headers: { "access-token": getTokenCookie() } };
};
