import React, { useContext, useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { Divider, Dropdown, Input, Menu, Spin } from "antd";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../utils/firebase";
import { CustomTable } from "../../../components/CustomTable";
import { Context } from "../../../utils/MainContext";
import { error } from "../../../components/Notifications";

export const Pledges = () => {
  const { allUsers, allContributions } = useContext(Context);

  const [contributionNames, setContributionNames] = useState([]);
  const [userNames, setUserNames] = useState([]);

  const [pledges, setPledges] = useState([]);

  const [selectedContribution, setSelectedContribution] = useState(
    "--Please select Contribution --"
  );
  const [selectedUser, setSelectedUser] = useState("--Please select User --");
  const [userPledge, setUserPledge] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    startLoading("Adding user Pledge . . .");

    // check if current pledges include pledge
    const isIncluded =
      pledges.filter(
        (e) =>
          e.contribution_id === selectedContribution.id &&
          e.user === selectedUser.uid
      ).length > 0;

    if (isIncluded) {
      error("ERROR", "Pledge already Exists!");

      stopLoading();
      return;
    }

    if (userPledge) {
      await addDoc(collection(db, "pledges"), {
        amount: userPledge,
        user: selectedUser.uid,
        contribution: selectedContribution.id,
        createdAt: serverTimestamp(),
      });

      stopLoading();
    }
  };

  useEffect(() => {
    const fetchPledges = async () => {
      startLoading("Fetching Pledges . . .");

      onSnapshot(
        query(collection(db, "pledges"), orderBy("createdAt", "desc")),
        (docs) => {
          const pledgesArr = [];

          docs.forEach((doc) => {
            const cUser = allUsers.filter(
              (item) => item.uid === doc.data().user
            )[0];
            const cContribution = allContributions.filter(
              (item) => item.id === doc.data().contribution
            )[0];

            const pledge = {
              member: cUser.name,
              contribution: cContribution.name,
              pledge: doc.data().amount,
              key: doc.id,
              user: doc.data().user,
              contribution_id: doc.data().contribution,
            };
            pledgesArr.push(pledge);
          });

          setPledges(pledgesArr);

          stopLoading();
        }
      );
    };

    fetchPledges();
  }, [allContributions, allUsers]);

  useEffect(() => {
    let conts = [];
    let usas = [];
    allContributions &&
      allContributions.forEach(
        (c) =>
          c.category === "project" &&
          conts.push({ text: c.name, value: c.name })
      );

    allUsers &&
      allUsers.forEach((c) => usas.push({ text: c.name, value: c.name }));
    setUserNames(usas);
    setContributionNames(conts);
  }, [allContributions, allUsers]);

  const columns = [
    {
      title: "Member",
      dataIndex: "member",
      key: "member",
      filters: [...userNames],
      onFilter: (value, record) => record.member.startsWith(value),
    },
    {
      title: "Contribution",
      dataIndex: "contribution",
      key: "contribution",
      filters: [...contributionNames],
      onFilter: (value, record) => record.contribution.startsWith(value),
    },

    {
      title: "Pledge",
      dataIndex: "pledge",
      key: "pledge",
    },
  ];
  // name total_amount email actions

  const tableData = pledges;

  const menu = (
    <Menu>
      {allContributions.map(
        (item, i) =>
          item.category === "project" && (
            <Menu.Item key={i} onClick={() => setSelectedContribution(item)}>
              <span target="_blank" rel="noopener noreferrer">
                {item.name}
              </span>
            </Menu.Item>
          )
      )}
    </Menu>
  );
  const uMenu = (
    <Menu>
      {allUsers.map((item, i) => (
        <Menu.Item key={i} onClick={() => setSelectedUser(item)}>
          <span target="_blank" rel="noopener noreferrer">
            {item.name}
          </span>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <AdminLayout current="1" breadcrumbs={["Admin", "contributions"]}>
      <Spin
        spinning={loading.isLoading}
        size="large"
        tip={loading.loadingMessage}
      >
        <form className="mx-auto my-2" onSubmit={handleSubmit}>
          <div className="flex items-end gap-1 w-full ">
            <div className="">
              <label className="font-medium" htmlFor="type">
                Input Contribution:
              </label>
              <Dropdown overlay={menu} placement="bottomLeft">
                <div
                  className="h-8 bg-white border flex items-center px-3"
                  style={{ width: "300px" }}
                >
                  {selectedContribution.name
                    ? selectedContribution.name
                    : selectedContribution}
                </div>
              </Dropdown>
            </div>

            <div className="">
              <label className="font-medium" htmlFor="type">
                Select User:
              </label>
              <Dropdown overlay={uMenu} placement="bottomLeft">
                <div
                  className="h-8 bg-white border flex items-center px-3"
                  style={{ width: "300px" }}
                >
                  {selectedUser.name ? selectedUser.name : selectedUser}
                </div>
              </Dropdown>
            </div>

            <div className="">
              <label className="font-medium" htmlFor="type">
                Input User's Pledge:
              </label>
              {/* amount  */}
              <Input
                type="number"
                placeholder="Pledge amount i.e 200 "
                // disabled={accessPledge ? false : true}
                // value={userPledge && userPledge.amount && userPledge.amount}
                onChange={(e) => setUserPledge(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="bg-green-700 px-4 text-white h-8 mb-0"
            >
              ADD
            </button>
          </div>
        </form>

        <Divider className="font-medium">All Contributions</Divider>

        <CustomTable cols={columns} rows={tableData} style />
      </Spin>
    </AdminLayout>
  );
};
