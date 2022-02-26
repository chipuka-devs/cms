import React, { useContext, useEffect } from "react";
import { Form, Input, Button, Checkbox, Divider } from "antd";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { error, success } from "../components/Notifications";
import { Context } from "../utils/MainContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const { setUser, user } = useContext(Context);
  const auth = getAuth();

  const navigate = useNavigate();

  const onFinish = async ({ email, password }) => {
    // fetch users

    // TODO: signin
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;

        setUser(user);
        success("Success", "Login success!");

        navigate("/");
      })
      .catch((err) => {
        error("Error", err.message);
      });
  };
  useEffect(() => {
    if (user && user.uid) {
      navigate("/");
    }
  }, [navigate, user]);

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="bg-slate-200  rounded h-96 lg:w-7/12 w-10/12 xl:w-5/12 flex justify-center items-center">
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
            name="email"
            rules={[{ required: true, message: "Please input your email" }]}
          >
            <Input
              className="p-2.5"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="i.e. email@mail.com"
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button text-black mr-6"
            >
              Log in
            </Button>
            Or{" "}
            <Link to="/register" className="text-blue-600 hover:underline ">
              &nbsp;Click here to register!
            </Link>
            Or <br />
            <Link to="/admin/login" className="text-blue-600 hover:underline ">
              &nbsp;Login as admin!
            </Link>
            {/* Or <a href="">register now!</a> */}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
