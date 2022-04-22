import React, { useContext, useState } from "react";
import NormalLayout from "../components/NormalLayout";
import { UserOutlined } from "@ant-design/icons";
import { Button, Input, Spin } from "antd";
import { Context } from "../utils/MainContext";
import { error, success } from "../components/Notifications";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

export const Profile = () => {
  const { user } = useContext(Context);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewpassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    //   check if user entered correct old password

    if (!oldPassword || oldPassword === "") {
      error("ERROR:", "original password required!");
      return;
    }

    if (oldPassword !== user.password) {
      error("ERROR:", "Incorrect password!");
      return;
    }

    if (!newPassword || newPassword === "") {
      error("ERROR:", "New password required!");
      return;
    }

    if (!confirm || confirm === "") {
      error("ERROR:", "Confirm Your new Password!");
      return;
    }

    if (confirm !== newPassword) {
      error("ERROR:", "Passwords do not match");
      return;
    }

    setLoading(true);
    // update password
    try {
      await updateDoc(doc(db, "users", user.uid), {
        password: newPassword,
      });

      success("SUCCESS!", "Password update successful!");

      setLoading(false);

      setNewpassword("");
      setOldPassword("");
      setConfirm("");
    } catch (error) {
      error("UPDATE ERROR:", error.message);

      setLoading(false);
    }
  };

  return (
    <NormalLayout breadcrumbs={["Home", "profile"]}>
      <div className="flex justify-center items-center my-14  ">
        <Spin spinning={loading} size="medium" tip={"Updating password"}>
          <div className="w-[360px] bg-slate-200 rounded-xl p-2 gap-4 min-h-[500px] flex flex-col items-center relative">
            <div className="w-20 h-20 p-3 text-white bg-slate-300 rounded-full text-center justify-center text-3xl mx-auto absolute top-[-35px]">
              <UserOutlined />
            </div>

            <div className="profile_list w-[90%] ">
              <div className="mt-10">
                <label htmlFor="">Name:</label>
                <Input className="text-black" value={user.name} disabled />
              </div>
              <div>
                <label htmlFor="">Phone:</label>
                <Input className="text-black" value={user.uid} disabled />
              </div>

              <div className="text-[13px] underdivne text-right font-medium lowercase">
                Change current password
              </div>
              <div>
                <label htmlFor="">Old Password:</label>
                <Input
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  type="password"
                  className="text-black"
                />
              </div>
              <div>
                <label htmlFor="">New Password:</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewpassword(e.target.value)}
                  className="text-black"
                />
              </div>
              <div>
                <label htmlFor="">Confrim New Password:</label>
                <Input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="text-black"
                />
              </div>
            </div>

            <Button className="w-[90%]" type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </Spin>
      </div>
    </NormalLayout>
  );
};
