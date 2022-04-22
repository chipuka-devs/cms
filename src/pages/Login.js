import React, { useContext, useEffect } from "react";
import { Form, Input, Button, Checkbox, Divider } from "antd";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { error, success } from "../components/Notifications";
import { Context } from "../utils/MainContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

const Login = () => {
  const { setUser, user } = useContext(Context);

  const navigate = useNavigate();

  const onFinish = async ({ phone, password }) => {
    // fetch users
    // TODO: signin
    const thisUser = await getDoc(doc(db, "users", phone));

    if (thisUser.data()) {
      const validPassword = thisUser.data().password === password;

      if (validPassword) {
        setUser(thisUser.data());

        success("SUCCESS!", "User Logged in successfully!");
      } else {
        error("ERROR:", "Incorrect phone or password!");
      }
    } else {
      error(
        "ERROR:",
        "The account does not exist! contact admin for registration"
      );
    }
  };
  useEffect(() => {
    if (user && user?.role === "normal_user" && user.uid) {
      navigate("/");
    }
  }, [navigate, user]);

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="bg-slate-200  rounded h-96 lg:w-7/12 w-[95%] xl:w-5/12 flex justify-center items-center">
        <Form
          name="normal_login"
          className="login-form w-10/12"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Divider className="uppercase ">
            <span className="text-xl">User-Login</span>{" "}
          </Divider>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number" },
            ]}
          >
            <Input
              className="p-2.5"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Enter phone number"
            />
          </Form.Item>

          <br />

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
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            {/* <a className="login-form-forgot" href="">
            Forgot password
          </a> */}
          </Form.Item>

          <Form.Item className="text-center">
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button text-black mr-6 my-2 w-[80%]"
            >
              Log in
            </Button>
            <br />
            <Link to="/register" className="text-blue-600 hover:underline ">
              &nbsp;Click here to register!
            </Link>
            &nbsp;Or&nbsp;
            <Link to="/admin/login" className="text-blue-600 hover:underline ">
              Login as admin!
            </Link>
            {/* Or <a href="">register now!</a> */}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
