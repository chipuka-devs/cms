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
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(doc(db, "files", "admins"), (doc) => {
      setFriends(doc.data().admins);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <Spin spinning={loading} size="large" tip="Loading Page . . .">
        <div className="h-screen bg-blue-100" />
      </Spin>
    );
  }

  return user ? (
    friends.includes(user.uid) ? (
      <>{children}</>
    ) : (
      <Unauthorized />
    )
  ) : (
    <Navigate to="/admin/login" />
  );
};

export default PrivateRoute;
