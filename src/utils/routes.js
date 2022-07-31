import Home from "../pages/Home";
import Signin from "../pages/admin/Signin";
import Signup from "../pages/admin/Signup";
import PrivateRoute from "./PrivateAdminRoute";
import { Result } from "antd";
import { Link } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateUser from "./PrivateUserRoute";

import Approvals from "../components/Approvals";

import ApproverRoute from "./ApproverRoute";
import { Profile } from "../pages/Profile";
import AdminLayout from "../components/admin/AdminLayout";

export const useRouter = () => [
  {
    path: "/admin/login",
    element: <Signin />,
  },

  {
    path: "/admin/register",
    element: <Signup />,
  },
  {
    path: "/admin/*",
    element: (
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    ),
  },

  {
    path: "/",
    element: (
      <PrivateUser>
        <Home />
      </PrivateUser>
    ),
  },
  {
    path: "/approve",
    element: (
      <PrivateUser>
        <ApproverRoute>
          <Approvals />
        </ApproverRoute>
      </PrivateUser>
    ),
  },

  {
    path: "/profile",
    element: (
      <PrivateUser>
        <Profile />
      </PrivateUser>
    ),
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },

  // <Admin Paths/>

  // <Admin Paths end/>
  {
    path: "*",
    element: (
      <>
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={<Link to="/">Back Home</Link>}
          style={{ marginTop: "6%" }}
        />
      </>
    ),
  },
];
