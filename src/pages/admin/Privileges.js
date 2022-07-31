import { Dropdown, Menu, Spin } from "antd";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { error, success } from "../../components/Notifications";
import { db } from "../../utils/firebase";

const Privileges = () => {
  const [loading, setLoading] = useState({
    isLoading: false,
    loadingMessage: "loading...",
  });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({
    name: "--pick approver--",
  });

  const stopLoading = () => {
    setLoading({
      isLoading: false,
      loadingMessage: "",
    });
  };

  const handleSubmit = async (e) => {
    startLoading("Assigning role . . .");

    e.preventDefault();

    const role = {
      approver: selectedUser.uid,
    };

    try {
      await setDoc(doc(db, "roles", "approve"), {
        ...role,
      });

      success("Success!", "Role assigned successfully!");

      stopLoading();
    } catch (err) {
      stopLoading();
      error("Error", err.message);
    }
  };

  const startLoading = (message) => {
    setLoading({
      isLoading: true,
      loadingMessage: message,
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

    const fetchApprover = async () => {
      startLoading("Fetching Approver . . .");

      const document = await getDoc(doc(db, "roles", "approve"));
      const docSnap = await getDoc(doc(db, "users", document.data().approver));

      if (docSnap.exists()) {
        setSelectedUser(docSnap.data());
      }
      stopLoading();

      // const d = await getDoc(doc(db, "users", doc.data().approver));
    };
    fetchUsers();
    fetchApprover();
  }, []);

  const menu = (
    <Menu>
      {users &&
        users.map((item, i) => {
          return (
            <Menu.Item key={i} onClick={() => setSelectedUser(item)}>
              <span target="_blank" rel="noopener noreferrer">
                {item.name}
              </span>
            </Menu.Item>
          );
        })}
    </Menu>
  );

  return (
    <>
      <Spin
        spinning={loading.isLoading}
        size="large"
        tip={loading.loadingMessage}
      >
        <form className="flex items-end gap-1 mx-auto" onSubmit={handleSubmit}>
          <div className="">
            <label className="" htmlFor="type">
              Click to Select deductions approver:
            </label>

            <Dropdown overlay={menu} placement="bottomLeft">
              <div
                className="h-8 bg-white border flex items-center px-3"
                style={{ width: "300px" }}
              >
                {selectedUser.name}
              </div>
            </Dropdown>
          </div>

          <button
            type="submit"
            className="bg-green-700 px-4 text-white h-8 mb-0"
          >
            Update
          </button>
        </form>
      </Spin>
    </>
  );
};

export default Privileges;
