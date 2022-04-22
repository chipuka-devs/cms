import { Spin } from "antd";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Unauthorized from "../pages/403";
import { db } from "./firebase";
import { Context } from "./MainContext";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState([]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const unsub = onSnapshot(doc(db, "users", user?.uid), (doc) => {
        setUserRole(doc.data().role);
        setLoading(false);
      });
      return () => unsub();
    }
  }, [user]);

  if (loading) {
    return (
      <Spin spinning={loading} size="large" tip="Loading Page . . .">
        <div className="h-screen bg-blue-100" />
      </Spin>
    );
  }

  return user ? (
    userRole === "admin" ? (
      <>{children}</>
    ) : (
      <Unauthorized />
    )
  ) : (
    <Navigate to="/admin/login" />
  );
};

export default PrivateRoute;
