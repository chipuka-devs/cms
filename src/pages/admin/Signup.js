import { Form, Input, Button, Divider, Spin, Result } from "antd";

import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { error, success } from "../../components/Notifications";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../utils/MainContext";
import { useContext, useEffect, useState } from "react";
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";

const Signup = () => {
  const navigate = useNavigate();
  const { currentUser: user } = useContext(Context);
  const [showPage, setShowPage] = useState(true);
  const [loading, setLoading] = useState(false);

  const onFinish = ({ email, password, c_password, fullname }) => {
    const auth = getAuth();

    if (c_password !== password) {
      return error("Password Error!", "Passwords do not match!");
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async () => {
        updateProfile(auth.currentUser, {
          displayName: fullname,
        });

        await updateDoc(doc(db, "files", "admins"), {
          admins: arrayUnion(auth.currentUser.uid),
        }).then((r) => success("Success!", "Admin Registration Successful!"));

        navigate("/admin");
      })
      .catch((err) => {
        error(err.message);
      });
  };

  useEffect(() => {
    setLoading(true);
    if (user) {
      console.log(user);
      navigate("/admin");
    }

    const unsub = onSnapshot(doc(db, "files", "privileges"), (doc) => {
      setShowPage(doc.data().signupPage);
      setLoading(false);
    });

    return () => unsub();
  }, [navigate, user]);

  if (loading) {
    return (
      <Spin spinning={loading} size="large" tip="Loading Page . . .">
        <div className="h-screen bg-blue-100" />
      </Spin>
    );
  }

  return (
    <div className="flex h-screen justify-center items-center">
      {showPage ? (
        <div className="bg-slate-200  rounded min-h-96 lg:w-7/12 w-10/12 xl:w-5/12 flex justify-center items-center">
          <Form
            name="normal_login"
            className="login-form w-10/12 py-6"
            initialValues={{ remember: true }}
            onFinish={onFinish}
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
              name="email"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                className="p-2.5"
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="email@email.com"
                type="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
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
                placeholder="Confirm Password"
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
              <Link
                to="/admin/login"
                className="text-blue-600 hover:underline "
              >
                &nbsp; Click here to Login!
              </Link>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page. Contact admin for more information."
          extra={
            <Link
              className="py-2 px-4 bg-blue-600 cursor-pointer text-white font-medium"
              to="/"
            >
              Back Home
            </Link>
          }
        />
      )}
    </div>
  );
};

export default Signup;
