import { Layout, Menu, Breadcrumb } from "antd";
import { getAuth, signOut } from "firebase/auth";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../utils/MainContext";
// import { useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { Context } from "../utils/MainContext";

const { Header, Content, Footer } = Layout;

const NormalLayout = ({ children, current = "1", breadcrumbs = ["Home"] }) => {
  const auth = getAuth();
  const { isApprover } = useContext(Context);

  return (
    <Layout className="layout min-h-screen">
      <Header>
        <div className="logo" />
        <Menu
          className="lg:ml-7"
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[current]}
        >
          <Menu.Item className="bg-blue-900 mx-1">
            <Link to="/">Home</Link>
          </Menu.Item>
          {isApprover && (
            <Menu.Item className="bg-blue-900">
              <Link to="/approve">Approve</Link>
            </Menu.Item>
          )}

          <Menu.Item
            className="flex items-center justify-center"
            style={{ marginLeft: "20%" }}
            onClick={() => {
              signOut(auth);
            }}
          >
            {/* <LogoutOutlined /> */}
            &nbsp;&nbsp; Logout
          </Menu.Item>
        </Menu>
      </Header>
      <Content className="px-2 lg:w-11/12 lg:mx-auto">
        <Breadcrumb className="rounded p-2 my-2 bg-slate-200">
          {breadcrumbs &&
            breadcrumbs.map((b, i) => (
              <Breadcrumb.Item key={i}>{b}</Breadcrumb.Item>
            ))}
          {/* <Breadcrumb.Item>Bill</Breadcrumb.Item> */}
        </Breadcrumb>

        <div className="site-layout-content">{children}</div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Excel to Json ©2022 Created by Pekstar Coders
      </Footer>
    </Layout>
  );
};

export default NormalLayout;
