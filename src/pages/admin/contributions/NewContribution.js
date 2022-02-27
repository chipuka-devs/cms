import { Divider, Input, Spin } from "antd";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { CustomTable } from "../../../components/CustomTable";
import { error, success } from "../../../components/Notifications";
import { db } from "../../../utils/firebase";

const NewContribution = () => {
  const [newContribution, setNewContribution] = useState("");
  const [loading, setLoading] = useState({
    isLoading: false,
    loadingMessage: "loading...",
  });
  const [tableData, setTableData] = useState([]);

  const columns = [
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
  ];
  // n

  //   const setTableData = () => {
  //     let objectList = [];

  //     list.forEach((i, _index) => {
  //       const obj = { key: _index + 1, name: i };

  //       objectList.push(obj);
  //     });

  //     return objectList;
  //   };

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

    if (!newContribution || newContribution === "") {
      error("Missing Field", "Contribution required");
      return;
    }
    startLoading("Creating Contribution. . .");

    const id = newContribution.toLowerCase();

    try {
      await setDoc(doc(db, "contributions", id), {
        name: newContribution,
      });

      setNewContribution("");

      stopLoading();

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

  useEffect(() => {
    startLoading("Loading Contributions . . .");

    const unsub = onSnapshot(collection(db, "contributions"), (docs) => {
      let list = [];
      let i = 1;
      docs.forEach((d) => {
        const loadedContribution = { ...d.data(), key: i };

        list.push(loadedContribution);
        i++;
      });
      setTableData(list);

      stopLoading();
    });

    return () => unsub();
  }, []);

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
        <form
          className="flex items-end gap-1 mx-auto my-2"
          onSubmit={handleSubmit}
        >
          <div className="">
            <label className="font-medium" htmlFor="type">
              Input contribution name:
            </label>
            {/* amount  */}
            <Input
              type="text"
              placeholder="i.e ChurchProjects "
              onChange={(e) => setNewContribution(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-green-700 px-4 text-white h-8 mb-0"
          >
            Create
          </button>
        </form>

        {/* view previously created contributions */}

        <CustomTable cols={columns} rows={tableData} style />
      </Spin>
    </AdminLayout>
  );
};

export default NewContribution;
