import React, { useContext, useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { Divider, Spin } from "antd";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../utils/firebase";
import { CustomTable } from "../../../components/CustomTable";
import { Context } from "../../../utils/MainContext";

export const AllContributions = () => {
  const { allUsers, allContributions } = useContext(Context);

  const [contributionNames, setContributionNames] = useState([]);
  const [userNames, setUserNames] = useState([]);
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
        docs.forEach((d) => {
          const currentUser = allUsers.filter(
            (item) => item.uid === d.data().user
          )[0];
          const currentContribution = allContributions.filter(
            (item) => item.id === d.data().contribution
          )[0];

          //   cList.push(d.data());

          const contributionDetails = {
            key: d.id,
            date: d.data().doc,
            member: currentUser.name,
            amount: d.data().amount,
            classification: currentContribution.category,
            purpose: currentContribution.name,
          };

          cList.unshift(contributionDetails);
        });

        setUserContributions(cList);

        stopLoading();
      });
    };

    fetchUserContributions();
  }, [allContributions, allUsers]);

  useEffect(() => {
    let conts = [];
    let usas = [];
    allContributions &&
      allContributions.forEach((c) =>
        conts.push({ text: c.name, value: c.name })
      );

    allUsers &&
      allUsers.forEach((c) => usas.push({ text: c.name, value: c.name }));
    setUserNames(usas);
    setContributionNames(conts);
  }, [allContributions, allUsers]);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      //   render: (text) => <Link to={"/"}>{text}</Link>,
    },
    {
      title: "Member",
      dataIndex: "member",
      key: "member",
      filters: [...userNames],
      onFilter: (value, record) => record.member.startsWith(value),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },

    {
      title: "Classification",
      dataIndex: "classification",
      //   key: "classification",
      filters: [
        { text: "Monthly", value: "monthly" },
        { text: "Project", value: "project" },
      ],
      onFilter: (value, record) => record.classification.startsWith(value),
    },

    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
      filters: [...contributionNames],
      onFilter: (value, record) => record.purpose.startsWith(value),
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
        <Divider className="font-medium">All Contributions</Divider>

        <CustomTable cols={columns} rows={tableData} style />
      </Spin>
    </AdminLayout>
  );
};
