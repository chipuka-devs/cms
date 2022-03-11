import { Divider } from "antd";
import React, { useContext, useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { CustomTable } from "../../components/CustomTable";
import { Context } from "../../utils/MainContext";

export const ViewUsers = () => {
  const { allUsers } = useContext(Context);

  const [groupUsers, setGroupUsers] = useState([]);

  useEffect(() => {
    const usersArr = [];

    allUsers.forEach((user) => {
      const details = {
        first: user.name.split(" ")[0],
        surname: user.name.split(" ")[1] ? user.name.split(" ")[1] : "",
        date: user.joinedAt,
        key: user.uid,
      };

      usersArr.push(details);
    });

    setGroupUsers(usersArr);
  }, [allUsers]);

  const columns = [
    {
      title: "First Name",
      dataIndex: "first",
      key: "first",
    },
    {
      title: "Surname",
      dataIndex: "surname",
      key: "surname",
    },
    {
      title: "Date Joined",
      dataIndex: "date",
      key: "date",
    },
  ];

  return (
    <AdminLayout current="5" breadcrumbs={["Admin/Users"]}>
      <Divider className="font-medium">All Users</Divider>

      <CustomTable cols={columns} rows={groupUsers} style />
    </AdminLayout>
  );
};
