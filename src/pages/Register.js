import { Button, Divider, Form, Input } from "antd";
import React from "react";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="bg-slate-200  rounded min-h-96 lg:w-7/12 w-10/12 xl:w-5/12 flex justify-center items-center">
        <Form
          name="normal_login"
          className="login-form w-10/12 py-6"
          initialValues={{ remember: true }}
          onFinish={() => {}}
        >
          <Divider className="uppercase ">
            <span className="text-xl">Admin-Registration</span>{" "}
          </Divider>

          <Form.Item
            name="fullname"
            rules={[
              { required: true, message: "Please input your Full name!" },
            ]}
          >
            <Input
              className="p-2.5"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Enter Fullname"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              className="p-2.5"
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Phone.no"
              type="text"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              className="p-2.5"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            name="c_password"
            rules={[{ required: true, message: "Please Confirm Password!" }]}
          >
            <Input
              className="p-2.5"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Confi  m Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button text-black mt-3 mr-6"
            >
              Register
            </Button>
            Or
            <Link to="/admin/login" className="text-blue-600 hover:underline ">
              &nbsp; Click here to Login!
            </Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
