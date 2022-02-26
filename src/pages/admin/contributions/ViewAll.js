import React, { useEffect, useState } from "react";
import { CustomTable } from "../Admin";
import AdminLayout from "../../../components/admin/AdminLayout";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Dropdown, Menu, Spin } from "antd";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../../utils/firebase";
import { error, success } from "../../../components/Notifications";

const View = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);

  const [userContributions, setUserContributions] = useState([]);
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

  const AddUserToList = async (e) => {
    e.preventDefault();
    startLoading("Adding User . . .");

    if (!selectedUser) {
      error("Error", "Please Select a user");
      stopLoading();
      return;
    }

    const userDetails = {
      uid: selectedUser.uid,
      name: selectedUser.name,
      email: selectedUser.email,
      total: 0,
    };

    try {
      await setDoc(doc(db, "user_contributions", selectedUser.uid), {
        ...userDetails,
      });

      success("Success!", "User added successfully!");
      setSelectedUser(null);
      stopLoading();
    } catch (err) {
      stopLoading();
      error("Error", err.message);
    }
  };

  const userExits = (user) => {
    return userContributions.some(function (el) {
      return el.name === user;
    });
  };

  // fetch all users
  useEffect(() => {
    const fetchUsers = () => {
      startLoading("Fetching Users . . .");
      onSnapshot(collection(db, "users"), (docs) => {
        const fetchedUsers = [];
        docs.forEach((d) => fetchedUsers.push(d.data()));

        setUsers(fetchedUsers);
        stopLoading();
      });
    };
    fetchUsers();
  }, []);

  // fetch user Contributions
  useEffect(() => {
    const fetchUserContributions = () => {
      startLoading("Fetching Users . . .");
      onSnapshot(collection(db, "user_contributions"), (docs) => {
        const cList = [];
        docs.forEach((d) => cList.push(d.data()));

        setUserContributions(cList);
        stopLoading();
      });
    };

    fetchUserContributions();
  }, []);

  const menu = (
    <Menu>
      {users &&
        users.map((item, i) => {
          if (!userExits(item.name)) {
            return (
              <Menu.Item key={i} onClick={() => setSelectedUser(item)}>
                <span target="_blank" rel="noopener noreferrer">
                  {item.name}
                </span>
              </Menu.Item>
            );
          }

          return null;
        })}
    </Menu>
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <Link to={"/"}>{text}</Link>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Total Contributions",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Actions",
      key: "actions",
      dataIndex: "actions",
      render: (_, c) => (
        <>
          {
            <button
              onClick={() => c.uid && navigate(`/admin/contributions/${c.uid}`)}
              className="p-2 bg-blue-500 rounded text-white"
            >
              View
            </button>
            // console.log(c.key)
          }
        </>
      ),
    },
  ];
  // name total_amount email actions

  const tableData = userContributions;

  return (
    <AdminLayout current="1" breadcrumbs={["Admin", "contributions"]}>
      <Spin
        spinning={loading.isLoading}
        size="large"
        tip={loading.loadingMessage}
      >
        <form
          className="flex items-end gap-1 mx-auto my-2"
          onSubmit={AddUserToList}
        >
          <div className="">
            <label className="font-medium" htmlFor="type">
              Input Contribution:
            </label>
            <Dropdown overlay={menu} placement="bottomLeft">
              <div
                className="h-8 bg-white border flex items-center px-3"
                style={{ width: "300px" }}
              >
                {selectedUser ? selectedUser.name : "--select user--"}
              </div>
            </Dropdown>
          </div>

          <button
            type="submit"
            className="bg-green-700 px-4 text-white h-8 mb-0"
          >
            Add user
          </button>
        </form>

        <CustomTable cols={columns} rows={tableData} style />
      </Spin>
    </AdminLayout>
  );
};

export default View;
