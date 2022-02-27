import { Spin } from "antd";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db } from "./firebase";

export const Context = createContext();

export const MainContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [normalUser, setNormalUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState(null);
  const [isApprover, setIsApprover] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    // console.log(user);

    onAuthStateChanged(auth, (user) => {
      setUser(user);

      setLoading(false);

      // console.log(user);
    });
  }, []);

  useEffect(() => {
    const fetchRoles = () => {
      onSnapshot(doc(db, "roles", "approve"), (response) => {
        setIsApprover(
          user && user.uid && response.data().approver === user.uid
        );
      });
    };

    fetchRoles();
  }, [user]);

  if (loading) {
    return (
      <Spin spinning={loading} size="large" tip="Loading Page . . .">
        <div className="h-screen bg-blue-100" />
      </Spin>
    );
  }

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        normalUser,
        setNormalUser,
        currentView,
        setCurrentView,
        isApprover,
        setIsApprover,
      }}
    >
      {children}
    </Context.Provider>
  );
};
