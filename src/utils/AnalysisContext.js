import { Spin } from "antd";
import { collection, onSnapshot } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db } from "./firebase";

export const AContext = createContext();

export const AnalysisContext = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [months] = useState([
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]);
  const [years, setYears] = useState([new Date().getFullYear()]);
  const [monthlyBasedContributions, setMonthlyBasedContributions] = useState(
    []
  );

  const [yearBasedProjectContributions, setYearBasedProjectContributions] =
    useState([]);

  useEffect(() => {
    setLoading(true);
    const groupContributions = async () => {
      //   const docs = await getDocs(collection(db, "user_contributions"));
      onSnapshot(collection(db, "user_contributions"), (docs) => {
        const uArr = [];
        docs.forEach((doc) => {
          if (doc.data()?.type && doc?.data()?.type === "voluntary") {
            return;
          }
          const currentMonth = new Date(doc.data().doc).getMonth();
          uArr.unshift({
            ...doc.data(),
            id: doc.id,
            doc: months[currentMonth],
          });
        });

        const userContributionsGroupedByMonth = uArr.reduce(function (r, a) {
          r[a.doc] = r[a.doc] || [];
          r[a.doc].unshift(a);
          return r;
        }, Object.create(null));

        setMonthlyBasedContributions(userContributionsGroupedByMonth);
        setLoading(false);
      });
    };

    groupContributions();
  }, [months]);

  useEffect(() => {
    setLoading(true);
    const groupContributions = async () => {
      //   const docs = await getDocs(collection(db, "user_contributions"));
      onSnapshot(collection(db, "user_contributions"), (docs) => {
        const uArr = [];
        docs.forEach((doc) => {
          if (doc.data()?.type && doc?.data()?.type === "voluntary") {
            return;
          }
          const currentYear =
            new Date(doc.data().doc).getFullYear() ||
            new Date(doc.data()?.doc?.seconds * 1000).getFullYear();
          currentYear &&
            !years.includes(currentYear) &&
            setYears([currentYear, ...years]);

          uArr.unshift({
            ...doc.data(),
            id: doc.id,
            doc: currentYear,
          });
        });

        const userContributionsGroupedByMonth = uArr.reduce(function (r, a) {
          r[a.doc] = r[a.doc] || [];
          r[a.doc].unshift(a);
          return r;
        }, Object.create(null));

        setYearBasedProjectContributions(userContributionsGroupedByMonth);
        setLoading(false);
      });
    };

    groupContributions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Spin spinning={loading} size="large" tip="Loading Page . . .">
        <div className="h-screen bg-blue-100" />
      </Spin>
    );
  }

  return (
    <AContext.Provider
      value={{
        monthlyBasedContributions,
        months,
        yearBasedProjectContributions,
        years,
      }}
    >
      {children}
    </AContext.Provider>
  );
};
