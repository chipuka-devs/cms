import { Divider, Dropdown, Input, Menu, Spin } from "antd";
import {
  addDoc,
  collection,
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

export const VoluntaryContributions = () => {
  const { allUsers } = useContext(Context);

  const [voluntaryContribution, setVoluntaryContribution] = useState({
    user: {
      name: "--please Select user--",
    },
    name: "",
    amount: "",
  });
  const [voluntaryContributions, setVoluntaryContributions] = useState([]);

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

    startLoading("Adding user contribution...");

    if (!voluntaryContribution.amount) {
      error("Empty Field", "Please enter a contribution amount");

      return;
    }

    if (!voluntaryContribution.name) {
      error("Error", "Please Select Contribution");
      return;
    }

    const { name, user, amount } = voluntaryContribution;

    try {
      // add contribution
      if (voluntaryContribution?.amount) {
        await addDoc(collection(db, "user_contributions"), {
          amount: amount,
          user: user.uid,
          type: "voluntary",
          contribution: name,
          doc: serverTimestamp(),
        });
      }

      success("Success!", "Contribution added successfully!");
      stopLoading();
      setVoluntaryContribution({
        user: {
          name: "--please Select user--",
        },
        name: "",
        amount: "",
      });
    } catch (err) {
      error("Error", err.message);
      stopLoading();
    }
  };

  useEffect(() => {
    startLoading("Fetching Users . . .");
    const fetchUserContributions = () => {
      const q = query(
        collection(db, "user_contributions"),
        where("type", "==", "voluntary")
      );
      onSnapshot(q, (docs) => {
        const cList = [];
        docs.forEach((d) => {
          const currentUser = allUsers.filter(
            (item) => item.uid === d.data().user
          )[0];

          cList.unshift({
            date: d.data()?.doc?.seconds
              ? new Date(
                  d.data()?.doc?.seconds * 1000
                ).toLocaleDateString()
              : new Date(d.data().timestamp).toLocaleDateString(),
            purpose: d.data()?.contribution,
            amount: d.data()?.amount,
            member: currentUser.name,
          });
        });

        setVoluntaryContributions(cList);

        stopLoading();
      });
    };

    fetchUserContributions();
  }, [allUsers]);

  const uMenu = (
    <Menu>
      {allUsers.map((item, i) => (
        <Menu.Item
          key={i}
          onClick={() =>
            setVoluntaryContribution((prev) => ({ ...prev, user: item }))
          }
        >
          <span target="_blank" rel="noopener noreferrer">
            {item.name}
          </span>
        </Menu.Item>
      ))}
    </Menu>
  );

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
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },

    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
    },
  ];

  return (
    <AdminLayout current="1" breadcrumbs={["Admin", "contributions"]}>
      <Spin
        spinning={loading.isLoading}
        size="large"
        tip={loading.loadingMessage}
      >
        <Divider className="font-medium">Voluntary Contributions</Divider>

        <form className="mx-auto my-2" onSubmit={handleSubmit}>
          <div className="flex items-end gap-1 w-full ">
            <div className="">
              <label className="font-medium" htmlFor="type">
                Select User:
              </label>
              <Dropdown overlay={uMenu} placement="bottomLeft">
                <div
                  className="h-8 bg-white border flex items-center px-3"
                  style={{ width: "300px" }}
                >
                  {voluntaryContribution?.user?.name}
                </div>
              </Dropdown>
            </div>

            <div className="">
              <label className="font-medium" htmlFor="type">
                Contribution Title:
              </label>
              {/* Contribution Name */}
              <Input
                type="text"
                placeholder="contribution title i.e celebration "
                required
                value={voluntaryContribution?.name}
                onChange={(e) =>
                  setVoluntaryContribution((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
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
                required
                value={voluntaryContribution?.amount}
                onChange={(e) =>
                  setVoluntaryContribution((prev) => ({
                    ...prev,
                    amount: e.target.value,
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
        <CustomTable cols={columns} rows={voluntaryContributions} style />
      </Spin>
    </AdminLayout>
  );
};
