import { Divider, Dropdown, Menu, Spin } from "antd";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { MonthlyForm } from "../../../components/admin/contributions/MonthlyForm";
import { ProjectForm } from "../../../components/admin/contributions/ProjectForm";
import { CustomTable } from "../../../components/CustomTable";
import { error, success } from "../../../components/Notifications";
import { db } from "../../../utils/firebase";

const CreateContribution = () => {
  const [loading, setLoading] = useState({
    isLoading: false,
    loadingMessage: "loading...",
  });

  const [monthlyContributions, setMonthlyContributions] = useState([]);
  const [projectContributions, setProjectContributions] = useState([]);

  const [contributionCategories] = useState(["monthly", "project"]);
  const [chosenCategory, setChosenCategory] = useState("monthly");
  const [newContribution, setNewContribution] = useState({
    category: chosenCategory,
  });

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

    // console.log(newContribution);

    startLoading("Creating Contribution. . .");

    try {
      await addDoc(collection(db, "contributions"), newContribution);

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

  const menu = (
    <Menu>
      {contributionCategories.map((item, i) => {
        return (
          <Menu.Item
            key={i}
            onClick={() => {
              setChosenCategory(item);
              setNewContribution({ ...newContribution, category: item });
            }}
          >
            <span target="_blank" rel="noopener noreferrer">
              {item}
            </span>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  useEffect(() => {
    startLoading("Loading Contributions . . .");

    const qMonthly = query(
      collection(db, "contributions"),
      where("category", "==", "monthly")
    );
    const qProjects = query(
      collection(db, "contributions"),
      where("category", "==", "project")
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

    const fetchProject = onSnapshot(qProjects, (docs) => {
      fetchMonthly();

      let conts = [];

      docs.forEach((d) => {
        conts.push({ ...d.data(), key: d.id });
      });
      // setTableData(list);
      setProjectContributions(conts);

      stopLoading();
    });

    return () => fetchProject();
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
  ];

  const projectColumns = [
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
      title: "Target",
      dataIndex: "target",
      key: "target",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
  ];

  //   const tableData = setTableData();

  return (
    <AdminLayout current="1" breadcrumbs={["Admin", "contributions", `new`]}>
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

        {/* contribution category: */}
        <div className="w-1/2">
          <span>
            Please selecte the contribution category (monthly or project)
          </span>

          <Dropdown overlay={menu} placement="bottomLeft">
            <div
              className="h-8 bg-white border flex items-center px-3"
              style={{ width: "100%" }}
            >
              {chosenCategory}
            </div>
          </Dropdown>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-2 my-4">
            {chosenCategory === "monthly" ? (
              <MonthlyForm
                state={newContribution}
                setState={setNewContribution}
              />
            ) : (
              <ProjectForm
                state={newContribution}
                setState={setNewContribution}
              />
            )}
          </div>

          <button
            type="submit"
            className="bg-green-700 px-4 text-white h-8 mb-0"
          >
            Create
          </button>
        </form>

        {/* view previously created contributions */}

        <div className="flex gap-2 mt-4 ">
          <div className="w-7/12">
            <span className="font-bold underline uppercase">
              Project Contributions Table
            </span>
            <CustomTable
              cols={projectColumns}
              rows={projectContributions}
              style
            />
          </div>
          <div className="w-5/12">
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
    </AdminLayout>
  );
};

export default CreateContribution;
