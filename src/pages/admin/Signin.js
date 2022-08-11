import { Form, Input, Button, Checkbox, Divider } from "antd";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { success, error } from "../../components/Notifications";
import { Link, useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate("/admin");

  const onFinish = ({ email, password }) => {
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        success("Success!", "Login successful!");
        navigate("/admin/users");
      })
      .catch((err) => {
        error("Error!", err.message);
      });
  };

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
            <span className="text-xl">Admin-Login</span>{" "}
          </Divider>

          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              className="p-2.5"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="email@email.com"
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
            <Link
              to="/admin/register"
              className="text-blue-600 hover:underline "
            >
              &nbsp;
              <br />
              Click here to register!
            </Link>{" "}
            &nbsp; Or &nbsp;
            <Link to="/login" className="text-blue-600 hover:underline ">
              &nbsp;Login as normal user!
            </Link>
            {/* Or <a href="">register now!</a> */}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Signin;
