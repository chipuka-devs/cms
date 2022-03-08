import React, { useContext, useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../utils/firebase";
import { CustomTable } from "../../../components/CustomTable";
import { Context } from "../../../utils/MainContext";

const View = () => {
  const navigate = useNavigate();

  const { allUsers } = useContext(Context);

  const [userContributions, setUserContributions] = useState([]);
  const [loading, setLoading] = useState({
    isLoading: false,
    loadingMessage: "loading...",
  });

  const stopLoading = () => {
    setLoading({
      isLoading: false,
      loadingMessage: "",
    });
  };

  const startLoading = (message) => {
    setLoading({
      isLoading: true,
      loadingMessage: message,
    });
  };

  useEffect(() => {
    startLoading("Fetching Users . . .");
    const fetchUserContributions = () => {
      onSnapshot(collection(db, "user_contributions"), (docs) => {
        const cList = [];
        docs.forEach((d) => cList.push(d.data()));

        setUserContributions([]);

        allUsers.forEach(async (u) => {
          if (cList.some((item) => item.user === u.id)) {
            const q = await query(
              collection(db, "user_contributions"),
              where("user", "==", u.id)
            );

            const thisUserContributions = await getDocs(q);

            const contributionsAmounts = [];

            thisUserContributions.forEach((cont) =>
              contributionsAmounts.push({ ...cont.data() })
            );

            const currentUserTotal = contributionsAmounts
              .map((item) => item.amount)
              .reduce((prev, next) => parseInt(prev) + parseInt(next));

            stopLoading();
            setUserContributions((prev) => [
              ...prev,
              {
                name: u.name,
                email: u.email,
                total: currentUserTotal,
                key: u.uid,
              },
            ]);
          }
        });

        stopLoading();
      });
    };

    fetchUserContributions();
  }, [allUsers]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <Link to={"/"}>{text}</Link>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Total Contributions",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Actions",
      key: "actions",
      dataIndex: "actions",
      render: (_, c) => (
        <>
          {
            <button
              onClick={() => c.key && navigate(`/admin/contributions/${c.key}`)}
              className="p-2 bg-blue-500 rounded text-white"
            >
              View
            </button>
            // console.log(c.key)
          }
        </>
      ),
    },
  ];
  // name total_amount email actions

  const tableData = userContributions;

  return (
    <AdminLayout current="1" breadcrumbs={["Admin", "contributions"]}>
      <Spin
        spinning={loading.isLoading}
        size="large"
        tip={loading.loadingMessage}
      >
        <div className="">
          <Link to="new" className="text-blue-500 hover:underline">
            Click here &nbsp;
          </Link>
          to add new User
        </div>

        <CustomTable cols={columns} rows={tableData} style />
      </Spin>
    </AdminLayout>
  );
};

export default View;
