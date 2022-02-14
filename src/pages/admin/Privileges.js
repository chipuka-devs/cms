import { Button, Checkbox, Form } from "antd";
import { doc, setDoc } from "firebase/firestore";
import React from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { error, success } from "../../components/Notifications";
import { db } from "../../utils/firebase";

const Privileges = () => {
  const onFinish = async (values) => {
    await setDoc(doc(db, "files", "privileges"), {
      signupPage: values.remember ? values.remember : false,
    })
      .then((r) => success("Success!", "Privilege updated!"))
      .catch((err) => error("Error!", err.message));
  };

  return (
    <AdminLayout current="3" breadcrumbs={["Admin", "Privileges"]}>
      <Form onFinish={onFinish}>
        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Show Registration Page</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            className="bg-blue-500 hover:bg-blue-800"
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </AdminLayout>
  );
};

export default Privileges;
