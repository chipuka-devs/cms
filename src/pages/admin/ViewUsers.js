import { Button, Divider, Input, Popconfirm, Spin } from "antd";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { CustomTable } from "../../components/CustomTable";
import { error, success } from "../../components/Notifications";
import { db } from "../../utils/firebase";
import { Context } from "../../utils/MainContext";

export const ViewUsers = () => {
  const { allUsers, user } = useContext(Context);

  const [loading, setLoading] = useState({
    isLoading: false,
    loadingMessage: "loading...",
  });
  const [groupUsers, setGroupUsers] = useState([]);

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    joinedAt: new Date(),
  });
  const [mode, setMode] = useState("");

  const stopLoading = () => {
    setLoading({
      isLoading: false,
      loadingMessage: "",
    });
  };

  const resetState = () => {
    setNewUser({
      firstName: "",
      lastName: "",
      phone: "",
      joinedAt: new Date().toISOString(),
    });
  };

  const handleEdit = (d) => {
    setMode("edit");

    console.log(new Date(d?.date)?.toISOString());
    setNewUser((prev) => ({
      ...prev,
      firstName: d?.first,
      lastName: d?.surname,
      phone: d?.key,
      joinedAt: new Date(d?.date),
    }));

    // setMode("");
  };

  const handleDelete = async (d) => {
    // check if user has made contributions
    const thisUserContributions = await getDocs(
      query(collection(db, "user_contributions"), where("user", "==", d?.key))
    );

    let cArr = [];
    thisUserContributions?.forEach((c) => cArr.push(c));

    // if has made, set status to disabled
    if (cArr.length > 0) {
      // user has made contributions
      error("Error:", "Operation not successful!");
    }
    // if has not, delete user
    else {
      try {
        await deleteDoc(doc(db, "users", d?.key));

        success("Success", "User Deleted Successfully!");
      } catch (err) {
        error("Error:", err?.message);
      }
    }
  };

  const startLoading = (message) => {
    setLoading({
      isLoading: true,
      loadingMessage: message,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    startLoading("Adding new Member");

    const { firstName, lastName, phone, joinedAt } = newUser;

    if (
      !firstName ||
      firstName === "" ||
      !lastName ||
      lastName === "" ||
      phone === "" ||
      !phone
    ) {
      error("ERROR!", "Please ensure you provide all fields");

      return;
    }

    const details = {
      name: `${firstName.trim()} ${lastName.trim()}`,
      uid: phone,
      password: firstName.trim().toLowerCase() + phone.trim(),
      joinedAt: joinedAt,
      role: "normal_user",
    };

    // console.log(details);
    try {
      await setDoc(doc(db, "users", phone), { ...details });

      stopLoading();

      resetState();

      success(
        "SUCCESS!",
        `User ${mode === "edit" ? "updated" : "added"} successfully!`
      );

      setMode("");
    } catch (error) {
      console.error(error.message);
      stopLoading();
    }
  };

  useEffect(() => {
    const usersArr = [];

    allUsers.forEach((u) => {
      const details = {
        first: u?.name.split(" ")[0],
        surname: u?.name.split(" ")[1] ? u.name.split(" ")[1] : "",
        date: u?.joinedAt?.seconds
          ? new Date(u?.joinedAt?.seconds * 1000).toLocaleDateString()
          : new Date(u.joinedAt).toLocaleDateString(),
        key: u.uid,
        phone: u.uid,
      };

      u.uid !== user.uid && usersArr.push(details);
      // console.log(user);
    });

    setGroupUsers(usersArr);
  }, [allUsers, user.uid]);

  const columns = [
    {
      title: "First Name",
      dataIndex: "first",
      key: "first",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a?.first.localeCompare(b?.first),
    },
    {
      title: "Surname",
      dataIndex: "surname",
      key: "surname",
      sorter: (a, b) => a?.surname.localeCompare(b?.surname),
    },
    {
      title: "Date Joined",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, data) => (
        <>
          <Button
            className="bg-blue-600 font-medium text-gray-100"
            onClick={() => handleEdit(data)}
          >
            Edit
          </Button>
          &nbsp;
          <Popconfirm
            title="Are you sure to delete this User?"
            onConfirm={() => handleDelete(data)}
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

  return (
    <>
      <Spin
        spinning={loading.isLoading}
        size="large"
        tip={loading.loadingMessage}
      >
        <Divider className="font-medium">All Users</Divider>

        <form className="mx-auto my-2" onSubmit={handleSubmit}>
          <p className="my-2">Add new Member:</p>
          <div className="flex items-end gap-1 w-full ">
            <div className="">
              <label className="font-medium" htmlFor="type">
                First Name:
              </label>
              {/* amount  */}
              <Input
                type="text"
                placeholder="First Name"
                required
                // disabled={accessPledge ? false : true}
                value={newUser.firstName}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, firstName: e.target.value }))
                }
              />
            </div>

            {/* lastname */}
            <div className="">
              <label className="font-medium" htmlFor="type">
                Last Name:
              </label>
              {/* amount  */}
              <Input
                type="text"
                placeholder="Last Name "
                required
                // disabled={accessPledge ? false : true}
                value={newUser.lastName}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, lastName: e.target.value }))
                }
              />
            </div>

            {/* phone number */}
            <div className="">
              <label className="font-medium" htmlFor="type">
                Phone Number:
              </label>
              {/* amount  */}
              <Input
                type="text"
                placeholder="0700000000"
                required
                disabled={mode === "edit"}
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>

            <div className="">
              <label className="font-medium">Date Joined:</label>
              {/* date  */}
              <Input
                type="date"
                required
                placeholder="select the starting day"
                value={new Date(newUser?.joinedAt)
                  ?.toISOString()
                  .substring(0, 10)}
                onChange={(e) =>
                  setNewUser((prev) => ({
                    ...prev,
                    joinedAt: e.target.value,
                  }))
                }
              />
            </div>

            <button
              type="submit"
              className="bg-green-700 px-4 text-white h-8 mb-0"
            >
              {mode === "edit" ? "UPDATE" : "ADD"}
            </button>

            <button
              type="button"
              className="border border-green-700 hover:bg-green-700 px-4 text-green-700 hover:text-white h-8 mb-0"
              onClick={resetState}
            >
              CLEAR
            </button>
          </div>
        </form>

        <CustomTable cols={columns} rows={groupUsers} style />
      </Spin>
    </>
  );
};
