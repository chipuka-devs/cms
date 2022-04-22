import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import { Context } from "./MainContext";

const PrivateUser = ({ children }) => {
  const { user } = useContext(Context);

  return user && user?.role === "normal_user" && user.uid ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateUser;
