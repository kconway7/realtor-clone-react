import React from "react";
import { useLocation, useNavigate } from "react-router";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  //const variables for pathNames
  const home = "/";
  const offers = "/offers";
  const signIn = "/sign-in";

  //Adds css stylings to selected nav element
  function pathMatchRoute(route) {
    if (route === location.pathname) return "!text-black !border-b-red-500";
  }

  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-50">
      <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
        <div>
          <img
            src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
            alt="logo"
            className="h-5 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div>
          <ul className="flex space-x-10">
            <li
              onClick={() => navigate(home)}
              className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] text-gray-400 border-b-transparent  ${pathMatchRoute(
                home
              )}`}
            >
              Home
            </li>
            <li
              onClick={() => navigate(offers)}
              className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] text-gray-400 border-b-transparent  ${pathMatchRoute(
                offers
              )}`}
            >
              Offers
            </li>
            <li
              onClick={() => navigate(signIn)}
              className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] text-gray-400 border-b-transparent  ${pathMatchRoute(
                signIn
              )}`}
            >
              Sign In
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
}
