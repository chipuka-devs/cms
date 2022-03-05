import { Input, Spin, Menu, Dropdown } from "antd";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { CustomTable } from "../../../components/CustomTable";
import { error, success } from "../../../components/Notifications";
import { db } from "../../../utils/firebase";

const View = () => {
  const [deduction, setDeduction] = useState({
    amount: null,
    title: "",
  });
  const [fetchedDeductions, setFetchedDeductions] = useState([]);
  const [loading, setLoading] = useState({
    isLoading: false,
    loadingMessage: "loading...",
  });
  const [listOfContributions, setListOfContributions] = useState([]);
  const [selectedContribution, setSelectedContribution] = useState();

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
    startLoading("Adding Deduction . . .");
    //   check if fields are null

    if (deduction.title === "") {
      error("Error", "Deduction title required!");
      stopLoading();
      return;
    }
    if (deduction.amount === null) {
      error("Error", "Deduction amount required!");
      stopLoading();
      return;
    }
    if (selectedContribution === "" || !selectedContribution) {
      error("Error", "Parent contribution required!");
      stopLoading();
      return;
    }

    const date = new Date().toLocaleDateString();

    const submittedDeduction = {
      ...deduction,
      date,
      status: "invalid",
      contribution: selectedContribution,
    };

    try {
      await addDoc(collection(db, "deductions"), submittedDeduction);

      success("Success!", "Deduction added successfully! awaiting approval");
      setDeduction({ amount: null, title: "" });
      stopLoading();
    } catch (err) {
      stopLoading();
      error("Error", err.message);
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      //   render: (text) => <Link to={"/"}>{text}</Link>,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => {
        if (status === "pending") {
          return (
            <span className="px-2 py-1 border border-slate-400 text-gray-600 bg-gray-100">
              {status}
            </span>
          );
        } else if (status === "approved") {
          return (
            <span className="px-2 py-1 border border-green-500 text-green-600 bg-green-100">
              Approved
            </span>
          );
        } else {
          return (
            <span className="px-2 py-1 border border-red-500 text-red-600 bg-red-100">
              {status}
            </span>
          );
        }
      },
    },
  ];

  useEffect(() => {
    const fetchDeductions = () => {
      startLoading("Fetching Deductions . . .");
      onSnapshot(collection(db, "deductions"), (docs) => {
        const cList = [];
        docs.forEach((d, i) => cList.push({ ...d.data(), id: d.id }));

        setFetchedDeductions(cList);
        stopLoading();
      });
    };

    const fetchContributionList = () => {
      startLoading("Fetching Contribution List...");

      onSnapshot(collection(db, "contributions"), (docs) => {
        let cList = [];
        docs.forEach((d) => cList.push({ ...d.data(), key: d.id }));

        setListOfContributions(cList);
        stopLoading();
      });
    };

    fetchDeductions();
    fetchContributionList();
  }, []);

  const menu = (
    <Menu>
      {listOfContributions &&
        listOfContributions.map((item, i) => (
          <Menu.Item key={i} onClick={() => setSelectedContribution(item.name)}>
            <span target="_blank" rel="noopener noreferrer">
              {item.name}
            </span>
          </Menu.Item>
        ))}
    </Menu>
  );

  return (
    <AdminLayout current="2" breadcrumbs={["Admin", "Deductions"]}>
      <Spin
        spinning={loading.isLoading}
        size="large"
        tip={loading.loadingMessage}
      >
        <div>
          <p className="text-gray-500">
            Fill in the form below to create a new deduction
          </p>
        </div>
        <form
          className="flex items-end gap-1 mx-auto my-2"
          onSubmit={handleSubmit}
        >
          <div className="">
            <label className="font-medium" htmlFor="type">
              Select Contribution:
            </label>
            <Dropdown overlay={menu} placement="bottomLeft">
              <div
                className="h-8 bg-white border flex items-center px-3"
                style={{ width: "300px" }}
              >
                {selectedContribution
                  ? selectedContribution
                  : "--select the parent contribution--"}
              </div>
            </Dropdown>
          </div>

          <div className="">
            <label className="font-medium" htmlFor="type">
              Input Title:
            </label>
            {/* title  */}
            <Input
              type="text"
              placeholder="input deduction title"
              value={deduction.title}
              onChange={(e) =>
                setDeduction({
                  ...deduction,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div className="">
            <label className="font-medium" htmlFor="type">
              Input Amount:
            </label>
            {/* amount  */}
            <Input
              type="number"
              placeholder="i.e 200 "
              value={deduction.amount}
              onChange={(e) =>
                setDeduction({
                  ...deduction,
                  amount: e.target.value,
                })
              }
            />
          </div>

          <button
            type="submit"
            className="bg-green-700 px-4 text-white h-8 mb-0"
          >
            Create
          </button>
        </form>

        <div className="user-table">
          <CustomTable
            className=""
            cols={columns}
            rows={fetchedDeductions && fetchedDeductions}
            key="title"
            isClickable={true}
            summary={{
              show: true,
              title: "Total Deductions (kshs):",
              amount:
                fetchedDeductions &&
                fetchedDeductions.length > 0 &&
                fetchedDeductions
                  .map((item) => (item.status === "approved" ? item.amount : 0))
                  .reduce((prev, next) => parseInt(prev) + parseInt(next)),
            }}
            style
          />
        </div>
      </Spin>
    </AdminLayout>
  );
};

export default View;
