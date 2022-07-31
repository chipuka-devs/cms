import React, { useContext, useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { DatePicker, Divider, Dropdown, Input, Menu, Spin } from "antd";
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
import { error, success } from "../../../components/Notifications";

export const MonthlyContributions = () => {
  const { allUsers, allContributions } = useContext(Context);

  const [contributionNames, setContributionNames] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [userContributions, setUserContributions] = useState([]);
  const [loading, setLoading] = useState({
    isLoading: false,
    loadingMessage: "loading...",
  });

  const [selectedContribution, setSelectedContribution] = useState(
    "--Please select Contribution --"
  );
  const [selectedUser, setSelectedUser] = useState("--Please select User --");

  const [currentContribution, setCurrentContribution] = useState({});

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

  const resetState = () => {
    setCurrentContribution({
      user: "",
      contribution: "",
      doc: "",
      amount: 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    startLoading("Adding user contribution...");

    if (!currentContribution.amount) {
      error("Empty Field", "Please enter a contribution amount");

      return;
    }

    if (!selectedContribution.name) {
      error("Error", "Please Select Contribution");
      return;
    }

    try {
      // add contribution
      if (currentContribution && currentContribution.amount) {
        await addDoc(collection(db, "user_contributions"), {
          amount: currentContribution.amount,
          user: selectedUser.uid,
          contribution: selectedContribution.id,
          doc: currentContribution?.doc,
          createdAt: serverTimestamp(),
        });
      }

      setLoading({ isLoading: false });

      resetState();

      success("Success!", "Contribution added successfully!");
    } catch (err) {
      setLoading({ isLoading: false });
      error("Error", err.message);
    }
  };

  useEffect(() => {
    startLoading("Fetching Users . . .");
    const fetchUserContributions = () => {
      const q = query(
        collection(db, "user_contributions"),
        orderBy("createdAt")
      );
      onSnapshot(q, (docs) => {
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
            key: d?.id,
            date: d?.data().doc,
            member: currentUser?.name,
            amount: d?.data().amount,
            classification: currentContribution && currentContribution.category,
            purpose: currentContribution && currentContribution.name,
          };

          if (
            currentContribution &&
            currentContribution.category === "monthly"
          ) {
            cList.unshift(contributionDetails);
          }
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
      allContributions.forEach(
        (c) =>
          c.category === "monthly" &&
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
      render: (_, item) => parseInt(item?.amount).toLocaleString(),
    },

    {
      title: "Classification",
      dataIndex: "classification",
      key: "classification",
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
  const menu = (
    <Menu>
      {allContributions.map(
        (item, i) =>
          item.category === "monthly" && (
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

  const tableData = userContributions;

  return (
    <>
      <Spin
        spinning={loading.isLoading}
        size="large"
        tip={loading.loadingMessage}
      >
        <Divider className="font-medium">Monthly Contributions</Divider>

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
                Input Amount:
              </label>
              {/* amount  */}
              <Input
                type="number"
                placeholder="i.e 200 "
                required
                // value={currentContributionAmount}
                onChange={(e) =>
                  setCurrentContribution({
                    user: selectedUser.uid,
                    contribution: selectedContribution.key,
                    amount: e.target.value,
                  })
                }
              />
            </div>

            <div className="">
              <label className="font-medium" htmlFor="type">
                Contribution Date:
              </label>
              <br />
              {/* amount  */}
              <DatePicker
                onChange={(_date, dateString) =>
                  setCurrentContribution((prev) => ({
                    ...prev,

                    doc: new Date(dateString).toLocaleDateString(),
                  }))
                }
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
        <CustomTable cols={columns} rows={tableData} style />
      </Spin>
    </>
  );
};
