import React, { useEffect, useState, useContext } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Divider, Table, Spin } from "antd";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import { Context } from "../../utils/MainContext";

const Admin = () => {
  const [tableData, setTableData] = useState({
    columns: [],
    rows: [],
  });
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(collection(db, "file"), (docs) => {
      let list = [];

      docs.forEach((d) => {
        const data = d.data().data;
        setFileName(d.data().name);

        if (data.length > 0) {
          const setTable = () => {
            let columns = [];
            Object.keys(data[0]).forEach((i) =>
              columns.push({
                title: i,
                dataIndex: i,
                key: i.toLowerCase(),
              })
            );
            setTableData({
              columns,
              rows: data,
            });
            setLoading(false);
          };
          setTable();
        }
      });
      console.log(docs[0].data());

      setTableData(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AdminLayout current="1" breadcrumbs={["Admin"]}>
      <div>
        <Divider>
          <span className="text-lg">{fileName && fileName} Tabs</span>
        </Divider>

        {/* {loading ? (
          <div>Loading . . .</div>
        ) : ( */}
        <Spin spinning={loading} size="large" tip="Loading...">
          <CustomTable
            cols={[
              { title: "uid", dataIndex: "id", key: "id" },

              {
                title: "Table Size(rows)",
                dataIndex: "data",
                key: "data",
                render: (d) => <>{d && d.length}</>,
              },
            ]}
            rows={tableData.rows}
          />
        </Spin>
        {/* )} */}
      </div>
    </AdminLayout>
  );
};
export const CustomTable = ({ cols, rows, isClickable = false, summary }) => {
  const navigate = useNavigate();
  const { setCurrentView } = useContext(Context);

  const columns = cols;

  const data = rows;
  return (
    <Table
      columns={columns}
      dataSource={data}
      summary={() => {
        if (summary && summary.show) {
          return (
            <Table.Summary fixed>
              <Table.Summary.Row className="bg-slate-500 text-white">
                <Table.Summary.Cell index={0} colSpan={2}>
                  <span className="font-medium uppercase">{summary.title}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} colSpan={2}>
                  <span
                    className="font-medium uppercase"
                    style={{ fontSize: "17px" }}
                  >
                    {summary.amount}
                  </span>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        }
      }}
      onRow={(record) => {
        if (isClickable) {
          return {
            onClick: () => {
              navigate(`${record.id}`);
              setCurrentView(record);
            }, // click row
          };
        }
      }}
    />
  );
};
export default Admin;
