import Admin from "../pages/admin/Admin";
import CreateFile from "../pages/admin/CreateFile";
import Home from "../pages/Home";
import Signin from "../pages/admin/Signin";
import Signup from "../pages/admin/Signup";
import ViewFile from "../pages/admin/ViewFile";
import Privileges from "../pages/admin/Privileges";
import PrivateRoute from "./PrivateAdminRoute";
import { Result } from "antd";
import { Link } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";

export const useRouter = () => [
  {
    path: "/",
    element: <Home />,
  },

  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <Admin />
      </PrivateRoute>
    ),
  },

  {
    path: "/admin/new_file",
    element: (
      <PrivateRoute>
        <CreateFile />
      </PrivateRoute>
    ),
  },

  {
    path: "/admin/:id",
    element: (
      <PrivateRoute>
        <ViewFile />
      </PrivateRoute>
    ),
  },

  {
    path: "/admin/login",
    element: <Signin />,
  },

  {
    path: "/admin/register",
    element: <Signup />,
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
