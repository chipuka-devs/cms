import { Spin } from "antd";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { CustomTable } from "./CustomTable";
import NormalLayout from "./NormalLayout";
import { error, success } from "./Notifications";

const Approvals = () => {
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

  const approveDeduction = async (d) => {
    const approvedDeduction = {
      ...d,
      status: "approved",
    };

    const { id, ...others } = approvedDeduction;

    try {
      await setDoc(doc(db, "deductions", id), others);

      success("Success!", "Deduction Approved successfully!");

      stopLoading();
    } catch (err) {
      stopLoading();
      error("Error", err.message);
    }
  };
  const rejectDeduction = async (d) => {
    const approvedDeduction = {
      ...d,
      status: "declined",
    };

    const { id, ...others } = approvedDeduction;

    try {
      await setDoc(doc(db, "deductions", id), others);

      success("Success!", "Deduction rejected successfully!");

      stopLoading();
    } catch (err) {
      stopLoading();
      error("Error", err.message);
    }
  };

  useEffect(() => {
    const fetchDeductions = () => {
      startLoading("Fetching Deductions . . .");
      onSnapshot(collection(db, "deductions"), (docs) => {
        const cList = [];
        docs.forEach((d) => cList.push({ ...d.data(), id: d.id }));

        setFetchedDeductions(cList);
        stopLoading();
      });
    };

    fetchDeductions();
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      //   render: (text) => <Link to={"/"}>{text}</Link>,
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
            <span className="px-2 py-1 border border-slate-400 text-gray-600 font-medium bg-gray-100">
              {status}
            </span>
          );
        } else if (status === "approved") {
          return (
            <span className="px-2 py-1 border border-green-500 text-green-600 font-medium bg-green-100">
              Approved
            </span>
          );
        } else {
          return (
            <span className="px-2 py-1 border border-red-500 text-red-600 font-medium bg-red-100">
              Rejected
            </span>
          );
        }
      },
    },

    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",

      render: (_, d) => {
        return (
          <>
            {d?.status !== "approved" ? (
              <div className="flex">
                <button
                  className="py-1 px-2 bg-green-400 font-medium mr-1"
                  onClick={() => approveDeduction(d)}
                >
                  Approve
                </button>
                <button
                  className="py-1 px-2 bg-red-400 font-medium mr-1"
                  onClick={() => rejectDeduction(d)}
                >
                  Reject
                </button>
              </div>
            ) : (
              <div className="flex">
                <button className="py-1 px-2 text-gray-50 rounded bg-slate-400 font-medium mr-1">
                  NULL
                </button>
              </div>
            )}
          </>
        );
      },
    },
  ];

  return (
    <NormalLayout current="1" breadcrumbs={["Home", "Deductions"]}>
      <Spin
        spinning={loading.isLoading}
        size="large"
        tip={loading.loadingMessage}
      >
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
    </NormalLayout>
  );
};

export default Approvals;
