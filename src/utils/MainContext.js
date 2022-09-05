import { Spin } from "antd";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db } from "./firebase";
import { doc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUsers } from "../redux/contributions/contributionSlice";

export const Context = createContext();

export const MainContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [normalUser, setNormalUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState(null);
  const [isApprover, setIsApprover] = useState(false);

  const [allUsers, setAllUsers] = useState([]);
  const [allContributions, setAllContributions] = useState([]);
  const [currentTab, setCurrentTab] = useState("home");
  const dispatch = useDispatch();

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
      onSnapshot(
        query(collection(db, "users"), orderBy("joinedAt", "desc")),
        (docs) => {
          const users = [];
          let usersObject = {};

          docs.forEach((user) => {
            if (user.data()?.role !== "admin") {
              const date = user?.data()?.joinedAt;

              const dateJoined = date?.seconds
                ? new Date(date?.seconds * 1000).toISOString()
                : new Date(date).toISOString();

              // ).toISOString();

              users.push({ ...user.data(), id: user.id });

              usersObject[user.id] = { ...user?.data(), joinedAt: dateJoined };
            }
          });

          setAllUsers(users);
          dispatch(setUsers(usersObject));
          setLoading(false);
        }
      );
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
  }, [dispatch]);

  // check if user is approver:
  useEffect(() => {
    const getApprover = async () => {
      if (user) {
        onSnapshot(doc(db, "roles", "approve"), (res) => {
          const approver = res?.data()?.approver;

          approver && setIsApprover(approver === user.uid);
        });
      }
    };

    getApprover();
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
        allUsers,
        allContributions,
        currentTab,
        setCurrentTab,
      }}
    >
      {children}
    </Context.Provider>
  );
};
