import { Input, Spin } from "antd";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { error, success } from "../../../components/Notifications";
import { db } from "../../../utils/firebase";
import { CustomTable } from "../Admin";

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

    const date = new Date().toLocaleDateString();

    const submittedDeduction = {
      ...deduction,
      date,
      status: "pending",
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
              Rejected
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
        docs.forEach((d) => cList.push(d.data()));

        setFetchedDeductions(cList);
        stopLoading();
      });
    };

    fetchDeductions();
  }, []);

  return (
    <AdminLayout current="1" breadcrumbs={["Admin", "Deductions"]}>
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

        <CustomTable
          cols={columns}
          rows={fetchedDeductions && fetchedDeductions}
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
      </Spin>
    </AdminLayout>
  );
};

export default View;
