import { Spin } from "antd";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db } from "./firebase";

export const Context = createContext();

export const MainContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [normalUser, setNormalUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState(null);
  const [isApprover, setIsApprover] = useState(false);

  const [allUsers, setAllUsers] = useState([]);
  const [allContributions, setAllContributions] = useState([]);

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
    const fetchAllUsers = () => {
      setLoading(true);
      onSnapshot(collection(db, "users"), (docs) => {
        const users = [];
        docs.forEach((user) => users.push({ ...user.data(), id: user.id }));

        setAllUsers(users);
        setLoading(false);
      });
    };

    const fetchAllContributions = () => {
      setLoading(true);
      onSnapshot(collection(db, "contributions"), (docs) => {
        const conts = [];
        docs.forEach((cont) => conts.push({ ...cont.data(), id: cont.id }));

        setAllContributions(conts);
        setLoading(false);
      });
    };

    fetchAllUsers();
    fetchAllContributions();
  }, []);

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
        allUsers,
        allContributions,
      }}
    >
      {children}
    </Context.Provider>
  );
};
