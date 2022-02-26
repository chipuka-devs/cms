import { Layout, Menu, Breadcrumb } from "antd";
import {
  LogoutOutlined,
  MinusCircleOutlined,
  // PlusCircleOutlined,
  KeyOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { useState } from "react";
// import { Context } from "../../utils/MainContext";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { success } from "../Notifications";

const { Content, Footer, Sider } = Layout;
// const { SubMenu } = Menu;

const AdminLayout = ({ children, current = "1", breadcrumbs = ["Admin"] }) => {
  const [collapsed, setCollapsed] = useState();
  const [curr] = useState(current);

  // const { user } = useContext(Context);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />

        <Menu theme="dark" defaultSelectedKeys={[curr]} mode="inline">
          {/* <Menu.Item key="1" icon={<PieChartOutlined />}>
            <Link to="/admin">Contributions</Link>
          </Menu.Item> */}

          <Menu.SubMenu
            key="1"
            icon={<ShareAltOutlined className="text-2xl" />}
            title="Contributions"
          >
            <Menu.Item>
              <Link to="/admin/contributions">View</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/admin/contributions/new">New</Link>
            </Menu.Item>
          </Menu.SubMenu>

          <Menu.SubMenu
            key="2"
            icon={<MinusCircleOutlined className="text-2xl" />}
            title="Deductions"
          >
            <Menu.Item>
              <Link to="/admin/deductions">View</Link>
            </Menu.Item>
          </Menu.SubMenu>

          <Menu.Item key="4" icon={<KeyOutlined />}>
            <Link to="/admin/privileges">Roles</Link>
          </Menu.Item>

          <Menu.Item
            key="5"
            icon={<LogoutOutlined />}
            onClick={() => {
              const auth = getAuth();
              signOut(auth)
                .then(() => {
                  success("success", "Log out successful!");
                })
                .catch((error) => {
                  error("Error!", error.message);
                });
            }}
          >
            Sign-out
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout className="site-layout">
        {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}

        <Content className=" mx-2">
          <Breadcrumb className="rounded p-2 my-2 bg-slate-200">
            {breadcrumbs &&
              breadcrumbs.map((b, i) => (
                <Breadcrumb.Item key={i}>{b}</Breadcrumb.Item>
              ))}
            {/* <Breadcrumb.Item>Bill</Breadcrumb.Item> */}
          </Breadcrumb>

          <div
            className="site-layout-background p-4"
            style={{ minHeight: 360 }}
          >
            {children}
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          Excel to Json ©2022 Created by Pekstar Coders
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
