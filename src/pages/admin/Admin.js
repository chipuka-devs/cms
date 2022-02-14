import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Divider, Table, Spin } from "antd";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [tableData, setTableData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(collection(db, "files"), (docs) => {
      let list = [];

      docs.forEach((d) => list.push({ ...d.data(), id: d.id }));

      setTableData(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AdminLayout current="1" breadcrumbs={["Admin"]}>
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
              { title: "name", dataIndex: "name", key: "name" },

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
                title: "size",
                dataIndex: "data",
                key: "data",
                render: (d) => <>{d && d.length}</>,
              },
            ]}
            rows={tableData}
          />
        </Spin>
        {/* )} */}
      </div>
    </AdminLayout>
  );
};
export const ExcelTable = ({ cols, rows }) => {
  const navigate = useNavigate();

  const columns = cols;

  const data = rows;
  return (
    <Table
      columns={columns}
      dataSource={data}
      onRow={(record) => {
        return {
          onClick: () => {
            navigate(`${record.id}`);
          }, // click row
        };
      }}
    />
  );
};
export default Admin;
