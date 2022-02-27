import Home from "../pages/Home";
import Signin from "../pages/admin/Signin";
import Signup from "../pages/admin/Signup";
import Privileges from "../pages/admin/Privileges";
import PrivateRoute from "./PrivateAdminRoute";
import { Result } from "antd";
import { Link } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateUser from "./PrivateUserRoute";

import View from "../pages/admin/contributions/ViewAll";
import ViewUser from "../pages/admin/contributions/ViewUser";
import NewContribution from "../pages/admin/contributions/NewContribution";
import ViewDetailedContribution from "../pages/admin/contributions/ViewDetailedContribution";

import Deductions from "../pages/admin/deductions/view";

import Approvals from "../components/Approvals";

import ApproverRoute from "./ApproverRoute";

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
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/admin/privileges",
    element: (
      <PrivateRoute>
        <Privileges />
      </PrivateRoute>
    ),
  },
  // contribution paths
  {
    path: "/admin/contributions",
    element: (
      <PrivateRoute>
        <View />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/contributions/:id",
    element: (
      <PrivateRoute>
        <ViewUser />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/contributions/:id/:id",
    element: (
      <PrivateRoute>
        <ViewDetailedContribution />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/contributions/new",
    element: (
      <PrivateRoute>
        <NewContribution />
      </PrivateRoute>
    ),
  },

  // deduction paths
  {
    path: "/admin/deductions",
    element: (
      <PrivateRoute>
        <Deductions />
      </PrivateRoute>
    ),
  },
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
