import { Input, Spin, Menu, Dropdown } from "antd";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { CustomTable } from "../../../components/CustomTable";
import { error, success } from "../../../components/Notifications";
import { db } from "../../../utils/firebase";
import { Context } from "../../../utils/MainContext";

const View = () => {
  const { allContributions } = useContext(Context);

  const [deduction, setDeduction] = useState({
    title: "",
  });
  const [deductions, setDeductions] = useState([]);

  const [loading, setLoading] = useState({
    isLoading: false,
    loadingMessage: "loading...",
  });
  const [selectedContribution, setSelectedContribution] = useState({});

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

  const calculateTotalContributions = async (cId) => {
    startLoading("Validating Deduction");
    const q = query(
      collection(db, "user_contributions"),
      where("contribution", "==", cId)
    );

    try {
      const results = await getDocs(q);

      const resultingContributions = [];
      results.forEach((r) => {
        resultingContributions.push(r.data());
      });
      const totalContributions =
        resultingContributions.length > 0
          ? resultingContributions
              .map((item) => item.amount)
              .reduce((prev, next) => parseInt(prev) + parseInt(next))
          : 0;

      stopLoading();
      return totalContributions;
    } catch (err) {
      error("Error", err.message);
    }
  };

  const calculateTotalDeductions = async (cId) => {
    startLoading("Validating Deduction");
    const q = query(
      collection(db, "deductions"),
      where("contribution", "==", cId)
    );

    try {
      const results = await getDocs(q);

      const resultingContributions = [];
      results.forEach((r) => {
        resultingContributions.push(r.data());
      });
      const totalContributions =
        resultingContributions.length > 0
          ? resultingContributions
              .map((item) => (item.amount ? item.amount : 0))
              .reduce((prev, next) => parseInt(prev) + parseInt(next))
          : 0;

      stopLoading();
      return totalContributions;
    } catch (err) {
      error("Error", err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (deduction.title === "") {
      error("Error", "Deduction title required!");
      stopLoading();
      return;
    }

    if (selectedContribution === "" || !selectedContribution) {
      error("Error", "Parent contribution required!");
      stopLoading();
      return;
    }

    if (selectedContribution.category === "monthly") {
      const totalC = await calculateTotalContributions(selectedContribution.id);
      const totalD = await calculateTotalDeductions(selectedContribution.id);

      const isValid =
        totalC - totalD > 0 && totalC >= selectedContribution.amount;

      if (isValid) {
        const submittedDeduction = {
          ...deduction,
          submissionDate: new Date().toLocaleDateString(),
          status: "pending",
          contribution: selectedContribution.id,
          amount: selectedContribution.amount,
          createdAt: serverTimestamp(),
        };

        try {
          await addDoc(collection(db, "deductions"), submittedDeduction);

          success(
            "Success!",
            "Deduction added successfully! awaiting approval"
          );

          stopLoading();
        } catch (err) {
          stopLoading();

          error("Error", err.message);
        }
      } else {
        error("Error", "Not valid");
      }
    } else if (selectedContribution.name === "other") {
      const submittedDeduction = {
        ...deduction,
        submissionDate: new Date().toLocaleDateString(),
        status: "pending",
        contribution: null,
        createdAt: serverTimestamp(),
      };

      try {
        await addDoc(collection(db, "deductions"), submittedDeduction);

        success("Success!", "Deduction added successfully! awaiting approval");

        stopLoading();
      } catch (err) {
        stopLoading();

        error("Error", err.message);
      }
    } else {
      const contrib = await getDoc(
        doc(db, "contributions", selectedContribution.id)
      );

      const contributionTarget = parseInt(contrib.data().target);

      const isValid =
        (await calculateTotalContributions) >= contributionTarget &&
        (await calculateTotalContributions) - (await calculateTotalDeductions) >
          0;
      if (isValid) {
        const submittedDeduction = {
          ...deduction,
          submissionDate: new Date().toLocaleDateString(),
          status: "pending",
          contribution: selectedContribution.id,
          amount: selectedContribution.amount,
          createdAt: serverTimestamp(),
        };

        try {
          await addDoc(collection(db, "deductions"), submittedDeduction);

          success(
            "Success!",
            "Deduction added successfully! awaiting approval"
          );

          stopLoading();
        } catch (err) {
          stopLoading();

          error("Error", err.message);
        }
      } else {
        error("Error", "Contribution Target not reached!");
      }
    }
  };

  useEffect(() => {
    const fetchDeductions = () => {
      onSnapshot(collection(db, "deductions"), (results) => {
        setDeductions([]);
        results.forEach(async (r) => {
          const contribution = await allContributions.filter(
            (item) => item.id === r.data().contribution
          )[0];

          if (contribution) {
            setDeductions((prev) => [
              {
                key: r.id,
                amount: r.data().amount,
                contribution: contribution.name,
                category: contribution.category,
                status: r.data().status,
                date: r.data().submissionDate,
                title: r.data().title,
              },
              ...prev,
            ]);
          } else {
            setDeductions((prev) => [
              {
                key: r.id,
                amount: r.data().amount,
                contribution: "",
                category: "Other",
                status: r.data().status,
                date: r.data().submissionDate,
                title: r.data().title,
              },
              ...prev,
            ]);
          }
        });
      });
    };

    fetchDeductions();
  }, [allContributions]);

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
      title: "Category",
      dataIndex: "category",
      key: "category",
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

  const menu = (
    <Menu>
      {allContributions.map((item, i) => (
        <Menu.Item key={i} onClick={() => setSelectedContribution(item)}>
          <span target="_blank" rel="noopener noreferrer">
            {item.name}
          </span>
        </Menu.Item>
      ))}
      <Menu.Item onClick={() => setSelectedContribution({ name: "other" })}>
        <span target="_blank" rel="noopener noreferrer">
          Other...
        </span>
      </Menu.Item>
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
                {selectedContribution?.name
                  ? selectedContribution.name
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

          {selectedContribution &&
            (selectedContribution.category === "project" ||
              selectedContribution?.name === "other") && (
              <div className="">
                <label className="font-medium" htmlFor="type">
                  Input Amount:
                </label>
                {/* amount  */}
                <Input
                  type="number"
                  placeholder="i.e 200 "
                  onChange={(e) =>
                    setDeduction({
                      ...deduction,
                      amount: e.target.value,
                    })
                  }
                />
              </div>
            )}

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
            rows={deductions}
            key="title"
            isClickable={true}
            summary={{
              show: true,
              title: "Total Deductions (kshs):",
              amount:
                deductions &&
                deductions.length > 0 &&
                deductions
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
