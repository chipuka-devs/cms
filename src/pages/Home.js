import { Divider, Spin } from "antd";
import { useState } from "react";
import NormalLayout from "../components/NormalLayout";
import { ExcelTable } from "./admin/Admin";

const Home = () => {
  const [loading] = useState(false);

  return (
    <NormalLayout>
      <div>
        <Divider>
          <span className="text-lg">All uploaded Files</span>
        </Divider>

        {/* {loading ? (
    <div>Loading . . .</div>
  ) : ( */}
        <Spin spinning={loading} size="large" tip="Loading...">
          <ExcelTable
            cols={[
              {
                title: "Date",
                dataIndex: "uploadedAt",
                key: "uploadedAt",
                render: (d) =>
                  d &&
                  d.seconds && (
                    <>{new Date(d.seconds * 1000).toLocaleString()} </>
                  ),
              },
              {
                title: "Amount",
                dataIndex: "data",
                key: "data",
                render: (d) => <>{d && d.length}</>,
              },
            ]}
            // rows={tableData}
          />
        </Spin>
        {/* )} */}
      </div>
    </NormalLayout>
  );
};

export default Home;
