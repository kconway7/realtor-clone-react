import React from "react";
import { Outlet, Navigate } from "react-router";
import { useAuthStatus } from "../hooks/useAuthStatus";
import Spinner from "./Spinner";

//Private Route component used to navigate back to sign in page if user is not logged in
export default function PrivateRoute() {
  const { loggedIn, checkingStatus } = useAuthStatus();
  if (checkingStatus) {
    return (
      <h3>
        <Spinner />
      </h3>
    );
  }
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
}
