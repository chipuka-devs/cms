import React, { useContext, useEffect, useState } from "react";
import { Button, Divider, Dropdown, Input, Menu, Popconfirm, Spin } from "antd";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../utils/firebase";
import { CustomTable } from "../../../components/CustomTable";
import { Context } from "../../../utils/MainContext";
import { error, success } from "../../../components/Notifications";
import moment from "moment";
import { useSelector } from "react-redux";
import _ from "lodash";

export const AnnualContributions = () => {
  const { allUsers, allContributions } = useContext(Context);
  const { annualGroupingContributions } = useSelector(
    (state) => state.contribution
  );

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

  const [currentContribution, setCurrentContribution] = useState({
    doc: new Date().toDateString(),
  });
  const [isUpdating, setIsUpdating] = useState(false);

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
    setIsUpdating(false);
    setSelectedUser("--Please select User --");
    setSelectedContribution("--Please select Contribution --");
    setCurrentContribution({
      // user: "",
      // contribution: "",
      doc: new Date().toDateString(),
      amount: 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    startLoading("Adding user contribution...");

    if (!currentContribution.amount) {
      error("Empty Field", "Please enter a contribution amount");
      stopLoading();
      return;
    }

    if (!selectedContribution.name) {
      error("Error", "Please Select Contribution");
      stopLoading();
      return;
    }

    try {
      // add contribution
      if (isUpdating) {
        await updateDoc(
          doc(db, "user_contributions", currentContribution?.key),
          {
            amount: currentContribution.amount,
            user: selectedUser?.uid,
            contribution: selectedContribution.id,
            doc: new Date(currentContribution.doc).toISOString(),
          }
        );

        success("Success!", "Contribution updated successfully!");
        setIsUpdating(false);
      }

      if (!isUpdating && currentContribution?.amount) {
        await addDoc(collection(db, "user_contributions"), {
          amount: currentContribution.amount,
          user: selectedUser.uid,
          contribution: selectedContribution.id,
          doc: new Date(currentContribution.doc).toISOString(),
          createdAt: serverTimestamp(),
        });

        success("Success!", "Contribution added successfully!");
      }

      setLoading({ isLoading: false });
      resetState();
    } catch (err) {
      stopLoading();
      error("Error", err.message);
    }
  };

  const handleUpdate = (contrib) => {
    // setUpdate((prev) => ({ ...prev, mode: true, contribution: contrib }));
    setIsUpdating(true);

    setSelectedContribution({ name: contrib?.purpose, id: contrib?.cid });
    setSelectedUser({ name: contrib?.member, uid: contrib?.uid });
    setCurrentContribution((prev) => ({
      ...prev,
      doc: contrib?.date,
      amount: contrib?.amount,
      key: contrib?.key,
    }));
    // console.log(contrib);
  };

  const handleDelete = async (id) => {
    // setUpdate((prev) => ({ ...prev, mode: true, contribution: contrib }));
    try {
      await deleteDoc(doc(db, "user_contributions", id));

      stopLoading();

      success("Success!", "Contribution Deleted Successfully!");
    } catch (err) {
      setLoading({
        ...loading,
        isLoading: false,
        loadingMessage: "",
      });

      error("Error:", err.message);
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

          const date = d?.data().doc;
          const contDate = new Date(date);
          const year = contDate.getFullYear();

          //   cList.push(d.data());
          const totals = annualGroupingContributions[year];
          if (currentContribution?.category === "annual") {
            const currentContContributions = totals[currentContribution?.id];
            const currentUserContributions = currentContContributions
              ? currentContContributions[currentUser?.id]
              : [];

            const total =
              currentUserContributions &&
              _.sumBy(currentUserContributions, (user) =>
                parseInt(user?.amount)
              );
            const balance = total - parseInt(currentContribution.amount);

            // console.log("Current conts: ", balance);
            // console.log("totals", totals);
            const contributionDetails = {
              key: d?.id,
              date: d?.data().doc,
              member: currentUser?.name,
              uid: currentUser?.id,
              cid: currentContribution?.id,
              amount: d?.data().amount,
              classification: currentContribution?.category,
              purpose: currentContribution?.name,
              balance,
            };

            cList.unshift(contributionDetails);
          }
        });
        // console.log(cList);

        setUserContributions(cList);

        stopLoading();
      });
    };

    fetchUserContributions();
  }, [allContributions, allUsers, annualGroupingContributions]);

  useEffect(() => {
    let conts = [];
    let usas = [];
    allContributions &&
      allContributions.forEach(
        (c) =>
          c.category === "annual" && conts.push({ text: c.name, value: c.name })
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
      render: (text) => (
        <>{moment(new Date(text).toLocaleDateString()).format("DD/MM/YYYY")}</>
      ),
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
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      filters: [...contributionNames],
      onFilter: (value, record) => record.purpose.startsWith(value),
      render: (_, { balance }) => {
        if (balance > 0) {
          return (
            <div className="bg-green-200 m-0 w-24 text-green-500 font-medium text-center p-1">
              {balance?.toLocaleString()}
            </div>
          );
        } else if (balance < 0) {
          return (
            <div className="bg-red-200 m-0 w-24 text-center text-red-500 font-medium p-1">
              {balance?.toLocaleString()}
            </div>
          );
        } else {
          return (
            <div className="bg-blue-200 text-blue-600 m-0 w-24 text-center font-medium p-1">
              {balance?.toLocaleString()}
            </div>
          );
        }
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, data) => (
        <>
          <Button
            className="bg-blue-600 font-medium text-gray-100"
            onClick={() => {
              handleUpdate(data);
            }}
          >
            Edit
          </Button>
          &nbsp;
          <Popconfirm
            title="Are you sure to delete this Contribution?"
            onConfirm={() => handleDelete(data?.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              className="bg-red-600 font-medium text-gray-100"
              // onClick={() => handleDelete(data)}
            >
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  // name total_amount email actions
  const menu = (
    <Menu>
      {allContributions.map(
        (item, i) =>
          item.category === "annual" && (
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
        <Divider className="font-medium">Annual Contributions</Divider>

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
                  {selectedContribution?.name
                    ? selectedContribution?.name
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
                value={currentContribution?.amount}
                onChange={(e) =>
                  setCurrentContribution((prev) => ({
                    ...prev,
                    user: selectedUser.uid,
                    contribution: selectedContribution.key,
                    amount: e.target.value,
                  }))
                }
              />
            </div>

            {
              <div className="">
                <label className="font-medium" htmlFor="type">
                  Contribution Date:
                </label>
                <br />
                {/* amount  */}

                <Input
                  type="date"
                  required
                  placeholder="select the starting day"
                  value={new Date(
                    currentContribution?.doc ||
                      new Date(currentContribution?.doc?.seconds) ||
                      null
                  )
                    ?.toISOString()
                    .substring(0, 10)}
                  onChange={(e) =>
                    setCurrentContribution((prev) => ({
                      ...prev,

                      doc: new Date(e.target.value),
                    }))
                  }
                />
              </div>
            }

            <button
              type="submit"
              className="bg-green-700 px-4 text-white h-8 mb-0"
            >
              {isUpdating ? "UPDATE" : "ADD"}
            </button>

            <button
              type="button"
              className="border border-green-700 hover:bg-green-700 px-4 text-green-700 hover:text-white h-8 mb-0"
              onClick={resetState}
            >
              CLEAR
            </button>
          </div>
        </form>
        <CustomTable
          cols={columns}
          rows={tableData}
          style
          showBg={false}
          summary={{
            show: true,
            title: "Total Contributions (kshs)",
            amount:
              userContributions.length > 0 &&
              userContributions?.reduce(
                (prev, next) => parseInt(prev) + parseInt(next?.amount),
                0
              ),
          }}
        />
      </Spin>
    </>
  );
};
