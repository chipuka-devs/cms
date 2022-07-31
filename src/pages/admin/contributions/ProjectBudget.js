import { Button, Divider, Popconfirm, Spin } from "antd";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
  setDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { ProjectForm } from "../../../components/admin/contributions/ProjectForm";
import { CustomTable } from "../../../components/CustomTable";
import { error, success } from "../../../components/Notifications";
import { db } from "../../../utils/firebase";
import {
  calculateDifferenceInMonths,
  validateDate,
} from "../../../utils/Validations";

const ProjectBudget = () => {
  const [loading, setLoading] = useState({
    isLoading: false,
    loadingMessage: "loading...",
  });

  const [projectContributions, setProjectContributions] = useState([]);

  const [newContribution, setNewContribution] = useState({});
  const [isEditing, setIsEditing] = useState(false);

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

    if (isEditing) {
      try {
        await setDoc(
          doc(db, "contributions", newContribution?.key),
          newContribution
        );

        stopLoading();

        setIsEditing(false);

        setNewContribution({});

        success("Success!", "Project Updated Successfully!");
      } catch (err) {
        setLoading({
          ...loading,
          isLoading: false,
          loadingMessage: "",
        });

        error("Error:", err.message);
      }
      return;
    } else {
      const { deadline, startDate, target } = newContribution;

      const isValid =
        validateDate(startDate, deadline) &&
        validateDate(new Date(), deadline) &&
        validateDate(new Date(), new Date(startDate));

      if (!isValid) {
        error("Error!", "Please provide valid dates!");
        return;
      }

      const nOfMonths = calculateDifferenceInMonths(startDate, deadline);
      const averageAmount = Math.floor(target / nOfMonths);

      startLoading("Creating Contribution. . .");

      try {
        await addDoc(collection(db, "contributions"), {
          ...newContribution,
          duration: nOfMonths,
          amountPerMonth: averageAmount,
          category: "project",
        });

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
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "contributions", id));

      stopLoading();

      success("Success!", "Project Deleted Successfully!");
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

    const qProjects = query(
      collection(db, "contributions"),
      where("category", "==", "project")
    );

    const fetchProject = () =>
      onSnapshot(qProjects, (docs) => {
        let conts = [];

        docs.forEach((d) => {
          conts.push({ ...d.data(), key: d.id });
        });
        // setTableData(list);
        setProjectContributions(conts);
      });
    stopLoading();

    fetchProject();
  }, []);

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
      render: (_, item) => parseInt(item?.target).toLocaleString(),
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
    {
      title: " Monthly Contribution",
      dataIndex: "amountPerMonth",
      key: "amountPerMonth",
      render: (_, item) => parseInt(item?.amountPerMonth).toLocaleString(),
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
            title="Are you sure to delete this Project?"
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

  //   const tableData = setTableData();

  return (
    <>
      <Spin
        spinning={loading.isLoading}
        size="large"
        tip={loading.loadingMessage}
      >
        <Divider>
          <span className="text-lg">Manage Project Contributions</span>
        </Divider>

        <div>
          <p className="text-gray-500">
            Fill in the form below to create a new contribution
          </p>
        </div>
        {/* create new contribution form */}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-2 my-4">
            <ProjectForm
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

        <div className="mt-4 ">
          <span className="font-bold underline uppercase">
            Project Contributions Table
          </span>

          <CustomTable cols={projectColumns} rows={projectContributions} />
        </div>
      </Spin>
    </>
  );
};

export default ProjectBudget;
