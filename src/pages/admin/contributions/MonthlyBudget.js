import { Button, Divider, Popconfirm, Spin } from "antd";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { MonthlyForm } from "../../../components/admin/contributions/MonthlyForm";
import { CustomTable } from "../../../components/CustomTable";
import { error, success } from "../../../components/Notifications";
import { db } from "../../../utils/firebase";

const MonthlyBudget = () => {
  const [loading, setLoading] = useState({
    isLoading: false,
    loadingMessage: "loading...",
  });

  const [isEditing, setIsEditing] = useState(false);

  const [monthlyContributions, setMonthlyContributions] = useState([]);

  const [newContribution, setNewContribution] = useState({});

  const resetState = () => {
    setNewContribution({});
  };

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
    const d = {
      ...newContribution,
      category: "monthly",
    };

    if (isEditing) {
      try {
        await setDoc(doc(db, "contributions", d?.key), d);

        setNewContribution("");

        stopLoading();

        resetState();

        setIsEditing(false);

        success("Success!", "Contribution Updated Successfully!");
      } catch (err) {
        setLoading({
          ...loading,
          isLoading: false,
          loadingMessage: "",
        });

        error("Error:", err.message);
      }

      return;
    }

    // console.log(newContribution);

    startLoading("Creating Contribution. . .");

    try {
      await addDoc(collection(db, "contributions"), d);

      setNewContribution("");

      stopLoading();

      resetState();

      success("Success!", "Contribution Created Successfully!");
    } catch (err) {
      setLoading({
        ...loading,
        isLoading: false,
        loadingMessage: "",
      });

      error("Error:", err.message);
    }
  };

  const deleteContribution = async (id) => {
    try {
      await deleteDoc(doc(db, "contributions", id));

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
    startLoading("Loading Contributions . . .");

    const qMonthly = query(
      collection(db, "contributions"),
      where("category", "==", "monthly")
    );

    const fetchMonthly = onSnapshot(qMonthly, (docs) => {
      let conts = [];
      docs.forEach((d) => {
        conts.push({ ...d.data(), key: d.id });
      });
      // setTableData(list);
      setMonthlyContributions(conts);

      stopLoading();
    });

    return () => fetchMonthly();
  }, []);

  const monthlyColumns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
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
              setIsEditing(true);
              setNewContribution(data);
            }}
          >
            Edit
          </Button>
          &nbsp;
          <Popconfirm
            title="Are you sure to delete this Contribution?"
            onConfirm={() => deleteContribution(data?.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button className="bg-red-600 font-medium text-gray-100">
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  //   const tableData = setTableData();

  return (
    <>
      <Spin
        spinning={loading.isLoading}
        size="large"
        tip={loading.loadingMessage}
      >
        <Divider>
          <span className="text-lg">Create Contribution</span>
        </Divider>

        <div>
          <p className="text-gray-500">
            Fill in the form below to create a new contribution
          </p>
        </div>
        {/* create new contribution form */}

        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 my-4">
            <MonthlyForm
              state={newContribution}
              setState={setNewContribution}
            />
          </div>

          <button
            type="submit"
            className="bg-green-700 px-4 text-white h-8 mb-0"
          >
            {isEditing ? "Update" : "Create"}
          </button>
        </form>

        {/* view previously created contributions */}

        <div className="flex gap-2 mt-4 ">
          <div className="lg:w-10/12">
            <span className="font-bold underline uppercase">
              Monthly Contributions Table
            </span>

            <CustomTable
              cols={monthlyColumns}
              rows={monthlyContributions}
              style
            />
          </div>
        </div>
      </Spin>
    </>
  );
};

export default MonthlyBudget;
