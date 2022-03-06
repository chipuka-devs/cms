import { Spin } from "antd";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
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

    const fetchUserContributions = async () => {
      setLoading(true);

      // fetchContributions
      let allContributions = [];

      const querySnapshot = await getDocs(collection(db, "contributions"));
      querySnapshot.forEach((c) =>
        allContributions.push({ ...c.data(), id: c.id })
      );

      onSnapshot(collection(db, "user_contributions"), (res) => {
        if (res) {
          res.forEach((d) => {
            const contribution = d.data().contributions;
            const totalAmount = contribution
              .map((item) => item.amount)
              .reduce((prev, next) => parseInt(prev) + parseInt(next));

            console.log(totalAmount);
            console.log(contribution);
          });
        }
      });
      setLoading(false);
    };

    fetchRoles();
    fetchUserContributions();
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
