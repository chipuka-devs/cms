import { Layout, Breadcrumb } from "antd";
import { Navbar } from "./Navbar";

const { Content, Footer } = Layout;

const NormalLayout = ({ children, current = "1", breadcrumbs = ["Home"] }) => {
  return (
    <Layout className="layout min-h-screen">
      {/* normal user navbar */}
      <Navbar />

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
      <Footer className="text-xs" style={{ textAlign: "center" }}>
        <span className="text-[12px]">
          Excel to Json ©2022 Created by Pekstar Coders
        </span>
      </Footer>
    </Layout>
  );
};

export default NormalLayout;
