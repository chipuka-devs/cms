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
import CreateContribution from "../pages/admin/contributions/CreateContribution";
import ViewDetailedContribution from "../pages/admin/contributions/ViewDetailedContribution";

import Deductions from "../pages/admin/deductions/viewAll";

import Approvals from "../components/Approvals";

import ApproverRoute from "./ApproverRoute";
import ViewDeduction from "../pages/admin/deductions/ViewDeduction";
import { Dashboard } from "../pages/admin/Dashboard";
import NewContribution from "../pages/admin/contributions/NewContribution";
import { AllContributions } from "../pages/admin/contributions/AllContributions";
import { ViewUsers } from "../pages/admin/ViewUsers";
import {
  Monthly,
  MonthlySummary,
  OverallSummary,
  Project,
} from "../pages/admin/analysis";

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

  // <Admin Paths/>
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
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
    path: "/admin/contributions/all",
    element: (
      <PrivateRoute>
        <AllContributions />
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
    path: "/admin/contributions/create",
    element: (
      <PrivateRoute>
        <CreateContribution />
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
  // Contributions paths end

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
    path: "/admin/deductions/:id",
    element: (
      <PrivateRoute>
        <ViewDeduction />
      </PrivateRoute>
    ),
  },
  // Deducitons end

  {
    path: "/admin/users",
    element: (
      <PrivateRoute>
        <ViewUsers />
      </PrivateRoute>
    ),
  },

  // analysis paths
  {
    path: "/admin/analysis/monthly",
    element: (
      <PrivateRoute>
        <Monthly />
      </PrivateRoute>
    ),
  },

  {
    path: "/admin/analysis/project",
    element: (
      <PrivateRoute>
        <Project />
      </PrivateRoute>
    ),
  },

  {
    path: "/admin/analysis/m_summary",
    element: (
      <PrivateRoute>
        <MonthlySummary />
      </PrivateRoute>
    ),
  },

  {
    path: "/admin/analysis/o_summary",
    element: (
      <PrivateRoute>
        <OverallSummary />
      </PrivateRoute>
    ),
  },
  // end of analysis paths

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
