import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
// import { db } from "./firebase";

import { Context } from "./MainContext";

const ApproverRoute = ({ children }) => {
  const { isApprover } = useContext(Context);
  //   const [loading, setLoading] = useState(false);

  return isApprover && isApprover ? <>{children}</> : <Navigate to="/" />;
};

export default ApproverRoute;
