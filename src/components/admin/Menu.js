import {
  LogoutOutlined,
  MinusCircleOutlined,
  KeyOutlined,
  ShareAltOutlined,
  // BarChartOutlined,
  MoneyCollectOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import analysisIcon from "../../assets/analysis.svg";
import React from "react";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { success } from "../Notifications";

const MenuBar = () => {
  return (
    <Menu
      style={{
        width: "100%",
      }}
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      theme="dark"
      // items={items}
    >
      {/* <Menu.Item key="0" icon={<BarChartOutlined />}>
        <Link to="/admin/">Dashboard</Link>
      </Menu.Item> */}

      <Menu.Item key="7" icon={<UserOutlined />}>
        <Link to="/admin/users">Member Details</Link>
      </Menu.Item>

      <Menu.SubMenu
        key="1"
        icon={<ShareAltOutlined className="text-2xl" />}
        title="Contributions"
      >
        {/* <Menu.Item>
              <Link to="/admin/contributions">User Contributions</Link>
            </Menu.Item> */}
        <Menu.SubMenu key="0" title="Budget">
          <Menu.Item>
            <Link to="/admin/contributions/monthly/new">Monthly Budget</Link>
          </Menu.Item>

          <Menu.Item>
            <Link to="/admin/contributions/project/new">
              Projects Classifications
            </Link>
          </Menu.Item>

          <Menu.Item>
            <Link to="/admin/contributions/pledges">Project Pledges</Link>
          </Menu.Item>

          <Menu.Item>
            <Link to="/admin/contributions/annual/new">Annual Budget</Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item>
          <Link to="/admin/contributions/monthly">Monthly Contributions</Link>
        </Menu.Item>

        <Menu.Item>
          <Link to="/admin/contributions/project">Project Contributions</Link>
        </Menu.Item>

        <Menu.Item>
          <Link to="/admin/contributions/voluntary">
            Voluntary Contributions
          </Link>
        </Menu.Item>

        <Menu.Item>
          <Link to="/admin/contributions/annual">Annual Contributions</Link>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu
        key="2"
        icon={<img src={analysisIcon} alt="analysis" className="w-6" />}
        title="Analysis"
      >
        <Menu.Item>
          <Link to="/admin/analysis/monthly">Monthly Budget</Link>
        </Menu.Item>

        <Menu.Item>
          <Link to="/admin/analysis/project">Monthly Project</Link>
        </Menu.Item>

        <Menu.Item>
          <Link to="/admin/analysis/m_summary">Monthly Summary</Link>
        </Menu.Item>

        <Menu.Item>
          <Link to="/admin/analysis/p_summary">Annual Project</Link>
        </Menu.Item>

        <Menu.Item>
          <Link to="/admin/analysis/o_summary">Overall Summary</Link>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu
        key="3"
        icon={<MinusCircleOutlined className="text-2xl" />}
        title="Expenditures"
      >
        <Menu.Item>
          <Link to="/admin/deductions">View</Link>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.Item key="4" icon={<MoneyCollectOutlined />}>
        <Link to="/admin/income-statement">Expense Report</Link>
      </Menu.Item>

      <Menu.Item key="5" icon={<KeyOutlined />}>
        <Link to="/admin/privileges">Roles</Link>
      </Menu.Item>

      <Menu.Item
        key="6"
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
  );
};

export default MenuBar;
