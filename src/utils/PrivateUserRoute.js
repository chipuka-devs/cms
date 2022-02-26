import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import { Context } from "./MainContext";

const PrivateUser = ({ children }) => {
  const { user } = useContext(Context);
  //   const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   console.log(normalUser);
  // }, [normalUser]);

  return user && user.uid ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateUser;
